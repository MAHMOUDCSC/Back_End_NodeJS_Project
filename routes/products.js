var express = require('express');
var router = express.Router();
var mysql = require('mysql');
let dateFormat = require('dateformat');
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
    connection.query("SELECT product.*,product_details.*,category.*,company.Name as name_company FROM company,product,product_details,category WHERE company.id = '" + req.params.id + "'and id_company =company.id and  	ser_pro=Serial_number and category.id=id_Category", function (error, result, fields) {
      if (error) {
        res.status(404).json({
          massage: "error"
        });
        throw error
      }; 

      ////console.log(result);

      res.status(200).json({
        massage: "access",
        product: result
      });


    });
  });
});

router.delete('/Product/:serial_number/:price/:Production_date', function (req, res, next) {


  con1.getConnection((error, connection) => {

    //let flag = 0;
    //var i = 0;
    //let jasoN = req.body.products;
    //// console.log(jasoN);
    let production_date = dateFormat(req.params.Production_date, "yyyy-mm-dd");
   // console.log(production_date);



    connection.query("DELETE  FROM product_details WHERE ser_pro = '" + req.params.serial_number + "' and price='" + req.params.price + "' and Production_date = '" + production_date + "'", function (error, result, fields) {
      if (error) {
        res.status(404).json({
          massage: error
        });
        // throw error
      }
      else {
        res.status(200).json({
          massage: "deleted"
        });
      }
    });
  });

});

router.patch('/Product', function (req, res, next) {


  con1.getConnection((error, connection) => {
    if (error) {
      throw error;
      if (error) res.status(500).json({
        massage: "error for connection"
      });
    }
    connection.query("UPDATE product SET  Name  = '" + req.body.name + "', id_Category ='" + req.body.id_Category + "',Image='" + req.body.image + "',description='" + req.body.description + "'WHERE Serial_number = '" + req.body.serial_number + "'", function (error, result, fields) {
      if (error) {
        throw error;
        res.status(500).json({
          massage: "can not UPDATE product information "
        });

      }
      if (result) {
        con1.getConnection((error, connection) => {
          if (error) {
            throw error;
            if (error) res.status(500).json({
              massage: "error for connection"
            });
          }
          connection.query("UPDATE product_details SET  Production_date  = '" + req.body.newproduction_date + "',  Expiry_date ='" + req.body.expiry_date + "',Available_number='" + req.body.available_number + "',Weight='" + req.body.weight + "',price='" + req.body.newprice + "'WHERE 	ser_pro = '" + req.body.serial_number + "' and price='" + req.body.price + "' and Production_date  = '" + req.body.production_date + "' ", function (error, result1, fields) {
            if (error) {
              throw error;
              res.status(500).json({
                massage: "can not UPDATE product information "
              });

            }

            if (result1) {
              res.status(200).json({
                massage: "Data has been updated"
              });
            } else {
              res.status(404).json({
                massage: "can not UPDATE product information "
              });

            }
          });
        });
      } else {
        res.status(404).json({
          massage: "can not UPDATE product information "
        });
      }

    });
  });



});

