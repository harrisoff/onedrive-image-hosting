type UploadItem = {
  file: import('antd/es/upload').RcFile
  /**
   * file.uid
   */
  uid: string
  type: 'image' | 'video' | 'audio'
  /**
   * Is processing done, may be succeed or failed
   */
  done: boolean
  name: string
  folder: string
  uploadId: string
  shareId: string
  shareUrl: string
  /**
   * Empty unless failed to upload or share
   */
  errorMessage: string
  /**
   * upload time, may be duplicated
   */
  timestamp: number
  isCache: false
  selected: boolean
}

/**
 * Cache successfully shared items to localStorage
 */
type CacheItem = Omit<UploadItem, 'file' | 'isCache'> & {
  file: null
  isCache: true
}

type FileListItem = UploadItem | CacheItem

interface Window {
  // baidu tongji
  _hmt: any
  // google analytics
  gtag: any
}
