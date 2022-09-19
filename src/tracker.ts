/**
 * @see https://tongji.baidu.com/holmes/Analytics/技术指南/JS%20API/JS%20API技术文档/_trackEvent
 * @see https://developers.google.com/tag-platform/gtagjs/reference
 * @example track('music', 'play', 'Hey Jude')
 */
const track = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  // baidu
  if (window._hmt) {
    const hmtParams: any[] = ['_trackEvent', category, action]
    if (label) hmtParams.push(label)
    if (value !== undefined) hmtParams.push(value)
    window._hmt.push(hmtParams)
  }
  // gtag
  if (window.gtag) {
    window.gtag(
      'event',
      category,
      {
        action,
        label,
        value
      }
    )
  }
}

/**
 * urlType:
 * - URL
 * - HTML
 * - BBCode
 * - Markdown
 */
const copyUrl = (urlType: string) => {
  track(
    'file',
    'copy',
    urlType
  )
}

/**
 * upload file
 */
const upload = () => {
  track(
    'file',
    'upload',
  )
}

const deleteCache = () => {
  track(
    'file',
    'deleteCache',
  )
}

/**
 * re-upload or re-share
 */
const reProcess = () => {
  track('file', 'retry')
}

const feedback = (content: string) => {
  track(
    'feedback',
    'submit',
    content
  )
}

const getToken = (isRefresh: boolean) => {
  track(
    'token',
    isRefresh ? 'refresh' : 'get'
  )
}

export default {
  copyUrl,
  upload,
  reProcess,
  feedback,
  deleteCache,
  getToken
}
