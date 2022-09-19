import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import shortid from 'shortid';
import { generateAuthUrl } from "@harrisoff/onedrive-js-sdk"

import { clientId, redirectUri } from './config';

const useHash = () => {
  const { hash } = useLocation()
  return useMemo((): Record<string, string | undefined> => {
    return hash.startsWith('#')
      ? Object.fromEntries(
        hash.slice(1)
          .split('&')
          .map(item => item.split('='))
          .filter((item): item is [string, string] => item.length === 2)
      )
      : {}
  }, [hash])
}

export const useHashParams = () => {
  const { access_token, error, error_description } = useHash()

  return {
    accessToken: access_token,
    error,
    errorDescription: error_description?.replace(/\+/g, ' ')
  }
}

export const useAccessToken = () => {
  return useHashParams().accessToken
}

export const useAuth = () => {
  const messageType = 'signin'

  let childWindow: Window | null
  
  const { hash } = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    if (window.opener && window.opener.location.origin == window.location.origin) {
      window.opener.postMessage({
        type: messageType,
        data: {
          hash
        }
      }, window.opener.location.origin)
      window.close()
    } else {
      window.addEventListener('message', event => {
        if (event.data.type === messageType) {
          navigate(event.data.data.hash, { replace: true })
          if (childWindow) childWindow.close()
        }
      })
    }
  }, [])

  return {
    openPopup() {
      childWindow = window.open(
        generateAuthUrl(clientId, redirectUri),
        'sign in',
        "scrollbars=no,toolbar=no,location=no,titlebar=no,directories=no,status=no,menubar=no,width=1020,height=618"
      )
    },
  }
}

export const uuid = () => {
  return shortid()
}
