angular.module('demoApp', []).controller('DemoController', function($scope) {

  $scope.options = [
    { label: 'one', value: 1 },
    { label: 'two', value: 2 }
  ];
    
  // Although this object has the same properties as the one in $scope.options,
  // Angular considers them different because it compares based on reference
  $scope.incorrectlySelected = { label: 'two', value: 2 };
    
  // Here we are referencing the same object, so Angular inits the select box correctly
  $scope.correctlySelected = $scope.options[1];
});
