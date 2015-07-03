
if(console){
	console.log("inside demo_worker");
}

importScripts("shared/shared.js");

var i = 0;

function timedCount() {
    i = i + 1;
    postMessage(i);
    setTimeout("timedCount()",500);
}

timedCount();

globalX = "global X set in worker";

print();