import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			formats: ['es', 'cjs'],
			fileName: (format) => `index.${format}.js`,
		},
		rollupOptions: {
			external: ['fabric', 'react', 'react-dom'],
			output: {
				globals: {
					fabric: 'fabric',
					react: 'React',
					'react-dom': 'ReactDOM',
				},
			},
		},
	},

	plugins: [
		dts({
			// rollupTypes: true,
		}),
	],
})
