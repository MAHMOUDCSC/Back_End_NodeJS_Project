var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const bcrypt = require("bcrypt");
let dateFormat = require('dateformat');
/* GET users listing. */
var con = mysql.createPool({
  connectionLimit: 100,
  host: "localhost",
  user: "root",
  password: "",
  database: "myproject"
});
var con1 = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "myproject"
});


router.post('/sigin', function (req, res, next) {

  con.getConnection((error, connection) => {
    if (error) throw error;
    connection.query("SELECT * FROM company WHERE  Email  = '" + req.body.Email + "'", function (error, result, fields) {
      if (error) throw error;



      connection.query("SELECT * FROM salesperson WHERE  Email  = '" + req.body.Email + "'", function (error, result_salesperson, fields) {
        if (error) throw error;



        connection.query("SELECT * FROM retailer WHERE  Email  = '" + req.body.Email + "'", function (error, result_retailer, fields) {
          if (error) throw error;




          ////console.log(result[0].id );


          if (result[0]) {
            ////console.log(result[0]);
            if (result[0].Account_status == 0) {
              con.getConnection((error, connection) => {
                connection.query("SELECT * FROM company_address WHERE  id_company  = '" + result[0].id + "'", function (error, result_add) {
                  if (error) throw error;
                  con.getConnection((error, connection) => {
                    ////console.log(result[0]);
                    connection.query("SELECT * FROM company_phone WHERE  id_company  = '" + result[0].id + "'", function (error, result_ph) {
                      if (error) throw error;
                      con.getConnection((error, connection) => {
                        ////console.log(result[0]);
                        connection.query("SELECT * FROM product,product_details,category  WHERE  id_company  = '" + result[0].id + "'and ser_pro=Serial_number and id_Category=id ", function (error, result_por) {
                          if (error) throw error;
                          ////console.log(result_por);
                          con.getConnection((error, connection) => {
                            connection.query("SELECT * FROM salesperson WHERE 	id_company  = '" + result[0].id + "'", function (error, result_sal) {
                              if (error) throw error;
                              ////console.log(result_sal);
                              con.getConnection((error, connection) => {
                                connection.query("SELECT id_card,Phone_Number FROM salesperson,salesperson_phone WHERE 	id_company  = '" + result[0].id + "'and  	id_card =identity_card  ", function (error, result_sal_phone) {
                                  if (error) throw error;
                                  // //console.log(result_sal_phone);
                                  con.getConnection((error, connection) => {
                                    connection.query("SELECT  	identity_card,id,Governorate FROM salesperson,has_disribution,distribution_areas WHERE 	salesperson.id_company  = '" + result[0].id + "'and  	id_card =identity_card and id_dist=id  ", function (error, result_sal_dist) {
                                      if (error) throw error;
                                      // //console.log(result_sal_dist);



                                      con.getConnection((error, connection) => {
                                        connection.query("SELECT salesperson.name,salesperson.identity_card,salesperson.Email AS Email_salesperson,orders.*,order_info.*,retailer.name_retailer,retailer.Store_name,retailer.city_name,retailer.Region,retailer.Street_name,retailer.Email,product.Name as name_product,(order_info.price *Required_quantity)as costall FROM salesperson,orders,order_info,retailer,product  WHERE 	salesperson.id_company  = '" + result[0].id + "' and Id_card=identity_card and  	o_number =Order_number and  	id_retailer=id and  	orders.ser_pro=product.Serial_number  ", function (error, result_order) {
                                          if (error) throw error;
                                          ////console.log(result_order);




                                          if (result[0].Email) {
                                            bcrypt.compare(req.body.password, result[0].password).then(result1 => {
                                              if (result1) {
                                                //result_por.Production_date=result_por.Production_date.toISOString().replace('T', ' ').substr(0, 19);
                                               
                                                
                                                for (let index = 0; index < result_sal.length; index++) {
                                                  let obj = [];
                                                  for (let j = 0; j < result_sal_phone.length; j++) {

                                                    if (result_sal[index].identity_card == result_sal_phone[j].id_card) {
                                                      obj.push(result_sal_phone[j].Phone_Number)
                                                      // //console.log(result_sal_phone[j].Phone_Number);
                                                      // result_sal[index]['phone'] = result_sal_phone;
                                                    }

                                                  }
                                                  result_sal[index]['phone'] = obj;
                                                }
                                                //console.log(result_order);
                                                for (let index = 0; index < result_sal.length; index++) {
                                                  let obj = [];
                                                  for (let j = 0; j < result_sal_dist.length; j++) {

                                                    if (result_sal[index].identity_card == result_sal_dist[j].identity_card) {
                                                      obj.push(result_sal_dist[j].Governorate)
                                                      ////console.log(result_sal_dist[j].Governorate);
                                                      // result_sal[index]['phone'] = result_sal_phone;
                                                    }

                                                  }
                                                  result_sal[index]['Governorate'] = obj;
                                                }
                                                res.status(200).json({
                                                  massage: "sccess sigin",
                                                  type: 0,
                                                  idcompany: result[0].id,
                                                  userName: result[0].Name,
                                                  email: result[0].Email,
                                                  imageProfile: result[0].image,
                                                  address: result_add,
                                                  phonecompany: result_ph,
                                                  product: result_por,
                                                  salesperson: result_sal,
                                                  order: result_order



                                                });

                                              }
                                              else {
                                                res.status(202).json({
                                                  massage: "wrong password"
                                                });

                                              }

                                            });

                                          }

                                        });
                                      });///
                                    });
                                  });
                                });
                              });
                            });
                          });//
                        });
                      });
                    });
                  });
                });
              });
            } else {
              res.status(202).json({
                massage: "The account has been suspended"
              })
            }

          }


          ////////////////////////////////////





          ////console.log(results[0]);
          else if (result_salesperson[0]) {
            ////console.log(result);
            if (result_salesperson[0].Account_status == 0) {
              if (result_salesperson[0].Email) {
                bcrypt.compare(req.body.password, result_salesperson[0].password).then(result1 => {
                  if (result1) {
                    delete result_salesperson[0].password;
                    delete result_salesperson[0].Account_status
                    con.getConnection((error, connection) => {
                      if (error) throw error;
                      connection.query("SELECT * FROM salesperson_phone WHERE  id_card   = '" + result_salesperson[0].identity_card + "'", function (error, result_phone, fields) {
                        if (error) throw error;
                        connection.query("SELECT * FROM has_disribution,distribution_areas WHERE  id_card   = '" + result_salesperson[0].identity_card + "' and id_dist=distribution_areas.id", function (error, result_area, fields) {
                          if (error) throw error;


                          for (let index = 0; index < result_salesperson.length; index++) {
                            let obj = [];
                            for (let j = 0; j < result_phone.length; j++) {

                              if (result_salesperson[index].identity_card == result_phone[j].id_card) {
                                obj.push(result_phone[j].Phone_Number)
                                ////console.log(result_phone[j].Phone_Number);
                                //result_sal[index]['phone'] = result_sal_phone;
                              }

                            }
                            result_salesperson[index]['phone'] = obj;
                          }
                          for (let index = 0; index < result_salesperson.length; index++) {
                            let obj = [];
                            for (let j = 0; j < result_area.length; j++) {

                              if (result_salesperson[index].identity_card == result_area[j].id_card) {
                                obj.push(result_area[j])
                                ////console.log(result_phone[j].Phone_Number);
                                //result_sal[index]['phone'] = result_sal_phone;
                              }

                            }
                            result_salesperson[index]['area'] = obj;
                          }


                          let result_order2;
                          con.getConnection((error, connection) => {
                            if (error) throw error;
                            connection.query("SELECT orders.*,order_info.*,retailer.name_retailer,retailer.Email,retailer.Id,retailer.city_name,retailer.Street_name,retailer.Region,(order_info.price *Required_quantity)as costall FROM orders,order_info,retailer WHERE  id_card   = '" + result_salesperson[0].identity_card + "' and o_number=Order_number  and  orders.id_retailer=Id", function (error, result_order, fields) {
                              if (error) throw error;


                              ////console.log(result_order);

                              // //console.log(result_order1);
                              /////console.log(result_order1[i].lengt);


                              for (var i = 0; i < result_order.length; i++) {
                                let o = result_order[i].Id;


                                // //console.log("result_order1[0].identity_card" + o);


                                connection.query("SELECT * FROM retailer_phone WHERE 	id_retailer ='" + o + "'", function (error, result_sal_phone, fields) {
                                  if (error) throw error;
                                  //result_order2 = result_order;
                                  // //console.log("result_sal_phone" + result_sal_phone);




                                  for (var index = 0; index < result_order.length; index++) {
                                    var obj = [];
                                    var flage = 0;
                                    for (var j = 0; j < result_sal_phone.length; j++) {

                                      if (result_order[index].Id == result_sal_phone[j].id_retailer) {
                                        obj.push(result_sal_phone[j].Phone_Number)
                                        flage = 1;

                                        ////console.log(result_sal_phone[j].Phone_Number);
                                        // result_sal[index]['phone'] = result_sal_phone;
                                      }

                                    }
                                    if (flage == 1) { result_order[index].phone = obj; }


                                  }

                                });

                              }
                              con.getConnection((error, connection) => {
                                if (error) throw error;

                                ////console.log(result_order);
                                res.status(200).json({
                                  massage: "sccess sigin",
                                  type: 1,
                                  salesperson: result_salesperson,
                                  order: result_order


                                });

                              });




                            });


                          });

                        });
                      });
                    });

                  }
                  else {
                    res.status(202).json({
                      massage: "wrong password"
                    });

                  }

                });

              }
            } else {
              res.status(202).json({
                massage: "The account has been suspended"
              })
            }
          }


          else if (result_retailer[0]) {
            // //console.log(result_retailer[0]);
            if (result_retailer[0].Account_status == 0) {
              if (result_retailer[0].Email) {
                bcrypt.compare(req.body.password, result_retailer[0].password).then(result1 => {
                  if (result1) {
                    con.getConnection((error, connection) => {
                      if (error) throw error;
                      connection.query("SELECT * FROM retailer_phone WHERE  id_retailer  = '" + result_retailer[0].Id + "'", function (error, result_phone, fields) {
                        if (error) throw error;
                        // //console.log(result_retailer[0].id);

                        ////console.log(result_retailer);
                        let result_retailer1 = result_retailer;
                        con.getConnection((error, connection) => {
                          if (error) throw error;
                          connection.query("SELECT order_info.*,category.*,salesperson.name as name_salesperson,salesperson.identity_card,salesperson.Email as email_salesperson,(order_info.price *Required_quantity)as costall FROM orders,order_info,product,category,salesperson WHERE id_retailer = '" + result_retailer1[0].Id + "' and Order_number=orders.o_number and orders.ser_pro=Serial_number  and category.id =id_Category and orders.Id_card=identity_card", function (error, result_order, fields) {
                            if (error) throw error;
                            let tt = [];
                            ////console.log(result_order);
                            let result_order1 = result_order;
                            // //console.log(result_order1);
                            /////console.log(result_order1[i].lengt);
                            for (var i = 0; i < result_order1.length; i++) {
                              let g = result_order1[i].identity_card;

                              let o = g;
                              // //console.log("result_order1[0].identity_card" + o);
                              connection.query("SELECT id_card,Phone_Number FROM salesperson_phone WHERE 	id_card ='" + o + "'", function (error, result_sal_phone) {
                                if (error) throw error;
                                // //console.log("result_sal_phone" + result_sal_phone);
                                tt.push(result_sal_phone);


                                for (let index = 0; index < result_order1.length; index++) {
                                  let obj = [];
                                  var flage = 0;
                                  for (let j = 0; j < result_sal_phone.length; j++) {

                                    if (result_order1[index].identity_card == result_sal_phone[j].id_card) {
                                      obj.push(result_sal_phone[j].Phone_Number)
                                      flage = 1;
                                      ////console.log(result_sal_phone[j].Phone_Number);
                                      // result_sal[index]['phone'] = result_sal_phone;
                                    }

                                  }
                                  if (flage == 1) result_order1[index]['phone'] = obj;
                                }


                                // //console.log(result_sal_phone);
                              });


                            }




                            con.getConnection((error, connection) => {
                              if (error) throw error;

                             
                            //console.log(result_order);
                              for (let index = 0; index < result_retailer.length; index++) {
                                let obj = [];
                                for (let j = 0; j < result_phone.length; j++) {

                                  if (result_retailer[index].identity_card == result_phone[j].id_card) {
                                    obj.push(result_phone[j].Phone_Number)
                                    ////console.log(result_phone[j].Phone_Number);
                                    //result_sal[index]['phone'] = result_sal_phone;
                                  }

                                }
                                result_retailer[index]['phone'] = obj;
                              }
                              ////////////////////////////////////


                              var { PythonShell } = require('python-shell');
                              var pyshell = new PythonShell('./routes/test.py');

                              pyshell.send(JSON.stringify([result_retailer[0].Id]));
                              let dd;
                              pyshell.on('message', function (message) {
                                // received a message sent from the Python script (a simple "print" statement)
                                ////console.log(message);
                                //dd=message;
                                var obj = JSON.parse(message);

                                // //console.log(obj);

                                res.status(200).json({
                                  massage: "sccess sigin",
                                  type: 2,
                                  retailer: result_retailer,
                                  order: result_order1,
                                  products: obj

                                });




                              });

                              // end the input stream and allow the process to exit
                              pyshell.end(function (err) {
                                if (err) {
                                  throw err;
                                };

                                //console.log('finished');
                              });



                              //////////////////////////////////////

                            });


                          });////
                        });
                      });
                    });

                  }
                  else {
                    res.status(202).json({
                      massage: "wrong password"
                    });

                  }

                });

              }
            } else {
              res.status(202).json({
                massage: "The account has been suspended"
              })
            }


          }
          else {
            res.status(404).json({
              massage: "Account not found"
            });
          }




        });

      });
    });
  });
});

