
var demoApp = angular.module('demoApp', ['ngRoute']);

// configure our routes
demoApp.config(function ($routeProvider) {

    $routeProvider
            // route for the home page
            .when('/', {
                templateUrl: 'submenu/subMenuHome.html',
                controller: 'mainController'
            })

            .when('/subMenuA', {
                templateUrl: 'submenu/subMenuA.html',
                controller: 'subMenuAController'
            })
            .when('/subMenuB', {
                templateUrl: 'submenu/subMenuB.html',
                controller: 'subMenuBController'
            });


});

demoApp.controller('mainController', function ($scope, $location) {
});

demoApp.controller('subMenuAController', function ($scope, $location, $routeParams) {

});

demoApp.controller('subMenuBController', function ($scope, $routeParams) {

});


