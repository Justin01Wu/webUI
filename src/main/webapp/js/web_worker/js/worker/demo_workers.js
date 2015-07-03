
if(console){
	console.log("inside demo_worker");
}

importScripts("../shared/shared.js");
// importScripts() use relative path to current js file, importScripts(relativeToCurrentJs), 
// rather than to general document , for example new worker(relativePathToDoc)

var i = 0;

function timedCount() {
    i = i + 1;
    postMessage(i);
    setTimeout("timedCount()",500);
}

timedCount();

globalX = "global X set in worker";

print();