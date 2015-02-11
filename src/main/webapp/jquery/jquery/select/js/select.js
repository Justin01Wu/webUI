

function selectByOptionValue(){
	var myOption = $('.selDiv option[value="CN"]');
	alert(myOption.text() + "-" +myOption.val());
}

function selectByOptionIndex(){
	var myOption = $('.selDiv option:eq(2)');
	//  get 2nd option in the whole list
	alert(myOption.text() + "-" +myOption.val());
}

function selectByLabel(){
	var myOption = $('.selDiv option:contains("China")');
	alert(myOption.text() + "-" +myOption.val());
}

function displaySelected(){
	var myOption = $( ".selDiv option:selected" );
	alert(myOption.text() + "-" + $("#myselect" ).val());
}

function setCanada(){
	$('.selDiv option:eq(1)').prop('selected', true)
}



