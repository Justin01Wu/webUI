function customersController($scope) {

	var mockDataForThisTest = [ {
		id : 1,
		name : "Justin Wu",
		country : "USA"
	}, {
		id : 2,
		name : "Rita Wang",
		country : "Canada"
	}, {
		id : 3,
		name : "Yan",
		country : "China"
	}];

	$scope.people = mockDataForThisTest;
	
	$scope.addMorePeople = function() {
		
		for(var i=0;i<1000;i++){
			var newPerson ={
				id: i+12,
				name: "p"+i,
				country: "country"+i
			};
			$scope.people.push(newPerson);
		}
	    
	};
}