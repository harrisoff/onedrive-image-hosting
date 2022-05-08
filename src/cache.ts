type Cache = {
  records: UploadItem[]
}

const CACHE_KEY_NAME = 'oneDriveImageHostingCache'
const MAX_CACHE_LENGTH = 5

export const readCache = () => {
  return JSON.parse(
    localStorage.getItem(CACHE_KEY_NAME) || JSON.stringify({ records: [] })
  ) as Cache
}

export const writeCache = (cache: Cache) => {
  cache.records = cache.records.slice(-MAX_CACHE_LENGTH)
  localStorage.setItem(
    CACHE_KEY_NAME,
    JSON.stringify(cache)
  )
}
