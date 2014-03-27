var ButtonView = Backbone.View.extend({
    tagName: 'div',
    className: '',
    attributes: {
    },
    template: _.template('<button type="button" class="btn <%= buttonClass %>" ><%= label %></button>'),
    events: {
        'click button.deleteSelected': 'fireDeleteSelected',
        'click button.deleteAll': 'fireDeleteAll',
        'click button.postCash': 'firePostCash',
        'click button.postCheck': 'firePostCheck',
        'click button.postCredit': 'firePostCredit'
    },
    initialize: function() {

        this.render();
    },

    firePostCash: function() {
        //console.log(event);
        this.trigger('post_transaction', 'cash');
    },

    firePostCheck: function() {
        this.trigger('post_transaction', 'check');
    },

    firePostCredit: function() {
        this.trigger('post_transaction', 'credit');
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