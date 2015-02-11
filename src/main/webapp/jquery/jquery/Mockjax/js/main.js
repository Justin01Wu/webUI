// Normal ajax request in your application
$.ajax({
	url: '/test/inline',
	dataType: 'json',
	success: function(json) {
		alert('You said: ' + json.say);
	}
});