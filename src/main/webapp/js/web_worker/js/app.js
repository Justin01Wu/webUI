// depends on js/demo_workers.js

var w;

function startWorker() {

	globalY = "global Y set in main";
	print();

	if (typeof (Worker) !== "undefined") {
		if (typeof (w) == "undefined") {
			w = new Worker("js/demo_workers.js");
		}
		w.onmessage = function(event) {
			document.getElementById("result").innerHTML = event.data;
		};
	} else {
		document.getElementById("result").innerHTML = "Sorry! No Web Worker support.";
	}
}

function stopWorker() {
	w.terminate();
	w = undefined;
}