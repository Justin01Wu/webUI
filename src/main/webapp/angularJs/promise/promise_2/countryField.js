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



    function _getCurrentPath() {
        var scripts = document.getElementsByTagName("script");
        var currentFile = scripts[scripts.length - 1].src;
        var currentPath = currentFile.substr(0, currentFile.lastIndexOf('/')) + "/";
        return currentPath;
    }
    
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
        console.log("init country.field component, selectedCountryId = " + $scope.selectedCountryId);
        
        $scope.countryList = [{id: "", name: "[Please Select]"}];
        if($scope.selectedCountryId !== undefined){
            var c = addCountryIfNot({id: $scope.selectedCountryId, name: "loading..."}, $scope.countryList);
            $scope.selectedCountry = c;            
        }else{
            $scope.selectedCountry = $scope.countryList[0];
        }
        
        
        countryService.getCountryList().then(
                function (data) {
                    console.log("getting country list data");
                    setOptions($scope.countryList, data);
                    $scope.errMsg = null;
                },
                function (errorMessage) {
                    console.log(errorMessage);
                    $scope.errMsg = errorMessage;
                    if($scope.selectedCountryId === undefined){
                        return;
                    }
                    // set "loading..." to "failure"
                    for (var i = 0; i < $scope.countryList.length; i++) {
                        var oneCountry = $scope.countryList[i];
                        if ($scope.selectedCountryId.toString() === oneCountry.id.toString()) {
                            oneCountry.name = "failure";
                            break;
                        }
                    }
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
            var newId = newValue === undefined? "":newValue;

            var c = addCountryIfNot({id: newId, name: "loading..."}, $scope.countryList);
            $scope.selectedCountry = c;  
        });
    }
    
    var rootDir = _getCurrentPath();
    
    var myDirective = {
        restrict: 'E',
        require: ['field'],
        scope: {
            selectedCountryId: '=field'
        },
        templateUrl: rootDir + 'countryField.html',

        controller: function ($scope, $http, countryService) {
            _controller($scope, $http, countryService);
        }

    };

    angular.module('directives',['myServices']).directive('country.field', function () {
        return myDirective;
    });

})(angular); 
