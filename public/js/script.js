window.onload=function(){

	function checkRes() {
    var x	= window.innerWidth;
    var y	= window.innerHeight;
    var res	= document.getElementById("res");
    res.innerText = x + " x " + y;
	}
	window.onload	= checkRes;
	window.onresize	= checkRes;

	function getElementBG(elm) {
	    var elementColor	= window.getComputedStyle(elm).backgroundColor;
	    var startIndex		= elementColor.indexOf("(") + 1;
	    var endIndex		= elementColor.indexOf(")");
	    var colorString		= elementColor.substring(startIndex, endIndex);
	    var color			= colorString.split(",");
	    for (var i = 0; i < 3; i++) {
	        color[i] = parseInt(color[i].trim());
	    }
	    return color;
	}

	function generateRGB() {
	    var color = [];
	    for (var i = 0; i < 3; i++) {
	        color.push(Math.floor(Math.random()*250));
	    }
	    return color;
	}

	function RGBtoHex(color) {
	    var hex = [];
	    for (var i = 0; i < 3; i++) {
	        hex.push(color[i].toString(16));
	        if (hex[i].length < 2) { hex[i] = "0" + hex[i]; }
	    }
	    return "#" + hex[0] + hex[1] + hex[2];
	}

	function colorDistance(cur, next) {
	    var distance = [];
	    for (var i = 0; i < 3; i++) {
	        distance.push(Math.abs(cur[i] - next[i]));
	    }
	    return distance;
	}

	function calculateIncrement(distance) {
	    var increment = [];
	    for (var i = 0; i < 3; i++) {
	        increment.push(Math.abs(Math.floor(distance[i] / iteration)));
	        if (increment[i] == 0) {
	            increment[i]++;
	        }
	    }
	    return increment;
	}
	
	function output(color) {
	    var rgb = document.getElementsByClassName("rgb");
	    rgb[0].innerText = color[0];
	    rgb[1].innerText = color[1];
	    rgb[2].innerText = color[2];
	}

	var fps			= 25;
	var iteration	= Math.round(1000 / fps);

	(function colorCycle() {
	    var elm				= document.getElementById("screen");
	    var currentColor	= getElementBG(elm);
	    var randomColor		= generateRGB();
	    var increment		= calculateIncrement(colorDistance(currentColor, randomColor));
	    
	    function transition() {
	        
	        if (currentColor[0] > randomColor[0]) {
	            currentColor[0] -= increment[0];
	            if (currentColor[0] <= randomColor[0]) {
	                increment[0] = 0;
	            }
	        } else {
	            currentColor[0] += increment[0];
	            if (currentColor[0] >= randomColor[0]) {
	                increment[0] = 0;
	            }
	        }
	        
	        if (currentColor[1] > randomColor[1]) {
	            currentColor[1] -= increment[1];
	            if (currentColor[1] <= randomColor[1]) {
	                increment[1] = 0;
	            }
	        } else {
	            currentColor[1] += increment[1];
	            if (currentColor[1] >= randomColor[1]) {
	                increment[1] = 0;
	            }
	        }
	        
	        if (currentColor[2] > randomColor[2]) {
	            currentColor[2] -= increment[2];
	            if (currentColor[2] <= randomColor[2]) {
	                increment[2] = 0;
	            }
	        } else {
	            currentColor[2] += increment[2];
	            if (currentColor[2] >= randomColor[2]) {
	                increment[2] = 0;
	            }
	        }
	        elm.style.background = RGBtoHex(currentColor);
	        output(currentColor);
	        
	        if (increment[0] == 0 && increment[1] == 0 && increment[2] == 0) {
	            clearInterval(handler);
	            colorCycle();
	        }
	    }
	    var handler = setInterval(transition, iteration);
	})();

};