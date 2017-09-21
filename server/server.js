const express = require('express');
const path = require('path');
var config = require('./../webpack.config.js');
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

const app = express();
const publicPath = express.static(path.join(__dirname, 'dist'))
const indexPath = path.join(__dirname, 'dist/index.html')

//app.use(express.static('./dist'));

var compiler = webpack(config);
const middleware = webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {//Powershell leaves out info
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  }
})
/////
   app.use(middleware)
   app.use(webpackHotMiddleware(compiler))
   app.get('*', function response (req, res) {
      res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '../dist/index.html'))) 
      res.end()
    })
//app.get('/', function (_, res) { res.sendFile(indexPath) })
// app.use('/', function(req,res){
// 	res.sendFile(path.resolve('./views/index.html'));
// });

var port = 3000;

app.listen(port, function(error){
	if(error) throw error;
	console.log('express server: ', port);
});

