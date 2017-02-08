const express = require('express');
const path = require('path');
var config = require('./webpack.config.js');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHottMiddleware = require('webpack-hot-middleware');

const app = express();

app.use(express.static('./dist'));

var compiler = webpack(config);

app.use(webpackDevMiddleware(compiler,
	{noInfo: true, publicPath: config.output.publicPath}));
app.use(webpackHottMiddleware(compiler));

app.use('/', function(req,res){
	res.sendFile(path.resolve('./components/index.html'));
});

var port = 3000;

app.listen(port, function(error){
	if(error) throw error;
	console.log('express server: ', port);
});

