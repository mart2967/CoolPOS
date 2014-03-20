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

exports.getRegisterItems = function(req,res) {
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
            res.send(data);
        });
    client.end();


}

exports.deleteSelectedFromRegister = function(selected, callback){
    console.log(selected);
    var client = new Client();
    client.connect( cred );
    client.query('USE Adrian_John_Max_POS');
    for(var i = 0; i < selected.length; i++){
        client.query('DELETE FROM Register WHERE id=' + selected[i]);
    }
    client.on('end', callback());

    return;
}

exports.deleteAllFromRegister = function(callback){
    var client = new Client();
    client.connect( cred );
    client.query('USE Adrian_John_Max_POS');
    client.query('TRUNCATE TABLE Register');
    client.end();
    callback();
    return;
}

exports.saveItemToRegister = function(data, callback){
    console.log(data);
    //var data = req.body;
    var client = new Client();
    var values = getValues(data);
    client.connect( cred );
    //console.log(cred);
    client.query('USE Adrian_John_Max_POS');
    client.query('INSERT INTO Register (itemID, label, price, amount, tid, time_stamp, user) VALUES (' + values + ')');
    console.log("Inserted: " + values);
//    client.query('SELECT * FROM Register').on('result', function(result){
//        result.on('row', function(row){
//           console.log(row);
//        });
//    });
    callback();
    return;
}

var getCurrentDateTime = function(){
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth()
    var day = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

var getValues = function(data) {
    var itemID = data.id;
    var label = data.item;
    var price = data.price_per_unit;
    var amount = 1;
    var tid = 1;
    var time = getCurrentDateTime();
    var user = data.user;
    return itemID + ", '" + label + "', " + price + ", " + amount + ", " + tid + ", '" + time + "', '" + user + "'";
}