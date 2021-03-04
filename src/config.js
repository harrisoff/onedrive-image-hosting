const clientId = window.location.hostname === 'localhost' ? 'bebfea7f-4c55-4f5b-b553-42b852baf849' : 'a8e98bd0-7d39-4b69-84aa-0798b94b0f5d';
const redirectUrl = window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'https://harrisoff.github.io/onedrive.html';
const scope = 'openid https://graph.microsoft.com/Files.ReadWrite.All';

export const loginUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUrl}&scope=${scope}`;
export const defaultDir = 'OneDriveApiDir';
