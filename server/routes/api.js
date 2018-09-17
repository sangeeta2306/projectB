const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var fs = require('fs');
var data ;

var connection = mysql.createConnection({
	host: 'localhost',
	user : 'root',
	password : 'Newuser123',
	database: 'project_B_db3'
});

//no need to call connection.connect() and connection.end(). This is implicitly called 
//by the node server itself.

router.get('/',(req,res)=>{
   res.send('API works!!');
});

router.get('/devices',function(req,res){
    var sql = "SELECT DISTINCT(dev_name) from img_tbl";
    connection.query(sql,function(err,results,fields){
        if(err) throw console.log(err);
        return res.send(results);
    })
});

router.get('/images', function (req, res) {   
		var sql = "SELECT * FROM img_tbl"; 
    	connection.query(sql,function(err,results,fields){
    	if(err) throw console.log(err);
        for(var i=0;i<results.length;i++){
           var bitmap = fs.readFileSync(results[i].file_path);
           results[i].file_path = new Buffer(bitmap).toString('base64');
           results[i].file_path = 'data:image/jpeg;charset=utf-8;base64,' + results[i].file_path;
        }
        return res.send(results);
      });
});

router.get('/imagelist/:id',async function(req,res){
    var id = req.params.id;
    var sql = 'select * from img_tbl where dev_name="'+id+'"';
    connection.query(sql, function(err,results,rows){
        if(err) throw console.log(err);
        for(var i=0;i<results.length;i++){
        results[i].fileName = results[i].file_path.split("/").pop(); 
        results[i].file_path = new Buffer(fs.readFileSync(results[i].file_path)).toString("base64");
      }
      return res.send(results);
    })
});

module.exports = router;
      