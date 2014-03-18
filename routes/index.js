var inspect = require('util').inspect;
var Client = require('mariasql');
var cred = require('../credentials').credentials; // a hash of login info for the database

exports.index = function(req, res){
    res.render('index');
};

exports.getAllItems = function(req, res){

    var client = new Client();
    client.connect( cred );
    //console.log(cred);
    client.query('USE Adrian_John_Max_POS');
    var data = new Array();
    client.query('SELECT * from Inventory').on('result',
        function(result) {
            result.on('row', function(row){
                //console.log(row);
                data.push(row);
            });
        }
    ).on('end',
        function() {
            //console.log(data);
            res.send(data);
        });
    client.end();
};

exports.getRegisterItems = function() {
    var client = new Client();
    client.connect( cred );
    client.query('USE Adrian_John_Max_POS');
    var data = new Array();
    client.query('SELECT * from Register').on('result',
        function(result) {
            result.on('row', function(row){
                data.push(row);
            });
        }
    ).on('end',
        function() {
            //console.log(data);
            return data;
        });
    client.end();


}

exports.saveItemToRegister = function(req,res){
    console.log(req.body);
    var data = req.body;
    var client = new Client();
    var values = getValues(data);
    client.connect( cred );
    //console.log(cred);
    client.query('USE Adrian_John_Max_POS');
    client.query('INSERT INTO Register (itemID, label, price, amount, tid) VALUES (' + values + ')');
    console.log("Inserted: " + values);
    res.send(200);
}

var getValues = function(data) {
    itemID = data.id;
    label = data.item;
    price = data.price_per_unit;
    amount = 1;
    tid = 1;

    return itemID + ", '" + label + "', " + price + ", " + amount + ", " + tid;
}