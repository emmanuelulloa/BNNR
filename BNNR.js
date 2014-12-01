//http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
(function() {
	var lastTime = 0;
	var vendors = ['webkit', 'moz'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame =
		  window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); },
			  timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());
//Animation Framework by Emmanuel Ulloa
(function(window){
'use strict';
//INIT TICKER
if(!window.BNNR_TICKER){
	window.BNNR_TICKER = {
		_tickers : [],
		qty : 0,
		currentFrame : 0,
		addTicker : function(t){
			BNNR_TICKER.qty = BNNR_TICKER._tickers.push(t);
		},
		removeTicker : function(t){
			var l = BNNR_TICKER._tickers.length;
			var i = 0;
			while(l){
				if(t === BNNR_TICKER._tickers[i]){
					--BNNR_TICKER.qty;
					return BNNR_TICKER._tickers.splice(i, 1);
				}
				++i
				--l;
			}
			return;
		},
		tick : function(){
			var l = BNNR_TICKER.qty;
			while(l){
				BNNR_TICKER._tickers[--l].tick();
			}
			++BNNR_TICKER.currentFrame;
			requestAnimationFrame(BNNR_TICKER.tick);
		}
	};
	requestAnimationFrame(BNNR_TICKER.tick);
}
var BNNR = window.BNNR || function(){
var eu = window.eu || {};
eu = {
	setTo : function(id,prop,value){
		var x = eu.getAsArray(id), k = eu.getAsArray(prop), v = eu.getAsArray(value);
		for (var i=0, y = x.length; i < y; i++){
			var p = eu.getParticle(x[i]);
			for(var j=0, l=k.length; j < l; j++){
				p.style(k[j],v[j]);
			}
		}
		return this;
	},
	getTween : function(id,prop,to,duration,params){
		var c = [];
		if(to.push){
			for(var i = 0; i < to.length; i++){
				c.push('current');
			}
		}else{
			c.push('current');
		}
		return new eu.Tween(id,prop,c,to,duration,params);
	},
	tweenTo : function(id,prop,from,to,duration,params){
		if(params){
			if(params.autoPlay !== undefined){
				if(!params.autoPlay){
					return new eu.Tween(id,prop,from,to,duration,params);
				}
			}
		}
		if(eu._twUtls._tAP){
			return new eu.Tween(id,prop,from,to,duration,params).start();
		}
		return new eu.Tween(id,prop,from,to,duration,params);
	},
	moveTo : function(id,x,y,duration,params){
		return eu.tweenTo(id,["translateX","translateY"], ["current","current"], [x,y], duration, params);
	},
	xTo : function(id,x,duration,params){
		return eu.tweenTo(id,"translateX", "current", x, duration, params);
	},
	yTo : function(id,y,duration,params){
		return eu.tweenTo(id,"translateY", "current", y, duration, params);
	},
	xSkewTo : function(id,x,duration,params){
		return eu.tweenTo(id,"skewX", "current", x, duration, params);
	},
	ySkewTo : function(id,y,duration,params){
		return eu.tweenTo(id,"skewY", "current", y, duration, params);
	},
	scaleTo : function(id,scale,duration,params){
		return eu.tweenTo(id,"scale","current",scale,duration,params);
	},
	rotateTo : function(id,rotate,duration,params){
		return eu.tweenTo(id,"rotate","current",rotate,duration,params);
	},
	fadeTo : function(id,opacity,duration,params){
		return eu.tweenTo(id,"opacity","current",opacity,duration,params);
	},
	fadeIn : function(id,duration,params){
		duration = duration || 'fast';
		return eu.tweenTo(id,"opacity",0,1,duration,params);
	},
	fadeOut: function(id,duration,params){
		duration = duration || 'slow';
		return eu.tweenTo(id,"opacity",1,0,duration,params);
	},
	bgPositionTo : function(id,to,duration,params){
		return new eu.BackgroundPositionTween(id,['current','current'],to,duration,params).start();
	},
	bgColorTo : function(id,from,to,duration,params){
		return new eu.ColorTween(id,"backgroundColor",from,to,duration,params).start();
	},
	bgBrightnessTo : function(id,from,brightness,duration,params){
		return new eu.ColorTween(id,"backgroundColor",from,eu.Color.RGBToHex(eu.Color.setBrightness(eu.Color.hexToRGB(from),brightness)),duration,params).start();
	},
	bgDarknessTo : function(id,from,darkness,duration,params){
		return new eu.ColorTween(id,"backgroundColor",from,eu.Color.RGBToHex(eu.Color.setDarkness(eu.Color.hexToRGB(from),darkness)),duration,params).start();
	},
	bezierTo : function(id,from,to,control,duration,params){
		return new eu.BezierTween(id,from,to,control,duration,params).start();
	},
	multipleTo : function(id,prop,from,to,duration,params,stagger){
		var t = [];
		for(var i = 0; i < id.length; i++){
			var tmp = {};
			for(var k in params){
				tmp[k] = params[k];
			}
			if(stagger){
				if(tmp.delay){
					tmp.delay += i * stagger;
				}else{
					tmp.delay = i * stagger;
				}
			} 
			t.push(eu.tweenTo(id[i],prop,from,to,duration,tmp));
		}
		return t;
	}
}
eu.extend = function(base,sub){
	var op = sub.prototype;
	function createObj(proto){
		function _f(){};
		_f.prototype = proto;
		return new _f();
	}
	sub.prototype = createObj(base.prototype);
	for(var k in op){
		sub.prototype[k] = op[k];
	}
	sub.prototype.constructor = sub;
}
eu.EventDispatcher = function(){
	this.listeners = {};
}
eu.EventDispatcher.prototype = {
	addListener : function(eventName,listener){
		if(!this.listeners[eventName]){
			this.listeners[eventName] = [];
		}
		this.listeners[eventName].push(listener);
	},
	removeListener : function(eventName,listener){
		if(!this.listeners[eventName]){
			throw "BNNR: " + eventName + " does not exist!";
		}
		var l = this.listeners[eventName].length, i = 0;
		while (l--){
			if(this.listeners[eventName][i] === listener){
				this.listeners[eventName].splice(i,1);
			}
			++i;
		}
	},
	dispatchEvent : function(eventName){
		if(this.listeners[eventName]){
			var l = this.listeners[eventName].length, i = 0;
			while (l--){
				this.listeners[eventName][i](this);
				++i;
			}				
		}
	}
}
eu.IPlayer = function(){
	eu.EventDispatcher.call(this);	
}
eu.IPlayer.prototype = {
	onComplete : function(){},
	onStop     : function(){},
	onStart    : function(){},
	start : function(){return this;},
	stop : function(){return this;},
	play : function(){return this;},
	toggle : function(){return this;},
	pause : function(){return this;},
	rewind : function(){return this;},
	fforward : function(){return this;},
	currentFrame : function(){return this;},
	totalDuration : function(){return this;},
	isPlaying : function(){return this;},
	setPosition : function(val){return this;},
	seek : function(val){return this;}
}
eu.extend(eu.EventDispatcher,eu.IPlayer);
eu.AbstractTicker = function(){
	eu.IPlayer.call(this);
	this._creationFrame = BNNR_TICKER.currentFrame;
	this._isPlaying = false;
}
eu.AbstractTicker.prototype = {
	isPlaying : function(){return this._isPlaying},
	currentFrame : function() {return BNNR_TICKER.currentFrame - this._creationFrame},
	tick : function(){
		this.dispatchEvent("onUpdate");
	},
	toggle : function(){
		if(this._isPlaying){
			this.pause();
		}else{
			this.resume();
		}
		return this;
	},
	pause : function(){
		if(this._isPlaying){
			this._deactivate();
		}
		return this;
	},
	resume : function(){
		if(!this._isPlaying){
			this._activate();
		}
		return this;
	},
	_activate : function(){
		BNNR_TICKER.addTicker(this);
		this._isPlaying = true;
	},
	_deactivate : function(){
		BNNR_TICKER.removeTicker(this);
		this._isPlaying = false;
	},
	play : function(){return this.start();},
	start : function(){
		this._activate();
		this.dispatchEvent("onStop");
		return this;
	},
	stop : function(){
		this._deactivate();
		this.dispatchEvent("onStart");
		return this;
	},
	destroy : function(){
		//this._deactivate();
		//this = null;
	}
}
eu.extend(eu.IPlayer, eu.AbstractTicker);
eu.Delay = function(duration,fn,args,scope){
	eu.AbstractTicker.call(this);
	this._fn = fn;
	this._args = args||[];
	this._scope = scope||null;
	this._duration = duration;
	this._time = eu.Math.getFrames(duration);
	this._count = this._time;
	this.start();
}
eu.Delay.prototype = {
	rewind : function (){this._count = this._time;},
	fforward : function (){this._count = 0;},
	totalDuration : function(){return eu.Math.getFrames(this._duration)},
	tick : function(){
		--this._count;
		eu.AbstractTicker.prototype.tick.call(this);
		if(this._count < 0){
			this.stop();
			if(this._fn) this._fn.apply(this._scope,this._args);
			this.dispatchEvent("onComplete");
			this._count = this._time;
		}
	}
}
eu.extend(eu.AbstractTicker, eu.Delay);
eu.Ticker = function(fn,duration,params){
	eu.AbstractTicker.call(this);
	this._fn = fn;
	this._time = 1;
	this._duration = eu.Math.getFrames(duration)||0;
	this._delay = 0;
	if(params){
		this._delay = (params.delay)?eu._twUtls.gD(params.delay):0;
		this._onComplete = (params.onComplete)?params.onComplete:undefined;
		this._onUpdate = (params.onUpdate)?params.onUpdate:undefined;
		this._onStart = (params.onStart)?params.onStart:undefined;
	}
	this._delayCount = this._delay;
	this.target = null;
}
eu.Ticker.prototype = {
	currentFrame : function() {return BNNR_TICKER.currentFrame - this._creationFrame},
	totalDuration : function(){return this._delay + this._duration},
	_checkIfDone : function(){
		if(this._duration == 0) return false;
		if(this._time > this._duration){
			this.stop();
			if(this._onComplete) this._onComplete();
			this.dispatchEvent("onComplete");
			return true;
		}
		return false;
	},
	_wait : function(){
		--this._delayCount;
		if(this._delayCount < 0){
			this.stop();
			this.start();
			this._delayCount = this._delay;
		}			
	},
	_run : function(){
		if(this._fn) this._fn(this);
		if(this._onUpdate) this._onUpdate();
		this._checkIfDone();
		++this._time;		
	},
	tick : function(){
		this._tick();
		eu.AbstractTicker.prototype.tick.call(this);
	},
	setFunction : function(fn){
		this._fn = fn;
	},
	start : function(){
		if(this._isPlaying){
			this.stop();
		}
		if(this._delayCount > 0){
			this._tick = this._wait;
		}else{
			if(this._delay < 0){
				this._time = Math.abs(this._delay);
			}else{
				this._time = 1;
			}
			if(this._onStart) this._onStart();
			this._tick = this._run;
		}
		eu.AbstractTicker.prototype.start.call(this);
		return this;
	},
	stop : function(){
		eu.AbstractTicker.prototype.stop.call(this);
		return this;
	},
	complete : function(fn){
		if(fn){this._onComplete = fn; return this}
		return this._onComplete;
	},
	setTarget : function(target){this.target = target; return this},
	getTarget : function(){return this.target}
}
eu.extend(eu.AbstractTicker, eu.Ticker);
eu.Timer = function(fn, rate, iterations, params){
	var _fx = {r:eu.Math.getFrames(rate),i:iterations || 0};
	_fx.c = _fx.i - 1;
	var t = new eu.Ticker(fn,0,params);
	t._run = function(){
		if(this._time%_fx.r == 0){
			this._fn();
			if(this._onUpdate) this._onUpdate();
			if(_fx.i > 0){
				if(_fx.c == 0){
					this.stop();
					if(this._onComplete) this._onComplete();
					_fx.c = _fx.i - 1;
				}
				--_fx.c;
			}
		}
		++this._time;
	};
	return t;
}
eu.defaultEase = function(t){return t * ( 2 - t );};
eu.Tween = function(id,prop,from,to,duration,params){
	eu.Ticker.call(this,undefined,duration,params);
	this.id=id;
	this.type="tween";
	this.props=eu.getAsArray(prop);
	this.to=eu.getAsArray(to);
	this.fr=eu.getAsArray(from);
	this.ch=[];
	this.e=eu.defaultEase;
	this.loop=-1;
	this.yoyo=false;
	this.repeat=0;
	this._then=undefined;
	this.pos=0;
	this.dir=1;
	this.initialized=false;
	if(params){
		if(params.ease){
			if(typeof params.ease === 'string'){
				if(eu.Ease){
					this.e = eu.Ease.getEase(params.ease);
				}
			}else{
				this.e = params.ease;
			}
		}
		this.loop = (params.loop != undefined)?params.loop:-1;
		this.yoyo = (params.yoyo == undefined)?false:params.yoyo;
		if(this.yoyo){
			this.loop = (this.loop == -1)?0:this.loop;
		}
	}
	var particle = eu.getParticle(this.id);
	particle.addProperties(this.props, this.fr);
	this.setTarget(particle);
	this.repeat = (this.loop > 0)?this.loop:-1;
	this.u = function(t,c,b){
		return this.e(t) * c + b;
	}
	return this;
}
eu.Tween.prototype = {
	_run : function(){
		this._time += this.dir;
		var l = this.props.length, i = 0, o = this.target.css, p = this.props;
		this.pos = eu.Math.fixProgress(this._time/this._duration, false);
		while(l){
			o[p[i]] = this.u(this.pos, this.ch[i], this.fr[i]);
			++i;
			--l;
		}
		if(this.target.tick) this.target.tick();
		if(this._onUpdate) this._onUpdate();
		if(this._checkIfDone()){
			this._whenTweenDone();
		}
	},
	_whenTweenDone : function(){
		if(this._then)this._then.start();
		if(this.loop > -1){
			if(this.loop == 0){
				this.start();
			}else{
				if(--this.repeat > -1){
					this.start();
				}
			}
		}
		if(this.yoyo){
			this._yoyo();
		}
	},
	_yoyo : function(){
		var tmp = this.fr;
		this.fr = this.to;
		this.to = tmp;
	},
	_updateTick : function(dir){
		if(!this._isPlaying && this.initialized){
			this.dir = dir||1;
			this.tick();
			return true;
		}
		return false;
	},
	_fixValues : function(){
		if(this.type == "tween" || this.type == 'backgroundPosition'){
			this.fr = eu._twUtls.fxV(this.target.css, this.props, this.fr);
			this.to = eu._twUtls.fxV(this.target.css, this.props, this.to);
			this.ch = eu._twUtls.gCh(this.fr, this.to);
		}
	},
	start : function(){
		this._fixValues();
		eu.Ticker.prototype.start.call(this);
		this.initialized = true;
		this._updateTick();
		return this;
	},
	nextFrame : function(){
		this._time = eu.Math.clamp(++this._time,0,this._duration);
		this._updateTick();
		return this;
	},
	prevFrame : function(){
		this._time = eu.Math.clamp(--this._time,0,this._duration);
		this._updateTick(-1);
		this.dir = 1;
		return this;
	},
	rewind : function(){
		this._time = 0;
		this._updateTick();
		return this;
	},
	fforward : function(){
		this._time = this._duration;
		this._updateTick();
		return this;
	},
	setPosition :  function(ratio){
		this._time = Math.round(eu.Math.clamp(ratio,0,1) * this._duration);
		this._updateTick();
		return this;
	},
	seek : function(time){
		time = eu.Math.getFrames(time);
		this._time = eu.Math.clamp(time,0,this._duration);
		this._updateTick();
		return this;
	},
	continueTo : function(to, duration){
		this.fr = this.to;
		this.to = eu.getAsArray(to);
		if(duration){
			this._duration = eu.Math.getFrames(duration);
		}
		this.start();
		return this;
	},
	yoyo : function(){
		this._yoyo();
		this.start();
		return this;
	},
	then : function(t){
		if(t.isPlaying()) t.stop();
		return this._then = t;
	}
}
eu.extend(eu.Ticker, eu.Tween);
  /**
    * generic bezier method for animating x|y coordinates
    * minimum of 2 points required (start and end).
    * first point start, last point end
    * additional control points are optional (but why else would you use this anyway ;)
    * @param points: array containing control points
       [[0, 0], [100, 200], [200, 100]]
    * @param pos: current be(tween) position represented as float  0 - 1
    * @return [x, y]
    */
eu.BezierTween = function(id,from,to,control,duration,params){
	eu.Tween.call(this,id,"translate",from,to,duration,params);
	this.type = "bezier";
	this.ctrl = eu.getAsArray(control);
	this.pts = this.fr.concat(this.ctrl.concat(this.to));
	this.u = (this.pts.length < 5)?(this.pts.length == 3)?eu.Math.quadraticBezier:eu.Math.cubicBezier:eu.Math.bezier;//;
	console.log(this.pts.length);
	return this;
}
eu.BezierTween.prototype = {
	_run : function(){
		this._time += this.dir;
		this.pos = eu.Math.fixProgress(this._time/this._duration, false);
		var loc = this.u(this.pos, this.pts, this.e);
		this.target.css.translateX = loc.x;
		this.target.css.translateY = loc.y;
		this.target.tick();
		if(this._onUpdate) this._onUpdate();
		if(this._checkIfDone()){
			this._whenTweenDone();
		}
	}
}
eu.extend(eu.Tween, eu.BezierTween);
eu.BackgroundPositionTween = function(id, from, to, duration, params){
	eu.Tween.call(this, id, ['_bgX', '_bgY'], from, to, duration, params);
	this.type = 'backgroundPosition';
	return this;
}
eu.BackgroundPositionTween.prototype = {
	_run : function(){
		this._time += this.dir;
		this.pos = eu.Math.fixProgress(this._time/this._duration, false);
		this.target.css._bgX = eu.Math.dec(this.u(this.pos, this.ch[0], this.fr[0]));
		this.target.css._bgY = eu.Math.dec(this.u(this.pos, this.ch[1], this.fr[1]));
		this.target.css.backgroundPosition = this.target.css._bgX + 'px ' + this.target.css._bgY + 'px';
		this.target.tick();
		if(this._onUpdate) this._onUpdate();
		if(this._checkIfDone()){
			this._whenTweenDone();
		}
	}
}
eu.extend(eu.Tween, eu.BackgroundPositionTween);
eu.ColorTween = function(id,prop,from,to,duration,params){
	eu.Tween.call(this,id,prop,from,to,duration,params);
	this.type = "color";
	this.c1 = eu.Color.hexToRGB(this.fr[0]);
	this.c2 = eu.Color.hexToRGB(this.to[0]);
	this.ci = {r:0,g:0,b:0};
	this.cc = {r:this.c2.r - this.c1.r,g:this.c2.g - this.c1.g,b:this.c2.b - this.c1.b};
	return this;
}
eu.ColorTween.prototype = {
	_run : function(){
		this._time += this.dir;
		this.pos = eu.Math.fixProgress(this._time/this._duration, false);
		var t = this;
		t.ci.r = eu.Math.clamp(eu.Math.dec(t.e(t.pos) * t.cc.r + t.c1.r), 0, 255);
		t.ci.g = eu.Math.clamp(eu.Math.dec(t.e(t.pos) * t.cc.g + t.c1.g), 0, 255);
		t.ci.b = eu.Math.clamp(eu.Math.dec(t.e(t.pos) * t.cc.b + t.c1.b), 0, 255);
		this.target.css[t.props[0]] = "#" + eu.Color.RGBToHex(t.ci);
		this.target.tick();
		if(this._onUpdate) this._onUpdate();
		if(this._checkIfDone()){
			this._whenTweenDone();
		}
	}
}
eu.extend(eu.Tween, eu.ColorTween);
//Tween Utilities
eu._twUtls = {
	_tAP : true,
	fxV : function(o,p,v){//fixValues
		//this.target.css, this.props, this.fr
		var l = p.length,r = [], n;
		for(var i=0; i < l; i++){
			var x = p[i];
			if(typeof v[i] == 'number'){
				r.push(v[i]);
			}else if(typeof v[i] == 'string'){
				if(v[i] == 'current'){
					r.push(o[x]);
				}else if(v[i].indexOf('=') != -1){
					var s = v[i].replace('=','');
					r.push(o[x] + parseFloat(s));
				}
			}else{
				r.push(parseFloat(v[i]));
			}
		}
		return r;		
	},
	gD : function(t){//getDelay
		return (t === undefined)? 0 : eu.Math.getFrames(t);
	},
	gCh : function(from, to){//getChange
		var val = [], l = Math.min(from.length,to.length), i = 0;
		while(l){
			val.push(to[i] - from[i]);
			++i;
			--l;
		}
		return val;
	},
}
eu.setAutoPlay = function(val){
	eu._twUtls._tAP = val;
};
//COLOR
eu.Color = {
	setBrightness : function(obj, value){
		value = eu.Math.clamp(value, 0, 1)
		obj.r += (255-obj.r) * value;
		obj.g += (255-obj.g) * value;
		obj.b += (255-obj.b) * value;
		return obj;
	},
	setDarkness : function(obj, value){
		value = 1 - eu.Math.clamp(value, 0, 1);
		obj.r *= value;
		obj.g *= value;
		obj.b *= value;
		return obj;
	},
	hexToRGB : function(hexString){
		var len = (hexString.length >= 6)?6:3;
		var value = hexString.substr(-len,len).toUpperCase();
		var hex = (len < 6)? value[0]+value[0]+value[1]+value[1]+value[2]+value[2]:value;
		var hex = parseInt(hex, 16);
		return {r: hex >> 16, g: hex >> 8 & 0xFF, b: hex & 0xFF};
	},
	RGBToHex : function(obj){
		var value = (Math.round(eu.Math.clamp(obj.r,0,255)) << 16 | Math.round(eu.Math.clamp(obj.g,0,255)) << 8 | Math.round(eu.Math.clamp(obj.b,0,255))).toString(16).toUpperCase();
		while (value.length < 6){
			value = "0" + value;
		}
		return value;
	}
}
//MATH
eu.Math = {
	GOLDEN_RATIO : 0.61803398875,
	R2D : 180/Math.PI,
	D2R : Math.PI/180,
	TWO_PI : Math.PI * 2,
	HALF_PI : Math.PI / 2,
	CIRC : 360,
	aleatory : Math.random,
	dec : function(n,x){
		x = x||1000;
		return Math.round(n*x)/x;
	},
	bezier : function(time, p, ease) { // points, pos
	  var n = p.length, r = [], i, j, t = (time < 1)? ease(time): ease(1);
	  for (i = 0; i < n; ++i) {
	    r[i] = [p[i].x, p[i].y]
	  }
	  for (j = 1; j < n; ++j) {
	    for (i = 0; i < n - j; ++i) {
	      r[i].x = (1 - t) * r[i].x + t * r[parseInt(i + 1, 10)].x;
	      r[i].y = (1 - t) * r[i].y + t * r[parseInt(i + 1, 10)].y;
	   }
	  }
	  return {x:r[0].x,y:r[0].y}
	},
	cubicBezier : function(time,p,ease){
		var p0 = p[0], p1 = p[1], p2 = p[2], p3 = p[3];
		var e = ease || function(k){return k * k * ( 3 - 2 * k )}, t = (time < 1)? e(time): e(1);
		var sq = t*t, cb = t*t*t, i = 1 - t, isq = i*i, icb = i*i*i;
		return {
			x :  icb*p0.x + 3*t*isq*p1.x + 3*sq*i*p2.x + cb*p3.x,
			y :  icb*p0.y + 3*t*isq*p1.y + 3*sq*i*p2.y + cb*p3.y
		}	
	},
	quadraticBezier : function(time,p,ease){
		var p0 = p[0], p1 = p[1], p2 = p[2];
		var e = ease || function(k){return k * k * ( 3 - 2 * k )}, t = (time < 1)? e(time): e(1);
		var i = 1 - t;
		return {
			x: i*i * p0.x + 2 * i * t * p1.x + t*t * p2.x,
			y: i*i * p0.y + 2 * i * t * p1.y + t*t * p2.y
		}
	},
	fixProgress : function(progress, loop){//fixProgress
		var l = (loop === undefined) ? true : loop;
		return (progress > 1) ? ((l) ? progress % 1 : 1 ) : (progress < 0) ? ((l) ? (1 + progress % 1) : 0) : progress;
	},
	easing : function(range, ease){
		var e = ease || 0.1;
		return range * e;
	},
	spring : function(range, friction, spring, speed){
		var f = friction || 0.1;
		var s = spring || 0.9;
		return speed * s + range * f;
	},
	getFrames : function(t){//getFrames
		if(!t) return 0;
		return (typeof t != 'string') ? Math.round((t * 1000)/16.666) : (t == "fast") ? 12:(t == "slow")?32:24;
	},
	random : function(min, max){
		if(arguments.length == 1){
			return eu.Math.aleatory() * min;
		}
		return eu.Math.aleatory() * (max - min) + min;
	},
	randomInt : function(min, max){
		if(arguments.length == 1){
			return Math.floor(eu.Math.aleatory() * (1 + min));
		}
		return Math.floor(eu.Math.aleatory() * (1 + max - min)) + min;
	},
	clamp : function(value, min, max){
		return Math.min(Math.max(value,min),max);
	},
	clamp360 : function(v){
		return (v > eu.Math.CIRC)? v % eu.Math.CIRC : v;
	},
	getRadians : function(degrees){
		return degrees * Math.PI / 180;
	},
	getDegrees : function(radians){
		return radians * 180 / Math.PI;
	},
	getDistance : function(x1,y1,x2,y2){
		function d(a,b){return b-a};
		var dx = d(x1,y1);
		if(arguments.length == 2){
			return dx;
		}
		var dy = d(x2,y2);
		return Math.sqrt(dx*dx + dy*dy);
	},
	getAngleDistance : function(alpha, omega){
		var d = this.getDistance(alpha,omega);
		return this.rotateTo(Math.cos(d), Math.sin(d));
	},
	chance : function(chance, type){
		var c = chance ? chance : 0.5;
		var t = (type == -1) ? -1 : 0;
		return (eu.Math.aleatory() > c)? t : 1;
	},
	center : function(width, container){
		return (container - width)/2;
	},
	sign : function(v){
		return (v < 0)?-1:1;
	},
	getShortRotation : function(from,to){
		return this.getAngleDistance(from,to);
	},
	rotateTo : function(x,y){return Math.atan2(y, x)}
}
//Renderings and particles
eu.cssPlugin = {
	/*
	Add functions that receives a dom element and a value for it
	example:
	BNNR.left = function (elem,val){ elem.style["left"] = val + "px"; }
	*/
}
eu.cssSetSuffix = function(suffix,val){
	eu.ParticleDB._suffixes[suffix] = val;
}
eu.applyCSS = function(elem, prop, value){
	if(prop.indexOf('translate') + prop.indexOf('scale') + prop.indexOf('rotate') + prop.indexOf('skew') + prop.indexOf('_bg') == -5){
		if(!eu.cssPlugin[prop]){
			elem.style[prop] = value;
		}else{
			eu.cssPlugin[prop](elem,value);
		}
	}
}
eu.resetCSS = function(elem){
	elem.style.WebkitTransform = ''; 
	elem.style.msTransform = ''; 
	elem.style.transform = '';
	elem.style = '';
}
eu.setCSS = function(elem, valueObj){
	//if it is NodeList let's apply it to each item
	if(elem.item){
		var i=0, l = elem.length;
		while(l--){
			for(var k in valueObj){
				eu.applyCSS(elem[i], k, valueObj[k] + (eu.ParticleDB._suffixes[k]||''));
			}
			new eu.Transform(elem[i], valueObj);
			++i;
		}
	}else if(elem.tagName){
		//if it is a dom element
		for(var k in valueObj){
			eu.applyCSS(elem, k, valueObj[k] + (eu.ParticleDB._suffixes[k]||''));
		}
		new eu.Transform(elem, valueObj);
	}
}
eu.isFunction = function(f){
	return f.toString() === '[object Function]';
}
eu.getAsArray = function(val){
	if(Object.prototype.toString.call(val) === '[object Array]') return val;
	return [val];
}
eu.getCSS = function (elem, field) {
	var css = document.defaultView && document.defaultView.getComputedStyle ?document.defaultView.getComputedStyle(elem, null): elem.currentStyle || elem.style;
	return css[field];
}
eu.attachElement = function (id, className, parentNode){
	var p, elem = document.createElement("div");
	p = (parentNode.tagName)?parentNode:document.getElementById(parentNode);
	elem.className = (!className)?"":className;
	elem.id = id;
	p.appendChild(elem);
	return elem;
}
eu.getInitialValue = function(t,v){//getInitialValue
	if(v){
		if(typeof v == 'number'){
			return v;
		}
	}else if(t == 'opacity' || t.indexOf('scale') != -1) return 1;
	return 0;
}
eu.Transform = function(elem,obj){
	var s = '';
	if('translateX' in obj || 'translateY' in obj){
		s += this.translate(obj);
	}
	if('translateZ' in obj) s+= this.translate(obj,'Z');
	if('scale' in obj) s+= this.scale(obj, '');
	if('scaleX' in obj) s+= this.scale(obj,'X');
	if('scaleY' in obj) s+= this.scale(obj,'Y');
	if('rotate' in obj) s+= this.rotate(obj,'');
	if('rotateX' in obj) s+= this.rotate(obj,'X');
	if('rotateY' in obj) s+= this.rotate(obj,'Y');
	if('skewX' in obj || 'skewY' in obj){
		s += this.skew(obj);
	}
	elem.style.WebkitTransform = s; elem.style.msTransform = s, elem.style.transform = s;
}
eu.Transform.prototype = {
	translate : function(v,a){
		if(a){
			return 'translate' + a + '(' + eu.Math.dec(v['translate' + a]) +'px) ';
		}
		return 'translate(' + eu.Math.dec(v.translateX||0) + 'px, ' + eu.Math.dec(v.translateY||0) + 'px) ';
	},
	scale : function(v,a){
		return 'scale' + a + '(' + eu.Math.dec(v['scale' + a]) +') ';
	},
	rotate : function(v,a){
			return 'rotate' + a + '(' + eu.Math.dec(eu.Math.clamp360(v['rotate'+a])) + 'deg) ';
	},
	skew : function(v){
		return 'skew(' +eu.Math.dec(v.skewX||0) +'deg,'+eu.Math.dec(v.skewY||0)+') ';
	}
}
eu.Particle = function(query, params){
	this.query = '';//the query that returns the dom element(s)
	this.css = {};//where we save the raw css transformation
	this.data = {};//a placeholder to save any other data
	this.view = null;//the view that represents the particle
	this._set = (params && params.setFunction)?params.setFunction:eu.setCSS;//a function to update the view
	this._get = (params && params.getFunction)?params.getFunction:eu.getCSS;//a function that returns CSS information of the view (even if the data is not saved in the css object)
	if(typeof query == 'string'){
		this.view = document.getElementById(query);
		if(this.view === null){
			this.view = document.querySelectorAll(this.view);
			if(this.view === null){
				var fns = [document.getElementsByClassName, document.getElementsByTagName, document.getElementsByName];
				for(var i = 0, l = fns.length; i < l; i++){
					this.view = fns[i](query);
					if(this.view != null){
						break;
					}
				}				
			}
		}
		this.query = query;
	}else if(query.tagName || query.item){//we are passing the actual DOM element or NodeList
		this.view = query;
	}else{
		throw "BNNR: " + query + " is not returning a DOM element!";
	}
}
eu.Particle.prototype = {
	tick : function(){
		this._set(this.view, this.css);
	},
	addProperties : function(props,from){
		if(props){
			for(var i = 0, l = props.length; i < l; i++){
				if(!this.css[props[i]]){
					this.css[props[i]] = eu.getInitialValue(props[i], from[i]);
				}
			}
		}
		if(this.css.translate){
			this.css.translateX = this.css.translate.x;
			this.css.translateY = this.css.translate.y;
			delete this.css.translate;
		}
	},
	'reset' : function(){
		eu.resetCSS(this.view);
	},
	'style' : function(prop, value){
		//SET
		if(value !== undefined){
			this.css[prop] = value;
			this.tick();
			return this.css[prop];
		}
		//GET
		if(this.css[prop]){
			return this.css[prop];
		}
		//GET FALLBACK
		return this._get(this.view,prop);
	}
}
eu.ParticleDB = {
	_dict : {},
	_nodes : [],
	_particles : [],
	_suffixes : {top:'px',left:'px',width:'px',height:'px'}
}
eu.ParticleFactory = {
	//a general method where you can pass an string, a dom element, a node list or HTML Collection, or use it to build a particle and its view
	getParticle : function(query,className,parentNode){
		var db = eu.ParticleDB;
		if(arguments.length == 1){//we are only requesting a particle
			if(typeof query == 'string'){//we are passing a query (an id like 'myDiv', a query '#myDiv' or '.particle')
				if(!db._dict[query]){//particle does not exists in the dictionary, let´s save it.
					db._dict[query] = new eu.Particle(query);
				}
				return db._dict[query];//FOUND IT!
			}else if(query.tagName || query.item){//we are passing the actual DOM element or NodeList, might not be in the dictionary
				//Let´s check first in the dictionary ['#myDiv' != document.getElementById('myDiv')]
				for(var k in db._dict){
					if(query === db._dict[k]){
						return db._dict[k];//FOUND IT!
					}
				}
				//Now let´s look within the nodes database to see if we already hold a reference to it
				for(var i=0, l = db._particles.length; i < l; i++){
					if(db._nodes === query){
						return db._particles[i];//FOUND IT!
					}
				}
				//Is not in the dictionary or the nodes array, so we need to create a completelly new Particle for it
				db._nodes.push(query);
				var p = new eu.Particle(query);
				db._particles.push(p);
				return p;//sort of FOUND IT!
			}else if(query.push){
				var particles = [], elem;
				for(var i=0, l = query.length; i < l; i++){
					particles.push(eu.ParticleFactory.getParticle([query[i]]));
				}
				return particles;//FOUND IT! An array or particles
			}
		}else{//we are building a particle and its view
			//so we are receiving a class name and a parent node to create a completely new particle(s)
			//to build 1 particle just use eu.ParticleFactory.getParticle('particle1','myClass','parentNodeId'); parentNodeId could be an HTML DOM element as well
			//check if it is an array or just a single string
			if(typeof query == 'string'){
				var elem = eu.attachElement(query, className, parentNode);
				db._dict[query] = new eu.Particle(elem);
				return db._dict[query];//FOUND IT!
			}else if(query.push){
				//Is an array like in eu.ParticleFactory.getParticle(['particle1','particle2','particle3'],'myClass','parentNodeId');
				var particles = [], elem;
				for(var i=0, l = query.length; i < l; i++){
					elem = eu.attachElement(query[i], className, parentNode);
					db._dict[query[i]] = new eu.Particle(elem);
					particles.push(db._dict[query[i]]);
				}
				return particles;//FOUND IT! An array or particles
			}else if(typeof query == 'number'){//in a rush and just need a bunch of particles? Use eu.ParticleFactory.getParticle(50, 'myClass', 'parentNodeId'); where 50 is the quantity of needed particles
				var particles = [], prefix = (typeof parentNode == 'string')?parentNode : new Date().getTime(), id = '', elem;
				for(var i=0; i < query; i++){
					id = 'particle_' + prefix + '_' + i;
					elem = eu.attachElement(id, className, parentNode);
					db._dict[id] = new eu.Particle(elem);
					particles.push(db._dict[id]);
				}
				return particles;//FOUND IT! An array or particles
			}
		}
	}
}
eu.getParticle = eu.ParticleFactory.getParticle;//shortcut method
//Timeline
eu.Timeline = function(channels,params){
	eu.IPlayer.call(this);
	this.group = false;
	this.channels = [];
	this.index = 0;
	this._longestTicker;
	this._currentTicker;
	this._isPlaying = false;
	if(params){
		if(params.isGroup){
			this.group = params.isGroup;
		}
		if(params.onComplete){
			this.onComplete = params.onComplete;
		}
		if(params.onStop){
			this.onStop = params.onStop;
		}
		if(params.onStart){
			this.onStart = params.onStart;
		}
	}
	if(channels.length){
		var l = channels.length;
		var i = 0;
		while(l--){
			this.channels.push(this._add(channels[i]));
			++i;
		}	
		this._setup();
	}
}
eu.Timeline.prototype = {
	_each : function(foo){
		var l = this.channels.length;
		var i = 0;
		while(l--){
			if(this.channels[i][foo]){
				this.channels[i][foo]();
			}
			++i;
		}
	},
	_getLongest : function(){
		var lngst = this.channels[this.channels.length - 1];
		if(!this.group){
			return lngst;
		}
		var l = this.channels.length;
		var i = 0;
		while(l--){
			lngst = (lngst.totalDuration() < this.channels[i].totalDuration()) ? this.channels[i] : lngst;
			++i;
		}
		return lngst;
	},
	_next : function(){
		if(this.index < this.channels.length){
			var ch = this.channels[this.index];
			if(ch instanceof eu.AbstractTicker || ch instanceof eu.Timeline){//eu.isFunction(this.channels[this.index]
				var delegate = this;
				this._currentTicker = ch;
				this._currentTicker.addListener('onComplete', function(){
					delegate._currentTicker.removeListener('onComplete', delegate._next);
					delegate.index++;
					delegate._next();
				});
				ch.start();
			}else{
				ch();
				this.index++;
				this._next();
			}
		}else{
			this.dispatchEvent('onComplete');
			this.index = this.channels.length - 1;
			this._isPlaying = false;
		}
	},
	_setup : function(){
		if(!this._longestTicker){
			this._longestTicker = this._getLongest();
		}else{
			this._longestTicker.removeListener('onComplete',this.onComplete);
			this._longestTicker = this._getLongest();
		}
		this._longestTicker.addListener('onComplete',this.onComplete);
	},
	_add : function(t){
		if(typeof t === 'number'){
			return new eu.Delay(t);
		}
		return t;
	},
	_mc : function(x,y){
		if(eu.isFunction(this.channels[this.index])){
			return this;
		}
		switch(x){
			case 'add':
			this.channels.push(this._add(y));
			this._setup();
			break;
			case 'start':
			if (this.group){
			this._each('start');
			}else{
				this.index = 0;
				this._next();
			}
			this._isPlaying = true;
			this.dispatchEvent('onStart');
			break;
			case 'stop':
			if (this.group){
				this._each('stop');
			}else{
				this.channels[this.index].stop();
			}
			this._isPlaying = false;
			this.dispatchEvent('onStop');
			break;
			case 'play':
			if (this.group){
				this._each('play');
			}else{
				this.channels[this.index].play();
			}
			this._isPlaying = true;
			break;
			case 'pause':
			if (this.group){
				this._each('pause');
			}else{
				this.channels[this.index].pause();
			}
			this._isPlaying = false;
			break;
			case 'resume':
			if (this.group){
				this._each('resume');
			}else{
				this.channels[this.index].resume();
			}
			this._isPlaying = true;
			break;
			case 'toggle':
			if (this.group){
				this._each('toggle');
			}else{
				this.channels[this.index].toggle();
			}
			this._isPlaying = !this._isPlaying;
			break;
			case 'rewind':
			this._each('rewind');
			this.index = 0;
			break;
			case 'fforward':
			this._each('fforward');
			this.index = this.channels.length - 1;
			break;
		}
		return this;
	},
	add : function(tween){
		return this._mc('add', tween);
	},
	start : function(){
		return (!this._isPlaying)?this._mc('start'):this;
	},
	stop : function(){
		return (this._isPlaying)?this._mc('stop'):this;
	},
	play : function(){
		return (!this._isPlaying)?this._mc('play'):this;
	},
	pause : function(){
		return (this._isPlaying)?this._mc('pause'):this;
	},
	resume : function(){
		return (!this._isPlaying)?this._mc('resume'):this;
	},
	toggle : function(){
		return this._mc('toggle');
	},
	rewind : function(){
		return this._mc('rewind');
	},
	fforward : function(){
		return this._mc('fforward');
	}
}
eu.extend(eu.IPlayer, eu.Timeline);
/* The equations defined here are open source under BSD License.
 * http://www.robertpenner.com/easing_terms_of_use.html (c) 2003 Robert Penner
 * Adapted to single time-based by
 * Brian Crescimanno <brian.crescimanno@gmail.com>
 * Ken Snyder <kendsnyder@gmail.com>
 */
eu.Ease = {
	_easeDict : {},
	getEase : function(e){
		if(e == undefined) return this.quadraticOut;
		if(this._easeDict[e]){
			return this._easeDict[e];
		}
		var v = e.split(" "), fn = this[v[0]] || this.quadraticOut, x;
		if(!v[1]){
			return this._easeDict[e] = fn;
		}else{
			var fn1 = v[0], fn2 = v[1], fn3 = v[2];
			if(fn1 == "mirror" || fn1 == "reverse" || fn1 == "returnLinear" || fn1 == "returnOut" || fn1 == "returnSmooth" || fn1 == "return"){
				if(!fn3){
					fn = this[fn2] || this.linear;	
				}else{
					fn = this.getEase(fn2 + " " + fn3) || this.linear;
				}
				return this._easeDict[e] = this.mix(this[fn1],fn);
			}else if(fn1 == "wave" || fn1 == "pulse" || fn1 == "blink" || fn1 == "stepped" || fn1 == "pow"){
				x = parseInt(v[1]) || 2;
				return this._easeDict[e] = function(t){
					return fn(t,x);
				}
			}else{
				return this._easeDict[e] = this.combine(fn1,fn2);
			}
		}
	},
	mix : function(e1,e2){
		return function (t){
			return e1(e2(t));
		}
	},
	combine : function(e1,e2){
		return function(t){
			if(t < 0.5){
				return eu.Ease[e1](t*2)/2;
			}
			return eu.Ease[e2]((t - 0.5) * 2) / 2 + 0.5;
		}
	},
	linear : function(t){
		return t;
	},
	out : function(t){
		return t * t;
	},
	"in" : function(t){
		return Math.sin(Math.PI * t/2);
	},
	inOut : function(t){
		return 1 - ((Math.sin(t * Math.PI + Math.PI/2)+1)/2);
	},
	strongOut : function(t){
		return (t == 1) ? 1 : 1 - Math.pow(2, -10 * t);
	},
	strongIn : function(t){
		return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1));
	},
	smoothStep : function(t){
		return t * t * ( 3 - 2 * t );
	},	
	quadraticIn : function(t){
		return t * t;
	},
	quadraticOut : function(t){
		return t * ( 2 - t );
	},
	quadraticInOut : function(t){
		if ( ( t *= 2 ) < 1 ) return 0.5 * t * t;
		return - 0.5 * ( --t * ( t - 2 ) - 1 );
	},
	cubicIn : function(t){
		return t*t*t;
	},
	cubicOut : function(t){
		return --t*t*t + 1;
	},
	cubicInOut : function(t){
		if ( ( t *= 2 ) < 1 ) return 0.5 * t * t * t;
		return 0.5 * ( ( t -= 2 ) * t * t + 2 );
	},
	quarticIn : function(t){
		return t*t*t*t;
	},
	quarticOut : function(t){
		return 1-(--t*t*t*t);
	},
	quarticInOut : function(t){
		if ( ( t *= 2 ) < 1) return 0.5 * t * t * t * t;
		return - 0.5 * ( ( t -= 2 ) * t * t * t - 2 );
	},
	quinticIn : function(t){
		return t*t*t*t*t;
	},
	quinticOut : function(t){
		return --t * t * t * t * t + 1;
	},
	quinticInOut : function(t){
		if ( ( t *= 2 ) < 1 ) return 0.5 * t * t * t * t * t;
		return 0.5 * ( ( t -= 2 ) * t * t * t * t + 2 );
	},
	sinusoidalIn : function (t){
		return 1 - Math.cos( t * Math.PI / 2 );
	},
	sinusoidalOut : function(t){
		return Math.sin( t * Math.PI / 2 );
	},
	sinusoidalInOut : function(t){
		return 0.5 * ( 1 - Math.cos( Math.PI * t ) );
	},
	exponentialIn : function(t){
		return t === 0 ? 0 : Math.pow( 1024, t - 1 );
	},
	exponentialOut : function(t){
		return t === 1 ? 1 : 1 - Math.pow( 2, - 10 * t );
	},
	exponentialInOut : function(t){
		if ( t === 0 ) return 0;
		if ( t === 1 ) return 1;
		if ( ( t *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, t - 1 );
		return 0.5 * ( - Math.pow( 2, - 10 * ( t - 1 ) ) + 2 );
	},
	circularIn : function(t){
		return 1 - Math.sqrt( 1 - t * t );
	},
	circularOut : function(t){
		return Math.sqrt( 1 - ( --t * t ) );
	},
	circularInOut : function(t){
		if ( ( t *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - t * t) - 1);
		return 0.5 * ( Math.sqrt( 1 - ( t -= 2) * t) + 1);
	},
	elasticIn : function(t){
		var s, a = 0.1, p = 0.4;
		if ( t === 0 ) return 0;
		if ( t === 1 ) return 1;
		if ( !a || a < 1 ) { a = 1; s = p / 4; }
		else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
		return - ( a * Math.pow( 2, 10 * ( t -= 1 ) ) * Math.sin( ( t - s ) * ( 2 * Math.PI ) / p ) );
	},
	elasticOut : function(t){
		return 1 - (Math.cos(t * 4.5 * Math.PI) * Math.exp(-t * 6));
	},
	elasticInOut : function(t){
		var s, a = 0.1, p = 0.4;
		if ( t === 0 ) return 0;
		if ( t === 1 ) return 1;
		if ( !a || a < 1 ) { a = 1; s = p / 4; }
		else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
		if ( ( t *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( t -= 1 ) ) * Math.sin( ( t - s ) * ( 2 * Math.PI ) / p ) );
		return a * Math.pow( 2, -10 * ( t -= 1 ) ) * Math.sin( ( t - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
	},
	strongElasticOut : function(t){
		return -1 * Math.pow(4, -8 * t) * Math.sin((t * 6 - 1) * (2 * Math.PI) / 2) + 1;
	},
	strongElasticIn : function (t,x) {
		return Math.pow(2, 10 * --t) * Math.cos(20 * t * Math.PI * (x && x[0] || 1) / 3);
	},
	backIn : function(t){
		var s = 1.70158;
		return t * t * ( ( s + 1 ) * t - s );
	},
	backOut : function(t){
		var s = 1.70158;
		return --t * t * ( ( s + 1 ) * t + s ) + 1;
	},
	backInOut : function(t){
		var s = 1.70158 * 1.525;
		if ( ( t *= 2 ) < 1 ) return 0.5 * ( t * t * ( ( s + 1 ) * t - s ) );
		return 0.5 * ( ( t -= 2 ) * t * ( ( s + 1 ) * t + s ) + 2 );
	},
	bounceIn : function(t){
		var v;
		for (var a = 0, b = 1; 1; a += b, b /= 2){
			if (t >= (7 - 4 * a) / 11){
				v = b * b - Math.pow((11 - 6 * a - 11 * t) / 4, 2);
				break;
			}
		}
		return v;
	},
	bounceOut : function (t) {
		if (t < (1/2.75)) {
		  return (7.5625*t*t);
		} else if (t < (2/2.75)) {
		  return (7.5625*(t-=(1.5/2.75))*t + .75);
		} else if (t < (2.5/2.75)) {
		  return (7.5625*(t-=(2.25/2.75))*t + .9375);
		} else {
		  return (7.5625*(t-=(2.625/2.75))*t + .984375);
		}
	},
	bounceInOut : function(t){
		if ( t < 0.5 ) return eu.Ease.bounceIn( t * 2 ) * 0.5;
		return eu.Ease.bounceOut( t * 2 - 1 ) * 0.5 + 0.5;
	},
	bouncePast : function(t){
		if (t < (1 / 2.75)) {
		  return (7.5625 * t * t);
		} else if (t < (2 / 2.75)) {
		  return 2 - (7.5625 * (t -= (1.5 / 2.75)) * t + .75);
		} else if (t < (2.5 / 2.75)) {
		  return 2 - (7.5625 * (t -= (2.25 / 2.75)) * t + .9375);
		} else {
		  return 2 - (7.5625 * (t -= (2.625 / 2.75)) * t + .984375);
		}	
	},
	returnLinear : function(t){
		if(t < 0.5) return 2 * t;
		else return 1 - 2 * (t - 0.5);
	},
	returnOut : function(t){
		return -4 * t * (t-1);
	},
	returnSmooth : function(t){
		return 0.5 - 0.5 * Math.cos(2 * Math.PI * t);
	},
	wobble : function(t){
		return (-Math.cos(t*Math.PI*(9*t))/2) + 0.5;
	},
	flicker : function(t){
		var t = t + (eu.Math.aleatory()-0.5)/5;
		return eu.Ease.sine(t < 0 ? 0 : t > 1 ? 1 : t);
	},
	slowMotion : function(t){
		var s = t * t, c = t*t*t;
		return 11.4475*c*s + -32.44*s*s + 36.585*c + -19.69*s + 5.0975*t;
	},
	slowMotionBack : function(t){
		var s = t * t, c = t*t*t;
		return 2.2975*c*s + -12.24*s*s + 22.785*c + -17.19*s + 5.3475*t;
	},
	hesitation : function(t){
		var s = t * t, c = t*t*t;
		return -13.245*c*s + 43.585*s*s + -47.885*c + 18.695*s + -0.15*t;
	},	
	random : function(t){
		if(t >= 1){
			return 1;
		} 
		return eu.Math.aleatory() * t;
	},
	mirror : function(t){
		return Math.sin( Math.PI * t );
	},
	reverse : function(t){
		return 1-t;
	},
	wave : function(t,x){
		return 0.5  * (1 - Math.cos(Math.PI * 2 * (x||2) * t ));
	},
	pulse : function(t,x){
		return (-Math.cos((t*((x||5)-.5)*2)*Math.PI)/2) + .5;
	},
	blink : function(t,x){
		return Math.round(t*(x||5)) % 2;
	},
	stepped : function(t,x){
		var x = x || 10;
		return Math.floor(t * x)/x;
	},
	pow : function(t,x){
		return Math.pow(t, (x || 2));
	}
}
//EASE SHORTCUTS
eu.Ease.elastic = eu.Ease.elasticOut;
eu.Ease.spring = eu.Ease.strongElasticOut;
eu.Ease.swing = eu.Ease.backOut;
eu.Ease.expo = eu.Ease.exponentialOut;
eu.Ease.circ = eu.Ease.circularOut;
eu.Ease.sine = eu.Ease.sinusoidalOut;
eu.Ease.bounce = eu.Ease.bounceOut;
eu.Ease.snap = eu.Ease.getEase("quinticOut");
eu.Ease["return"] = eu.Ease.returnLinear;
//PARTICLE SYSTEM
eu.ParticleSystem = function(particles, init, move, reset, duration, params){
	this.ps = eu.getAsArray(particles);
	this.init = init;
	this.move = move;
	this.reset = reset || function(){};
	this.ticker = new eu.Ticker(function(ticker){
		var l = ticker.target.length(), i = 0;
		while(l){
			ticker.target.move.call(ticker.target.ps[i],i);
			ticker.target.reset.call(ticker.target.ps[i],i);
			ticker.target.ps[i].tick();
			--l;
			++i;
		}
	},duration,params).setTarget(this);
	this.initialize();
}
eu.ParticleSystem.prototype = {
	initialize : function(){
		var l = this.length(), i = 0, t;
		if(!this.init) return this;
		while(l){
			this.init.call(this.ps[i],i);
			--l;
			++i;
		}
		return this;
	},
	start : function(){this.ticker.start();return this},
	stop : function(){this.ticker.stop(); return this},
	length : function(){return this.ps.length}
}
//Particle based behaviors
eu.Spin = function(elements,speed,duration,params){
	var i = function(){this.data.speed = speed || 3; this.style("rotate",0);}, 
	m = function(){this.css.rotate += this.data.speed;}, 
	r = function(){}, 
	el = eu.getParticle(elements);
	return new eu.ParticleSystem(el,i,m,r,duration,params).start();
}
eu.Follow = function(elements,loc,ease,spring,alignTo,duration,params){
	ease = ease || 0.08;
	spring = spring || 0;
	alignTo = alignTo || false;
	var f = (spring > 0)?eu.Math.spring:eu.Math.easing,
	d = (spring > 0)?0.2:1.2,
	M = eu.Math,
	i = function(){
		this.css.translateX = 0;
		this.css.translateY = 0;
		this.css.rotate = 0;
		if(!this.data.Follow){
			this.data.Follow = {};
		}
		this.data.Follow = {
			ease:ease,
			spring:spring,
			speed:{x:0,y:0},
			loc:loc,
			at:alignTo,
			drag:d,
			M:M,
			fn:f
		}
	},
	m = function(){
		var td = this.data.Follow, dx = td.M.getDistance(this.css.translateX,td.loc.x), dy = td.M.getDistance(this.css.translateY,td.loc.y);
		td.speed.x = td.fn(dx,td.ease,td.spring,td.speed.x);
		td.speed.y = td.fn(dy,td.ease,td.spring,td.speed.y);
		this.css.translateX += td.speed.x;
		this.css.translateY += td.speed.y;
		if(td.at) {
			this.css.rotate = td.M.rotateTo(dx,dy) * td.M.R2D;
		}
	},
	r = function(){},
	el = eu.getParticle(elements);
	return new eu.ParticleSystem(el,i,m,r,duration,params).start();
}
eu.Oscillate = function(elements, prop, min, max, freq, amp, offset, duration, params){
	var i = function(index){
		if(!this.data.Oscillate){
			this.data.Oscillate = {};
		}
		this.data.Oscillate[prop] = {
			center : (max+min)/2,
			range : max-min,
			speed : 0,
			freq : (freq!=undefined)?1/freq:0.01,
			amp : (amp||1),
			prop : prop,
			offset : ((freq!=undefined)?1/freq:0.01) * index
		}
	},
	m = function(){
		var td = this.data.Oscillate[prop], v = td.speed + td.offset;
		v -= (v|0);
		this.css[td.prop] = Math.sin(6.283185307179586 * v) * td.range/2 * td.amp + td.center;
		td.speed += td.freq;
		td.speed -= (td.speed|0);
		//console.log();
	},
	r = function(){},
	el = eu.getParticle(elements);
	return new eu.ParticleSystem(el,i,m,r,duration,params).start();
}
eu.Vibrate = function(elements, prop, min, max, friction, spring, duration, params){
	var i = function(index){
		if(!this.data.Vibrate){
			this.data.Vibrate = {};
		}
		this.css[prop] = eu.getInitialValue(prop);
		this.data.Vibrate[prop] = {
			range : max - min,
			min : min,
			prop : prop,
			friction : friction || 0.1,
			spring : spring || 0.9,
			vel : 0,
			goal : 0
		}
	},
	m = function(){
		var td = this.data.Vibrate[prop]; 
		td.goal = td.min + (eu.Math.aleatory() * td.range);
		td.vel = td.vel * td.spring + (td.goal - this.css[td.prop]) * td.friction;
		this.css[td.prop] += td.vel;
	},
	r = function(){},
	el = eu.getParticle(elements);
	return new eu.ParticleSystem(el,i,m,r,duration,params).start();
}
//SPRITE ANIMATION
eu.SpriteAnimation = function (id,count,fps,size,isHorizontal,duration,params) {
	var _fx = {id:id,f:0,c:count-1,r:fps,s:size,i:0,h:(isHorizontal !== undefined)? isHorizontal : true,p:eu.getParticle(id)};
	_fx.u = (_fx.h)?function(){return (this.f * -this.s) + "px 0px";}:function(){return "0px " + (this.f * -this.s) + "px";}
	return new eu.Ticker(function(){
		if(_fx.i%_fx.r == 0){
			_fx.p.style("backgroundPosition", _fx.u());
			++_fx.f;
			if(_fx.f > _fx.c){
				_fx.f = 0;
				_fx.i = 0;
			}
		}
		++_fx.i;
	},duration,params).setTarget(_fx.p);
}
return eu;
}();
window.BNNR = BNNR;
}(window));