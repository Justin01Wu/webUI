if (!window.console) {
	window.console = {
		log : function() {
		},
		warn : function() {
		},
		error : function() {
		}
	};
}	

function AccountListController($scope, $http) {
		
		$scope.userName = "originalUserName";
		
		$scope.changeName = function() {
			$scope.userName = "originalUserName changed by $scope.changeName ";
		};
		
}
	
jQuery(document).ready(function(){
   	jQuery( "#changeName2" ).bind( "click", function() {
    		
   		var controllerDiv = document.getElementById('tableDiv');
   		var scope = angular.element(controllerDiv).scope();  // get Angular Controller $scope	    		
   		
   		//scope.changeName();  // wrong way, this sometimes doesn't work
   	    scope.$apply(function () {
   	        scope.changeName();
   	    });
   	});
   	
   	jQuery( "#changeName4" ).bind( "click", function() {
		
   		var controllerDiv = document.getElementById('tableDiv');
   		var scope = angular.element(controllerDiv).scope();  // get Angular Controller $scope	    		
   		scope.$apply(function(){
   			scope.userName = "originalUserName changed by direct changeName";
   		});
   	});
   	
   	jQuery( "#getName" ).bind( "click", function() {
		
   		var controllerDiv = document.getElementById('tableDiv');
   		var scope = angular.element(controllerDiv).scope();  // get Angular Controller $scope	    		
   		alert(scope.userName);
   	});
});