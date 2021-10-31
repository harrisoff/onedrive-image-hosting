import React from 'react';
import { generateAuthUrl } from '@harrisoff/onedrive-api'

import { clientId, redirectUri } from './config';
import { parseHash } from './utils'

import Main from './components/Main'

import './index.less'

const ErrorMessage = ({ label, message }: { label: string, message: string }) => {
	return <p><span style={{ color: 'red', marginRight: '10px' }}>{label}:</span>{message}</p>
}

export default function App() {
	const { access_token, error, error_description } = parseHash(location.hash)

	if (access_token) {
		return <Main accessToken={access_token} />
	}

	if (error) {
		return <div style={{ margin: '20px' }}>
			<ErrorMessage label='ERROR' message={error} />
			<ErrorMessage label='ERROR DESCRIPTION' message={error_description.replace(/\+/g, ' ')} />
		</div>
	}

	location.href = generateAuthUrl(clientId, redirectUri)
	return <div style={{ margin: '20px' }}>
		Redirecting to OneDrive authentication page, please wait...
	</div>
}
