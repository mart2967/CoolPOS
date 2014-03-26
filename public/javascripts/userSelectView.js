/**
 * Created by mart2967 on 3/26/14.
 */
var UserSelectView = Backbone.View.extend({
    tagName: 'ul',
    className: 'dropdown-menu',
    events: {
        'click a.user': 'changeUser'
    },

    changeUser: function(event){
        this.trigger('changeUser', event.target.innerText);
    },

    initialize: function(){
        this.render();
    },

    render: function(){
        for(var i = 0; i < this.model.length; i++) {
            this.$el.append('<li><a href="#" class="user">' + this.model[i] + '</a></li>');
        }
        $('#userList').append(this.$el);
    }

});