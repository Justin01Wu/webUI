var app = angular.module('plunker', []);

app.controller('MainCtrl', function ($scope) {
    $scope.name = 'World';
});


app.directive('outerDirective', function () {
    return{
        scope: {},
        transclude: true,  // allow to include child content    
        template: [
            '<fieldset>',
            '<legend>outer directive</legend>',
            '<div ng-transclude/>'   // use this div to hold child directive because ng-transclude must attach to an element
        ].join('\n'),    
        restrict: 'E',
        controller: function ($scope) { 
            // $scope is the appropriate scope for the directive
            this.childCall = function (message) {
                alert('Got the message from nested directive: ' + message);
            };
        }
    };
});

app.directive('innerDirective', function () {
    return{
        scope: {},
        template: "<fieldset>" +
            "<legend>inner directive</legend>"+
            "<button ng-click='callParent()'>call parent</button>"+
            "</fieldset>",
        
        controller : function($scope){          
            $scope.callParent =  function(){
                $scope.parentCtrl.childCall("Hi, Parent directive");
            };
        },
        restrict: 'E',
        require: '^outerDirective',
        link: function ($scope, elem, attrs, controllerInstance) {
            //the 4th argument is the controller instance you required outerDirective
            $scope.parentCtrl = controllerInstance;
            //controllerInstance.childCall(Hi, Parent directive);
        }
    };
});