
var user = {
	"name": "Justin Wu"
};

var userStats = { 
		"posts": 3
		};
		
$.mockjax({
	url: 'users/1',
	responseTime: 3000,
		//status: 404,
	contentType: 'application/json',
	responseText: JSON.stringify(user)
});

$.mockjax({
	url: 'userStats/1',
	responseTime: 2000,
	contentType: 'application/json',
	responseText: JSON.stringify(userStats)
});

