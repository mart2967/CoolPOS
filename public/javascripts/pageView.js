/**
 * Created by mart2967 on 3/5/14.
 */
var PageView = Backbone.View.extend({

    initialize: function() {
        this.initSocket()
        var self = this;
        this.items = new ItemCollection();
        this.paymentButtons = new Array();

        this.items.fetch({
            success: function(){
                self.itemButtons = new ItemCollectionButtonView({collection: self.items });
                self.select = new SelectView({collection: new RegisterItemCollection()});
                self.deleteButton = new ButtonView({
                    model: {label: 'Delete All', buttonClass: 'btn-danger deleteAll'},
                    className: 'col-lg-3 col-md-4 col-xs-6'
                });
                self.deleteSelButton = new ButtonView({
                    model:{label: 'Delete Selected', buttonClass: 'btn-danger deleteSelected'},
                    className: 'col-lg-3 col-md-4 col-xs-6'
                });
                self.paymentButtons.push( new ButtonView({
                    model:{label: 'Cash', buttonClass:'btn-success postCash'},
                    className: 'col-xs-3'
                }));
                self.paymentButtons.push( new ButtonView({
                    model:{label: 'Check', buttonClass:'btn-success postCheck'},
                    className: 'col-xs-3'
                }));
                self.paymentButtons.push( new ButtonView({
                    model:{label: 'Credit', buttonClass:'btn-success postCredit'},
                    className: 'col-xs-3'
                }));

                self.initHandlers();
                self.render();
            },
            error: function(){
                alert('error loading inventory data');
            }
        });

    },

    render: function(){
        $('#buttons').html(this.itemButtons.$el);
        this.select.render();
        this.paymentButtons.forEach(function(button){
            $('#payment').append(button.$el);
        });
        $('#delete_div').append(this.deleteButton.$el);
        $('#delete_div').append(this.deleteSelButton.$el);
    },

    initSocket: function(){
        var self = this;
        this.socket = io.connect('http://localhost');
        this.socket.on('user_list', function(list){
            console.log(list);
            self.user = list[0];
            $('#currentUser').text('Current User: ' + self.user.name);
            self.userSelect = new UserSelectView({model:list});
            self.userSelect.on('changeUser', function(user){
                self.user = user;
                $('#currentUser').text('Current User: ' + self.user.name);
            });
        });
        this.socket.on('update_client', function () {
            console.log('client updating...');
            self.select.initialize();
        });
    },

    initHandlers: function(){
        var self = this;
        this.paymentButtons.forEach(function(button){
            self.listenTo(button, 'post_transaction', function(type) {
                console.log(self.user);
                self.socket.emit('post_transaction', {type:type, userID:self.user.id});
            });
        });
        this.listenTo(this.deleteButton, 'deleteAll', function(){
            this.socket.emit('delete_all');
        });
        this.listenTo(this.deleteSelButton, 'deleteSelected', function(selected){
            this.socket.emit('delete_selected', selected);
        });
        this.listenTo(this.itemButtons, 'click', function(button){
            button.attributes.user = this.user;
            this.socket.emit('button_click', button.attributes)
        });
    }

});