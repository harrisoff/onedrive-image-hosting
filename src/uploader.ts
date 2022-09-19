import { useMemo } from 'react'
import OneDriveApi from '@harrisoff/onedrive-js-sdk'

import { useAccessToken } from './utils';

export const useOneDriveClient = () => {
  const accessToken = useAccessToken() || ''
  return useMemo(() => new OneDriveApi({ accessToken }), [accessToken])
}
