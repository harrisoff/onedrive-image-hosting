import React from 'react';
import { ImageListItem, ImageListItemBar, IconButton, Tooltip } from '@mui/material'
import { CloudUpload, CopyAllOutlined } from '@mui/icons-material'
import copy from 'copy-to-clipboard'

export type Props = Pick<
  UploadItem | CacheItem,
	'fileName' | 'status' | 'shareUrl' | 'errorMessage'
> & {
	onClickUpload(fileName: string): void
}
export default (props: Props) => {
	const { fileName, status, shareUrl, errorMessage, onClickUpload } = props

	let children: React.ReactNode
	let actionIcon: React.ReactNode

	if (errorMessage) {
		children = <div className='imageListItemContent'>
			<p className='errorMessage'>{errorMessage}</p>
		</div>
		actionIcon = <Tooltip title='upload again'>
			<IconButton
				sx={{ color: 'white' }}
				onClick={() => onClickUpload(fileName)}
			>
				<CloudUpload />
			</IconButton>
		</Tooltip>
	}

	else if (status === 'uploading') {
		children = <div className='imageListItemContent' />
		actionIcon = <IconButton
			sx={{ color: 'white' }}
		>
			<CloudUpload className='flicker' />
		</IconButton>
	}

	else {
		children = <img
			src={shareUrl}
		/>
		actionIcon = <Tooltip title='copy url'>
			<IconButton
				sx={{ color: 'white' }}
				onClick={() => {
					if (shareUrl) copy(shareUrl)
				}}
			>
				<CopyAllOutlined />
			</IconButton>
		</Tooltip>
	}

	return <ImageListItem className='imageListItem'>
		{children}
		<ImageListItemBar
		  className='imageListItemBar'
			title={<div title={fileName}>{fileName}</div>}
			position="bottom"
			actionIcon={actionIcon}
			actionPosition="left"
		/>
	</ImageListItem>
}