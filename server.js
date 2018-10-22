var express = require('express');
const router = express.Router();
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
var data;
var spawn = require('child_process').spawn;
var rimraf = require('rimraf');
//Use these lines if the folder path is determined by the IP address of the machine

//var ip= require('ip').address().split('.').pop();
var ip='199';


//var serverVideoFolder = '/home/pcadmin/Desktop/ProjectB/server/saved_video_SBC_'+ip+'/';
var serverVideoFolder = '/home/pcadmin/Desktop/ProjectB/server/saved_video_SBC_199/';
var serverImageFolder = '/home/pcadmin/Desktop/ProjectB/server/saved_images_SBC_199/';
//var clientFolder = '/home/pcadmin/Desktop/ProjectB/client/colour_images/';
server.listen(3000);
//parsers for POST data
var chokidar = require('chokidar');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


io.on('connection', function(socket) {
  console.log('A new WebSocket connection has been established. Please visit http://localhost:3000 to start the application');
   socket.emit('ip',ip)
  
  //Code for folder path chosen by Device Name button on UI
 /* socket.on('start files',(data)=>{
    serverImageFolder = '/home/pcadmin/Desktop/ProjectB/server/saved_images_'+data+'/';
 });*/
    chokidar.watch(serverVideoFolder, {
    ignored:['basler_camera.py',/[\/\\]\./],
    usePolling: true,
    interval : 25,
    persistent:true
    }).on('add', path=> {
    if(fs.statSync(path).isFile()){
    filepath = new Buffer(fs.readFileSync(path)).toString("base64");
    socket.emit('file added',filepath); 
    setTimeout(function(){deleteServerFiles(path)},8000);
    }
    }); 
   //code for saved images section:
    chokidar.watch(serverImageFolder,{
    ignored:['basler_camera.py',/[\/\\]\./],
    usePolling: true,
    interval : 25
    }).on('add',path=>{
    if(fs.statSync(path).isFile()){
      socket.emit('image added',path);
    }
    });
});

function deleteServerFiles(path){
  var glob = require('glob');
  var time = path.split('/').pop();
  //var time = Math.round(Date.now()/1000)-5;
          let v = serverVideoFolder+time; 
          glob(v,function(err,files){
          
            for(var i=0;i<files.length;i++){
            if(fs.existsSync(files[i]) && fs.statSync(files[i]).isFile()){
              fs.unlinkSync(files[i]);  
              console.log("successfully removed "+files[i]);
            }
          }  
          
          
    });
};
/*function deleteClientFiles(){
  var glob = require('glob');
  var time = Math.round(Date.now()/1000)-4;
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
*///points static path to dist:
app.use(express.static(path.join(__dirname,'dist')));
//API paths
app.use('/api',api);

//catching other routes and return to the index.html
app.get('*',(req,res)=>{
	res.sendFile(path.join(__dirname,'dist/index.html'));
})

const port = process.env.PORT || '3000';
