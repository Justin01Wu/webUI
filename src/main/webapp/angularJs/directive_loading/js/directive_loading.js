var myApp = angular.module('directive_loading', []);

myApp.controller('mainController', MainController);

// The controller code
function MainController($scope) {
	console.log("MainController init...");
	$scope.projects = [
		{id: 0, name: "please select project"},
		{id: 111, name: 'Project A'},
		{id: 222, name: 'Project B'},
		{id: 333, name: 'project C'}
	];
	$scope.selectedProject = $scope.projects[0];
}

myApp.directive('project', function(){
      return {
        restrict: 'E',  // "A" is for attribute, "E" is for element
		require: 'project11',		        
        scope: {
            projectId: '@project11'  // set up one way binding between a local scope property and the parent scope property 
		},
        templateUrl: 'widgets/project.html',
		controller: function ($scope, $attrs, $http) {

			// example comes from 
			// http://stackoverflow.com/questions/15112584/using-scope-watch-and-scope-apply
			// and http://stackoverflow.com/questions/14693052/watch-ngmodel-from-inside-directive-using-isolate-scope
			$scope.$watch('projectId', function(newValue, oldValue) {
				console.log("project changed from " + oldValue +" to "+ newValue); 
				$scope.project=null;
				if(!($scope.projectId) || $scope.projectId === '0') {
					console.log("no project selected, so skip loading: " );					
					return;
				}
				console.log("load project " + $scope.projectId + "..." );				
				var targetUrl = '/api/project/' + $scope.projectId;
				console.log("targetUrl= " + targetUrl );
				$scope.loading=true;
				$http.get(targetUrl)
				.success(function(data, status) {
					console.log(data);
					$scope.project=data;  
					$scope.loading=false;
				}).
				error(function(data, status, headers, config) {
					// log error
					$scope.loading=false;
					alert('error: load failure');
				}); 
			});

			
		}
		
      }
    });
	
// of course you can add ngMockE2E directly into myApp, but that will pollute your production code
// so we add ngMockE2E here 
var myAppDev = angular.module('myAppDev', ['directive_loading', 'ngMockE2E']);   // last parameter set up $httpBackend

// decorate the $httpBackend service to delay response for [2-5] seconds:
// comes from http://endlessindirection.wordpress.com/2013/05/18/angularjs-delay-response-from-httpbackend/
myAppDev.config(function($provide) {
    $provide.decorator('$httpBackend', function($delegate) {
        var proxy = function(method, url, data, callback, headers) {
            var interceptor = function() {
                var _this = this,
                    _arguments = arguments;
				var waitTime = 0;
				if (url.match(/^\/api\/project\/[.]*/) ) {
					waitTime = Math.floor((Math.random() * 3000) + 2000);
					console.log("mock up delay million seconds:" + waitTime); 				
				}else{
					console.log("not API, so no wait time: " + url ); 				
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
	var project1 = {
			name: "project A",
			type: "catastrophe XOL",
			underwriter: "Justin Wu",
			profile: "Us Property"
        };

	var project2 = {
			error: 404,
			errorMsg: "can't find project with ID 222"
        };

	var project3 = {
			name: "project C",
			type: "Per Event XOL",
			underwriter: "Jeff",
			profile: "Intl Property"
        };
		
	// Do your mock	
    $httpBackend.whenGET('/api/project/111').respond(project1);
	$httpBackend.whenGET('/api/project/222').respond(404, project2);
	$httpBackend.whenGET('/api/project/333').respond(project3);
	
	//$httpBackend.whenGET(/^widgets\//).passThrough();
	
	// Catch-all pass through for all other requests
	$httpBackend.whenGET(/.*/).passThrough();
	$httpBackend.whenPOST(/.*/).passThrough();
	$httpBackend.whenDELETE(/.*/).passThrough();
	$httpBackend.whenPUT(/.*/).passThrough();
	
})	