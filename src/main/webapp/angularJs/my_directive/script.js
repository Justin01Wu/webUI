var app = angular.module('myDirectives', []);

app.directive('message', function(){
      return {
	  
        restrict: 'E',  
		// "A" is for attribute, "E" is for element, "C" for class, "M" for comment
		// default is "A"
		
        scope: {},
        templateUrl: 'widgets/messages.html',
		controller: function ($scope, $attrs) {
			console.log("set msg..");
			$scope.msg = $attrs.msg2;
		}
		
      };
    });
	

// this example comes from https://thinkster.io/egghead/directive-restrictions/	
app.directive("superman", function(){
  return {
   restrict: "A",  
   // "A" is for attribute, "E" is for element, "C" for class, "M" for comment
   
   link: function(){  //  this function implement the behaviour of this attribute
       alert("I'm working as a superman");
     }
  };
});	

app.directive("flash", function(){
  return {
   restrict: "A",
   link: function(){
       alert("I'm working faster");
     }
  };
});