console.log("start of facetogif_in_modal.js");

App = Ember.Application.create({});

  navigator.getMedia = ( 
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      thisBrowserIsBad);
      
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

var mainbutton;

function thisBrowserIsBad() {
  track('streaming', 'not supported');
  var msg = findGifMessage('noSupport');
  alert(msg);
}

var facetogif = {
	
  gifSettings : {
    w : 0,
    h : 0,
    ms : 100,
    preset : 'normal'
  },

  recorderFrame : function() {
    var frame = {
      x : 0,
      y : 0,
      w : facetogif.gifSettings.w,
      h : facetogif.gifSettings.h
    };
    return frame;
  },
  
  canvas : null,
  video : null,
  initCanvas : function() {
    var c = facetogif.canvas;
    c.width = facetogif.gifSettings.w;
    c.height = facetogif.gifSettings.h;
    return c;
  },
  stream : null,
  gifContainer : null,
  controls : null,
  recIndicator : null,
  str : {
    STOP_STREAMING : "stop streaming",
    START_RECORDING : "start recording",
    STOP_RECORDING : "make gif",
    COMPILING : "\"it's compiling...\"",
    PAUSE : "||",
    RESUME : "►",
    OPTIMISING : "optimising"
  },

  displayGIF : function(img) {

    $("#gif-creator-container").hide();
    var article = document.createElement('article2');

    article.appendChild(img);
    article.appendChild(facetogif.controls.cloneNode(true));
    article.className = "generated-gif separate " + facetogif.gifSettings.preset;
    img.className = "generated-img";
    facetogif.gifContainer.appendChild(article);
  },

  blob : null,

  // it's not really an optimization, rather a re-export with very low quality,
  // using a different tool
  optimise : function(frames, callback) {
    // start with the second writer!
    var w = facetogif.secondWorker
        || (facetogif.secondWorker = new Worker('js/lib/gifwriter.worker.js'));
    w.onmessage = function(e) {
      var blob = new Blob([ e.data.bytes ], {
        type : 'image/gif'
      });
      callback(blob);
    }
    w.postMessage({
      imageDataList : frames.filter(function(e, i) {
        return !!i % 3
      }),
      width : facetogif.gifSettings.width,
      height : facetogif.gifSettings.height,
      paletteSize : 95,
      delayTimeInMS : facetogif.gifSettings.ms
    });
  },

  is_blob_too_big : function(blob, max) {
    return blob.size > (max || (2048 * 1024));
  }
};

var recorder = {
  state : 0,
  gif : null,
  interval : null,
  frames : [],
  ctx : null,
  states : {
    IDLE : 0,
    RECORDING : 1,
    PAUSED : 2,
    COMPILING : 3,
    FINISHED : 4,
    BUSY : 5
  },
  setBusy : function() {
    facetogif.video.dataset.state = recorder.state = recorder.states.BUSY;
  },
  setFinished : function() {
    recorder.state = recorder.states.FINISHED;
  },
  start : function() {
    facetogif.video.dataset.state = recorder.state = recorder.states.RECORDING;
    recorder.interval = setInterval(recorder_fn(recorder.ctx, recorder.gif,
        recorder.frames), facetogif.gifSettings.ms);
  },
  pause : function() {
    facetogif.video.dataset.state = recorder.state = recorder.states.PAUSED;
    clearInterval(recorder.interval);
  },
  compile : function(callback) {
    console.log("compile...");
    facetogif.video.dataset.state = recorder.state = recorder.states.COMPILING;
    recorder.gif.on('finished', function(blob) {
      console.log("compile finished");
      recorder.setFinished();
      console.log("blob size: ");
      console.log(blob.size);
      console.log(blob.type);
      callback(blob);
      delete facetogif.video.dataset.state;
    });
    console.log("start render...");
    recorder.gif.render();
  }

};

function recorder_fn(ctx, gif, frames) {
  var coords = facetogif.recorderFrame(), 
  drawW = facetogif.gifSettings.w, 
  drawH = facetogif.gifSettings.h;
  ctx.translate(coords.w, 0);
  ctx.scale(-1, 1);
  return function() {
    if (facetogif.video.src) {
      ctx.drawImage(facetogif.video, coords.x, coords.y, coords.w, coords.h);
      var frame = ctx.getImageData(0, 0, drawW, drawH);
      frames.push(frame);
      gif.addFrame(frame, {
        delay : facetogif.gifSettings.ms
      });
    }
    else {
      clearInterval(recorder.interval);
      facetogif.recIndicator.classList.remove('on');
      recorder.state = recorder.states.IDLE;
    }
  };
}

function compileGif() {
  console.log("compile gif...");
  mainbutton = document.getElementById('start-recording');

  mainbutton.classList.remove('recording');
  mainbutton.innerHTML = facetogif.str.COMPILING;
  recorder.pause();
  facetogif.recIndicator.classList.remove('on');
  mainbutton.classList.add('processing');
  mainbutton.parentNode.classList.add('busy');
  recorder.state = recorder.states.COMPILING;
  recorder.compile(function(blob) {
    var img = document.createElement('img');
    img.src = URL.createObjectURL(blob);

    facetogif.blob = blob;

    facetogif.displayGIF(img);
    mainbutton.removeAttribute('disabled');
    mainbutton.classList.remove('processing');
    mainbutton.parentNode.classList.remove('busy');
    mainbutton.innerHTML = facetogif.str.START_RECORDING;
    track('generated-gif', 'created');
  });
  track('recording', 'finished');
}