router.post('/signup_retailer', function (req, res, next) {

  con.getConnection((error, connection) => {
    if (error) throw error;
    connection.query("SELECT Email FROM retailer WHERE  Email ='" + req.body.Email + "'", function (error, result_test, fields) {

      if (result_test.length > 0) {
        //console.log('This email is already used');
        res.status(202).json({
          massage: 'This email is already used'
        });
      }

      else {

        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(404).json({
              massage: err
            });

          } else {


            con1.connect(function (err) {

              var sql = "INSERT INTO retailer(name_retailer ,Store_name,password,Email,city_name,image )VALUES ?";


              //Make an array of values:
              var values = [
                [
                  req.body.name,
                  req.body.Store_name,
                  hash,
                  req.body.Email,
                  req.body.city_name,
                  req.body.image
                ]
              ];


              con1.query(sql, [values], function (err, result) {
                if (err) throw err;
                sql2 = "INSERT INTO retailer_phone(id_retailer,Phone_Number)VALUES ?";


                values2 = [
                  [
                    result.insertId,
                    req.body.Phone_Number

                  ]
                ];

                con1.query(sql2, [values2], function (err, result) {
                  if (err) {
                    //console.log(err);
                    throw err;

                  }
                  else {

                    res.status(200).json({
                      massage: "signup ok"
                    });
                  }


                });


              });

            });

          }
        }
        );


      }
    }
    );

  });

});


module.exports = router;
