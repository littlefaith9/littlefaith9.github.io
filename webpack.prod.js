const TerserPlugin= require('terser-webpack-plugin');
const { version } = require('./package.json');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: './src/ts/common/entry.ts',
	output: {
		path: __dirname,
		filename: './index.js',
	},
	module: {
		rules: [{ test: /\.ts/, loader: 'ts-loader' }]
	},
	resolve: {
		extensions: ['.ts']
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin({
			terserOptions: {
				format: {
					comments: false,
				}
			},
			extractComments: false,
		})]
	},
	stats: {
		warningsFilter: /some filter/
	},
	plugins: [
		new DefinePlugin({ DEVELOPMENT: false, VERSION: JSON.stringify(version) }),
		new HtmlWebpackPlugin({ title: 'LittleFaith9', meta: { 'theme-color': '#a0f03c' }, hash: true })
	],
};