function countdown(node, callback) {
  var s = 3, fn;
  fn = function() {
    node.innerHTML = s;
    s--;
    if (s < 0) {
      callback();
    }else {
      setTimeout(fn, 1000);
    }
  };
  fn();
}

function track(msg, action) {
  console.log(msg + " " + action);
}

function gif_init() {
	
  console.log("gif_init...");
  
  // check if it is already inited...
  var firstButton = $('#put-your-face-here');
  if (firstButton.hasClass('init4569')) {
    console.log("gif_init is already done, so do nothing");
    return;
  }
  firstButton.addClass('init4569');
  if (navigator.appVersion.indexOf('MSIE') !== -1) {
    firstButton
        .text("Unfortunately, this feature is not supported in Internet Explorer 9");
    return;
  }
  
  facetogif.video = document.getElementById('video665');
  facetogif.gifSettings.w = facetogif.video.width;
  facetogif.gifSettings.h = facetogif.video.height;
  
  facetogif.controls = document.getElementById('controls-template');
  if (facetogif.controls) {
    facetogif.controls.parentNode.removeChild(facetogif.controls);
    facetogif.controls.removeAttribute('id');
  }

  facetogif.recIndicator = document.getElementById('recording-indicator');

  facetogif.canvas = document.createElement('canvas');
  facetogif.gifContainer = document.getElementById('gif-go-here');

};

function _initGifModal() {
  console.log('_initGifModal...');
  gif_init();

  // $('#gif-creator').off('shown', _initGifModal);
  // prevent multiple call on show event because modal is always hidden rather
  // than closing
};

var initEvent = false
function openGifCreator() {
  console.log('openGifCreator...');
  if (!initEvent) {
    $('#gif-creator').on('show', this._initGifModal);
    $('#gif-creator').on('shown', function() {
      if (facetogif.video) {
        console.log("restart video play");
        facetogif.video.play();
      }

    });
    initEvent = true;
  }
  $('#gif-creator').modal({show : true});
};

function hideGifModal(){
	$('#gif-creator').modal('hide');
}

function _removeGif() {
  console.log("remove generated-gif");
  var container = $('#gif-go-here');
  var img = container.find('.generated-img');
  img.src = null;
  facetogif.blob = null;
  container.empty();

  facetogif.video.parentNode.removeAttribute("style");

}

function findGifMessage(code) {
  return $('#messageBox').find("." + code).text();
}

function _startCamera(button) {
  track('streaming', 'request');
  navigator.getMedia({
    video : true
  },
  // successCallback
  function(stream) {
    track('streaming', 'start');
    button.innerHTML = facetogif.str.STOP_STREAMING;
    button.classList.add('streaming');
    if (!facetogif.video) {
      console.log("no video element, try to find it");
      facetogif.video = document.getElementById('video665');
    }
    facetogif.video.src = window.URL.createObjectURL(stream);
    facetogif.stream = stream;
    console.log('test why refresh...');
  },
  // errorCallback
  function(fail) {
    track('streaming', 'failed');
    console.log(fail);
    if (fail === 'NO_DEVICES_FOUND') {
      // alert("You cannot make a GIF without a camera. Sorry.");
      alert(findGifMessage('noCamera'));
    }
    else {
      // alert("Your camera is not working right now. Check nothing else is
      // using your camera and then try again.");
      alert(findGifMessage('cameraNotAvailable'));
    }
  });

}

function _stopCamera(button) {
  track('streaming', 'stop');
  facetogif.stream.stop();
  facetogif.stream = null;
  facetogif.video.removeAttribute('src');
  button.classList.remove('streaming');

}

function _startRecording(mainbutton) {
  track('recording', 'start');
  recorder.gif = new GIF({
    workers : 2,
    width : facetogif.gifSettings.w,
    height : facetogif.gifSettings.h,
    quality : 20,
    workerScript : 'resources/js/lib/facetogif/gif.worker.js'
  });
  recorder.setBusy();
  recorder.frames = [];
  recorder.ctx = facetogif.initCanvas().getContext('2d');

  facetogif.recIndicator.classList.add('on');
  mainbutton.innerHTML = facetogif.str.STOP_RECORDING;
  recorder.start();

  console.log("will stop recording in 3 seconds and start compile...");
  countdown(mainbutton, compileGif);

}

function switchCamera() {
  console.log('switchCamera...');
  var button = document.getElementById('put-your-face-here');
  if (button.classList.contains('clicked') && facetogif.stream) {
    _stopCamera(button);
  }
  else {
    _startCamera(button);
  }
  button.classList.toggle('clicked');
}

function startRecording() {
  console.log('startRecording...');
  var button = document.getElementById('start-recording');
  button.disabled = true;
  _startRecording(button);
}

function removeGif() {
  E.debug('removeGif...');
  _removeGif();
}

function insertGif() {
  console.log('insertGif...');
  if(facetogif == null || facetogif.blob == null ){
    console.log('no gif blob, so do nothing');
    return;
  }
  var targetGifBlob = facetogif.blob;
  alert(targetGifBlob.size());
  
  _removeGif();

  $('#gif-creator').modal('hide');
} 
