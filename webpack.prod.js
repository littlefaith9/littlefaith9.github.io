const TerserPlugin= require('terser-webpack-plugin');
const { version } = require('./package.json');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
	function times(repeat, item) {
		const array = [];
		for (let i = 0; i < repeat; i++)
			array.push(item(i));
		return array;
	}
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
	function randomString(length) {
		return times(length, () => chars[Math.floor(Math.random() * chars.length)]).join('');
	}
	const hash = randomString(16);
	return {
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
			new DefinePlugin({ DEVELOPMENT: false, VERSION: JSON.stringify(version), HASH: JSON.stringify(hash) }),
			new HtmlWebpackPlugin({
				title: 'LittleFaith9',
				meta: {
					'theme-color': '#000000',
					'viewport': 'height=device-height, width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, target-densitydpi=device-dpi'
				},
				hash: true,
				templateContent: `
				<html>
					<head></head>
					<body data-hash="${hash}"></body>
				</html>
				`,
			}),
		],
	}
};