import React, { useEffect, useState } from 'react';
import {
	TextField, Button, Paper, styled,
	Stack, Dialog, DialogContent,
	DialogContentText, DialogActions,
	Divider, Link
} from '@mui/material';
import { GitHub } from '@mui/icons-material';
import OneDriveApi, { getShareUrl, generateAuthUrl } from '@harrisoff/onedrive-js-sdk'

import { clientId, redirectUri, defaultFolder } from '../../config'
import { readCache, writeCache } from '../../cache';

import ImageItemList from '../ImageItemList'

const Input = styled('input')({
	display: 'none',
});

const records = readCache()

export default ({ accessToken }: { accessToken: string }) => {
	const [oneDriveApi] = useState(new OneDriveApi({ accessToken }))

	const latestRecord = records[records.length - 1]

	const [folderName, setFolderName] = useState(latestRecord?.folderName || defaultFolder);

	const [itemList, setItemList] = useState<(UploadItem | CacheItem)[]>(
		records.map(r => ({
			...r,
			status: 'cache'
		}))
	);
	const updateItemProgress = (item: UploadItem, data: Partial<UploadItem>) => {
		setItemList(prevProgress => prevProgress.map(p => {
			if (p.status !== 'cache' && p.fileName === item.fileName) {
				return {
					...p,
					...data
				}
			}
			return p
		}))
	}
	useEffect(() => {
		// hmmm, there are unnecessary writes
		writeCache(
			itemList
				.filter(i => i.status === 'cache' || i.status === 'shared')
				.map((i) => ({
					fileName: i.fileName,
					folderName: i.folderName,
					shareUrl: i.shareUrl
				}))
		)
	}, [itemList])

	const upload = (item: UploadItem) => {
		updateItemProgress(
			item,
			{
				status: 'uploading'
			}
		)
		oneDriveApi.upload(item.data, `${item.folderName}/${item.fileName}`)
			.then(({ id }) => {
				updateItemProgress(
					item,
					{
						status: 'uploaded',
						uploadId: id,
					}
				)
				return new Promise((resolve, reject) => {
					oneDriveApi.share(id)
						.then(({ shareId }) => {
							updateItemProgress(
								item,
								{
									status: 'shared',
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
						status: 'error',
						errorMessage: e.message
					}
				)
			})
	}

	const handleChangeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
		const fileList = Array.from(e.target.files || [])
		const newItemList: UploadItem[] = fileList
			.map(file => {
				return {
					fileName: file.name,
					data: file,
					folderName,
					uploadId: '',
					shareId: '',
					shareUrl: '',
					status: 'pending' as 'pending',
				}
			})
			.filter(item => {
				return !itemList.map(i => i.fileName).includes(item.fileName)
			})
		setItemList(prevItemList => [
			...prevItemList,
			...newItemList
		])
		newItemList.forEach(upload)
	}

	const handleReUpload = (fileName: string) => {
		const file = itemList.find((i): i is UploadItem => i.fileName === fileName)
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
				itemList.length > 0 ? (
					<ImageItemList itemList={itemList} onClickUpload={handleReUpload} />
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