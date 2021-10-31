import React, { useState } from 'react';
import {
	TextField, Button, Paper, styled,
	Stack, Dialog, DialogContent,
	DialogContentText, DialogActions,
	Divider, Link
} from '@mui/material';
import { GitHub } from '@mui/icons-material';
import OneDriveApi, { getShareUrl, generateAuthUrl } from '@harrisoff/onedrive-api'

import { clientId, redirectUri } from '../../config'

import ImageItemList from '../ImageItemList'

const Input = styled('input')({
	display: 'none',
});

export default ({ accessToken }: { accessToken: string }) => {
	const [oneDriveApi] = useState(new OneDriveApi({ accessToken }))

	const [folderName, setFolderName] = useState('OneDriveImageHosting');

	const [uploadItemList, setUploadItemList] = useState<UploadItem[]>([]);
	const updateItemProgress = (item: UploadItem, data: Partial<UploadItem>) => {
		setUploadItemList(prevProgress => prevProgress.map(p => {
			if (p.fileName === item.fileName) {
				return {
					...p,
					...data
				}
			}
			return p
		}))
	}

	const upload = (item: UploadItem) => {
		updateItemProgress(
			item,
			{
				isUploading: true,
				error: ''
			}
		)
		oneDriveApi.upload(item.data, item.filePath)
			.then(({ id }) => {
				updateItemProgress(
					item,
					{
						isUploaded: true,
						uploadId: id,
					}
				)
				return new Promise((resolve, reject) => {
					oneDriveApi.share(id)
						.then(({ shareId }) => {
							updateItemProgress(
								item,
								{
									isUploading: false,
									shareId,
									shareUrl: getShareUrl(shareId)
								}
							)
						})
						.catch(reject)
				})
			})
			.catch(e => {
				updateItemProgress(
					item,
					{
						isUploading: false,
						error: e.message
					}
				)
			})
	}

	const handleChangeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
		const fileList = Array.from(e.target.files || [])
		const newItemList = fileList.map(file => {
			return {
				fileName: file.name,
				data: file,
				filePath: `${folderName}/${file.name}`,
				isUploading: false,
				isUploaded: false,
				uploadId: '',
				shareId: '',
				shareUrl: '',
				error: ''
			}
		})
			.filter(item => {
				return !item.isUploading && !item.isUploaded
			})
			.filter(item => {
				return !uploadItemList.map(i => i.fileName).includes(item.fileName)
			})
		setUploadItemList([
			...uploadItemList,
			...newItemList.map(item => {
				return {
					...item,
					isUploading: true
				}
			})
		])
		newItemList.forEach(upload)
	}

	const handleReUpload = (fileName: string) => {
		const file = uploadItemList.find(f => f.fileName === fileName)
		if (file) upload(file)
	}

	const [isDialogVisible, setIsDialogVisible] = useState(false);
	const handleClickAuth = () => {
		setIsDialogVisible(true)
	}
	const handleOk = () => {
		location.href = generateAuthUrl(clientId, redirectUri)
	}
	const handleCancel = () => {
		setIsDialogVisible(false)
	}

	return <div className='main'>
		<Stack
			direction="row"
			alignItems="center"
			spacing={2}
			className='toolbox'
		>
			<label>
				<Input accept="image/*" id="contained-button-file" multiple type="file" onChange={handleChangeFiles} />
				<Button variant="contained" component="span">
					Select Files
				</Button>
			</label>
			<TextField size='small' label='folder name' value={folderName} onChange={e => setFolderName(e.target.value)} />
			<Divider orientation="vertical" flexItem />
			<span>
				If access_token is expired:
			</span>
			<Button variant="contained" component="span" onClick={handleClickAuth}>
				Open Auth Url
			</Button>
			<Divider orientation="vertical" flexItem />
			<Link href='https://github.com/harrisoff/onedrive-image-hosting' target='_blank'>
				<GitHub />
			</Link>
		</Stack>

		<Paper elevation={2} className='imageListWrapper'>
			{
				uploadItemList.length > 0 ? (
					<ImageItemList itemList={uploadItemList} onClickUpload={handleReUpload} />
				) : (
					'Selected files will be displayed here'
				)
			}
		</Paper>

		<Dialog open={isDialogVisible} onClose={handleCancel}>
			<DialogContent>
				<DialogContentText>
					You are leaving this page.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button color="primary" onClick={handleOk}>
					Go ahead
				</Button>
				<Button color="primary" onClick={handleCancel}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	</div>
}