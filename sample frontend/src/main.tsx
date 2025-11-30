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

createRoot(document.getElementById('root')).render(
	<StrictMode>
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
	</StrictMode>
)
