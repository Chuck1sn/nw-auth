module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true
	},
	extends: ['standard-with-typescript', 'plugin:prettier/recommended'],
	overrides: [],
	parserOptions: {
		parser: '@typescript-eslint/parser',
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: './tsconfig.json',
		tsconfigRootDir: __dirname
	},
	rules: {},
	plugins: ['@typescript-eslint']
}
