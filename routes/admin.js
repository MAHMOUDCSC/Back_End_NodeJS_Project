var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const bcrypt = require("bcrypt");


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

router.post('/signin', function (req, res, next) {

  con1.getConnection((error, connection) => {
    if (error) throw error;
    connection.query("SELECT * FROM admin WHERE  Email  = '" + req.body.Email + "'", function (error, result, fields) {
      if (error) throw error;




      if (result.length && result[0].Email) {
        bcrypt.compare(req.body.password, result[0].password).then(result1 => {


          if (result1) {

            connection.query("SELECT * FROM company  ", function (error, result_company, fields) {
              if (error) throw error;
              connection.query("SELECT COUNT(id) as count FROM company ", function (error, result_count, fields) {
                if (error) throw error;
                connection.query("SELECT COUNT(Serial_number) as count FROM product ", function (error, result_count2, fields) {
                  if (error) throw error;
                  connection.query("SELECT COUNT(id) as count FROM retailer ", function (error, result_count1, fields) {
                    if (error) throw error;
                    connection.query("SELECT * FROM retailer ", function (error, result_retailer, fields) {

                      con1.getConnection((error, connection) => {
                        if (error) throw error;
                        var i = 0;
                        let flage = 0;

                        for (i; i < result_retailer.length; i++) {
                          let o = result_retailer[i].Id;

                          if (flage == 0) {

                            for (let oo = 0; oo < result_company.length; oo++) {
                              let o = result_company[oo].id;


                              let ii = i;
                              connection.query("SELECT COUNT(id) as count_salesperson FROM company,salesperson WHERE 		id  ='" + o + "' and id_company=id", function (error, result_count_sels, fields) {
                                if (error) throw error;
                                //result_order2 = result_order;
                                //// console.log("result_sal_phone" + result_sal_phone);
                               // console.log(result_count_sels);


                                result_company[oo]["count_salesperson"] = result_count_sels[0].count_salesperson;



                              });
                            }


                            for (let oo = 0; oo < result_company.length; oo++) {
                              let o = result_company[oo].id;


                              let ii = i;
                              connection.query("SELECT COUNT(id) as count_product FROM company,product WHERE 		id  ='" + o + "'and id_company=id", function (error, result_count_pro, fields) {
                                if (error) throw error;
                                //result_order2 = result_order;
                                //// console.log("result_sal_phone" + result_sal_phone);
                               // console.log(result_count_pro);
                                result_company[oo]["count_product"] = result_count_pro[0].count_product;




                              });
                            }





                            for (let oo = 0; oo < result_company.length; oo++) {
                              let o = result_company[oo].id;


                              let ii = i;
                              connection.query("SELECT * FROM company_address WHERE 		id_company  ='" + o + "'", function (error, result_comaddress, fields) {
                                if (error) throw error;
                                //result_order2 = result_order;
                                //// console.log("result_sal_phone" + result_sal_phone);







                                var opp = []

                                for (let j = 0; j < result_comaddress.length; j++) {
                                  var obj = {}
                                  if (o == result_comaddress[j].id_company) {
                                    obj.city_name = result_comaddress[j].city_name;
                                    obj.Region = result_comaddress[j].Region;
                                    obj.Street_name = result_comaddress[j].Street_name;
                                    opp.push(obj);

                                    ////console.log(result_sal_phone[j].Phone_Number);
                                    // result_sal[index]['phone'] = result_sal_phone;
                                  }

                                }
                               // console.log(opp);

                                for (var y = 0; y < opp.length; y++)
                                  result_company[oo]["address" + (y + 1)] = opp[y];




                              });


                            }

                            ////////////////////////

                            for (let oo = 0; oo < result_company.length; oo++) {
                              let o = result_company[oo].id;



                              connection.query("SELECT * FROM company_phone WHERE 		id_company  ='" + o + "'", function (error, result_comphone, fields) {
                                if (error) throw error;
                                //result_order2 = result_order;
                                //// console.log("result_sal_phone" + result_sal_phone);





                                var obj = [];

                                for (let j = 0; j < result_comphone.length; j++) {

                                  if (o == result_comphone[j].id_company) {
                                    obj.push(result_comphone[j].Phone_Number)


                                    ////console.log(result_sal_phone[j].Phone_Number);
                                    // result_sal[index]['phone'] = result_sal_phone;
                                  }

                                }
                               // console.log(obj);
                                result_company[oo]["phone"] = obj;






                              });







                            }

                            flage = 1;
                          }


                          //// console.log("result_order[0].identity_card" + o);

                          let ii = i;
                          connection.query("SELECT * FROM retailer_phone WHERE 	id_retailer ='" + o + "'", function (error, result_sal_phone, fields) {
                            if (error) throw error;
                            //result_order2 = result_order;
                            //// console.log("result_sal_phone" + result_sal_phone);





                            var obj = [];

                            for (let j = 0; j < result_sal_phone.length; j++) {

                              if (o == result_sal_phone[j].id_retailer) {
                                obj.push(result_sal_phone[j].Phone_Number)


                                ////console.log(result_sal_phone[j].Phone_Number);
                                // result_sal[index]['phone'] = result_sal_phone;
                              }

                            }
                           // console.log(obj);
                            result_retailer[ii]["phone"] = obj;


                            const p = ii + 1;
                            if (p == result_retailer.length) {

                              res.status(200).json({
                                massage: "sccess sigin",
                                company: result_company,
                                count_company: result_count[0].count,
                                count_retailer: result_count1[0].count,
                                count_product: result_count2[0].count,
                                retailer: result_retailer

                              });
                            }


                          });



                          ////console.log(i);
                        }


                        /////

                      });
                    });
                  });
                });
              });
            });
          } else {
            res.status(202).json({
              massage: "wrong password"
            });

          }
        });

      } else {
        res.status(202).json({
          massage: "Email not found",
        });
      }
    });
  });


});


