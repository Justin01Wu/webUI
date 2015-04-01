(function () {
    'use strict';

    var firstApp = angular.module('firstApp', []);
    var secondApp = angular.module('secondApp', []);



    function firstAppController($scope) {
        // Initialize the model variables
        $scope.firstName = "John";
        $scope.lastName = "Doe";

        // Define utility functions
        $scope.getFullName = function () {
            return $scope.firstName + " " + $scope.lastName;
        };
    }
    ;

    function secondAppController($scope) {
        // Initialize the model variables
        $scope.firstName = "Bob";
        $scope.middleName = "Al";
        $scope.lastName = "Smith";

        // Define utility functions
        $scope.getFullName = function () {
            return $scope.firstName + " " + $scope.middleName + " "
                    + $scope.lastName;
        };
    }
    ;

    firstApp.controller('firstAppController', firstAppController);
    secondApp.controller('secondAppController', secondAppController);

})();  // close anonymous function