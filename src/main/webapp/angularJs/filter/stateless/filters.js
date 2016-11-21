/** declare some angularJs filters:  userIdToName
 * Justin Wu
 */

(function() {
	// use anonymous function to avoid JS global variable conflict
	
    'use strict';

    
    angular.module('filters').filter('userIdToName', function() {
        return function (userId) {
            console.log("userId = " + userId);
        	if(isNaN(userId)){
        		return userId;
        	} 
                if(userId == "2"){
                    return "Justin";    
                }else if(userId == "3"){
                    return "Rita";    
                }else{
                    return "Unknown";
                }
        	
        };
    });
    
}());  // directly run anonymous function 