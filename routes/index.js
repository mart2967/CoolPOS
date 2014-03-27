var inspect = require('util').inspect;
var Client = require('mariasql');
var cred = require('../credentials').credentials; // a hash of login info for the database
var client = new Client();
client.connect( cred );
client.query('USE Adrian_John_Max_POS');

exports.index = function(req, res){
    res.render('index');
};

exports.postTransaction = function(data, callback) {
    var transaction = new Object();
    transaction.type = data.type;
    transaction.employee_id = data.userID;
    transaction.till_id = 1;
    transaction.customer_id = 1;
    transaction.end_time = getCurrentDateTime();
    var transactionItems = new Object();
    client.query('SELECT * FROM Register').on('result', function(result){
        result.on('row', function(row){
            if (transaction.start_time === undefined){
                transaction.start_time = row.time_stamp;
            }
            if(transactionItems[row.itemID] === undefined){
                transactionItems[row.itemID] = new Object();
                transactionItems[row.itemID].quantity = 1;
                transactionItems[row.itemID].unit_price = row.price;
            } else {
                transactionItems[row.itemID].quantity += 1;
            }
        });
    }).on('end', function(){
            client.query(
                    'INSERT INTO Transaction (till_id, employee_id, customer_id, start_time, end_time, type) VALUES ('
                        + transaction.till_id + ', ' + transaction.employee_id + ', ' + transaction.customer_id + ', "' + transaction.start_time
                        + '", "' + transaction.end_time + '", "' + transaction.type + '")'
                ).on('end', function(){
                    console.log('Created transaction');
                    client.query('SELECT MAX(id) FROM Transaction').on('result', function(result){
                        result.on('row', function(row){
                            console.log(row);
                            transaction.id = row['MAX(id)'];
                        });
                    }).on('end', function(){
                            //calculate the total price from the type and quantity
                            //transactionItems[row.itemID].total_price = calculateTotal(row.itemID, transactionItems[row.itemID].quantity);
                            //here's a placeholder, FIX WHEN DEALS
                            for(var itemType in transactionItems){
                                console.log(itemType);
                                transactionItems[itemType].total_price = transactionItems[itemType].unit_price * transactionItems[itemType].quantity;
                                client.query('INSERT INTO Transaction_Inventory_Item (inventory_id, transaction_id, total_price, quantity) VALUES ('
                                    + itemType + ', ' + transaction.id + ', ' + transactionItems[itemType].total_price + ', '
                                    + transactionItems[itemType].quantity + ')').on('end', function(){
                                        console.log('Inserted T_I');
                                    });
                            }
                            //console.log(transactionItems);
                            console.log(transaction);
                            client.query('TRUNCATE TABLE Register').on('end', function(){
                                callback();
                            });
                        });


                });

        });
    //client.query('INSERT INTO Transaction (till_id, employee_id, customer_id, end_time, type) VALUES ')
}

calculateTotal = function(itemID, quantity){
    //change when deals work
    client.query('');

}

exports.getUserList = function(callback){
    var users = new Array();
    client.query('SELECT id, name FROM Employee').on('result', function(result) {
        result.on('row', function(row){
            users.push(row);
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