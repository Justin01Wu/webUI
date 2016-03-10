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

    function addCountryIfNot(newCountry, countryList) {        

        for (var i = 0; i < countryList.length; i++) {
            var oneCountry = countryList[i];            
            if (oneCountry.id.toString() === newCountry.id.toString()) {
                return oneCountry;
            }            
        }
        countryList.push(newCountry);
        return newCountry;
    }
    
    function _controller($scope, $http) {
        console.log("init country.field component...");
        
        $scope.countryList = [{id: "", name: "[Please Select]"}];
        $scope.selectedCountry = $scope.countryList[0];  
        
        $scope.changeCountry = function () {
            console.log("changing country to " + $scope.selectedCountry.id  + " - " + $scope.selectedCountry.name);
            $scope.selectedCountryId = $scope.selectedCountry.id;
        };
        
        $scope.$watch('selectedCountryId', function(newValue, oldValue) {
            			 
            if (newValue === null) {
                    return;
            }
            if (newValue === oldValue) {
                    return;
            }
            console.log("selectedCountryId changed from " + oldValue + " to " 	+ newValue);
            var c = addCountryIfNot({id: newValue, name: "loading..."}, $scope.countryList);
            $scope.selectedCountry = c;  
        });
    }
    
    var myDirective = {
        restrict: 'E',
        require: ['field'],
        scope: {
            selectedCountryId: '=field'
        },
        template: '<select ng-model="selectedCountry" ng-options="item as item.name for item in countryList" ng-change="changeCountry()" ></select>',
        //template: '<input type="text" ng-model="selectedCountry"  />',
        controller: function ($scope, $http) {
            _controller($scope, $http);
        }

    };

    angular.module('directives',[]).directive('country.field', function () {
        return myDirective;
    });

})(angular); 
