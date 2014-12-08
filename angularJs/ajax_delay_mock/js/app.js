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

// decorate the $httpBackend service to delay response for [2-3.5] seconds:
myAppDev.config(function($provide) {
    $provide.decorator('$httpBackend', function($delegate) {
	
	//$delegate - The original service instance, which can be monkey patched, configured, decorated or delegated to.
	
        var proxy = function(method, url, data, callback, headers) {
            var interceptor = function() {
                var _this = this,
                    _arguments = arguments;
				var waitTime = 0;
				if (url.match(/^\/user\/1/) ) {
					waitTime = Math.floor((Math.random() * 1500) + 2000);
				}					
                setTimeout(function() {
                    callback.apply(_this, _arguments);
                }, waitTime);
            };
            return $delegate.call(this, method, url, data, interceptor, headers);
        };
        for(var key in $delegate) {
            proxy[key] = $delegate[key];
        }
        return proxy;
    });
})


myAppDev.run(function ($httpBackend) {
	var user = {
			firstName: "mocked first Name",
			lastName: "mocked last name"
        };
		
	// Do your mock	
    $httpBackend.whenGET('/user/1').respond(user);	
})
