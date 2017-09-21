var path = require('path');
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	devtool: 'eval_source_map',
	context: path.join(__dirname,'./views/'), 
	entry:[
	path.join(__dirname,'views/index.js')
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].bundle.js',
		publicPath: '/'
	},
	module:{
		loaders: [{
			test: /\.js$/,
			loader: 'babel-loader',
			include: path.join(__dirname, 'views'),
			query: {
				presets: ['latest','react','stage-2']
			}},
 			{ test: /\.scss?$/,
        loader: 'style-loader!css-loader!sass-loader',
        include: path.join(__dirname, 'views', 'styles') }
        ],
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		inline: true,
		stats: 'errors-only'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'views/index.html'),
			hash:true
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	]
};