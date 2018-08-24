var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var mysql = require('mysql');
var http = require('http');
const api= require('./server/routes/api');
const app = express();

//parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



//points static path to dist:
app.use(express.static(path.join(__dirname,'dist')));
//app.use(express.static('public'));
//API paths
app.use('/api',api);

//catching other routes and return to the index.html
app.get('*',(req,res)=>{
	res.sendFile(path.join(__dirname,'dist/index.html'));
})

const port = process.env.PORT || '3000';
app.set('port',port);

const server = http.createServer(app);

server.listen(port,()=> console.log(`API running on localhost:${port}`));
