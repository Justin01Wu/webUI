(function () {
    'use strict';

    var myApp = angular.module('myApp', []);



    function firstController($scope) {
        // Initialize the model variables
        $scope.firstName = "John";
        $scope.lastName = "Doe";

        // Define utility functions
        $scope.getFullName = function () {
            return $scope.firstName + " " + $scope.lastName;
        };
    }
    ;

    function secondController($scope) {
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

    myApp.controller('firstController', firstController);
    myApp.controller('secondController', secondController);

})();  // close anonymous function