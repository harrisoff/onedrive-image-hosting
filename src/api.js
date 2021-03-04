axios.interceptors.response.use((response) => response,
  (error) => {
    alert(error.response.statusText);
    return Promise.reject(error);
  });

export function uploadSmall(file, path, token) {
  return axios({
    method: 'PUT',
    url: `https://graph.microsoft.com/v1.0/me/drive/root:/${path}:/content`,
    data: file,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getUploadUrl(filePath, token) {
  return axios({
    method: 'POST',
    url: `https://graph.microsoft.com/v1.0/drive/root:/${filePath}:/createUploadSession`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}
export function uploadLarge(data, url, size) {
  return axios({
    method: 'PUT',
    url,
    data,
    headers: {
      'Content-Range': `bytes 0-${size - 1}/${size}`,
    },
  });
}

export function getShareId(fileId, token) {
  return axios({
    method: 'POST',
    url: `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/createLink`,
    data: {
      type: 'view',
      scope: 'anonymous',
    },
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

export function genShareUrl(shareId) {
  return `https://api.onedrive.com/v1.0/shares/${shareId}/root/content`;
}
