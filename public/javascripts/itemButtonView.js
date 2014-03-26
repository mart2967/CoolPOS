/**
 * Created by mart2967 on 3/4/14.
 */
var ItemButtonView = Backbone.View.extend({
    className: 'col-xs-6 col-md-3',
    attributes: {
      style: 'margin-bottom: 20px;'
    },
    template: _.template('<button type="button" id="<%= id %>" class="item btn btn-primary btn-lg"><%= item %></button>'),

    initialize: function() {
        this.render();
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
    }

});