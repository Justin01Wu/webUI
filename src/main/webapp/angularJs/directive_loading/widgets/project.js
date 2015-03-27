/**
 * declare an angularJs directive "project.edit", type : element 
 * usage:  <project.edit project11="{{selectedProject.id}}"></project.edit>
 * 
 * depend on angularJs 
 * 
 * -- Justin Wu
 */

var myApp = angular.module('directives', []);


function _controller($scope, $http){
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
};

myApp.directive('project.edit', function(){
      return {
        restrict: 'E',  // "A" is for attribute, "E" is for element
		require: 'project11',		        
        scope: {
            projectId: '@project11'  // set up one way binding between a local scope property and the parent scope property 
		},
        templateUrl: 'widgets/project.html',
		controller: function ($scope, $http) {
			 _controller($scope, $http);			
		}
		
      }
    });