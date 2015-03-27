App = Ember.Application.create();

App.IndexRoute = Ember.Route.extend({
  
  model: function() {
    return {id:2, value:'this is value of model 2'}; 
  }
});

App.IndexController = Ember.ObjectController.extend({
    actions : {
    changeData : function() {
			this.set('model',{id:3, value:'this is value of model 3'});       
    }
  }
});


App.HobbyComponent = Ember.Component.extend({
  data: null,
  sid : null,
  
  init : function() {
    this._super();
    this.set('sid', Math.random());
  }  

});

