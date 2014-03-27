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
        console.log(event.target);
        this.trigger('changeUser', {name:event.target.innerText, id:event.target.id});
    },

    initialize: function(){
        this.render();
    },

    render: function(){
        console.log(this.model[0].name);
        for(var i = 0; i < this.model.length; i++) {
            this.$el.append('<li><a href="#" class="user" id="' + this.model[i].id + '">' + this.model[i].name + '</a></li>');
        }
        $('#userList').append(this.$el);
    }

});