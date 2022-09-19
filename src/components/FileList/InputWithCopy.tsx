import { useState } from "react"
import { Tooltip, Input, Button } from "antd"
import { CopyOutlined } from '@ant-design/icons'
import copy from "copy-to-clipboard"

import tracker from '../../tracker'

import classes from './index.module.less'

const InputWithCopy = ({ label, text }: {
  label: string
  text: string
}) => {
  const [copyTip, setCopyTip] = useState('copy');
  return <Input.Group compact className={classes.inputGroup}>
    <Input
      addonBefore={<span className={classes.addonBefore}>{label}</span>}
      value={text}
    />
    <Tooltip
      title={copyTip}
      onVisibleChange={visible => {
        if (visible) setCopyTip('copy')
      }}
      placement='right'
    >
      <Button icon={<CopyOutlined />} onClick={() => {
        copy(text)
        setCopyTip('copied!')
        tracker.copyUrl(label)
      }} />
    </Tooltip>
  </Input.Group>
}

export default InputWithCopy
