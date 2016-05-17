/**
 * declare an angularJs directive "country.field" in module "directives" , type : element usage:
 * <country.field field="person.citizen" read-only="true"></country.field>
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
    
    function setOptions($scope, countryList) {
        var oldCountryList = $scope.countryList;
        console.log("got all country: " + countryList.length);
        var foundSelectedItem = false;
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
            if($scope.selectedCountryId === undefined){
                foundSelectedItem =  true;
            }else{
                if($scope.selectedCountryId.toString() === oneCountry.id.toString()){
                    foundSelectedItem =  true;
                }                
            }
                
        }
        if(!foundSelectedItem){
            $scope.errMsg = "can't found selectedCountryId: " + $scope.selectedCountryId;
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
        
        $scope.loading=true;
        countryService.getCountryList().then(
                function (data) {
                    console.log("getting country list data");
                    $scope.loading=false;
                    $scope.errMsg = null;
                    setOptions($scope, data);
                    
                },
                function (errorMessage) {
                    $scope.loading=false;
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
        
        $scope.displaySelect = function () {
            if($scope.loading){
                return false;
            }
            if($scope.readOnly=="true"){
                return false;
            }            
            if($scope.selectedCountryId===999){
                return false;
            }
            if($scope.errMsg){
                return false;
            }
            
            return true;
        };
                
        $scope.displayText = function () {
            if($scope.loading){
                return false;
            }
            if($scope.readOnly =="false"){
                return false;
            }   
            if($scope.selectedCountryId===999){
                return false;
            }
            if($scope.errMsg){
                return false;
            }            
            return true;
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
            selectedCountryId: '=field',
            readOnly: '@readOnly'
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
