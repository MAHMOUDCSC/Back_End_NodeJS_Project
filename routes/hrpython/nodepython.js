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
