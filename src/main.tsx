import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'
import { queryClient } from './lib/queryClient'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { StrictMode } from 'react'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider>
			<BrowserRouter>
				<QueryClientProvider client={queryClient}>
					<AuthProvider>
						<App />
						<Toaster position='top-right' richColors />
					</AuthProvider>
				</QueryClientProvider>
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>
)
