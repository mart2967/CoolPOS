var DeleteButtonView = Backbone.View.extend({
    tagName: 'div',
    className: 'col-lg-3',
    template: _.template('<button type="button" class="btn btn-danger deleteButton <%= type %>" ><%= label %></button>'),
    events: {
        'click button.deleteSelected': 'fireDeleteSelected',
        'click button.deleteAll': 'fireDeleteAll'
    },
    initialize: function() {

        this.render();
    },

    fireDeleteAll: function(){
        this.trigger('deleteAll');
    },


    fireDeleteSelected: function(){
        var sel = $('#itemList option:selected');
        var selected = new Object();

        for(var i = 0; i < sel.length; i++){
            selected[i] = sel[i].id;
        }
        selected.length = sel.length;
        //console.log(selected);
        this.trigger('deleteSelected', selected);
    },

    render: function() {
        this.$el.html(this.template(this.model));
    }
});