import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		host: true,
		allowedHosts: ['4ebabe5c88a2.ngrok-free.app'],
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					// Core React libraries
					'react-vendor': ['react', 'react-dom', 'react-router-dom'],

					// UI Components and styling (only commonly used ones)
					'ui-vendor': ['framer-motion', 'lucide-react', 'sonner'],

					// Radix UI components
					'radix-vendor': [
						'@radix-ui/react-dialog',
						'@radix-ui/react-dropdown-menu',
						'@radix-ui/react-label',
						'@radix-ui/react-select',
						'@radix-ui/react-slot',
						'@radix-ui/react-switch',
						'@radix-ui/react-tabs',
						'@radix-ui/react-checkbox',
					],

					// Data fetching and state management
					'query-vendor': ['@tanstack/react-query', 'axios'],

					// Animation libraries
					'animation-vendor': ['@lottiefiles/dotlottie-react'],
				},
			},
		},
		// Increase chunk size warning limit to reduce noise
		chunkSizeWarningLimit: 600,
	},
})
