# Browser cache mechanism

 - But IE and Firefox will show you which line of JS code
 - Browser will follow Cache-Control related setting if it exists, like Cache-Control, Pragma, Expires...
 - Chrome will load data directly from cache if the file has no Cache-Control related setting and it is not too old(like less than one minute), the http
 - status is 200 with memoryCache flag
 - Chrome ask web server to check if file is changed if it is too old from last loading(like more than one minute), no matter if the file has no CacheControl related setting
 - Chrome will get the http status 304 with 0.2 k data return if the server side say it is not changed(comparing eTag)
 - Chrome will get the http status 200 with real data return and real size if the server side say it is changed(comparing eTag)
 - JSP and JSF has no eTag, so browser will load data every time , no matter if it has setting or not
  <img src="browser_cache\image-2025-9-29_19-26-54.png">	
   <img src="browser_cache\image-2025-9-29_20-10-48.png">	