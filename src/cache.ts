type Records = Pick<
  CacheItem,
  'fileName' | 'folderName' | 'shareUrl'
>[]

const CACHE_KEY_NAME = 'oneDriveImageHostingCacheRecords'
const MAX_CACHE_LENGTH = 100

export const readCache = () => {
  return JSON.parse(
    localStorage.getItem(CACHE_KEY_NAME) || '[]'
  ) as Records
}

export const writeCache = (records: Records) => {
  localStorage.setItem(
    CACHE_KEY_NAME,
    JSON.stringify(
      records.slice(-MAX_CACHE_LENGTH)
    )
  )
}
