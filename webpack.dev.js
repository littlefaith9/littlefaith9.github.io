const path = require('path');
const { version } = require('./package.json');
const { DefinePlugin } = require('webpack');

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
	plugins: [new DefinePlugin({ DEVELOPMENT: true, VERSION: JSON.stringify(version) })],
};