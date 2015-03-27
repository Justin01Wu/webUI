App = Ember.Application.create();

App.Router.map(function(match) {
	this.resource('posts', function() {

	});
});


App.ApplicationRoute = Ember.Route.extend({
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

App.IndexRoute = Ember.Route.extend({
	model : function() {

		// var channel = this.get('model');
		var self = this;
		// Assume this promise will just get channel
		return new Ember.RSVP.Promise(function(resolve, reject) {
			console.log('loading channel ...');

			$.ajax({
				type : 'get',
				dataType : "json",
				url : 'getChannel'
			}).done(function(response) {
				//self.set('model', response);

				resolve(channel);
			}).fail(function(xhr, status, error) {
				reject("can't get cahnnel info");
			});
		});
	}
	
//  actions: {
//	    error: function(reason) {
//	      alert(reason);
//
//	      // Can transition to another route here, e.g.
//	      // this.transitionTo('index');
//
//	      // Uncomment the line below to bubble this error event:
//	      // return true;
//	    }
//	  }
});

App.PostsController = Ember.ArrayController.extend({
	needs : [ 'postsIndex' ],

	total : function() {
		return this.get('controllers.postsIndex.content.length');
	}.property('controllers.postsIndex.content.length'),

	// Or this
	total2Binding : 'controllers.postsIndex.total'
});

App.PostsIndexRoute = Ember.Route.extend({
	model : function() {
		// Assume this promise will just get ALL Ids
		return new Ember.RSVP.Promise(function(resolve, reject) {

			$.ajax({
				type : 'get',
				dataType : "json",
				url : 'getPosts'
			}).done(function(response) {
				var posts = Ember.A();
				for (var i = 0; i < response.length; i++) {
					posts.push(Ember.Object.create(response[i]));
				}
				resolve(posts);
			}).fail(function(xhr, status, error) {
				reject("can't load posts Ids");
			});

		});
	}
	
//	  actions: {
//		    error: function(reason) {
//		      alert(reason);
//	
//		      // Can transition to another route here, e.g.
//		      // this.transitionTo('index');
//	
//		      // Uncomment the line below to bubble this error event:
//		      // return true;
//		    }
//		  }
});

App.PostsIndexController = Ember.ArrayController.extend({
	itemController : 'Post',

	total : function() {
		return this.get('length');
	}.property('model')
});

App.PostController = Ember.ObjectController.extend(Ember.PromiseProxyMixin);
App.PostController.reopen({

	init : function() {

		var post = this.get('model'); // Now we need to get the detailed data for this post item
		var self = this;
		this.set('promise', new Ember.RSVP.Promise(function(resolve, reject) {
			console.log('loading all posts one by one...');
			$.ajax({
				type : 'get',
				dataType : "json",
				url : 'getPostItem/'+ self.model.id
			}).done(function(response) {
				post.title = "title #" + response.title;
				post.text = "text #" + response.title + ": " + response.text;
				resolve(post);
			}).fail(function(xhr, status, error) {
				reject("can't load post item");
			});

		}));
	},
	// Testing computed property
	numberChars : function() {
		return this.get('text').length;
	}.property('content.text')
});
