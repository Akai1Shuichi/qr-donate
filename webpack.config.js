const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
	const isDev = argv.mode !== 'production';

	return {
		entry: './script.js',
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: isDev ? 'bundle.js' : 'bundle.[contenthash].js',
			clean: true,
			assetModuleFilename: 'assets/[name][hash][ext][query]'
		},
		module: {
			rules: [
				{
					test: /\.css$/i,
					use: ['style-loader', 'css-loader']
				},
				{
					test: /\.(png|jpe?g|gif|svg)$/i,
					type: 'asset/resource'
				}
			]
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, 'index.html'),
				inject: 'body'
			}),
			new CopyWebpackPlugin({
				patterns: [
					{ from: path.resolve(__dirname, 'assets'), to: 'assets' }
				]
			})
		],
		devtool: isDev ? 'eval-source-map' : 'source-map',
		devServer: {
			static: path.resolve(__dirname, 'dist'),
			compress: true,
			port: 5173,
			open: true,
			host: '0.0.0.0'
		}
	};
};


