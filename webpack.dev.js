const path = require('path');

module.exports = {
	mode: 'development',
	entry: './src/ts/graphics/screen.ts',
	devServer: {
		port: 8000,
        allowedHosts: 'all',
        static: {                          
            directory: path.join(__dirname, './'),  
            watch: true,
        }
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
	}
};