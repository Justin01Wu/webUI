
(function (angular) {
    'use strict';

    var myApp = angular.module('PersonApp', ['directives']);
    myApp.controller('PersonCtrl', PersonController);
    myApp.factory("personService", personService);

    function personService($http, $q) {
        return{
            
            getUrl: function(wrongDataFlag){
                if (wrongDataFlag) {
                    return "data/personList_noExist.json";
                }else{
                    return "data/personList.json";
                }                
            },
            
            getPerson: function (wrongDataFlag) {
                
                console.log("getting person data is called");
                
                var apiUrl = this.getUrl(wrongDataFlag);
                
                //Creating a deferred object
                var deferred = $q.defer();
                
                
                $http.get(apiUrl).success(function (data) {
                    //Passing data to deferred's resolve function on successful completion
                    console.log("getting person data is returned");
                    deferred.resolve(data);
                }).error(function () {
                    //Sending a friendly error message in case of failure
                    deferred.reject("An error occured while fetching person basic info");
                });

                //Returning the promise object
                return deferred.promise;
            }
        };
    }

    function PersonController($scope, personService  ) {

        $scope.person = {};
        $scope.loadPerson = function (wrongDataFlag) {
            console.log("loadPerson is called in controller");
            $scope.person = {};
            personService.getPerson(wrongDataFlag).then(
                    function (data) {
                        console.log("getting person data");
                        $scope.person = data;
                        $scope.errMsg = null;
                    },
                    function (errorMessage) {
                        console.log(errorMessage);
                        $scope.errMsg = errorMessage;
                    }
            );
        };

    }

})(angular); // close anonymous function
