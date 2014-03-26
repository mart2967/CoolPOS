/**
 * Created by mart2967 on 3/4/14.
 */
var ItemCollectionButtonView = Backbone.View.extend({
    columns: 4,
    events: {
        'click button.item': 'saveToRegister'
    },

    initialize: function() {
        this.render();
    },

    render: function() {
        this.$el.append('<div class=row">');
        _.each(this.collection.models, (function(item, index) {
            var view;
            view = new ItemButtonView({
                model: item
            });
            if (index % this.columns == 0 && index > 0){
                this.$el.append('</div><div class="row">');
            }
            this.$el.append(view.el);
        }), this);
        this.$el.append('</div>');
        //console.log(this.$el);
        return this;
    },

    saveToRegister: function(event){
        //console.log(this);
        //console.log(event.target.id)
        var modelIndex = event.target.id - 1;
        var clickedItem = this.collection.models[modelIndex];
        //console.log(clickedItem);
        this.trigger('click', clickedItem);
    }

});