var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const bcrypt = require("bcrypt");
/* GET users listing. */
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "myproject"
});
var con1 = mysql.createPool({
  connectionLimit: 100,
  host: "localhost",
  user: "root",
  password: "",
  database: "myproject"
});



router.get('/:id', function (req, res, next) {
  con1.getConnection((error, connection) => {
    if (error) throw error;
    connection.query("SELECT salesperson.* FROM salesperson WHERE  	id_company  = '" + req.params.id + "'", function (error, result, fields) {
      if (error) throw error;

      if (result[0]) {
        con1.getConnection((error, connection) => {
          if (error) throw error;
          connection.query("SELECT salesperson_phone.* FROM salesperson,salesperson_phone WHERE 	id_company  = '" + req.params.id + "' and  identity_card=id_card  ", function (error, result_phone, fields) {
            if (error) throw error;
            con1.getConnection((error, connection) => {
              connection.query("SELECT  	identity_card,id,Governorate FROM salesperson,has_disribution,distribution_areas WHERE 	salesperson.id_company  = '" + req.params.id+ "'and  identity_card=id_card and id_dist=id  ", function (error, result_sal_dist) {
                if (error) throw error;

            res.status(200).json({
              massage: "access",
              salesperson: result,
              salespersonPhone: result_phone,
              distributionAreas: result_sal_dist,


            });
          });
        });
          });
        });
      }else{
        res.status(200).json({
          massage: "access",
          salespersons:[],
          phone:[]


        });
      }
    });
  });


});
router.post('/add', function (req, res, next) { 

  con1.getConnection((error, connection) => {
    connection.query("SELECT * FROM salesperson WHERE  identity_card= '" + req.body.salesperson.identity_card + "'", function (error, result_find) {
      if (error) throw error;
      
  con1.getConnection((error, connection) => {
    connection.query("SELECT * FROM salesperson WHERE  Email= '" + req.body.salesperson.Email + "'", function (error, result_find2) {
      if (error) throw error;
      //console.log(result_find);
      if(result_find.length>0){
        
        res.status(404).json({
          
          massage: "It cannot be added because the ID number is already used"
        });
        
        
      }
      else if(result_find2.length>0){
        console.log("pppppp ");
        res.status(404).json({
          massage: "It cannot be added because the Email is already used"
        });
      }
      else{
        bcrypt.hash(req.body.salesperson.password, 10, (err, hash) => {
          if (err) {
            throw err;
          } else {
        
        let sql ="INSERT INTO salesperson(name,identity_card,password,Email,ID_photo,id_company)VALUES ?";
        let values = [
          [
            req.body.salesperson.name,
            req.body.salesperson.identity_card,
            hash,
            req.body.salesperson.Email,
            req.body.salesperson.ID_photo, 
            req.body.salesperson.id_company,
          ]
        ];

        con.query(sql,[values], function (err, result) {
          if (err){ 
            
            res.status(404).json({
            massage: err
          });
        }
          var i=0;
         for(;i<req.body.salespersonPhone.length;i++) {
          let sql2 ="INSERT INTO salesperson_phone(id_card ,Phone_Number)VALUES ?";
           let values2 = [
           [
            req.body.salesperson.identity_card,
            req.body.salespersonPhone[i].Phone_Number
          ]
         ];
         con.query(sql2,[values2], function (err, result) {
          if (err) {
             res.status(404).json({
            massage: err
          });

        }
         });

        }//for
        if(i==req.body.salespersonPhone.length){

          var i=0;
        for(;i<req.body.distributionAreas.length;i++) {
          let sql3 ="INSERT INTO has_disribution(id_dist,id_card)VALUES ?";
           let values3 = [
           [
            req.body.distributionAreas[i].id,
            req.body.salesperson.identity_card
          ]
         ];
         con.query(sql3,[values3], function (err, result) {
          if (err){
            //console.log('err');
            res.status(404).json({
            massage: err
          });
        }
         });

        }//for
        if(i==req.body.distributionAreas.length){
          res.status(200).json({
            massage: "Added successfully"
          });

        }



        }else{
          //console.log('err');
          res.status(404).json({
            massage: err
          });
          
        }

        });
      }
    });

      }//////////
    });
  });
    });
  });/////




});

module.exports = router;