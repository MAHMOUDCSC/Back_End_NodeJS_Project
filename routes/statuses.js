var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dateFormat = require('dateformat');
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

router.post('/ready', function (req, res, next) {

    con1.getConnection((error, connection) => {
        if (error) {

            if (error) res.status(404).json({
                massage: "error for connection"
            });

        }
        connection.query("UPDATE order_info SET  ready_status = '" + req.body.ready_status + "' WHERE  	Order_number = '" + req.body.Order_number + "'", function (error, result, fields) {
            if (error) {
                res.status(404).json({
                    massage: "error  database"
                });

            }
            if (result) {
                res.status(200).json({
                    massage: "done "
                });
            }
        });
    });


});

router.post('/Payment', function (req, res, next) {

    con1.getConnection((error, connection) => {
        if (error) {

            if (error) res.status(404).json({
                massage: "error for connection"
            });

        }
        connection.query("UPDATE order_info SET	Payment_status = '" + req.body.Payment_status + "' WHERE  	Order_number = '" + req.body.Order_number + "'", function (error, result, fields) {
            if (error) {
                res.status(404).json({
                    massage: "error  database"
                });

            }
            if (result) {
                res.status(200).json({
                    massage: "done "
                });
            }
        });
    });

});

router.post('/Delivery', function (req, res, next) {


    con1.getConnection((error, connection) => {
        if (error) {

            if (error) res.status(404).json({
                massage: "error for connection"
            });

        }
        let date_ob = new Date();
        date_ob = dateFormat(date_ob, "yyyy-mm-dd");
        //console.log(date_ob);

        connection.query("UPDATE order_info SET	 	Delivery_status  = '" + req.body.Delivery_status + "',Delivery_date=' " + date_ob + "' WHERE  	Order_number = '" + req.body.Order_number + "'", function (error, result, fields) {
            if (error) {
                res.status(404).json({
                    massage: "error  database"
                });

            }
            if (result) {
                res.status(200).json({
                    massage: "done "
                });
            }
        });
    });

});

router.post('/', function (req, res, next) {


    con1.getConnection((error, connection) => {
        if (error) {

            if (error) res.status(404).json({
                massage: "error for connection"
            });

        }
        let date_ob = new Date();
        date_ob = dateFormat(date_ob, "yyyy-mm-dd");
        //console.log(date_ob);

        connection.query("UPDATE order_info SET	 	Delivery_status  = '" + req.body.Delivery_status + "',Delivery_date=' " + date_ob + "', ready_status = '" + req.body.ready_status + "',Payment_status = '" + req.body.Payment_status + "' WHERE  	Order_number = '" + req.body.Order_number + "'", function (error, result, fields) {
            if (error) {
                res.status(404).json({
                    massage: "error  database"
                });

            }
            if (result) {
                res.status(200).json({
                    massage: "done "
                });
            }
        });
    });

});


router.post('/Account_salespersons', function (req, res, next) {


    con1.getConnection((error, connection) => {
        if (error) {

            if (error) res.status(404).json({
                massage: "error for connection"
            });

        }
        let date_ob = new Date();
        date_ob = dateFormat(date_ob, "yyyy-mm-dd");
        //console.log(date_ob);

        connection.query("UPDATE salesperson SET	Account_status  = '" + req.body.Account_status + "' WHERE  	identity_card = '" + req.body.identity_card + "'", function (error, result, fields) {
            if (error) {
                res.status(404).json({
                    massage: "error  database"
                });

            }
            if (result) {
                res.status(200).json({
                    massage: "done "
                });
            }
        });
    });

});
module.exports = router;