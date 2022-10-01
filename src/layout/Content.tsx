import { useEffect, useMemo, useState } from 'react';
import { Layout, Tooltip, Space, Alert, Input, Button, Popconfirm } from 'antd'
import { QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons'

import FolderSelector from '../components/FolderSelector';
import FileInput from '../components/FileInput'
import { List, Item } from '../components/FileList'

import { defaultFolder, uploadHistoryLength, showManageCacheLength } from '../config'
import { useSettingsHistory, useUploadHistory } from '../cache';
import { useHashParams, useAuth } from '../utils';
import tracker from '../tracker';

import classes from './index.module.less'
import classNames from 'classnames';

export default () => {
  // TODO: there are unnecessary writes
  const { uploadHistory, setUploadHistory } = useUploadHistory()

  const [itemList, setItemList] = useState<FileListItem[]>(uploadHistory);
  const sortedItemList = useMemo(() => itemList.slice(0).sort((a, b) => b.timestamp - a.timestamp), [itemList])

  // update cache

  const newHistory: CacheItem[] = useMemo(() => {
    return sortedItemList
      .filter(i => i.done && !i.errorMessage)
      .map(i => ({ ...i, file: null, isCache: true, selected: false }))
  },
    [sortedItemList]
  )
  useEffect(() => {
    setUploadHistory(newHistory)
  }, [newHistory])

  // manage cache

  const [editMode, setEditMode] = useState(false);
  const hasSelected = useMemo(() => itemList.some(i => i.selected), [itemList])
  useEffect(() => {
    if (!editMode) {
      setItemList(
        prevItemList => prevItemList.map(i => ({ ...i, selected: false }))
      )
    }
  }, [editMode])

  // filter

  const [keyword, setKeyword] = useState<string>();
  const defaultFolderList: {
    label: string
    selected: boolean
  }[] = useMemo(() => {
    return Array.from(new Set([...uploadHistory.map(i => i.folder), defaultFolder]))
      .map(label => ({ label, selected: label === defaultFolder }))
  }, [uploadHistory])
  const [folderList, setFolderList] = useState(defaultFolderList);
  const selectedFolder = useMemo(() => {
    return folderList.find(i => i.selected)?.label || defaultFolder
  }, [folderList])
  const filteredItems = useMemo(() => {
    return sortedItemList
      .filter(f => f.folder === selectedFolder)
      .filter(f => keyword ? f.name.includes(keyword) : true)
  }, [sortedItemList, selectedFolder, keyword])

  // error messages

  const hashParams = useHashParams()
  const { openPopup } = useAuth()
  const {
    error,
    errorDescription
  } = useMemo(() => {
    if (hashParams.error) {
      return hashParams
    }
    if (!hashParams.accessToken) {
      return {
        error: <>Please <a onClick={openPopup}>get token</a></>,
        errorDescription: undefined
      }
    }
    return {
      error: undefined,
      errorDescription: undefined
    }
  }, [hashParams])

  // settings cache

  const { settingsHistory, setSettingsHistory } = useSettingsHistory()
  const [showAdvanced, setShowAdvanced] = useState(settingsHistory.showAdvanced);
  useEffect(() => {
    // update cache
    setSettingsHistory({
      ...settingsHistory,
      showAdvanced
    })
    // reset advanced options values
    if (!showAdvanced) {
      setKeyword(undefined)
      setEditMode(false)
    }
  }, [showAdvanced])

  return <Layout.Content className={classes.main}>
    <div className={classes.sections}>
      {
        !!error && <section>
          <Alert
            showIcon
            type='error'
            message={<>
            <div style={{ fontWeight: 'bold' }}>{error}</div>
            {
              !!errorDescription && <div>{errorDescription}</div>
            }
            </>}
          />
        </section>
      }
      <section className={classes.toolbar}>
        <div className={classes.advanced}>
          {
            showAdvanced ? <>
              <Space>
                <span>
                  Select a folder:
                </span>
                <FolderSelector
                  folderList={folderList}
                  onAdd={folder => {
                    setFolderList(
                      prev => Array
                        .from(
                          new Set([...prev.map(i => i.label), folder])
                        )
                        .map(i => {
                          if (i === folder) return { label: i, selected: true }
                          return { label: i, selected: false }
                        })
                    )
                  }}
                  selectedFolder={selectedFolder}
                  onSelect={folder => {
                    setFolderList(prev => prev.map(i => {
                      if (i.label === folder) return { ...i, selected: true }
                      return { ...i, selected: false }
                    }))
                  }}
                />
                <span>
                      <Input
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        placeholder='Search filename'
                      />
                    </span>
                {
                  editMode
                    ? <>
                      <Popconfirm
                        title='Sure?'
                        onConfirm={() => {
                          tracker.deleteCache()
                          setItemList(prev => prev.filter(i => !i.selected))
                        }}
                      >
                        <Button type='link' danger disabled={!hasSelected}>
                          Delete selected
                        </Button>
                      </Popconfirm>
                      <Button type='link' onClick={() => setEditMode(false)}>Cancel</Button>
                    </>
                    : itemList.length >= showManageCacheLength
                      ? <>
                        <Tooltip
                          placement='bottom'
                          title={<>
                            <span>1. Latest {uploadHistoryLength} items will be saved to browser's cache.</span><br />
                            <span>2. Does not affect the original file.</span>
                          </>}
                        >
                          <Button type='link' onClick={() => { setEditMode(true) }}>
                          Manage cache
                          <QuestionCircleOutlined />
                        </Button>
                        </Tooltip>
                      </>
                      : null
                }
              </Space>
            </> : null
          }
        </div>
        <div className={classes.switch}>
          <Button
            type='text'
            icon={<SettingOutlined />}
            onClick={() => {
              setShowAdvanced(v => !v)
            }}
            className={classNames({
              [classes.switch]: true,
              [classes.active]: showAdvanced
            })}
          >
            Advanced
          </Button>
        </div>
      </section>
      <section>
        <FileInput
          onAdd={newItem => {
            setItemList(prev => [...prev, newItem])
          }}
          folder={selectedFolder}
        />
      </section>
      <section className={classes.fileList}>
        <List>
          {
            filteredItems.map(item => {
              return <Item
                editMode={editMode}
                key={item.uid}
                data={item}
                onChange={newItem => {
                  setItemList(
                    prev => prev.map(prevItem => {
                      if (prevItem.uid === item.uid) {
                        if (prevItem.isCache) {
                          const { file, isCache, ...rest } = newItem
                          return {
                            ...prevItem,
                            ...rest
                          }
                        }
                        else {
                          return {
                            ...prevItem,
                            ...newItem
                          }
                        }
                      }
                      return prevItem
                    })
                  )
                }}
              />
            })
          }
        </List>
      </section>
    </div>
  </Layout.Content>
}
