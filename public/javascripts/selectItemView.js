/**
 * Created by mart2967 on 3/5/14.
 */
var SelectItemView = Backbone.View.extend({
    tagName: 'option',
    template: _.template('<%= item %>'),
    

    initialize: function(){
        this.render();
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }

});