const path = require('path')
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('rollup-plugin-ts')
const sourceMaps = require('rollup-plugin-sourcemaps')

const resolveFile = function (filePath) {
	return path.join(process.cwd(), '.', filePath)
}

const packageJson = require(resolveFile('package.json'))

export default {
	input: resolveFile('src/index.ts'),
	output: [
		{
			file: resolveFile('dist/cjs/index.js'),
			format: 'cjs',
			sourcemap: true,
			plugins: [],
		},
		{
			file: resolveFile('dist/esm/index.js'),
			format: 'esm',
			sourcemap: true,
			plugins: [],
		},
	],
	external: [
		...Object.keys(packageJson.dependencies || {}),
		...Object.keys(packageJson.devDependencies || {}),
	],
	plugins: [
		typescript({
			tsconfig: resolveFile('tsconfig.json'),
			sourceMap: true,
			inlineSources: false,
			hook: {
				// Always rename declaration files to index.d.ts to avoid emitting two declaration files with identical contents
				outputPath: (path, kind) =>
					kind === 'declaration' ? resolveFile('./dist/index.d.ts') : path,
			},
		}),
		sourceMaps(),
		// uglify(),
		commonjs(),
	],
}
