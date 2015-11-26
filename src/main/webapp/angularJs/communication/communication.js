var app = angular.module('plunker', []);

app.controller('MainCtrl', function ($scope) {
    $scope.name = 'World';
});


app.directive('directiveA', function () {
    return{
        restrict: 'E',
        controller: function ($scope) {
            this.data = 'init value';

            this.set = function () {
                //EMIT THE EVENT WITH DATA
                var value = new Date().toISOString();
                $scope.$emit('MSG_A', value);
                this.data = value;
                // communication with second Directive ???
            };
        },
        controllerAs: 'firstCtrl'
    };
});

app.directive('directiveB', function () {
    return{
        restrict: 'E',
        controller: function ($scope) {
            var _that = this;
            //LISTEN TO THE EVENT 
            $scope.$on('MSG_A', function (e, data) {
                _that.data = data;
            });
            this.data = 'init value';

        },
        controllerAs: 'secondCtrl'
    };
});