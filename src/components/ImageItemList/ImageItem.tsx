import React from 'react';
import { ImageListItem, ImageListItemBar, IconButton, Tooltip } from '@mui/material'
import { CloudUpload, CopyAllOutlined } from '@mui/icons-material'
import copy from 'copy-to-clipboard'

type Props = UploadItem & {
	onClickUpload(fileName: string): void
}
export default (props: Props) => {
	const { fileName, isUploading, shareUrl, error, onClickUpload } = props

	let children: React.ReactNode
	let actionIcon: React.ReactNode

	if (error) {
		children = <div className='imageListItemContent'>
			<p className='errorMessage'>{error}</p>
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

	else if (isUploading) {
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
			alt={fileName}
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