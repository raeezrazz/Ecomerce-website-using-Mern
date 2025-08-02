import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PersistGate } from "redux-persist/integration/react";

import { Provider } from 'react-redux'
import { persistor, store } from './store/store.js'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
			<BrowserRouter>
				<Routes>
					<Route path='/*' element={<App />} />
				</Routes>
			</BrowserRouter>
			<ToastContainer />
			</PersistGate>
		</Provider>
	</StrictMode>
)
