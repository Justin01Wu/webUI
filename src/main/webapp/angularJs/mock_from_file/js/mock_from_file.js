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
        restrict: 'E',
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
					waitTime = Math.floor((Math.random() * 1000) + 500);
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


		
	// Do your mock	
    $httpBackend.whenGET('/api/project/111').respond(project1);
	$httpBackend.whenGET('/api/project/222').respond(404, project2);
	
	// you can also mock data from a file
	//http://stackoverflow.com/questions/21057477/how-to-return-a-file-content-from-angulars-httpbackend		
	$httpBackend.whenGET('/api/project/333').respond(function(method, url, data) {
	
	    console.log("    ==> going to load mock data from file: mock/project3.json");
		//Since $httpBackend doesn't work with returned promises, 
		// one way you can do this is to get your data synchronously. 
		// $http doesn't have a synchronous option out of the box, 
		// so you would have to make the call to your file without it, like so:
		var request = new XMLHttpRequest();
		
		var url = window.location.href;
		var arr = url.split("/");
		var result = arr[0] + "//" + arr[2];
		if(result === "file://"){
			request.overrideMimeType("application/json");
		}
		
		request.open('GET', './mock/project3.json', false);  // set aSynchronous = false
		request.send(null);
		console.log("    ==> status: " + request.status);
		var reqStatus = request.status;
		if(reqStatus == 0){
		    // will return 0 if it is on local file, so hack it
			console.log("    ==> going to hack status to 200");
			reqStatus = 200;  
		}
		return [reqStatus, request.response, {}];
	});
	
	//$httpBackend.whenGET(/^widgets\//).passThrough();
	
	// Catch-all pass through for all other requests
	$httpBackend.whenGET(/.*/).passThrough();
	$httpBackend.whenPOST(/.*/).passThrough();
	$httpBackend.whenDELETE(/.*/).passThrough();
	$httpBackend.whenPUT(/.*/).passThrough();
	
})	