router.post('/addProduct', function (req, res, next) {


  con1.getConnection((error, connection) => {
    let flag = 0;


    if (error) throw error;
    connection.query("SELECT * FROM product WHERE Serial_number = '" + req.body.SerialNumber + "'", function (error, result_boll, fields) {
      if (error) {

        res.status(404).json({
          massage: "error"
        });

      }

      let jasoN = req.body;

     // console.log(jasoN);
      if (result_boll.deleteStatus) {


        connection.query("UPDATE product SET  Name  = '" + req.body.productname + "', id_Category ='" + req.body.idCategory + "',Image='" + req.body.imageproduct + "',deleteStatus=0 WHERE Serial_number = '" + req.body.SerialNumber + "'", function (error, result, fields) {
          if (error) {
            throw error;
            res.status(500).json({
              massage: "can not UPDATE product information "
            });
            /*  var values = [
                [
                  req.body.productname,
                  req.body.idCategory,
                  req.body.SerialNumber,
                  req.body.imageproduct,
                  req.body.idCompany
                ]
              ];*/
          }
          if (result) {
            con1.getConnection((error, connection) => {
              if (error) {
                throw error;
                if (error) res.status(500).json({
                  massage: "error for connection"
                });
              }
              connection.query("UPDATE product_details SET  Production_date  = '" + req.body.productiondate + "',  Expiry_date ='" + req.body.expirydate + "',Available_number='" + req.body.quantity + "',Weight='" + req.body.weight + "',price='" + req.body.price + "'WHERE 	ser_pro = '" + req.body.SerialNumber + "'", function (error, result1, fields) {
                if (error) {
                  throw error;
                  res.status(500).json({
                    massage: "can not UPDATE product information "
                  });
                  /* values2 = [
                     [
                       req.body.productiondate,
                       req.body.expirydate,
                       req.body.quantity,
                       req.body.weight,
                       req.body.price,
                       req.body.SerialNumber
                     ]
                   ];
             */
                }

                if (result1) {
                  res.status(200).json({
                    massage: "Data has been updated"
                  });
                } else {
                  res.status(404).json({
                    massage: "can not UPDATE product information "
                  });

                }
              });
            });
          } else {
            res.status(404).json({
              massage: "can not UPDATE product information "
            });
          }

        });



      }////
      else if (result_boll.length == 0) {

        con.connect(function (err) {




          var sql = "INSERT INTO product( Name, id_Category, Serial_number,Image, id_company)VALUES ?";


          //Make an array of values:
          var values = [
            [
              req.body.productname,
              req.body.idCategory,
              req.body.SerialNumber,
              req.body.imageproduct,
              req.body.idCompany
            ]
          ];


          con.query(sql, [values], function (err, result1) {
            if (err) {
             // console.log(err);
              res.status(404).json({
                massage: "error"
              });

              throw err;
            }

            // // console.log(result1);


            sql2 = "INSERT INTO product_details(Production_date,Expiry_date,Available_number,Weight,price,ser_pro)VALUES ?";


            values2 = [
              [
                req.body.productiondate,
                req.body.expirydate,
                req.body.quantity,
                req.body.weight,
                req.body.price,
                req.body.SerialNumber
              ]
            ];

            con.query(sql2, [values2], function (err, result) {
              if (err) {
               // console.log(err);
                res.status(404).json({
                  massage: "error not save in database"
                });
                throw err;

              } else {
                res.status(200).json({
                  massage: "product is added "
                });
              }


            });


          });

        });
      }
      else if (result_boll[0].Name == req.body.productname) {

        con.connect(function (err) {
          sql3 = "INSERT INTO product_details(Production_date,Expiry_date,Available_number,Weight,price,ser_pro)VALUES ?";


          values3 = [
            [
              req.body.productiondate,
              req.body.expirydate,
              req.body.quantity,
              req.body.weight,
              req.body.price,
              req.body.SerialNumber
            ]
          ];

          con.query(sql3, [values3], function (err, result) {
            if (err) {
             // console.log(err);
              res.status(404).json({
                massage: "There must be a difference between the old and new details added to the same product either in price or on the date of production ."
              });

            } else {
              res.status(200).json({
                massage: "new details added"
              });
            }


          });

        });


      }
      else {
        res.status(404).json({
          massage: "error the serial_number is exists ,Either use the same product name with different details or change the product serial number for me..  "
        });




      }
    });
  });


});


router.get('/', function (req, res, next) {
  con1.getConnection((error, connection) => {
    if (error) throw error;
    connection.query("SELECT product.*,product_details.*,category.*,company.Name as name_companys FROM company,product,product_details,category WHERE  id_company =company.id and  	ser_pro=Serial_number and category.id=id_Category  order by `entry_date` ASC LIMIT 15", function (error, result, fields) {
      if (error) {
        res.status(404).json({
          massage: "error"
        });
        throw error
      };

      ////console.log(result);

      res.status(200).json({
        massage: "access",
        product: result
      });


    });
  });
});

router.get('/s/:id', function (req, res, next) {
  /* con1.getConnection((error, connection) => {
     if (error) throw error;
     connection.query("SELECT product.*,product_details.*,category.*,company.Name as name_companys FROM company,product,product_details,category WHERE  id_company =company.id and  	ser_pro=Serial_number and category.id=id_Category", function (error, result, fields) {
       if (error) {
         res.status(404).json({
           massage: "error"
         });
         throw error
       };
       connection.query("SELECT product.*,product_details.*,category.*,company.Name as name_companys FROM company,product,product_details,category WHERE  id_company =company.id and  	ser_pro=Serial_number and category.id=id_Category", function (error, result_ss, fields) {
         if (error) {
           res.status(404).json({
             massage: "error"
           });
           throw error
         };
       });*/


  ////console.log(result);

  res.status(200).json({
    massage: "access"
  });


  //});s
  //  });
});


module.exports = router;