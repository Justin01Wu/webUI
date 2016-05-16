/**
 * declare an angularJs directive "message.load" in module "directives" , type : element usage:
 * <message.load ></message.load>
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

        $scope.loadData = function () {
            $scope.service.loadData();
        };

        
    }
    
    var rootDir = _getCurrentPath();
    
    console.log("init messageLoad...");
    
    var myDirective = {
        restrict: 'E',       
        templateUrl: rootDir + 'messageLoad.html',

        controller: function ($scope, messageService) {
            _controller($scope, messageService);
        }

    };

    angular.module('directives',['myServices']).directive('message.load', function () {
        return myDirective;
    });

})(angular); 
