
/**
 * 
 * @param {type} angular
 * @returns {undefined}
 * learn from here:
 *   http://stackoverflow.com/questions/35902264/angularjs-multiple-directive-instances-making-xhr-call-multiple-times
 */
(function (angular) {
    'use strict';

    angular.module('myServices', []).service('countryService', countryService);
    return;

    function countryService($http, $q) {
        return {
            getCountryList: getCountryList
        };
        
        function getCountryList() {

            console.log("getting country list is called");

            var apiUrl = getUrl();

            //Creating a deferred object
            var deferred = $q.defer();


            $http.get(apiUrl).success(function (data) {
                //Passing data to deferred's resolve function on successful completion

                if ("file:" === window.location.protocol) {
                    // now simulate slow loading, delay response for [8-9.5] seconds
                    var waitTime = Math.floor((Math.random() * 1500) + 8000);
                    console.log("loading countryList waiting time: " + waitTime);
                    setTimeout(function () {
                        deferred.resolve(data);
                        console.log("getting country list data is returned");
                    }, waitTime);
                } else {
                    deferred.resolve(data);
                    console.log("getting country list data is returned");
                }

            }).error(function () {
                //Sending a friendly error message in case of failure
                deferred.reject("An error occured while fetching country list info");
            });

            //Returning the promise object
            return deferred.promise;
        }

        function getUrl() {
            if (window.wrongCountryDataFlag) {
                return "data/countryList_wrong.json";
            } else {
                return "data/countryList.json";
            }
        }
    };


})(angular);     