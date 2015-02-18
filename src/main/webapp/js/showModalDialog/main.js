// fix for deprecated method in Chrome 37
  if (!window.showModalDialog) {
     window.showModalDialog = function (arg1, arg2, arg3) {

        var w;
        var h;
        var resizable = "no";
        var scroll = "no";
        var status = "no";

        // get the modal specs
        var mdattrs = arg3.split(";");
        for (i = 0; i < mdattrs.length; i++) {
           var mdattr = mdattrs[i].split(":");

           var n = mdattr[0];
           var v = mdattr[1];
           if (n) { n = n.trim().toLowerCase(); }
           if (v) { v = v.trim().toLowerCase(); }

           if (n == "dialogheight") {
              h = v.replace("px", "");
           } else if (n == "dialogwidth") {
              w = v.replace("px", "");
           } else if (n == "resizable") {
              resizable = v;
           } else if (n == "scroll") {
              scroll = v;
           } else if (n == "status") {
              status = v;
           }
        }

        var left = window.screenX + (window.outerWidth / 2) - (w / 2);
        var top = window.screenY + (window.outerHeight / 2) - (h / 2);
        var targetWin = window.open(arg1, arg1, 'toolbar=no, location=no, directories=no, status=' + status + ', menubar=no, scrollbars=' + scroll + ', resizable=' + resizable + ', copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
        targetWin.focus();
     };
  }
  

  function showModal(){
	  var url = "dialog.html";
	  var features='dialogHeight:300px; dialogWidth:300px';
	  window.showModalDialog(url,window,features);
		  
  }

//  function _openDialogWindow(windowId,url,width,height,scrollbars){
//  	var scroll=0;
//  	if(scrollbars) scroll=scrollbars;
//  	var iLeft = (window.screen.width - width) / 2;
//  	var iTop = (window.screen.height - height) / 2;
//      var docUrl = document.URL;	
//      url=docUrl.substr(0, docUrl.lastIndexOf('/')+1)+url;
//      var features='dialogHeight:'+height+'px; dialogWidth:'+width+'px'
//  			+';dialogTop:' + iTop + 'px; dialogleft:' + iLeft+'px'
//  			+'; scroll:'+scroll+'; resizable:1;'+' status:1; unadorned:1';
//  	window.showModalDialog(url,window,features);
//  			
//  	//CCD: 27-Jun-08 - return the window - required for testing
//  }