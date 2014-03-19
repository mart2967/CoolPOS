var DeleteButtonView = Backbone.View.extend({
    template: _.template('<button type="button" id="deleteButton" class="btn btn-danger " style="margin-top: 20px;">Delete All</button>'),
    events: {
        'click button': 'deleteAll'
    },
    initialize: function() {
        this.render();
    },

    deleteAll: function(){
        console.log('delete clicked');
        this.trigger('delete');
    },

    render: function() {
        this.$el.html(this.template());
    }
});