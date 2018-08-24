const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var fs = require('fs');
var data ;

var connection = mysql.createConnection({
	host: 'localhost',
	user : 'root',
	password : 'Newuser123',
	database: 'image_database'
});

//no need to call connection.connect() and connection.end(). This is implicitly called 
//by the node server itself.

router.get('/',(req,res)=>{
   res.send('API works!!');
});

router.get('/devices',function(req,res){
    var sql = "SELECT DISTINCT(DEVICE_NAME) from server_images";
    connection.query(sql,function(err,results,fields){
        if(err) throw console.log(err);
        return res.send(results);
    })
});

router.get('/images', function (req, res) {   
		var sql = "SELECT * FROM server_images"; 
    	connection.query(sql,function(err,results,fields){
    	if(err) throw console.log(err);
        //return res.send({ error: false, data: Object.values(results), message: 'Got the list' });
    	//return res.send({ data: results});
    	//return res.send(res.json(results));
             // read binary data
        for(var i=0;i<results.length;i++){
           var bitmap = fs.readFileSync(results[i].FILEPATH);
           results[i].FILEPATH = new Buffer(bitmap).toString('base64');
           results[i].FILEPATH = 'data:image/jpeg;charset=utf-8;base-64,' + results[i].FILEPATH;
        }
        return res.send(results);
        //return res.status(200).json({payload:Object.values(results)});
    });
});

router.get('/imagelist/:id',async function(req,res){

    var id = req.params.id;
    var sql = 'select * from server_images where DEVICE_NAME="'+id+'"';
    connection.query(sql, function(err,results,fields){
        if(err) throw console.log(err);
        for(var i=0;i<results.length;i++){
          //console.log(results[i].FILEPATH);
           //var bitmap = fs.readFileSync(results[i].FILEPATH);
           //let sample = new Buffer(bitmap).toString('base64');
           //results[i].FILEPATH = 'data:image/jpeg;charset=utf-8;base-64,' + sample;
        //sample = null;
        //var path = new Buffer(fs.readFileSync(results[i].FILEPATH)).toString("base64");
        //results[i].FILEPATH = path;
        results[i].FILEPATH = new Buffer(fs.readFileSync(results[i].FILEPATH)).toString("base64");
        
         }
        return res.send(results);
        /*results[0].FILEPATH = new Buffer(fs.readFileSync(results[0].FILEPATH)).toString("base64");
        return res.send(results);*/
        
    })
});

module.exports = router;
      