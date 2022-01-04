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

router.post('/addorder', function (req, res, next) {
    var flag = 0;
    var i = 0;
    var jasoN = req.body.orders;
    console.log(jasoN);



    for (i; i < jasoN.length; i++) {
        let city = jasoN[i].city;
        let id = jasoN[i].id;
        let jasoNco = jasoN[i];
      
        con1.getConnection((error, connection) => {
            if (error) throw error;
            connection.query("SELECT * FROM `distribution_areas` WHERE Governorate ='" + city + "'", function (error, result_areas, fields) {
                if (error) throw error;
                ////.log(result_areas);


                connection.query("SELECT salesperson.identity_card FROM salesperson,has_disribution WHERE id_company ='" + id + "' and Account_status = 0  and identity_card=id_card and id_dist='" + result_areas[0].id + "'", function (error, result_card, fields) {
                    if (error) throw error;
                    console.log(result_card);

                    if (result_card.length) {
                        ////.log(result_card);
                        let min = result_card[0].identity_card;
                        let count2 = 0;
                        //.log(jasoNco.id_retailer);
                        
                        connection.query("SELECT * FROM orders,order_info  WHERE id_retailer ='"+jasoNco.id_retailer +"' and Id_card ='"+min+"' and o_number=order_info.Order_number and order_info.ready_status='0' and order_info.Delivery_status='0'", function (error, result_find_s, fields) {
                            if (error) throw error;
                            console.log(result_find_s);
                    if(result_find_s.length==0){


                       let u = 0;
                        for (u ; u < result_card.length; u++) {
                            let identi;
                            identi = result_card[u].identity_card;
                            let f=u;

                                connection.query("SELECT COUNT(o_number) as count  FROM orders,order_info WHERE Id_card ='" +result_card[u].identity_card  + "' and o_number=Order_number  and Delivery_status=0", function (error, result_countw, fields) {
                                    if (error) throw error;
                                    ////.log(result_countw[0].count);
                                   // //.log(identi);
                                    if (f == 0) {
                                        count2 = result_countw[0].count;
                                        min = identi;
                                     //  //.log(min);
                                    }
                                   // //.log(result_countw);
                                   // //.log(count2);
                                    if (count2 > result_countw[0].count) {
                                        count2 = result_countw[0].count;
                                        min = identi;
                                        //.log(min);
                                        //.log(count2);
                                     // //.log(result_countw);
                                    }

                                    // //.log("lll " + min);

                                });
                        
                        }
                    }else{
                    min=result_find_s[0].Id_card;
                    count2=0;
                    }
                    });
                        //.log("////////////////");
                        //.log(count2);
                        //.log(min);

                        con1.getConnection((error, connection) => {
                            if (error) throw error;
                           // //.log(min);

                            connection.query("SELECT Name,id_Category FROM product WHERE Serial_number ='" + jasoNco.ser_pro + "'", function (error, result_proname, fields) {
                                if (error) throw error;
                                //    //.log(result_proname);





                                let sql = "INSERT INTO order_info(Required_quantity,price,Production_date,nameProduct,category_id)VALUES ?";
                                let q1 = jasoNco.requiredQuantity;
                                let q3 = jasoNco.price;
                                let q4 = jasoNco.Production_date;
                                let q66 = result_proname[0].id_Category;
                                let q5 = result_proname[0].Name;
                                let d = min;
                                let dd = jasoNco.ser_pro;
                                let ddd = jasoNco.id_retailer;
                                ////.log(d);
                                let values = [
                                    [
                                        q1,
                                        q3,
                                        q4,
                                        q5,
                                        q66
                                    ]
                                ];
                                let h = d;
                                con.query(sql, [values], function (err, result) {
                                    if (err) throw err;
                                    ////.log("1 record inserted");
                                    var sql1 = "INSERT INTO orders(Id_card,ser_pro,id_retailer,o_number)VALUES ?";
                                    ////.log("h" + h);
                                    var values1 = [
                                        [
                                            d,
                                            dd,
                                            ddd,
                                            result.insertId

                                        ]
                                    ];
                                    // //.log(values1);
                                    con.query(sql1, [values1], function (err, result) {
                                        if (err) throw err;
                                        //  //.log("1 record inserted");
                                    });
                                });
                            });
                        });//
                    } else {
                        //.log("GG");
                    }

                });

            });
      });
    }


    if (i == jasoN.length) {
        res.status(200).json({
            massage: "done ..."
        });
    }




});


router.delete('/:Order_number', function (req, res, next) {
    con1.getConnection((error, connection) => {
        connection.query("SELECT * FROM order_info  WHERE order_info.Order_number  = '" + req.params.Order_number + "' ", function (error, result_order) {
            if (error) throw error;
            //.log(result_order);

            if (result_order.length == 0) {
                res.status(404).json({
                    massage: error
                });
            }
            else if (result_order[0].ready_status == 0) {

                con1.getConnection((error, connection) => {
                    if (error) throw error;
                    connection.query("DELETE FROM order_info WHERE Order_number = '" + req.params.Order_number + "'", function (error, result, fields) {
                        if (error) {
                            res.status(404).json({
                                massage: "error"
                            });
                            //throw error
                        };
                        if (result) {

                            con1.getConnection((error, connection) => {
                                if (error) throw error;
                                connection.query("DELETE FROM orders WHERE o_number = '" + req.params.Order_number + "'", function (error, result1, fields) {
                                    if (error) {
                                        res.status(404).json({
                                            massage: "error"
                                        });
                                        throw error
                                    };
                                    //.log("Number of records deleted: " + result1.affectedRows);
                                    if (result1) {
                                        res.status(200).json({
                                            massage: "done ..."
                                        });
                                    } else {
                                        res.status(404).json({
                                            massage: "error"
                                        });
                                    }


                                });
                            });
                        } else {
                            res.status(404).json({
                                massage: "error"
                            });
                        }

                    });
                });
            }
            else {
                res.status(404).json({
                    massage: "No deletion is possible because the order has been loaded by the salesperson"
                });

            }
        });
    });

});
module.exports = router;