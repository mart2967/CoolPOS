var inspect = require('util').inspect;
var Client = require('mariasql');
var cred = require('../credentials').credentials; // a hash of login info for the database
var client = new Client();
client.connect( cred );
client.query('USE Adrian_John_Max_POS');

exports.index = function(req, res){
    res.render('index');
};

exports.postTransaction = function(type, callback) {
    var transactionItems = new Object();
    client.query('SELECT * FROM Register').on('result', function(result){
        result.on('row', function(row){
            console.log(row.itemID);
            if(transactionItems[row.itemID] === undefined){
                transactionItems[row.itemID] = new Object();
                transactionItems[row.itemID].quantity = 1;
                transactionItems[row.itemID].unit_price = row.price;
            } else {
                transactionItems[row.itemID].quantity += 1;
            }

        });
    }).on('end', function(){
            //calculate the total price from the type and quantity
            //transactionItems[row.itemID].total_price = calculateTotal(row.itemID, transactionItems[row.itemID].quantity);
            //here's a placeholder, FIX WHEN DEALS
            for(var itemType in transactionItems){
                transactionItems[itemType].total_price = transactionItems[itemType].unit_price * transactionItems[itemType].quantity;
            }
            console.log(transactionItems);
        });
    //client.query('INSERT INTO Transaction (till_id, employee_id, customer_id, end_time, type) VALUES ')
}

calculateTotal = function(itemID, quantity){

}

exports.getUserList = function(callback){
    var users = new Array();
    client.query('SELECT name FROM Employee').on('result', function(result) {
        result.on('row', function(row){
            users.push(row.name);
        });
    }).on('end', function() {
            callback(users);
        });
}

exports.getAllItems = function(req, res){

    var data = new Array();
    client.query('SELECT * from Inventory').on('result', function(result) {
        result.on('row', function(row){
            data.push(row);
        });
    }).on('end', function() {
            res.send(data);
        });
};

exports.getRegisterItems = function(req,res) {
    var data = new Array();
    client.query('SELECT * from Register').on('result', function(result) {
        result.on('row', function(row){
            data.push(row);
        });
    }).on('end', function() {
            res.send(data);
        });
}

exports.deleteSelectedFromRegister = function(selected, callback){
    client.query('DELETE FROM Register WHERE id IN ' + formatIDList(selected)).on('end', function(){
        callback();
    });

    return;
}

formatIDList = function(data){
    var out = '(';
    for(var i = 0; i < data.length; i++){
        out += data[i];
        if(i != data.length - 1){
            out += ', ';
        }
    }
    out += ')';
    return out;
}

exports.deleteAllFromRegister = function(callback){
    client.query('TRUNCATE TABLE Register').on('end', function(){
        callback();
    });
    return;
}

exports.saveItemToRegister = function(data, callback){
    console.log(data);
    var values = getValues(data);
    client.query('INSERT INTO Register (itemID, label, price, amount, tid, time_stamp, user) VALUES (' + values + ')').on('end', function(){
        console.log("Inserted: " + values);
        callback();
    });
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