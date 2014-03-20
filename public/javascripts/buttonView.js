/**
 * Created by mart2967 on 3/4/14.
 */
var ButtonView = Backbone.View.extend({
    className: 'col-md-3',

    template: _.template('<button type="button" id="<%= id %>" class="item btn btn-primary btn-lg" style="margin-bottom: 30px;"><%= item %></button>'),
    events: {
        //'click': 'saveItem'
    },


    //template: _.template('<div style="position: absolute; top: <%= top_margin %>;left: <%= left_margin %>">' +
    //            '<button id="<%= id %>", class="item btn btn-primary"><%= label %></button></div>'),
    initialize: function() {

        this.render();

    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
    },

    saveItem: function(event){
        console.log('clicked');
        //console.log(this);
//        this.model.save({
//            success: function(){
//                console.log('saved');
//            },
//            error: function(){
//                console.log('save error');
//            }
//
//        });
    }

})