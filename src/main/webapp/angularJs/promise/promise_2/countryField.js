/**
 * declare an angularJs directive "country.field" in module "directives" , type : element usage:
 * <country.field field="person.citizen" ></country.field>
 * 
 *  It depends on countryService.js, angularJs ;
 *  
 *  -- Justin Wu
 */

(function (angular) {
    'use strict';

    function _setOptions($scope, currencyList) {
        console.log("got all currency: " + currencyList.length);

        if(!$scope.initValue){
            $scope.selectedCurrency.currencyName= "[Please Select]";
        }
        for (var i = 0; i < currencyList.length; i++) {
            var oneCurrency = currencyList[i];
            
            if (oneCurrency.currencyId.toString() === $scope.selectedCurrency.currencyId) {
                $scope.selectedCurrency.currencyName = oneCurrency.currency;
            } else {
                $scope.options.push({currencyId: oneCurrency.currencyId, currencyName: oneCurrency.currency});

            }
        }
    }

    function _controller($scope, $http) {
        console.log("init country.field component...");
        
        $scope.countryList = [
                {currencyId: "", currencyName: "[Please Select]"},
                {currencyId: $scope.initValue, currencyName: "loading..."}
            ];
        //$scope.selectedCountry = $scope.options[1];   
    }
    
    var myDirective = {
        restrict: 'E',
        require: ['field'],
        scope: {
            selectedCountry: '=field'
        },
        //template: '<select ng-model="selectedCountry" ng-options="item as item.name for item in countryList" ></select>',
        template: '<input type="text" ng-model="selectedCountry"  />',
        controller: function ($scope, $http) {
            _controller($scope, $http);
        }

    };

    angular.module('directives',[]).directive('country.field', function () {
        return myDirective;
    });

})(angular); 
