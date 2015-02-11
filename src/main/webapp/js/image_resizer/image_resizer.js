
var ImageResizer = {
	maxGifError:"validate.fileSizeGif",
	error_validType:"validate.extension",
	
	MAX_WIDTH:720,
	MAX_HEIGHT:720,
	MAX_SIZE:20*1024,
	MAX_GIF_SIZE:2000*1024,
	
	_canvas:null,
	_origImg:null,
	_origFile:null,
	_targetFileType:null,
	_dataurl:null,
	_ctx:null,
	
	_reset:function(){
		this._canvas=null;
		this._origImg=null;
		this._origFile=null;
		this._dataurl=null;
		this._ctx=null
	},
	
	setup:function(readerEvent, file){
        // var o = readerEvent;
        // var n = file;
		console.log("image_resizer->setup");
		this._reset();
		if(file.type.match("image/gif")){
			if(file.size>this.MAX_GIF_SIZE){
				return new Error(this.maxGifError)
			}else{
				console.log("can't compress GIF file, so just use original image ");
				this._passOrigImage(readerEvent, file);
				return
			}
		}else{
			if(!file.type.match("image/jpeg") && !file.type.match("image/png")){
				alert("file must be an image");
				return new Error(this.error_validType);
				return
			}
		}if(file.size<this.MAX_SIZE){
			console.log("original file size < MAX_SIZE, so just use original image ");
			this._passOrigImage(readerEvent, file);
			return
		}
		console.log("original file size > MAX_SIZE, so going to compress image ");
		var img = new Image;
		img.src = readerEvent.target.result;
		this._origImg = img;
		this._origFile = file;
		var l = this;
		img.onload=function(){
			l._resize()
		}
	},
		
	_passOrigImage:function(m,l){
		this._dataurl=m.target.result;
		this._origFile=l;
		this._targetFileType=this._origFile.type;
		this._handleFinalResult()
	},
		
	_handleFinalResult:function(){
		var blob=this._dataURItoBlob(this._dataurl);
		console.log("targetFile.size = " + blob.size);
		this.handleFinalResult(blob, this._dataurl)
	},
	
	handleFinalResult:function(blob, targetUrl){
		alert("code error, need to initialize handleFinalResult")
	},
		
	_targetSize:function(){
		if(!this._dataurl){
			this._dataurl=this._canvas.toDataURL(this._origFile.type);
			this._targetFileType=this._origFile.type
		}
		var m="data:image/png;base64,";
		var l=(this._dataurl.length-m.length)*3/4;
		console.log("size = "+l);
		return l
	},
		
	_handleBigJpeg:function(){
		console.log("_handleBigJpeg..");
		var l=this._getDefaultQuality();
		this._increaseCompression(l-0.1)
	},
											
	_handleBigPng:function(){
		console.log("png file, so detect transparency firstly ");
		var p=this._ctx.getImageData(0,0,this._canvas.width,this._canvas.height).data;
		var o=false,l=0;for(var n=3;n<p.length;n+=4){
			if(p[n]==0){
				o=true;
				l=Math.floor(n/4);
				break
			}
		}
		if(o){
			console.log("Has transparency at "+l);
			console.log("so have to submit big file ");
			this._handleFinalResult()
		}else{
			console.log("no transparency, so convert to jepg ");
		this._dataurl=this._canvas.toDataURL("image/jpeg");
		this._targetFileType="image/jpeg";
		var m=this._targetSize();
		if(m<this.MAX_SIZE){
			this._handleFinalResult();
			return
			}
		else{
			this._handleBigJpeg()
			}
		}
	},
												
	_getDefaultQuality:function(){
		var l=1;for(var m=0;m<100;m++){
			var o=parseFloat((l).toFixed(2));
			var n=this._canvas.toDataURL("image/jpeg",o);
			if(n==this._dataurl){console.log("The default quality value is: "+o);
			return o
		}
			l=l-0.01
		}
		return 1
	},
													
	_dataURItoBlob:function(m){
		var r=atob(m.split(",")[1]);
		var l=m.split(",")[0].split(":")[1].split(";")[0];
		var q=new ArrayBuffer(r.length);
		var o=new Uint8Array(q);
		for(var p=0;p<r.length;p++){
			o[p]=r.charCodeAt(p)
		}
		var n=new Blob([q],{type:l});
		return n
	},
															
	_increaseCompression:function(m){
		console.log("decrease quality of jpeg image to: "+m);
		this._dataurl=this._canvas.toDataURL("image/jpeg",m);
		this._targetFileType="image/jpeg";
		var l=this._targetSize();
		if(l<this.MAX_SIZE){
			this._handleFinalResult();
			return
		}else{
			if(m>0.2){
			this._increaseCompression(m-0.1)
			}else{
				console.log("quality is too low, now have to submit ");
				this._handleFinalResult()
			}
		}
	},
																
	_resize:function(){
		console.log("original width = "+this._origImg.width);
		console.log("original height = "+this._origImg.height);
		this._canvas=document.createElement("canvas");
		this._setCanvasSize();
		this._ctx=this._canvas.getContext("2d");
		this._ctx.drawImage(this._origImg,0,0,this._canvas.width,this._canvas.height);
		var l=this._targetSize();
		if(l<this.MAX_SIZE){
			this._handleFinalResult();
			return
		}
		if(this._origFile.type==="image/png"){
			this._handleBigPng()
		}else{
			this._handleBigJpeg()
		}
	},
				
	_setCanvasSize:function(){
		var m=this._origImg.width;
		var l=this._origImg.height;
		if(m>=l){
			if(m>this.MAX_WIDTH){
				l*=this.MAX_WIDTH/m;m=this.MAX_WIDTH
			}
		}else{
			if(l>this.MAX_HEIGHT){
				m*=this.MAX_HEIGHT/l;
				l=this.MAX_HEIGHT
			}
		}
		this._canvas.width=m;this._canvas.height=l;
		console.log("target image width = "+m);
		console.log("target image height = "+l)
	}
	
	
}


window.uploadPhotos = function(event){
    // Read in file
    var file = event.target.files[0];

    // Ensure it's an image
    if(file.type.match(/image.*/)) {
    	
        console.log('An image has been loaded');

        // Load the image
        var reader = new FileReader();
        reader.onload = function (readerEvent) {
        	ImageResizer.setup(readerEvent, file);
        	
        	ImageResizer.handleFinalResult = function(blob, targetUrl){
        		document.getElementById('targetImg').src = targetUrl;
        		document.getElementById('infoLabel').innerHTML = 'original file size: ' + file.size + '    target file size: ' + blob.size;
        	};
        }
        reader.readAsDataURL(file);
    }
}

