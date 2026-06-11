import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'

export default defineConfig({
	build: {
		assetsDir: './dist',
		outDir: './dist',
		rollupOptions: {
			input: './src/client.tsx',
			output: {
				entryFileNames: 'client.js'
			}
		}
	},
	plugins: [cloudflare(), ssrPlugin(), tailwindcss()],
	resolve: {
		tsconfigPaths: true
	}
})
