import { useState,  useEffect } from 'react'

import { uuid } from './utils'
import { uploadHistoryKeyOld, uploadHistoryKey, uploadHistoryLength, settingsHistoryKey } from './config'

/**
 * migrate old version cache
 */
const migrateOldHistory = () => {
  type OldCache = {
    fileName: string
    folderName: string
    shareUrl: string
  }
  const oldCache: OldCache[] = JSON.parse(
    window.localStorage.getItem(uploadHistoryKeyOld) || '[]'
  )
  if (oldCache.length) {
    window.localStorage.removeItem(uploadHistoryKeyOld)
    return oldCache.map((old): CacheItem => {
      const { fileName, folderName, shareUrl } = old
      return {
        file: null,
        uid: uuid(),
        type: 'image',
        done: true,
        name: fileName,
        folder: folderName,
        uploadId: '',
        shareId: '',
        shareUrl,
        errorMessage: '',
        timestamp: 0,
        isCache: true,
        selected: false,
      }
    })
  }
  return []
}

const getUploadHistory = () => {
  const history = JSON.parse(
    window.localStorage.getItem(uploadHistoryKey) || '[]'
  ) as CacheItem[]
  return history.concat(
    migrateOldHistory()
  )
}
export const useUploadHistory = () => {
  return {
    uploadHistory: getUploadHistory(),
    setUploadHistory(items: CacheItem[]) {
      window.localStorage.setItem(
        uploadHistoryKey,
        JSON.stringify(
          items.slice(0, uploadHistoryLength)
        )
      )
    },
  }
}

const defaultSettings = {
  showAdvanced: false
}
type Settings = typeof defaultSettings
export const useSettingsHistory = () => {
  const localSettings = window.localStorage.getItem(settingsHistoryKey)
  const settingsHistory = localSettings ? JSON.parse(localSettings) as Settings : defaultSettings

  return {
    settingsHistory,
    setSettingsHistory(newSettings: Settings) {
      window.localStorage.setItem(
        settingsHistoryKey,
        JSON.stringify(newSettings)
      )
    }
  }
}
