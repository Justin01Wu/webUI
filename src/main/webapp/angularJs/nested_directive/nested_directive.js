var app = angular.module('plunker', []);

app.controller('MainCtrl', function ($scope) {
    $scope.name = 'World';
});


app.directive('outerDirective', function () {
    return{
        scope: {},
        restrict: 'AE',
        controller: function ($scope, $compile, $http) { //dependencies can be injected
            // $scope is the appropriate scope for the directive
            this.addChild = function (message) {
                console.log('Got the message from nested directive: ' + message);
            };
        }
    };
});

app.directive('innerDirective', function () {
    return{
        scope: {},
        restrict: 'AE',
        require: '^outerDirective',
        link: function (scope, elem, attrs, controllerInstance) {
            //the 4th argument is the controller instance you required outerDirective
            var message = "Hi, Parent directive";
            controllerInstance.addChild(message);
        }
    };
});