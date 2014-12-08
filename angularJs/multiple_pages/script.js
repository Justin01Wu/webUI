// script.js

	// create the module and name it scotchApp
        // also include ngRoute for all our routing needs
	var scotchApp = angular.module('scotchApp', ['ngRoute']);

	// configure our routes
	scotchApp.config(function($routeProvider) {
	
		$routeProvider
			// route for the home page
			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'mainController'
			})

			// route for the about page
			.when('/about', {
				templateUrl : 'pages/about.html',
				controller  : 'aboutController'
			})
			
			// route for the specific about page
			.when('/about?search=:search', {
				templateUrl : 'pages/about.html',
				controller  : 'aboutController'
			})

			// route for the default contact page
			.when('/contact', {
				templateUrl : 'pages/contact.html',
				controller  : 'contactController'
			})
			
			// route for the department contact page
			.when('/contact/:department', {
				templateUrl : 'pages/contact.html',
				controller  : 'contactController'
			});
			
	});	

	// create the controller and inject Angular's $scope
	scotchApp.controller('mainController', function($scope, $location) {		
		console.log('in mainController');
		console.log('$location.url=' + $location.$$url);
		console.log('$location.path=' +$location.$$path);
		// create a message to display in our view
		$scope.message = 'Everyone come and see how good I look!';
	});

	scotchApp.controller('aboutController', function($scope, $location, $routeParams) {
		console.log('in aboutController');
		console.log('$location.url=' + $location.$$url);
		console.log('$location.path=' +$location.$$path);

		if($routeParams.search){
			$scope.message = 'Look for ' + $routeParams.search + '?';
		}else{
			$scope.message = 'Look! I am an about page.';
		}
		
	});

	scotchApp.controller('contactController', function($scope, $routeParams) {
		console.log('in contactController');
		if($routeParams.department){
			$scope.message = 'Contact us! This is '+ $routeParams.department + ' department.';
		}else{
			$scope.message = 'Contact us! This is head office.';
		}
	});
	
	
	scotchApp.run(['$rootScope', '$sce', '$location', '$route', 
	
	function($rootScope, $sce, $location, $route) {
	
		$rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl){
			console.log('    ==>> in locationChangeStart');
			console.log('      ==>> going to change to ' + newUrl);
			console.log('      ==>> from  ' + oldUrl);
			
			// we can hide real url by this way:   
			//$rootScope.target = $location.search()['key']; // (equivalent) key = GET[key]
			// $rootScope.target = $location.search().key; // Other solution
			// it comes from  http://stackoverflow.com/questions/22841015/angularjs-how-to-change-location-path-in-routechangestart-event
		});
	    
		$rootScope.$on('$routeChangeStart', function(event, next, current) {
			console.log('    ==>> in routeChangeStart');
			if(next){
				if(next.$$route.keys.length>0){
					console.log('      ==>> going to change to ' + next.$$route.keys[0].name);
				}else{
					console.log('      ==>> going to change to ' + next.$$route.templateUrl);
				}
			}
			if(current){
				if(current.$$route.keys.length>0){
					console.log('      ==>> from ' + current.$$route.keys[0].name);
				}else{
					console.log('      ==>> from ' + current.$$route.templateUrl);
				}				
			}

        });
    }]);