App = Ember.Application.create();

App.Router.map(function(match) {
	this.route('user', { path:'/user/:user_id'});
});


App.User = Ember.Object.extend({
  
  loadUserInfo: function(userId) {
    var userInfoPromise = new Ember.RSVP.Promise(function(resolve, reject) {
      $.ajax({        
       type: 'get',
       dataType: 'json',
       url: "users/" + encodeURIComponent(userId.trim())
     }).done(function(response) {       
       resolve(response);    //fill the object with your JSON response
     }).fail(function(jqXHR){
       reject("Cannot get user info, Please check the user ID and try again.");
     });
   });
    return userInfoPromise;
  },
  
  loadUserStats : function(userId) {
    var userInfoUrl = "userStats/" + encodeURIComponent(userId.trim());
    var userStatsPromise = new Ember.RSVP.Promise(function(resolve, reject) {
      $.ajax({
        type: 'get',
        dataType: 'json',
        url: userInfoUrl
      }).done(function(response) {
        resolve(response);    //fill the object with your JSON response
      }).fail(function(jqXHR){
        reject("Cannot get user stats, Please check the user ID and try again.");
      });
    });
    return userStatsPromise;
  }
  
});

App.UserStore = App.User.create();

App.UserRoute = Ember.Route.extend({
    
  model : function(params) {
    if (params) {
      if (!params.user_id){
        return Ember.RSVP.reject("parameter userId is not found ");
      }
      var userId = decodeURIComponent(params.user_id);      
      var userInfoPromise = App.UserStore.loadUserInfo(userId);      
      var userStatsPromise = App.UserStore.loadUserStats(userId);

      return Ember.RSVP.hash({
        userInfo: userInfoPromise,
        userStats: userStatsPromise
      });
    }
  },
  
  setupController : function(controller, model) {
    this._super(controller, model);
    var userInfo = model.userInfo;
    var userStats = model.userStats;
    
    controller.set('content', userInfo);
    Ember.merge(controller.get('content'), userStats);
  },
  
  actions: {
    error: function(reason) {
      alert(reason);

      // Can transition to another route here, e.g.
      // this.transitionTo('index');

      // Uncomment the line below to bubble this error event:
      // return true;
    }
  }
});
