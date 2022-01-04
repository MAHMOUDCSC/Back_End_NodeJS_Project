var express = require('express');
var router = express.Router();
var mysql = require('mysql');
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

router.get('/:id/company', function (req, res, next) {
    con1.getConnection((error, connection) => {
        if (error) throw error;
        connection.query("SELECT * FROM company WHERE id  = '" + req.params.id + "'", function (error, result, fields) {
            if (error) throw error;

            if (result[0]) {
                con1.getConnection((error, connection) => {
                    connection.query("SELECT * FROM company_address WHERE  id_company  = '" + result[0].id + "'", function (error, result_add) {
                        if (error) throw error;
                        con1.getConnection((error, connection) => {
                            ////console.log(result[0]);
                            connection.query("SELECT * FROM company_phone WHERE  id_company  = '" + result[0].id + "'", function (error, result_ph) {
                                if (error) throw error;

                                res.status(200).json({
                                    massage: "access",
                                    company: result,
                                    address: result_add,
                                    phone: result_ph
                                });

                            });
                        });

                    });
                });
            }
        });
    });



});

router.patch('/:id/company', function (req, res, next) {



    // req.body.company,
    // req.body.address


    ////console.log(values);

    con1.getConnection((error, connection) => {
        if (error) throw error;
        connection.query("DELETE FROM company_phone WHERE id_company = '" + req.body.company[0].id + "'", function (error, result, fields) {
            if (error) {
                res.status(404).json({
                    massage: "error"
                });
                // throw error
            };
        });
    });
    con1.getConnection((error, connection) => {
        if (error) throw error;
        connection.query("DELETE FROM company_address WHERE id_company = '" + req.body.company[0].id + "'", function (error, result, fields) {
            if (error) {
                res.status(404).json({
                    massage: "error"
                });
                // throw error
            };
        });
    });
    con1.getConnection((error, connection) => {
        if (error) {

            if (error) res.status(404).json({
                massage: "error for connection"
            });

        }
        connection.query("UPDATE company SET  Name = '" + req.body.company[0].Name + "',image='" + req.body.company[0].image + "' WHERE id = '" + req.params.id + "'", function (error, result, fields) {
            if (error) {
                res.status(404).json({
                    massage: "can not UPDATE company information "
                });

            }
            con1.getConnection((error, connection) => {
                if (error) {

                    res.status(404).json({
                        massage: "error for connection"
                    });

                }



                for (var i = 0; i < req.body.phone.length; i++) {

                    var sql2 = "INSERT INTO company_phone(id_company,Phone_Number)VALUES ?";


                    values2 = [
                        [
                            req.params.id,
                            req.body.phone[i].Phone_Number

                        ]
                    ];

                    con.query(sql2, [values2], function (err, result) {
                        if (err) {
                            //console.log(err);
                            throw err;

                        }


                    });
                }


                for (var i = 0; i < req.body.address.length; i++) {
                    var sql3 = "INSERT INTO company_address(id_company ,city_name,Region,Street_name)VALUES ?";


                    values3 = [
                        [
                            req.body.company[0].id,
                            req.body.address[i].city_name,
                            req.body.address[i].Region,
                            req.body.address[i].Street_name
                        ]
                    ];

                    con.query(sql3, [values3], function (err, result) {
                        if (err) {
                            ////console.log(err);
                            throw err;

                        }


                    });
                }

                //console.log(result.affectedRows + " record(s) updated");
                res.status(200).json({
                    massage: " UPDATE accessfull"
                });
            });
        });
    });

});
router.patch('/retailer', function (req, res, next) {

    con1.getConnection((error, connection) => {
        if (error) {

            if (error) res.status(404).json({
                massage: "error for connection"
            });

        }
        connection.query("UPDATE retailer SET  name_retailer = '" + req.body.retailer[0].name_retailer + "',Store_name ='" + req.body.retailer[0].Store_name + "',city_name ='" + req.body.retailer[0].city_name + "',Region ='" + req.body.retailer[0].Region + "',Street_name ='" + req.body.retailer[0].Street_name + "',image='" + req.body.retailer[0].image + "',ID_photo='" + req.body.retailer[0].ID_photo + "' WHERE Id = '" + req.body.retailer[0].id + "'", function (error, result, fields) {
            if (error) {

                res.status(404).json({
                    massage: "can not UPDATE company information "
                });
            }
            con1.getConnection((error, connection) => {
                if (error) throw error;
                connection.query("DELETE FROM retailer_phone WHERE id_retailer = '" + req.body.retailer[0].id + "'", function (error, result, fields) {
                    if (error) {
                        res.status(404).json({
                            massage: "error"
                        });
                        // throw error
                    };
                });
            });



            con1.getConnection((error, connection) => {
                if (error) {

                    res.status(404).json({
                        massage: "error for connection"
                    });

                }


                for (var i = 0; i < req.body.phone.length; i++) {

                    var sql2 = "INSERT INTO retailer_phone(id_retailer ,Phone_Number )VALUES ?";


                    values2 = [
                        [
                            req.body.retailer[0].id,
                            req.body.phone[i].Phone_Number

                        ]
                    ];

                    con.query(sql2, [values2], function (err, result) {
                        if (err) {
                            //console.log(err);
                            throw err;

                        }


                    });
                }
            });
            //console.log(result.affectedRows + " record(s) updated");
            res.status(200).json({
                massage: " UPDATE accessfull"
            });

        });
    });


});

