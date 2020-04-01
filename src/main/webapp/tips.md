# General web development tips

## Browser

 - In Chrome (version 38 -40, didn't try others), the exception comes from JOSN.parse won't show up which line of JS code it comes from.
But IE and Firefox will show you which line of JS code

 - IE(5-11) always cache AJAX response until you explicitly appending a query string parameter "_=[TIMESTAMP]"
 which means jQuery.ajax({cache: false, ... 
 other browser never cache  AJAX response

 - when a page has multiple frame in frame set, you need to choose correct frame in Chrome console to run command properly,
 it is a drop down list on the top of Chrome console

 - Chrome will send an error status 0 when browser cancelled a request
(it often happens when user click a link to go to another page before an AJAX request return)
So your code need to handle it if you are using jQuery:
```javascript

jQuery.ajax({
	url : ...,
	dataType : 'json',
	success : function(json) {
		...
	},
	error: function(jqXHR,error, errorThrown) {
		
		//If either of these are true, then it's not a true error and we don't care
		if (jqXHR.status === 0 || jqXHR.readyState === 0) {
			console.error("browser canceled request: " + self.apiUrl );
			return;
		}
		var msg = "loading all clients error with status: " + jqXHR.status;
		console.error(msg);
		//alert(msg);  // this one will block JS execuation, so remove it
		jQuery("#userColumn").addClass("hasError");
	}
		
```		

 - download behavior:
```xml
	<a href="/images/a.jpg" download />
```
 
 With 'download' , chrome and FireFox are silently download,  but IE still open it in the page

 After set attachment, chrome and FireFox are still silently downloading, but IE ask "do you want to open or save..."
 for attachment, IE will automatically close window which is opened by target="_blank", but chrome and FireFox won't close it.

 - console.log
    
Basically IE browser doesn’t have console object if users didn’t open developer console.
So any code are using console.log or warn will fail.

To stop this , JavaScript code must have this dummy definition in the beginning:
```javascript

if (!window.console) {
	   window.console = {
			 log : function() {},
			 warn : function() {},
			 error : function() {}
	   };
}
	
```	

By the way, some JS library has some kind of logging service, but none of them can be traced by browser: 
In some browser, console.log will automatically write down which line of which file generate the log.
You can click on it to open related code

## IDE
+ Eclipse (some version) always set JavaScript build path to src\main\webapp when import a maven project, 
     if your JavaScript is not there, you need manually add it 
     otherwise you will get this error when click the link of  a JavaScript function:     
       "the source is not on the include path of a JavaScript project"
       
     you can change it Project Explorer view, right-click the required project and select Properties | JavaScript | JavaScript Libraries.
+ Eclipse give up JavaScript supporting since 2019, Please see here](https://bugs.eclipse.org/bugs/show_bug.cgi?id=530728) 

##  Run without a server

 To run your web page on your local , you have to disable some browser security setting
###   In Chrome: 
You can add some parameter to disable it: 
```shell
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --allow-file-access-from-files --disable-web-security
```    
Since Chrome 49, the command is:
```shell
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --allow-file-access-from-files --disable-web-security --user-data-dir
```
### In Firefox: 
        Go to about:config
        Find security.fileuri.strict_origin_policy parameter
        Set it to false
		
## Run with a server
+ This project already has Java web project setting, you just need to package and deploy it
+ You can also use IDE like Eclipse to run it
+ You can use this command in the target folder to start a web server if you have NodeJs installed: `npx serve`	
+ Please see serve details from here https://www.npmjs.com/package/serve	
		 
	 
