/**
 * Created by mart2967 on 3/5/14.
 */
var PageView = Backbone.View.extend({
    initialize: function() {
        var self = this;
        this.idCount = 0;
        this.items = new ItemCollection();
//        this.registerItems = new RegisterItemCollection();
//        this.registerItems.fetch({
//            success: function(){
//                self.select = new SelectView({collection: self.registerItems});
//            },
//            error: function(){
//                alert('error loading register data');
//            }
//        });
        this.items.fetch({
            success: function(){
                self.buttons = new ItemCollectionButtonView({collection: self.items });
                self.select = new SelectView({collection: new RegisterItemCollection()});
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
        $('#itemList').html(this.select.$el);
    },

    initHandlers: function(){
        this.listenTo(this.buttons, 'click', function(button){
            //console.log(this.idCount);
//            var buttonClone = jQuery.extend({}, button.attributes);
//            buttonClone.id = this.idCount;
//            buttonClone.itemId = button.attributes.id;
//            buttonClone.amount = 1;
//            this.idCount++;
            //console.log(event.target.id);
            //console.log(buttonClone);
//            this.select.collection.add(buttonClone);


        });
    }

});