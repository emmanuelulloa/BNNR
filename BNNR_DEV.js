var BNNR_DEV = {
go : function(id,type,opts){
	BNNR_DEV[type].register(id,opts).onchange = function(){
		document.getElementById('output_txt').value = BNNR_DEV[type].getCSS();
	}
},
Mouse : {
	_of : {x:0,y:0},//mouse offset
	_t : null,
	_hud : null,
	_createHUD : function(){
		var me = BNNR_DEV.Mouse;
		me._hud = document.createElement("div");
		me._hud.style.display = "block";
		me._hud.style.position = "absolute";
		me._hud.style.border = "1px solid white";
		me._hud.style.color = "white";
		me._hud.style.backgroundColor = "rgba(100,100,100,0.7)";
		me._hud.style.fontFamily = "arial";
		me._hud.style.fontSize = "10px";
		me._hud.style.zIndex = "1000";
		me._hud.style.width = "150px";
		me._hud.style.height = "10px";
		me._hud.style.top = "0px";
		me._hud.style.left = "0px";
		me._hud.style.padding = "10px 10px 10px 10px";
		me._hud.style.textAlign = "left";
		me._hud.style.fontWeight = "normal";
		me._hud.innerHTML = me.getPosition();
		me._t.parentNode.appendChild(me._hud);
	},
	getPosition : function(){
		var me = BNNR_DEV.Mouse;
		return "x: " + me.position.x + " y: " + me.position.y + " | x: " + Math.round(me.position.x/me._t.offsetWidth * 100) + "% y: " + + Math.round(me.position.y/me._t.offsetHeight * 100) + "%";
	},
	register : function(DOMElement){
		this._t = (typeof DOMElement == "string")?document.getElementById(DOMElement):DOMElement;
		document.onmousemove = function(event){
			event = event || window.event;
			var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
			var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
			BNNR_DEV.Mouse.position.x = event.clientX + scrollLeft - BNNR_DEV.Mouse._t.offsetLeft + BNNR_DEV.Mouse._of.x;
			BNNR_DEV.Mouse.position.y = event.clientY + scrollTop  - BNNR_DEV.Mouse._t.offsetTop  + BNNR_DEV.Mouse._of.y;
			BNNR_DEV.Mouse._hud.style.left = (BNNR_DEV.Mouse.position.x + 10) + "px";
			BNNR_DEV.Mouse._hud.style.top = (BNNR_DEV.Mouse.position.y + 10) + "px";
			BNNR_DEV.Mouse._hud.innerHTML = BNNR_DEV.Mouse.getPosition();
		}
		this._t.onmousedown = function(event){
			BNNR_DEV.Mouse.isDown = true;
			document.onmouseup = function(event){
				BNNR_DEV.Mouse.isDown = false;
				this.onmouseup = null;
			}
		}
		this._t.style.border = "2px dashed #1E90FF";
		this._createHUD();
	},
	setOffset : function(x,y){
		this._of.x = x;
		this._of.y = y;
	},
	getCSS : function(){
		return Mouse.getPosition();
	},
	isDown : false,
	position : {x:0,y:0}
},
//http://help.dottoro.com/ljslrhdh.php
//http://www.sitepoint.com/html5-file-drag-drop-read-analyze-upload-progress-bars/
Position : {
	_t : null,
	isDown : false,
	position : {width:0,height:0,x:0,y:0,image:"image.jpg"},
	scrollTop : 0,
	scrollLeft : 0,
	_hndl : {x:0,y:0},
	_of : {x:0,y:0},
	onchange : function(){},
	_setMouse : function(event){
		this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
		this.scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
		var x = event.clientX + this.scrollLeft - event.target.offsetLeft;
		var y = event.clientY + this.scrollTop  - event.target.offsetTop;
		BNNR_DEV.Position.position.x = x;
		BNNR_DEV.Position.position.y = y;
	},
	_move : function(){
		this._t.style.left = Math.round(this.position.x + (this.position.width  * this._hndl.x)) + "px";
		this._t.style.top  = Math.round(this.position.y + (this.position.height * this._hndl.y)) + "px";
	},
	unregister : function(DOMElement){
		var t = (typeof DOMElement == "string")?document.getElementById(DOMElement):DOMElement;
		t.style.border = 'none';
		t.parentNode.onmousedown = null;
	},
	register : function(DOMElement,opts){
		this._t = (typeof DOMElement == "string")?document.getElementById(DOMElement):DOMElement;
		BNNR_DEV.target = DOMElement;
		this._t.style.border = "3px dashed #FF00FF";
		this._t.style.display = "block";
		this._t.style.position = "absolute";
		if(this._t.src){
			this.position.image = this._t.src;
		}
		if(opts){
			if(opts.useGrid){
				this._t.parentNode.style.background = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAIUlEQVQYV2OMq7zlw0AEYAQpXNSutoWQ2lGFeEOI6OABAGfyJggVi5D1AAAAAElFTkSuQmCC) repeat";
			}
			if(opts.translateCoordinates){
				if(typeof opts.translateCoordinates == 'boolean'){
					this._of.x = parseInt(BNNR_DEV.CSS.getCSS(this._t.parentNode, "width"))/2;
					this._of.y = parseInt(BNNR_DEV.CSS.getCSS(this._t.parentNode, "height"))/2;	
				}else{
					this._of.x = opts.translateCoordinates.x;
					this._of.y = opts.translateCoordinates.y;
				}
				var axis = document.createElement("div");
				axis.style.background = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAK0lEQVQYV2NkQAOq/5n/g4RuM/5lRJZC4YAk6KgQZhW6W9H5jEQrHAK+BgAyPiRXTkXUggAAAABJRU5ErkJggg==) no-repeat";
				axis.style.display = "block";
				axis.style.position = "absolute";
				axis.style.width = "9px";
				axis.style.height = "9px";
				axis.style.top = this._of.y + "px";
				axis.style.left = this._of.x + "px";
				axis.style.zIndex = 1001;
				this._t.parentNode.appendChild(axis);
				var xpos = (isNaN(parseInt(BNNR_DEV.CSS.getCSS(this._t, "left"))))?0:parseInt(BNNR_DEV.CSS.getCSS(this._t, "left"));
				var ypos = (isNaN(parseInt(BNNR_DEV.CSS.getCSS(this._t, "top"))))?0:parseInt(BNNR_DEV.CSS.getCSS(this._t, "top"));
				this._t.style.left = (xpos + this._of.x) + "px";
				this._t.style.top = (ypos + this._of.y) + "px";
				this._t.parentNode.style.backgroundPosition = this._of.x + "px " + this._of.y + "px";
			}
		}
		this._t.parentNode.style.cursor = this._t.style.cursor = "crosshair";
		this._t.style.zIndex = 1000;
		if(opts && opts.handle){
			if(typeof opts.handle == "string"){
				switch(opts.handle.toUpperCase()){
					case "TL":
					case "CORNER1":
					this._hndl = {x:0,y:0};
					break;
					case "TR":
					case "CORNER2":
					this._hndl = {x:-1,y:0};
					break;
					case "BR":
					case "CORNER4":
					this._hndl = {x:-1,y:-1};
					break;
					case "BL":
					case "CORNER3":
					this._hndl = {x:0,y:-1};
					break;
					case "BC":
					case "BOTTOM":
					this._hndl = {x:-0.5,y:-1};
					break;
					case "TC":
					case "TOP":
					this._hndl = {x:-0.5,y:0};
					break;
					case "CL":
					case "LEFT":
					this._hndl = {x:0,y:-0.5};
					break;
					case "CR":
					case "RIGHT":
					this._hndl = {x:-1,y:-0.5};
					break;
					case "CENTER":
					case "MIDDLE":
					this._hndl = {x:-0.5,y:-0.5};
					break;
				}
			}else{
				this._hndl = opts.handle;
			}
		}
		this._t.parentNode.onmousedown = function(event){
			BNNR_DEV.Position.position.width = BNNR_DEV.Position._t.width || parseInt(BNNR_DEV.CSS.getCSS(BNNR_DEV.Position._t, "width"));
			BNNR_DEV.Position.position.height = BNNR_DEV.Position._t.height || parseInt(BNNR_DEV.CSS.getCSS(BNNR_DEV.Position._t, "height"));
			event = event||window.event;
			if(event.target == this){
				BNNR_DEV.Position.isDown = true;
				document.onmouseup = function(event){
					BNNR_DEV.Position.isDown = false;
					BNNR_DEV.Position._setMouse(event);
					BNNR_DEV.Position._move();
					BNNR_DEV.Position.onchange();
					document.onmouseup = null;
				}
			}
		}
		document.onkeyup = function(event){
			event = event||window.event;
			var speed = 1;
			if(event.shiftKey){
				speed = 10;
			}
			if(event.keyCode == 38){
				BNNR_DEV.Position.position.y -= speed;
			}
			if(event.keyCode == 40){
				BNNR_DEV.Position.position.y += speed;
			}
			if(event.keyCode == 37){
				BNNR_DEV.Position.position.x -= speed;
			}
			if(event.keyCode == 39){
				BNNR_DEV.Position.position.x += speed;
			}
			BNNR_DEV.Position._move();
			BNNR_DEV.Position.onchange();
		}
		return this;
	},
	getCSS : function(){
		var i = BNNR_DEV.Position.position.image.split("/");
		var name = i[i.length-1];
		var cname = (name)? "#" + name.split(".")[0] : ".myClass";
		var left = (parseInt(this._t.style.left)) - this._of.x;
		var top = (parseInt(this._t.style.top)) - this._of.y;
		var s = cname + " {\rbackground-image:url('images/"+name+"');\rbackground-repeat: no-repeat;\rposition:absolute;\rdisplay:block;\rwidth:"+this.position.width+"px;\rheight:"+this.position.height+"px;\rleft: "+left+"px;\rtop: "+top+"px;\r}";
		return s;
	}
},
Transform : {
	_t : null,
	_reg : null,
	_of : {x:0,y:0},
	isDown : false,
	transform : {scale:1,rotate:0,transformOrigin:"50% 50%"},
	position : {width:0,height:0,x:0,y:0,image:"image.jpg"},
	scrollTop : 0,
	scrollLeft : 0,
	_of : {x:0,y:0},
	dec : function(n,x){
		x = x||1000;
		return Math.round(n*x)/x;
	},
	_createHUD : function(){
		me = BNNR_DEV.Transform;
		me._reg = document.createElement("div");
		me._reg.style.display = "block";
		me._reg.style.position = "absolute";
		me._reg.style.border = "2px solid lime";
		me._reg.style.backgroundColor = "rgba(0,255,0,0.4)";
		me._reg.style.width = "6px";
		me._reg.style.height = "6px";
		me._reg.style.borderRadius = "4px";
		me._reg.style.zIndex = "1999";
		me._t.parentNode.appendChild(me._reg);
	},
	onchange : function(){},
	_setMouse : function(event){
		this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
		this.scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
		var x = event.clientX + this.scrollLeft - BNNR_DEV.Transform._t.offsetLeft - BNNR_DEV.Transform._t.parentNode.offsetLeft;
		var y = event.clientY + this.scrollTop  - BNNR_DEV.Transform._t.offsetTop - BNNR_DEV.Transform._t.parentNode.offsetTop;
		BNNR_DEV.Transform.position.x = x;
		BNNR_DEV.Transform.position.y = y;
	},
	_move : function(){
		var x = Math.round(this.position.x - 3 + BNNR_DEV.Transform._of.x);
		var y = Math.round(this.position.y - 3 + BNNR_DEV.Transform._of.y);
		this._reg.style.left = x + "px";
		this._reg.style.top = y + "px";
		var s = this.getTransform();
		this._t.style.WebkitTransform = s;
		this._t.style.msTransform = s;
		this._t.style.transform = s;
		var to = this.getTransformOrigin("%");
		console.log(to);
		this._t.style.WebkitTransformOrigin = to;
		this._t.style.msTransformOrigin = to;
		this._t.style.transformOrigin = to;
	},
	getTransformOrigin:function(unit){
		var s = "XPOSPER YPOSPER";
		if(unit == "px"){
			return s.replace(new RegExp('XPOS', 'g'),BNNR_DEV.Transform.position.x).replace(new RegExp('YPOS', 'g'),BNNR_DEV.Transform.position.y).replace(new RegExp('PER', 'g'),"px");
		}else if(unit == "%"){
			return s.replace(new RegExp('XPOS', 'g'),Math.round(BNNR_DEV.Transform.position.x/BNNR_DEV.Transform.position.width * 100)).replace(new RegExp('YPOS', 'g'),Math.round(BNNR_DEV.Transform.position.y/BNNR_DEV.Transform.position.height * 100)).replace(new RegExp('PER', 'g'),"%");
		}
	},
	getTransform:function(){
		return "scale(" + BNNR_DEV.Transform.dec(BNNR_DEV.Transform.transform.scale) + ") rotate(" + BNNR_DEV.Transform.transform.rotate + "deg)";
	},
	register : function(DOMElement,opts){
		this._t = (typeof DOMElement == "string")?document.getElementById(DOMElement):DOMElement;
		this._t.parentNode.onmousedown = function(event){
			BNNR_DEV.Transform.position.width = BNNR_DEV.Transform._t.width || parseInt(BNNR_DEV.CSS.getCSS(BNNR_DEV.Transform._t, "width"));
			BNNR_DEV.Transform.position.height = BNNR_DEV.Transform._t.height || parseInt(BNNR_DEV.CSS.getCSS(BNNR_DEV.Transform._t, "height"));
			BNNR_DEV.Transform._of.x = parseInt(BNNR_DEV.CSS.getCSS(BNNR_DEV.Transform._t, "left"));
			BNNR_DEV.Transform._of.y = parseInt(BNNR_DEV.CSS.getCSS(BNNR_DEV.Transform._t, "top"));
			if(!BNNR_DEV.Transform._reg){
				BNNR_DEV.Transform._createHUD();
			}
			event = event||window.event;
			BNNR_DEV.Transform.isDown = true;
			document.onmouseup = function(event){
				BNNR_DEV.Transform.isDown = false;
				BNNR_DEV.Transform._setMouse(event);
				BNNR_DEV.Transform._move();
				BNNR_DEV.Transform.onchange();
				document.onmouseup = null;
			}
		}
		if(opts){
			if(opts.useGrid){
				this._t.parentNode.style.background = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAJ0lEQVQYV2O8f//+fwY0oKCggC7EwDgUFP4HAnSXP3jwANMzQ0AhAMn6NQNyREcSAAAAAElFTkSuQmCC) repeat";
			}
		}
		document.onkeyup = function(event){
			event = event||window.event;
			var speed = 1;
			if(event.shiftKey){
				speed = 10;
			}
			if(event.keyCode == 38){
				BNNR_DEV.Transform.transform.scale += (speed/100);
			}
			if(event.keyCode == 40){
				BNNR_DEV.Transform.transform.scale -= (speed/100);
			}
			if(event.keyCode == 37){
				BNNR_DEV.Transform.transform.rotate += speed;
			}
			if(event.keyCode == 39){
				BNNR_DEV.Transform.transform.rotate -= speed;
			}
			BNNR_DEV.Transform._move();
			BNNR_DEV.Transform.onchange();
		}
		this._t.style.border = "3px dashed lime";
		this._t.style.display = "block";
		this._t.style.position = "absolute";
		if(this._t.src){
			this.position.image = this._t.src;
		}
		this._t.parentNode.style.cursor = this._t.style.cursor = "crosshair";
		this._t.style.zIndex = 999;
		var to = "50% 50%";
		this._t.style.WebkitTransformOrigin = to;
		this._t.style.msTransformOrigin = to;
		this._t.style.transformOrigin = to;
		var s = this.getTransform();
		this._t.style.WebkitTransform = s;
		this._t.style.msTransform = s;
		this._t.style.transform = s;
		return this;
	},
	getCSS : function(){
		var px = BNNR_DEV.Transform.getTransformOrigin("px");
		var pc = BNNR_DEV.Transform.getTransformOrigin("%");
		var s1 = "-ms-transform-origin: "+px+";\r-webkit-transform-origin: "+px+";\r-moz-transform-origin: "+px+";\rtransform-origin: "+px+";\r";
  		var s2 = "-ms-transform-origin: "+pc+";\r-webkit-transform-origin: "+pc+";\r-moz-transform-origin: "+pc+";\rtransform-origin: "+pc+";\r"; 
  		var t = "-ms-transform: " + this.getTransform() + ";\r-webkit-transform: " + this.getTransform() + ";\r-moz-transform: " + this.getTransform()+";\r";
		var i = BNNR_DEV.Transform.position.image.split("/");
		var s = ".myClass {\rbackground-image:url('"+i[i.length-1]+"');\rbackground-repeat: no-repeat;\rposition:absolute;\rdisplay:block;\rwidth:"+this.position.width+"px;\rheight:"+this.position.height+"px;\rleft: "+BNNR_DEV.Transform._of.x+"px;\rtop: "+BNNR_DEV.Transform._of.y+"px;\r"+s1+"/* OR */\r"+s2+"\r"+t+"}";
		return s;
	}
},
CSS : {
	getCSS : function (elem, field) {
		var css = document.defaultView && document.defaultView.getComputedStyle ?
			document.defaultView.getComputedStyle(elem, null)
			: elem.currentStyle || elem.style;
		return css[field];
	},
},
target : null,
loadImage : function(event,files){
	if(BNNR_DEV.target != null){
		BNNR_DEV.Position.unregister(BNNR_DEV.target);
	}
	event = window.event || event;
	var img = document.createElement('img');
	var _name = files[0].name || files[0].fileName;
	console.log(_name)
	img.src = 'images/' + _name;
	img.id = _name.split('.')[0];
	var container = document.getElementById('container');
	if(container == null){
		window.alert("You need a DIV element with id 'container'");
		return;
	}
	container.appendChild(img);
	BNNR_DEV.go(img.id,'Position');
},
UI : function(){
	var container = document.createElement('DIV'),
		size = window.prompt('What is the size of the container?','800x600').split('x'),
		w = size[0],
		h = size[1];
	container.style.border = '1px solid black'
	container.style.overflow = 'hidden';
	container.style.display = 'block'; 
	container.style.width = w + 'px';
	container.style.height = h + 'px';
	container.id = 'container';
	var myUI = document.createElement('DIV');
	myUI.id = 'myUI';
	myUI.style.align = 'right';
	myUI.style.position = 'relative';
	myUI.style.display = 'block';
	myUI.style.clear = 'both';
	myUI.innerHTML = '<form id="myForm"><textarea id="output_txt" rows="8" cols="50"></textarea><br /><input type="file" onchange="BNNR_DEV.loadImage(event,this.files)" /></form>';
 	document.body.appendChild(container);
 	document.body.appendChild(myUI);
}
};
