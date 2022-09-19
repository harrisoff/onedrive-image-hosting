import { useState } from 'react';
import { Divider, Input, Select, Space, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons'

type Props = {
  folderList: {
    label: string
    selected: boolean
  }[]
  onAdd(folder: string): void
  selectedFolder: string
  onSelect(folder: string): void
}
export default (props: Props) => {
  const { folderList, onAdd, selectedFolder, onSelect } = props

  const [folderName, setFolderName] = useState<string>();

  return <Select
    value={selectedFolder}
    onChange={onSelect}
    ref={null}
    style={{
      width: 300,
    }}
    dropdownRender={(menu) => (
      <>
        {menu}
        <Divider
          style={{
            margin: '8px 0',
          }}
        />
        <Space
          style={{
            padding: '0 8px 4px',
          }}
        >
          <Input
            placeholder="Folder Name"
            value={folderName}
            onChange={event => setFolderName(event.target.value)}
          />
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={event => {
              event.preventDefault()
              if (folderName) {
                onAdd(folderName)
                setFolderName(undefined)
              }
            }}
          >
            Add Folder
          </Button>
        </Space>
      </>
    )}
  >
    {folderList.map((folder) => (
      <Select.Option key={folder.label}>{folder.label}</Select.Option>
    ))}
  </Select>
};
