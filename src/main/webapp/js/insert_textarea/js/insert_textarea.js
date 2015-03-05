

function insertStr2Textarea(id, value){
	var myTextArea = $(id);
	
	if(myTextArea[0].selectionStart == null) {
		// IE browser IE8- doesn't support selectionStart
		alert('no support for selectionStart, so skip'); 
		return;
	}
	
	var selectionStart = myTextArea[0].selectionStart;
	var selectionEnd = myTextArea[0].selectionEnd;

  var origStr = myTextArea.val();
  
  var firstPart = origStr.substring(0, selectionStart);
  var secondPart = origStr.substring(selectionEnd);

  var targetStr = firstPart + value + secondPart;
  myTextArea.val(targetStr);
	myTextArea[0].selectionStart = selectionStart + value.length;
	myTextArea[0].selectionEnd = selectionEnd + value.length;
}

