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
var glob = require('glob');
const fs= require('fs');
var serverFolder = '/home/pcadmin/Desktop/ProjectB/server/saved_video_SBC_4/';
var clientFolder = '/home/pcadmin/Desktop/ProjectB/client/colour_images/';
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
  require('chokidar').watch(serverFolder, {
	ignored:['basler_camera.py',/[\/\\]\./],
	usePolling: true,
	interval : 30
   }).on('add', path=> {
   	if(fs.statSync(path).isFile()){
    path = new Buffer(fs.readFileSync(path)).toString("base64");
    socket.emit('file added',path); 
    }
});
});

function deleteServerFiles(){
  var glob = require('glob');
  var time = Math.round(Date.now()/1000)-5;
          let v = serverFolder+time+'*.jpg'; 
          glob(v,function(err,files){
          for(var i=0;i<files.length;i++){
            if(fs.statSync(files[i]).isFile()){
              fs.unlinkSync(files[i]);  
              console.log("successfully removed "+files[i]);
            }else{
              console.log("error");
            }
          }
    })

};
function deleteClientFiles(){
  var glob = require('glob');
  var time = Math.round(Date.now()/1000)-5;
          let v = clientFolder+time+'*.jpg'; 
          glob(v,function(err,files){
          for(var i=0;i<files.length;i++){
            if(fs.statSync(files[i]).isFile()){
              fs.unlinkSync(files[i]);  
              console.log("successfully removed "+files[i]);
            }else{
              console.log("error");
            }
          }
    })

};
//deleteServerFiles();
//deleteClientFiles();
//setInterval(function(){deleteServerFiles()},1000);
//setInterval(function(){deleteClientFiles()},1000);

//points static path to dist:
app.use(express.static(path.join(__dirname,'dist')));
//API paths
app.use('/api',api);

//catching other routes and return to the index.html
app.get('*',(req,res)=>{
	res.sendFile(path.join(__dirname,'dist/index.html'));
})

const port = process.env.PORT || '3000';
