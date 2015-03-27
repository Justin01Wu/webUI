
var channel = {
	"name": "fake channel"
};

var postIds = [
             { "id": 1},
             { "id": 2},
             { "id": 3}
           ];

var post1 = { 
		"id": 1, 
		"title": "dkdflg dsf",
		"text": "text text text3456"
		};
		
var post2 = { 
		"id": 2, 
		"title": "dskfjkl",
		"text": "4364fddsf"
		};
		
var post3 = { 
		"id": 3, 
		"title": "dgf",
		"text": "kghj"
		};		

$.mockjax({
	url: 'getPostItem/1',
	responseTime: Math.floor((Math.random()*5)+1)*1300,
	contentType: 'application/json',
	responseText: JSON.stringify(post1)
});

$.mockjax({
	url: 'getPostItem/2',
	responseTime: Math.floor((Math.random()*5)+1)*1300,
	contentType: 'application/json',
	responseText: JSON.stringify(post2)
});

$.mockjax({
	url: 'getPostItem/3',
	status: 404,
	responseTime: Math.floor((Math.random()*5)+1)*1300,
	contentType: 'application/json',
	responseText: JSON.stringify(post3)
});

$.mockjax({
	url: 'getChannel',
	responseTime: 2000,
	contentType: 'application/json',
	responseText: JSON.stringify(channel)
});

$.mockjax({
	url: 'getPosts',
	responseTime: 2000,
	contentType: 'application/json',
	responseText: JSON.stringify(postIds)
});




