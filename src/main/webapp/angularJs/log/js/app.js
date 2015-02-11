
if (! window.console) {
	   window.console={};
	   console.log=function(){};
	   console.debug=function(){};
	   console.error=function(){};
	   console.warn=function(){};
	   console.info=function(){};
}

var myApp = angular.module('myApp', []);


myApp.controller('personController', function($scope, $http ) {		
	$scope.firstName="Justin";
	$scope.lastName="Wu";	
	
	console.log('console.log');
	console.info('console.info');
	console.debug('console.debug');
	console.warn('console.warn');
	console.error('console.error');
	$scope.log.log('log.log');
	$scope.log.info('log.info');
	$scope.log.debug('log.debug');
	$scope.log.warn('log.warn');
	$scope.log.error('log.error');
});

myApp.run(function ($rootScope, $log) {
    $rootScope.log = $log;
});

