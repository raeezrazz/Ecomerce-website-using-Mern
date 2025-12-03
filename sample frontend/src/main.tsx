import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App2'
import { PersistGate } from "redux-persist/integration/react";
import { CartProvider } from "@/contexts/CartContext";
import { Provider } from 'react-redux'
import { persistor, store } from './store/store'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// import { GoogleOAuthProvider } from '@react-oauth/google' // Commented out - Google OAuth not configured

// const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		{/* Uncomment GoogleOAuthProvider when Google OAuth is configured */}
		{/* <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}> */}
			<Provider store={store}>
				<CartProvider>
					<PersistGate loading={null} persistor={persistor}>
						<BrowserRouter>
							<Routes>
								<Route path='/*' element={<App />} />
							</Routes>
						</BrowserRouter>
						<ToastContainer />
					</PersistGate>
				</CartProvider>    
			</Provider>
		{/* </GoogleOAuthProvider> */}
	</StrictMode>
)
