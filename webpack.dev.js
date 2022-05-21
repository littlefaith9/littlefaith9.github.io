const path = require('path');
const { version } = require('./package.json');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/ts/common/entry.ts',
	devServer: {
		port: 8000,
        allowedHosts: 'all',
        static: {                          
            directory: path.join(__dirname, './'),  
            watch: true,
        },
		devMiddleware: {
			stats: 'minimal',
		},
	},
	output: {
		path: __dirname,
		filename: './index.js',
        publicPath: '/'
	},
	module: {
		rules: [{ test: /\.ts/, loader: 'ts-loader' }]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	stats: {
		warningsFilter: /some filter/
	},
	plugins: [
		new DefinePlugin({ DEVELOPMENT: true, VERSION: JSON.stringify(version) }),
		new HtmlWebpackPlugin({
			title: 'LittleFaith9',
			meta: {
				'theme-color': '#000000',
				'viewport': 'height=device-height, width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, target-densitydpi=device-dpi'
			},
			// templateContent: `
			// <html>
			// 	<head>
			// 		<link rel="manifest" href="manifest.webmanifest">
			// 	</head>
			// 	<body></body>
			// </html>
			// `
		}),
	],
};