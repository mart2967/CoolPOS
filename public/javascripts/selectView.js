/**
 * Created by mart2967 on 3/5/14.
 */
var SelectView = Backbone.View.extend({
    htmlId: 'itemList',
    tagName: 'select multiple',
    className: 'form-control',
    attributes: {
        'size': '15',
        'style': 'margin-bottom:20px; margin-top:20px'
    },

    initialize: function(){
        var self = this;
        this.collection.fetch({
            success: function(){
                self.render();
            },
            error: function(){
                console.log('error loading register data');
            }
        });
    },

    render: function(){
        this.$el.empty();
        var total = 0;
        _.each(this.collection.models, (function(item){
            total += parseFloat(item.attributes.price);
            var view = new SelectItemView({model: item, id: item.id});
            this.$el.append(view.el);
        }), this);
        $('#itemList').html(this.$el);
        $('#total').html('<b>Total: $' + total.toFixed(2) + '</b>');
    }

});