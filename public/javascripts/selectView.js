/**
 * Created by mart2967 on 3/5/14.
 */
var SelectView = Backbone.View.extend({
    tagName: 'select multiple',
    className: 'form-control',
    attributes: {'size': '10'},
    initialize: function(){
        console.log('selectBox init');
        var self = this;
        //this.collection = new RegisterItemCollection();
        this.collection.fetch({
            success: function(){
                console.log(self.collection);
                self.render();
                //self.select = new SelectView({collection: self.registerItems});
            },
            error: function(){
                console.log('error loading register data');
            }
        });

        //this.render();
        //this.collection.on("add", this.addItemView, this);

    },

    update: function(){

    },
    addItemView: function(item){
        console.log(item);
        //var uniqueItemIds = _.pluck(this.collection.models, 'itemId');
        //console.log(uniqueItemIds);
        //if (this.collection.indexOf)
        var view = new SelectItemView({ model: item });
        this.$el.append(view.$el);
    },

    render: function(){
        this.$el.empty();
        _.each(this.collection.models, (function(item, index){
            //console.log(item);
            var view = new SelectItemView({model: item});
            this.$el.append(view.el);
        }), this);
        $('#itemList').html(this.$el);
        //this.collection.each(this.addItemView);
    }

});