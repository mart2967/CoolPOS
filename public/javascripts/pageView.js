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
                self.deleteButton = new DeleteButtonView();
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
        this.listenTo(this.buttons, 'click', function(button){
            console.log(button.attributes);
            this.socket.emit('button_click', button.attributes)


        });
    }

});