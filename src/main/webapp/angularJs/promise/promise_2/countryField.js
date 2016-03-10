/**
 * declare an angularJs directive "country.field" in module "directives" , type : element usage:
 * <country.field field="person.citizen" ></country.field>
 * 
 *  It depends on countryService.js, angularJs ;
 *  
 *  -- Justin Wu
 */

(function (angular, wrongDataFlag) {
    'use strict';

    function setOptions(oldCountryList, countryList) {
        
        console.log("got all country: " + countryList.length);
        for (var i = 0; i < countryList.length; i++) {
            var oneCountry = countryList[i];
            for (var j = 0; j < oldCountryList.length; j++) {

                var found = false;
                if (oldCountryList[j].id.toString() === oneCountry.id.toString()) {
                    oldCountryList[j].name = oneCountry.name;
                    found = true;
                    break;
                }
            }
            if (!found) {
                oldCountryList.push(oneCountry);
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
    
    function _controller($scope, $http, countryService) {
        console.log("init country.field component...");
        
        $scope.countryList = [{id: "", name: "[Please Select]"}];
        $scope.selectedCountry = $scope.countryList[0];  
        
        countryService.getCountryList(wrongDataFlag).then(
                function (data) {
                    console.log("getting country list data");
                    setOptions($scope.countryList, data);
                    $scope.errMsg = null;
                },
                function (errorMessage) {
                    console.log(errorMessage);
                    $scope.errMsg = errorMessage;
                }
        );
        
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
        template: '<select ng-model="selectedCountry" '
                + 'ng-options="item as item.name for item in countryList" '
                + 'ng-change="changeCountry()" ></select>',

        controller: function ($scope, $http, countryService) {
            _controller($scope, $http, countryService);
        }

    };

    angular.module('directives',['myServices']).directive('country.field', function () {
        return myDirective;
    });

})(angular, false); 
