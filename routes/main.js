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

router.get('/category', function (req, res, next) {

  con1.getConnection((error, connection) => {
    if (error) throw error;
    connection.query("SELECT * FROM category  ", function (error, result, fields) {
      if (error) throw error;
      if (result) {
        res.status(200).json({
          massage: "access",
          category: result,
        });
      }

    });
  });
});

router.get('/areas', function (req, res, next) {

  con1.getConnection((error, connection) => {
    if (error)res.status(404).json({
      massage: "erorr"
    }); 
    connection.query("SELECT * FROM distribution_areas  ", function (error, result, fields) {
      if (error) res.status(404).json({
        massage: "erorr"
      }); 
      if (result) {
        res.status(200).json({
          massage: "access",
          category: result,
        });
      }

    });
  });
});
router.get('/', function (req, res, next) {





});

router.get('/allcompany', function (req, res, next) {


  con1.getConnection((error, connection) => {
    if (error) throw error;
    connection.query("SELECT id,Name  FROM company  ", function (error, result, fields) {
      if (error) throw error;
      if (result) {
        res.status(200).json({
          massage: "access",
          company: result,
        });
      }

    });
  });
});



router.get('/count', function (req, res, next) {


  con1.getConnection((error, connection) => {
    if (error) throw error;

    connection.query("SELECT COUNT(id) as count FROM company ", function (error, result_count, fields) {
      if (error) throw error;
      connection.query("SELECT COUNT(Serial_number) as count FROM product ", function (error, result_count2, fields) {
        if (error) throw error;
        connection.query("SELECT COUNT(id) as count FROM retailer ", function (error, result_count1, fields) {
          if (error) throw error;

          res.status(200).json({
            massage: "sccess sigin",
            count_company: result_count[0].count,
            count_retailer: result_count1[0].count,
            count_product: result_count2[0].count,

          });

        });
      });
    });
  });
});


module.exports = router;