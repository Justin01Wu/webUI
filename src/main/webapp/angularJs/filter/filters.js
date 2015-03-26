/** declare some angularJs filters:  currency.usd currency.comma 
 * Justin Wu
 */

(function() {
	// use anonymous function to avoid JS global variable conflict
	
    'use strict';

    function numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
    
    angular.module('filters').filter('currency.usd', function() {
        return function (number, currencyCode) {
        	if(isNaN(number)){
        		return number;
        	} 
        	return "$"+number;
        };
    });

    angular.module('filters').filter('currency.comma', function() {
        return function (number, currencyCode) {
        	if(isNaN(number)){
        		return number;
        	}         	
        	return numberWithCommas(number);
        };
    });
    
    
}());  // directly run anonymous function 