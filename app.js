
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.set('layout', 'layout');
app.enable('view cache');
app.engine('html', require('hogan-express'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

io.sockets.on('connection', function(socket){
    routes.getUserList(function(list){
        console.log(list);
        socket.emit('user_list', list);
    });
    socket.on('button_click', function(data){
        routes.saveItemToRegister(data, function(){
            socket.emit('update_client');
        });
    });
    socket.on('delete_all', function(){
        routes.deleteAllFromRegister(function(){
            socket.emit('update_client');
        })
    });
    socket.on('delete_selected', function(selected){
        routes.deleteSelectedFromRegister(selected, function(){
            socket.emit('update_client');
        });
    });
});

app.get('/', routes.index);
app.get('/allItems', routes.getAllItems);
app.get('/registerItems', routes.getRegisterItems);

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
