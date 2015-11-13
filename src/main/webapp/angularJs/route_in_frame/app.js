
var demoApp = angular.module('demoApp', ['ngRoute']);

// configure our routes
demoApp.config(function ($routeProvider) {

    $routeProvider
            // route for the home page
            .when('/', {
                templateUrl: 'submenu/subMenuHome.html',
                controller: 'homeController'
            })

            .when('/subMenuA', {
                templateUrl: 'submenu/subMenuA.html',
                controller: 'subMenuAController'
            })
            .when('/subMenuB/menu2b', {
                templateUrl: 'submenu/subMenuB.html',
                controller: 'subMenuBController'
            })
            .otherwise({
                redirectTo: '/'
            })        
    ;


});


    function MenuCtrl($scope, $location) {
        
        $scope.location = $location;
    }
    demoApp.controller('MenuCtrl', MenuCtrl);




