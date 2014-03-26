/**
 * Created by mart2967 on 3/5/14.
 */
var PageView = Backbone.View.extend({

    initialize: function() {
        this.initSocket()
        var self = this;
        this.items = new ItemCollection();

        this.items.fetch({
            success: function(){
                self.buttons = new ItemCollectionButtonView({collection: self.items });
                self.select = new SelectView({collection: new RegisterItemCollection()});
                self.deleteButton = new ButtonView({model:{label: 'Delete All', buttonClass: 'btn-danger deleteAll'}});
                self.deleteSelButton = new ButtonView({model:{label: 'Delete Selected', buttonClass: 'btn-danger deleteSelected'}});
                self.initHandlers();
                self.render();
            },
            error: function(){
                alert('error loading inventory data');
            }
        });

    },

    render: function(){
        $('#buttons').html(this.buttons.$el);
        this.select.render();
        $('#delete_div').html(this.deleteButton.$el);
        $('#delete_div').append(this.deleteSelButton.$el);
    },

    initSocket: function(){
        var self = this;
        this.socket = io.connect('http://localhost');
        this.socket.on('user_list', function(list){
            self.user = list[0];
            $('#currentUser').text('Current User: ' + self.user);
            self.userSelect = new UserSelectView({model:list});
            self.userSelect.on('changeUser', function(userName){
                self.user = userName;
                $('#currentUser').text('Current User: ' + self.user);
            });
        });
        this.socket.on('update_client', function () {
            console.log('client updating...');
            self.select.initialize();
        });
    },

    initHandlers: function(){
//        this.listenTo(this.userSelect, 'changeUser', function(userName){
//            this.user = userName;
//            $('#currentUser').text('Current User: ' + this.user);
//        });
        this.listenTo(this.deleteButton, 'deleteAll', function(){
            //console.log('deleting all items');
            this.socket.emit('delete_all');
        });
        this.listenTo(this.deleteSelButton, 'deleteSelected', function(selected){
            //console.log('deleting selected items: ' + selected);
            this.socket.emit('delete_selected', selected);
        });
        this.listenTo(this.buttons, 'click', function(button){
            button.attributes.user = this.user;
            this.socket.emit('button_click', button.attributes)
        });
    }

});