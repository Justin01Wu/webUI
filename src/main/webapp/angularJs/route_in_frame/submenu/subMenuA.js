
(function () {
    function MyCtrl($scope, $location, $routeParams) {
        console.log("in subMenuAController ");
        $scope.message="from subMenuAController";
    }
    demoApp.controller('subMenuAController', MyCtrl);

})();