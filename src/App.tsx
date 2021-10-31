import React from 'react';
import { generateAuthUrl } from '@harrisoff/onedrive-api'

import { clientId, redirectUri } from './config';

import Main from './components/Main'

import './index.less'

export default function App() {
	const hash = window.location.hash.substr(1);
	if (hash) {
		const accessToken = hash.match(/(access_token=)([a-zA-Z0-9/%]*)/)?.[2];
		if (accessToken) return <Main accessToken={accessToken} />
	}

	location.href = generateAuthUrl(clientId, redirectUri)
	return <div style={{ margin: '20px'}}>
		Redirecting to OneDrive authentication page, please wait...
	</div>
}
