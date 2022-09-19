import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { baseUrl } from './config'
import Layout from './layout'

import './App.less'

export default function App() {
	return <>
		<BrowserRouter basename={baseUrl}>
			<Routes>
				<Route path='/' element={<Layout />} />
			</Routes>
		</BrowserRouter>
	</>
}
