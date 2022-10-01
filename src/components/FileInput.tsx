import { message, Upload, Tag } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { CloudUploadOutlined, CheckCircleFilled } from '@ant-design/icons'

import { uuid } from '../utils'
import tracker from '../tracker'

const getFileType = (file: RcFile): UploadItem['type'] | null => {
  if (/audio\/*/.test(file.type)) return 'audio'
  if (/video\/*/.test(file.type)) return 'video'
  if (/image\/*/.test(file.type)) return 'image'
  return null
}

type Props = {
  onAdd(item: UploadItem): void
  folder: string
}
export default (props: Props) => {
  const { onAdd, folder } = props

  return <Upload.Dragger
    height={120}
    multiple
    fileList={[]}
    accept='image/*,video/*,audio/*'
    beforeUpload={(file) => {
      const parts = file.name.split('.')
      const fileExt = parts.pop()
      const fileName = parts.join('.')
      const type = getFileType(file)
      if (!type) {
        message.error(`Invalid file type: ${file.type || fileExt}`)
      } else {
        tracker.upload()
        onAdd({
          file,
          uid: file.uid,
          type,
          timestamp: new Date().getTime(),
          done: false,
          name: `${fileName}.${uuid()}.${fileExt}`,
          folder,
          uploadId: '',
          shareId: '',
          shareUrl: '',
          errorMessage: '',
          isCache: false,
          selected: false
        })
      }
      return false
    }}
  >
    <p><CloudUploadOutlined style={{ fontSize: 28 }} /></p>
    <p>Click or drag files to this area to upload (Up to 60Mb)</p>
    <p>
      <Tag icon={<CheckCircleFilled style={{ color: '#52c41a' }} />}>
        Image / Audio / Video
      </Tag>
    </p>
  </Upload.Dragger>
}
