var myApp = angular.module('myApp', []);

myApp.config( function() {
    console.log("step 1: app config");
});

myApp.run(function($rootScope) {
    console.log("step 2: app run");
	$rootScope.someData = {message: "hello from myApp.run"};
	// You can only get $rootScope injected to services and run function, 
	//because each child scope is inherited from its parent scope and the top level scope is rootScope. 
	// Since it would be ambigous to inject any scope. Only root scope is provided.
	// http://stackoverflow.com/questions/17371687/getting-scope-object-in-angulars-run-method
});

myApp.directive("test1", function() {
    console.log("step 3: directive setup");
    return {
        compile: function() {
			console.log("step 4: directive compile");
		}
    }
});

myApp.directive("test2", function() {
    return {
        link: function() {
			console.log("step 6: directive link");
		}
    }
});

myApp.controller('myCtrl', function($scope) {
    console.log("step 5: app controller");
	console.log("  get someData from parent: " + $scope.$parent.someData.message);	
});

myApp.factory('aProvider', function() {
   // because aProvider is not called, so it is not initialized
   console.log("factory");
});