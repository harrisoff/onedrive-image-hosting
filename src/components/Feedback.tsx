import { useState, useImperativeHandle, forwardRef } from "react"
import type { Ref } from 'react'
import { Modal, Input, Form, message } from "antd"

import tracker from '../tracker'

export type RefType = {
  show(): void
}
export default forwardRef((props, ref: Ref<RefType>) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm<{ content: string }>()

  useImperativeHandle(ref, () => {
    return {
      show() {
        form.resetFields()
        setVisible(true)
      },
    }
  })

  return <Modal
    visible={visible}
    title='Feedback'
    okText='OK'
    cancelText='Cancel'
    onOk={() => {
      form.validateFields()
        .then(formData => {
          tracker.feedback(formData.content)
          message.success('Thanks for your feedback!')
          setVisible(false)
        })
        .catch(() => {})
    }}
    onCancel={() => {
      setVisible(false)
    }}
  >
    <div style={{ marginBottom: 10, textAlign: 'center' }}>
      This feature is based on data tracking scripts,<br />
      you may need to <span style={{ color: '#f5222d' }}>disable adblock</span>.
    </div>
    <Form form={form}>
      <Form.Item name='content' label='Content'>
        <Input.TextArea placeholder="Any suggestions?" />
      </Form.Item>
    </Form>
  </Modal>
})
