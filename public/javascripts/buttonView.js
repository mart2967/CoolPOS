var ButtonView = Backbone.View.extend({
    tagName: 'div',
    className: 'col-lg-3 col-md-4 col-xs-6',
    attributes: {
      style: 'margin-top: 20px'
    },
    template: _.template('<button type="button" class="btn <%= buttonClass %>" ><%= label %></button>'),
    events: {
        'click button.deleteSelected': 'fireDeleteSelected',
        'click button.deleteAll': 'fireDeleteAll',
        'click button.postTransaction': 'firePostTransaction'
    },
    initialize: function() {

        this.render();
    },

    firePostTransaction: function(event) {

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