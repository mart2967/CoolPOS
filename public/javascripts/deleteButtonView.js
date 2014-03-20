var DeleteButtonView = Backbone.View.extend({
    template: _.template('<button type="button" id="deleteButton" class="btn btn-danger" style="margin-top: 20px;"><%= label %></button>'),
    events: {
        'click button': 'fireDelete'
    },
    initialize: function() {

        this.render();
    },

    fireDelete: function(){
        var sel = $('#itemList option:selected');
        var selected = new Object();

        for(var i = 0; i < sel.length; i++){
            selected[i] = sel[i].index + 1;
        }
        selected.length = sel.length;
        console.log(selected);
        this.trigger('delete', selected);
    },

    render: function() {
        this.$el.html(this.template(this.model));
    }
});