
(function () {
    function MyCtrl($scope, $routeParams) {
        console.log("in subMenuBController ");
        $scope.user = {fullName: "Justin Wu"};
    }
    demoApp.controller('subMenuBController', MyCtrl);

})();
