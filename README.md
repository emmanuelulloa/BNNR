BNNR
====

BNNR is a javascript library for HTML banner animation.  
It's objective is to allow easy implementation of animations for banner ads without requiring 3rd party libraries or more than 1 file.

Every element that you animate should be styled like this:

```CSS
#myElement {
	display: block;
	position: absolute;
}
```
Let's say we want to animate an image:

```HTML
<img id="myElement" src="image.png" />
```
Then on your script you can do it like so:
```JavaScript
var myTween = BNNR.getTween('myElement', ['translateX','translateY'], [250,200], 1, {ease:'bounce', delay:1, onComplete:function(){console.log('onComplete triggered')}});
myTween.start();
```
