
if (!window.console) window.console = {
		log: function() {},
		warn: function() {}
};

var myApp = angular.module('myApp2', []);

myApp.value('mode', 'app');
myApp.value('version', 'v1.0.1');

myApp.controller('personController', function($scope, $http ) {		
	$scope.firstName="Justin";
	$scope.lastName="Wu";
	
	$scope.retrieveNewPerson = function() {
		$http.get('/user/1').success(function(data, status) {
			console.log(data);
			$scope.firstName=data.firstName;  
			$scope.lastName=data.lastName;  
		}); 
    
    }
});