router.post('/signup', function (req, res, next) {

  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      res.status(404).json({
        massage: err
      });

    } else {

      con.connect(function (err) {

        var sql = "INSERT INTO admin(Email,password)VALUES ?";


        //Make an array of values:
        var values = [
          [
            req.body.Email,
            hash
          ]
        ];


        con.query(sql, [values], function (err, result) {
          if (err) throw err;
          else {

            res.status(200).json({
              massage: "done"
            });
          }


        });

      });

    }
  }
  );







});




router.post('/signup_company', function (req, res, next) {

  con1.getConnection((error, connection) => {
    if (error) throw error;
    connection.query("SELECT Email FROM company WHERE  Email  = '" + req.body.Email + "'", function (error, result_company, fields) {
      if (error) throw error;
      connection.query("SELECT Email FROM salesperson WHERE  Email  = '" + req.body.Email + "'", function (error, result_sal, fields) {
        if (error) throw error;
        connection.query("SELECT Email FROM retailer WHERE  Email  = '" + req.body.Email + "'", function (error, result_ret, fields) {
          if (error) throw error;


         // console.log(result_company);
         // console.log(result_sal);
         // console.log(result_ret);
          if (result_company.length || result_sal.length || result_ret.length) {
           // console.log('This email is already used');
            res.status(202).json({
              massage: 'This email is already used'
            });
          }

          else {
            ////console.log('the Email is not used');

            bcrypt.hash(req.body.password, 10, (err, hash) => {
              if (err) {
                res.status(404).json({
                  massage: err
                });

              } else {


                con.connect(function (err) {

                  var sql = "INSERT INTO company(Name,password,Email,image)VALUES ?";




                  var values = [
                    [
                      req.body.name,
                      hash,
                      req.body.Email,
                      req.body.image
                    ]
                  ];



                  con.query(sql, [values], function (err, result) {
                    if (err) throw err;
                    var sql2 = "INSERT INTO company_phone(id_company ,Phone_Number)VALUES ?";
                    ////console.log(result.insertId);

                    var values2 = [
                      [
                        result.insertId,
                        req.body.Phone_Number
                      ]
                    ]


                    con.query(sql2, [values2], function (err, result1) {
                      if (err) throw err;

                    });

                    var sql2 = "INSERT INTO company_address(id_company ,city_name,Region,Street_name)VALUES ?";


                    var values3 = [
                      [
                        result.insertId,
                        req.body.city,
                        req.body.Region,
                        req.body.Street
                      ]
                    ]

                    con.query(sql2, [values3], function (err, result1) {
                      if (err) throw err;
                      res.status(200).json({
                        massage: "signup ok"
                      });
                    });


                    /////////////////////////////////////////////////////////////////////////address


                    //// console.log(req.body),


                  });
                  //// console.log(result);



                });

              }
            }
            );

          }
        });
      });

    });
  });


});////



/////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////// retailer
router.post('/signup_retailer', function (req, res, next) {



  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      res.status(404).json({
        massage: err
      });

    } else {


      con.connect(function (err) {

        var sql = "INSERT INTO retailer(name_retailer ,Store_name,password,ID_photo,city_name,Region,Street_name)VALUES ?";


        //Make an array of values:
        var values = [
          [
            req.body.name,
            req.body.Store_name,
            hash,
            req.body.ID_photo,
            req.body.city_name,
            req.body.Region,
            req.body.Street_name
          ]
        ];


        con.query(sql, [values], function (err, result) {
          if (err) throw err;
          sql2 = "INSERT INTO retailer_phone(id_retailer,Phone_Number)VALUES ?";


          values2 = [
            [
              result.insertId,
              req.body.Phone_Number

            ]
          ];

          con.query(sql2, [values2], function (err, result) {
            if (err) {
             // console.log(err);
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





});





router.post('/signup_salesperson', function (req, res, next) {



  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      res.status(404).json({
        massage: err
      });

    } else {


      con.connect(function (err) {

        var sql = "INSERT INTO salesperson(name,identity_card,password,Email,Account_status,Distribution_areas,ID_photo,Phone_Number1,Phone_Number2,id_company )VALUES ?";


        //Make an array of values:
        var values = [
          [
            req.body.name,
            req.body.identity_card,
            hash,
            req.body.Email,
            1,
            req.body.Distribution_areas,
            req.body.ID_photo,
            null,
            req.body.Phone_Number2,
            req.body.id_company
          ]
        ];



        con.query(sql, [values], function (err, result) {
          if (err) throw err;

        });

      });
      con.end();
    }
  }
  );




  ////console.log(req.body)
  res.status(200).json({
    massage: "signup ok"
  });
});

module.exports = router;