/**
 * declare an angularJs directive "message.summary" in module "directives" , type : element usage:
 * <message.summary ></message.summary>
 * 
 *  It depends on messageService.js, angularJs ;
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
    
    function _controller($scope, messageService) {
        
        $scope.service = messageService;
    }
    
    var rootDir = _getCurrentPath();
    
    console.log("init messageSummary...");
    
    var myDirective = {
        restrict: 'E',       
        templateUrl: rootDir + 'messageSummary.html',

        controller: function ($scope, messageService) {
            _controller($scope, messageService);
        }

    };

    // this is second directive in the same module, so you can't add  dependency like this :  angular.module('directives',['myServices'])
    // you have to remove dependency, otherwise it will overwrite first module
    //  http://stackoverflow.com/questions/20077273/angularjs-two-directives-with-the-same-module-name
    angular.module('directives').directive('message.summary', function () {
        return myDirective;
    });

})(angular); 