router.get('/:id/retailer', function (req, res, next) {
    con1.getConnection((error, connection) => {
        if (error) throw error;
        connection.query("SELECT * FROM retailer WHERE Id  = '" + req.params.id + "'", function (error, result, fields) {
            if (error) throw error;

            if (result[0]) {

                con1.getConnection((error, connection) => {
                    ////console.log(result[0]);
                    connection.query("SELECT * FROM retailer_phone WHERE   	id_retailer   = '" + req.params.id + "'", function (error, result_ph) {
                        if (error) throw error;

                        res.status(200).json({
                            massage: "access",
                            company: result,

                            phone: result_ph
                        });

                    });
                });


            }
        });
    });



});
router.patch('/salesperson', function (req, res, next) {
    con1.getConnection((error, connection) => {
        if (error) throw error;
        connection.query("DELETE  FROM salesperson_phone WHERE id_card = '" + req.body.salesperson[0].identity_card + "'", function (error, result, fields) {
            if (error) {
                /*res.status(404).json({
                    massage: "error"
                });*/
                throw error
            };
        });
    });
    con1.getConnection((error, connection) => {
        if (error) throw error;
        connection.query("DELETE FROM has_disribution WHERE id_card = '" + req.body.salesperson[0].identity_card + "'", function (error, result, fields) {
            if (error) {
                res.status(404).json({
                    massage: "error"
                });
                // throw error
            };
        });
    });
    con1.getConnection((error, connection) => {
        if (error) {

            if (error) res.status(404).json({
                massage: "error for connection"
            });

        }

        connection.query("UPDATE salesperson SET   	name = '" + req.body.salesperson[0].name + "', 	Email ='" + req.body.salesperson[0].Email + "',ID_photo='" + req.body.salesperson[0].image + "',Account_status ='" + req.body.salesperson[0].Account_status + "' WHERE identity_card = '" + req.body.salesperson[0].identity_card + "'", function (error, result, fields) {
            if (error) {

                res.status(404).json({
                    massage: "can not UPDATE company information "
                });
            }

            if (error) {

                res.status(404).json({
                    massage: "error for connection"
                });

            }





            for (var i = 0; i < req.body.phone.length; i++) {
                var sql2 = "INSERT INTO salesperson_phone(id_card,Phone_Number)VALUES ?";


                var values2 = [
                    [
                        req.body.salesperson[0].identity_card,
                        req.body.phone[i].Phone_Number
                    ]
                ];

                con.query(sql2, [values2], function (err, result) {
                    if (err) {
                        ////console.log(err);
                        throw err;

                    }


                });
            }

            for (var i = 0; i < req.body.area.length; i++) {
                var sql3 = "INSERT INTO has_disribution(id_dist,id_card)VALUES ?";


                var values3 = [
                    [
                        req.body.area[i].id,
                        req.body.salesperson[0].identity_card

                    ]
                ];

                con.query(sql3, [values3], function (err, result) {
                    if (err) {
                        //console.log(err);
                        throw err;

                    }


                });
            }





            //console.log(result.affectedRows + " record(s) updated");
            res.status(200).json({
                massage: " UPDATE accessfull"
            });

        });
    });


});



module.exports = router;