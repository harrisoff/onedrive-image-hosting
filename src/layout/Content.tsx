import { useEffect, useMemo, useState } from 'react';
import { Layout, Checkbox, Tooltip, Space, Alert, Input, Tag, Button, Popconfirm } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

import FolderSelector from '../components/FolderSelector';
import FileInput from '../components/FileInput'
import { List, Item } from '../components/FileList'

import { defaultFolder, uploadHistoryLength, showSearchLength, showManageCacheLength } from '../config'
import { useSettingsHistory, useUploadHistory } from '../cache';
import { useHashParams } from '../utils';
import tracker from '../tracker';

import classes from './index.module.less'

export default () => {
  // settings cache
  const { settingsHistory, setSettingsHistory } = useSettingsHistory()
  const [useSuffix, setUseSuffix] = useState(settingsHistory.filenameSuffix);
  useEffect(() => {
    setSettingsHistory({
      ...settingsHistory,
      filenameSuffix: useSuffix
    })
  }, [useSuffix])

  // upload cache
  // TODO: there are unnecessary writes
  const { uploadHistory, setUploadHistory } = useUploadHistory()

  const [itemList, setItemList] = useState<FileListItem[]>(uploadHistory);
  const sortedItemList = useMemo(() => itemList.slice(0).sort((a, b) => b.timestamp - a.timestamp), [itemList])
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
  const {
    error,
    errorDescription
  } = useMemo(() => {
    if (hashParams.error) {
      return hashParams
    }
    return {
      error: '',
      errorDescription: ''
    }
  }, [hashParams])

  return <Layout.Content className={classes.main}>
    <div className={classes.sections}>
      {
        // TODO: 看下效果
        !!error && <section>
          <Alert
            showIcon
            closable
            type='error'
            message={error}
            description={errorDescription}
          />
        </section>
      }
      <section className={classes.toolbar}>
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
            <Checkbox checked={useSuffix} onChange={event => setUseSuffix(event.target.checked)}>
              Add random suffix to filename
            </Checkbox>
            <Tooltip title={<>
              <Tag color='#f5222d'>Strongly Recommended</Tag><br />
              <span>This avoids filename duplication.</span>
            </>} placement='bottom'>
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
          {
            itemList.length >= showSearchLength && (
              <span>
                <Input
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder='Search filename'
                />
              </span>
            )
          }
        </Space>
        <div>
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
                <Button type='link' onClick={() => {
                  setEditMode(false)
                  setItemList(prev => prev.map(i => ({ ...i, selected: false })))
                }}>Cancel</Button>
              </>
              : itemList.length >= showManageCacheLength
                ? <>
                  {/* FIXME: causes image reload */}
                  <Button type='link' onClick={() => { setEditMode(true) }}>
                    Manage cache
                  </Button>
                  <Tooltip
                    placement='bottom'
                    title={<>
                      <span>1. Latest {uploadHistoryLength} items will be saved to browser's cache.</span><br />
                      <span>2. Does not affect the original file.</span>
                    </>}
                  >
                    <QuestionCircleOutlined />
                  </Tooltip>
                </>
                : null
          }
        </div>
      </section>
      <section>
        <FileInput
          onAdd={newItem => {
            setItemList(prev => [...prev, newItem])
          }}
          folder={selectedFolder}
          filenameSuffix={useSuffix}
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
                          const a = prevItem
                          const b = newItem
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
