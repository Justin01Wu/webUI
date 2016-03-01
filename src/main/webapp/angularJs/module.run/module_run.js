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

myApp.directive("directive1", function() {
    console.log("step 3: directive1: directive setup");
    return {
        restrict: 'A',  
        compile: function(tElement, tAttributes, transcludeFn) {
            console.log("step 4: directive1: directive compile on :" + tElement[0].id);
            return this.link; // without this line, current directive will has null link function.
	},
	controller: function ($scope, $element, $attrs, $transclude) {
            console.log("step 6: directive1: init directive controller on " + $element[0].id);	
	}, 
        link: function(scope, element, attributes, controller, transcludeFn) {
            console.log("step 7: directive1: directive link on " + element[0].id);
	}        
    };
});

myApp.directive("directive2", function() {
    return {
        compile: function(tElement, tAttributes, transcludeFn) {
            console.log("step 4: directive2: directive compile on :" + tElement[0].id);
            return this.link; // without this line, current directive will has null link function.
	},        
        controller: function ($scope, $element) {
            console.log("step 6: directive2 : init directive controller on " + $element[0].id);	
	},
        link: function(scope, element) {
            console.log("step 7: directive2 : directive link on " + element[0].id);
	}
    };
});

myApp.controller('myCtrl', function($scope) {
    console.log("step 5: app controller ");
	console.log("  get someData from parent: " + $scope.$parent.someData.message);	
});

myApp.factory('aProvider', function() {
   // because aProvider is not called, so it is not initialized
   console.log("factory");
});