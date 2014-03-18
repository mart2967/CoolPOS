/**
 * Created by mart2967 on 3/4/14.
 */
var ItemCollection = Backbone.Collection.extend({
   model: Item,
   url: '/allItems'
});