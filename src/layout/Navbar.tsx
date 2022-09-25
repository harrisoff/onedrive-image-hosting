import { useRef, useMemo } from 'react'
import { Button, Layout, Space } from 'antd'
import { GithubFilled } from '@ant-design/icons'
import classNames from 'classnames'

import Feedback from '../components/Feedback'
import type { RefType } from '../components/Feedback'

import { useAuth, useHashParams } from '../utils'

import classes from './index.module.less'

export default () => {
  const feedbackRef = useRef<RefType>(null)

  const { openPopup } = useAuth()

  const hashParams = useHashParams()
  const hasToken = useMemo(() => !!hashParams.accessToken, [hashParams])

  return <>
    <Layout.Header className={classes.navbar}>
      <div className={classes.content}>
        <div>
          OneDrive Image Hosting
        </div>
        <Space size='large'>
          <Button
            type='link'
            style={{ color: 'white' }}
            className={classNames({ [classes.blink]: !hasToken })}
            onClick={() => {
              openPopup()
            }}
          >
            {
              hasToken && 'Refresh token'
            }
          </Button>
          <Button
            type='link'
            style={{ color: 'white' }}
            onClick={() => {
              feedbackRef.current?.show()
            }}
          >Feedback</Button>
          <a href='https://github.com/harrisoff/onedrive-image-hosting' target='_blank'>
            <GithubFilled style={{ color: 'white' }} />
          </a>
        </Space>
      </div>
    </Layout.Header>
    <Feedback ref={feedbackRef} />
  </>
}