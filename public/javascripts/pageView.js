/**
 * Created by mart2967 on 3/5/14.
 */
var PageView = Backbone.View.extend({

    initialize: function() {
        this.initSocket()

        var self = this;
        this.items = new ItemCollection();
        this.user = '';
        while(this.user == ''){
            this.user = window.prompt('Please Enter Your Name','Adrian');
        }
        this.items.fetch({
            success: function(){
                self.buttons = new ItemCollectionButtonView({collection: self.items });
                self.select = new SelectView({collection: new RegisterItemCollection()});
                self.deleteButton = new DeleteButtonView({model:{label: 'Delete All'}});
                self.deleteSelButton = new DeleteButtonView({model:{label: 'Delete Selected'}});
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
        this.socket.on('update_client', function () {
            console.log('client updating...');
            self.select.initialize();
            //$('#itemList').html(self.select.$el);
        });
    },

    initHandlers: function(){
        this.listenTo(this.deleteButton, 'delete', function(){
            console.log('deleting all items');
            this.socket.emit('delete_all');
        });
        this.listenTo(this.deleteSelButton, 'delete', function(selected){
            console.log('deleting selected items: ' + selected);
            this.socket.emit('delete_selected', selected);
        });
        this.listenTo(this.buttons, 'click', function(button){
            button.attributes.user = this.user;
            //console.log(button.attributes);
            this.socket.emit('button_click', button.attributes)


        });
    }

});