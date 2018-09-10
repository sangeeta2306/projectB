var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var mysql = require('mysql');
var http = require('http');
const api= require('./server/routes/api');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const testFolder = '/home/pcadmin/Downloads/Test2/';
const fs= require('fs');
server.listen(3000);
//parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
io.on('connection', function(socket) {
  console.log('A new WebSocket connection has been established');
  require('chokidar').watch('/home/pcadmin/Desktop/projectb/saved_images_SBC_200', {
	ignored:['basler_camera.py',/[\/\\]\./],
	usePolling: true,
	interval : 20
   }).on('add', path=> {
   	if(fs.statSync(path).isFile()){
    path = new Buffer(fs.readFileSync(path)).toString("base64");
    socket.emit('file added',path); 
    }
});
});

//points static path to dist:
app.use(express.static(path.join(__dirname,'dist')));
//API paths
app.use('/api',api);

//catching other routes and return to the index.html
app.get('*',(req,res)=>{
	res.sendFile(path.join(__dirname,'dist/index.html'));
})

const port = process.env.PORT || '3000';
