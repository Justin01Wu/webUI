// The module code

var myApp = angular.module('myApp', []);   
myApp.controller('personController', PersonController);

// The controller code
function PersonController($scope, $http) {
 	
  $http.get('/user/1').success(function(data, status) {
	console.log(data);
    $scope.user=data;  
  }); 
  
}

// of course you can add ngMockE2E directly into myApp, but that will pollute your production code
// so we add ngMockE2E here 
var myAppDev = angular.module('myAppDev', ['myApp', 'ngMockE2E']);   // last parameter set up $httpBackend

myAppDev.run(function ($httpBackend) {
	var user = {
			firstName: "mocked first Name",
			lastName: "mocked last name"
        };
		
	// Do your mock	
    $httpBackend.whenGET('/user/1').respond(user);
})

