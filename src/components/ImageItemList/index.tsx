import React from 'react';
import { ImageList } from '@mui/material'

import ImageItem from './ImageItem'

type Props = {
  itemList: UploadItem[]
  onClickUpload(fileName: string): void
}
export default ({ itemList, onClickUpload }: Props) => {
  return <ImageList cols={5} rowHeight={164} className='imageList'>
    {itemList.map((item) => <ImageItem {...item} key={item.fileName} onClickUpload={onClickUpload} />)}
  </ImageList>
}
