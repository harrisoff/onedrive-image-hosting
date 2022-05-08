type UploadItem = {
	fileName: string
	data: File
	folderName: string
	uploadId: string
	shareId: string
	shareUrl: string
	status: 'pending' | 'uploading' | 'uploaded' | 'shared' | 'error'
	errorMessage?: string
}
type CacheItem = Pick<
	UploadItem,
	'fileName' | 'folderName' | 'shareUrl' | 'errorMessage'
> & {
	status: 'cache'
}
