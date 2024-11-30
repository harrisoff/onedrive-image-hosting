import { useEffect } from "react"
import { Popover, Tooltip, Card, Button, Checkbox } from 'antd'
import type { CardProps } from "antd"
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons"
import classNames from 'classnames'

import { useOneDriveClient } from '../../uploader';
import tracker from '../../tracker'
import InputWithCopy from './InputWithCopy'

import classes from './index.module.less'

export type Props = {
  editMode: boolean
  data: FileListItem
  onChange(data: Partial<UploadItem>): void
}
export default (props: Props) => {
  const {
    editMode,
    data,
    onChange,
  } = props

  const {
    done,
    type,
    folder,
    name,
    uploadId,
    shareId,
    shareUrl,
    errorMessage,
    file,
    isCache,
    selected
  } = data

  const oneDriveClient = useOneDriveClient();

  const upload = async (f: File) => {
    if (!isCache) {
      onChange({
        done: false,
      })
      try {
        const { id } = await oneDriveClient.upload(f, `${folder}/${name}`)
        onChange({
          uploadId: id,
          errorMessage: '',
        })
        return id
      } catch (err: any) {
        onChange({
          done: true,
          errorMessage: err.response?.data?.error?.code || err.message,
        })
      }
    }
  }

  const share = async (id: string) => {
    if (!isCache) {
      onChange({
        done: false,
      })
      try {
        const { shareId } = await oneDriveClient.share(id)
        const shareUrl = await oneDriveClient.getShareUrl(shareId)
        onChange({
          shareId,
          shareUrl,
          done: true,
          errorMessage: '',
        })
      } catch (err: any) {
        onChange({
          done: true,
          errorMessage: err.response?.data?.error?.code || err.message,
        })
      }
    }
  }

  const process = async (file: File) => {
    const id = await upload(file)
    if (id) share(id)
  }

  useEffect(() => {
    if (file) process(file)
  }, [])

  const cardProps: CardProps = {
    size: 'small',
    className: classNames({ [classes.editMode]: editMode }),
    title: <Tooltip className={classes.title} title={name}>
      {name}
    </Tooltip>,
    extra: editMode && <Checkbox checked={selected} />,
    onClick() {
      if (editMode) {
        onChange({ selected: !selected })
      }
    }
  }

  if (!done) {
    return <Card {...cardProps}>
      <div className={classNames(classes.content, classes.loading)}>
        <LoadingOutlined />
      </div>
    </Card>
  }

  if (!errorMessage) {
    const CardContent = <div className={classNames(classes.content, classes.succeed)}>
      {
        type === 'video'
          ? <video src={shareUrl} controls />
          : type === 'audio'
            ? <audio src={shareUrl} controls />
            : <img src={shareUrl} alt={name} />
      }
    </div>
    return <Card {...cardProps}>
      {
        editMode
          ? CardContent
          : <Popover
            content={
              <div className={classes.links}>
                <InputWithCopy label='URL' text={shareUrl} />
                {
                  type === 'image' && <>
                    <InputWithCopy label='HTML' text={`<img src="${shareUrl}" alt="${name}" border="0">`} />
                    <InputWithCopy label='BBCode' text={`[img]${shareUrl}[/img]`} />
                    <InputWithCopy label='Markdown' text={`![${name}](${shareUrl})`} />
                  </>
                }
              </div>
            }>
            {CardContent}
          </Popover>
      }
    </Card>
  }

  const needReUpload = !uploadId && file
  const needReShare = uploadId && !shareId
  return <Card {...cardProps}>
    <div className={classNames(classes.content, classes.error)}>
      <div>{errorMessage}</div>
      {
        (needReShare || needReUpload) ? <>
          <Button icon={<UploadOutlined />} type="link" onClick={() => {
            tracker.reProcess()
            if (needReShare) share(uploadId)
            else process(file!)
          }}>try again</Button>
        </> : null
      }
    </div>
  </Card>
}
