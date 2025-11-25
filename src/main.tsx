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
import posthog from 'posthog-js'
import { PostHogProvider } from '@posthog/react'

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
	api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
	defaults: '2025-05-24',
	capture_pageview: true,
	capture_pageleave: true,
	autocapture: true,
	// Enable Web Vitals tracking
	capture_performance: true,
	capture_heatmaps: true,
	capture_dead_clicks: true,
})

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<PostHogProvider client={posthog}>
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
		</PostHogProvider>
	</StrictMode>
)
