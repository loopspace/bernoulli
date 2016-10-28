var canvas; 
var form;
var lField;
var nField;
var pField;
var ctx;
var strokeWidth = 1;
var bgHue;
var grHue;
var txtHue;
var p = 1;
var l = 0;
var n = 30;
var lh = 30;
var border;
var width;
var height;
var fwidth;
var fheight;
var bwidth;
var bheight;
var gwidth;
var gheight;
var txtWidth;
var bw;
var inTouch;
var drawn;
var colourList;

// Binomial functions
function binom(n,k) {
    if (k > n/2)
	return binom(n,n-k);
    return factorial(n,n-k+1)/factorial(k,1);
}

function factorial(m,n) {
    return factorial_aux(1,m,n);
}

function factorial_aux(l,m,n) {
    if (m < n) {
        return l;
    } else {
        return factorial_aux(l*m,m-1,n);
    }
}

function clear() {
    ctx.save();
    ctx.fillStyle = "hsl(" + bgHue + ",100%,25%)";
    ctx.fillRect(0, 0, fwidth, fheight);
    // also fill bg (not necessary but looks nice when resizing)
    document.querySelector("body").style.backgroundColor = ctx.fillStyle;
    document.querySelector("form").style.color = "hsl(" + txtHue + ",100%,85%)";
    ctx.restore();
}


// drawing routine
function draw() {
    // clear background
    clear();
    ctx.save();
    ctx.fillStyle = "hsl("+grHue+",100%,50%)";
    ctx.strokeStyle = "white";
    ctx.lineWidth = strokeWidth;
    ctx.translate(border,border);
    var mode = Math.floor(p);
    var ht = Math.pow(p,mode) * Math.exp(-p) /factorial(mode,1);
    var tm,x,y,q,lbl;
    for (var i=l;i<=n;i++) {
	x = bw*(i-l) + bwidth;
	q = Math.pow(p,i) * Math.exp(-p)/factorial(i,1);
	y = (gheight - theight)/ht * q;
	ctx.fillStyle = "hsl("+grHue+",100%,50%)";
	ctx.fillRect(x,gheight - y,bw,y);
	ctx.strokeStyle = "black";
	ctx.strokeRect(x,gheight-y,bw,y);
	if (n < 50 || (n < 250 && i%5 == 0) || i%10 ==0) {
	    tm = ctx.measureText(i);
	    ctx.fillStyle = "hsl("+txtHue+",100%,85%)";
	    ctx.fillText(i,x+bw/2-tm.width/2,height-10);
	}
	ctx.strokeStyle = "hsl("+txtHue+",100%,85%)";
	ctx.beginPath();
	ctx.moveTo(x,gheight);
	ctx.lineTo(x,gheight+10);
	ctx.stroke();
	ctx.moveTo(bwidth,gheight - y);
	ctx.lineTo(bwidth/2,gheight - y);
	ctx.stroke();
	lbl = q.toFixed(2).replace(/^0*/,'');
	ctx.fillStyle = "hsl("+txtHue+",100%,85%)";
	if (lbl != '.00')
	    if (i < (n+1)*p) {
		ctx.fillText(lbl,x+bw-txtWidth-5,gheight - y-5);
	    } else {
		ctx.fillText(lbl,x+5,gheight - y-5);
	    }
    }
    ctx.strokeStyle = "hsl("+txtHue+",100%,85%)";
    ctx.beginPath();
    x = bw*(n+1) + bwidth;
    ctx.moveTo(x,gheight);
    ctx.lineTo(x,gheight+10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bwidth/2,gheight);
    ctx.lineTo(width,gheight);
    ctx.moveTo(bwidth,gheight);
    ctx.lineTo(bwidth,0);
    ctx.stroke();
    var palette = ctx.createLinearGradient(0,0,10,gheight);
    palette.addColorStop(0,'hsl(0,100%,50%)');
    palette.addColorStop(0.167,'hsl(60,100%,50%)');
    palette.addColorStop(0.333,'hsl(120,100%,50%)');
    palette.addColorStop(0.5,'hsl(180,100%,50%)');
    palette.addColorStop(0.667,'hsl(240,100%,50%)');
    palette.addColorStop(0.833,'hsl(300,100%,50%)');
    palette.addColorStop(1,'hsl(360,100%,50%)');
    ctx.beginPath();
    ctx.rect(width+5,0,10,gheight);
    ctx.fillStyle = palette;
    ctx.fill();
    ctx.restore();
    if (!drawn)
	colourList = ctx.getImageData(width+10+border,border,1,gheight+border);
    drawn = true;
}

function resetBernoulli() {
    l = parseInt(lField.value,10);
    n = parseInt(nField.value,10);
    p = parseFloat(pField.value);
    if (p == 1) p = .999999; // p = 1 causes an error
    bw = gwidth/((n-l+1)+1.5);
    draw();
}

function processForm() {
    switch (this.value) {
	case 'incl':
	lField.value = Math.max(0,Math.min(n-1,l + 5));
	break;
	case 'decl':
	lField.value = Math.max(0,Math.min(n-1,l - 5));
	break;
	case 'incll':
	lField.value = Math.max(0,Math.min(n-1,l + 1));
	break;
	case 'decll':
	lField.value = Math.max(0,Math.min(n-1,l - 1));
	break;
	case 'incn':
	nField.value = Math.max(l+1,n + 5);
	break;
	case 'decn':
	nField.value = Math.max(l+1,n - 5);
	break;
	case 'incnn':
	nField.value = Math.max(l+1,n + 1);
	break;
	case 'decnn':
	nField.value = Math.max(l+1,n - 1);
	break;
	case 'incp':
	pField.value = Math.round(100*(p + 1))/100;
	break;
	case 'decp':
	pField.value = Math.round(100*Math.max(0,p - 1))/100;
	break;
	case 'incpp':
	pField.value = Math.round(100*(p + .1))/100;
	break;
	case 'decpp':
	pField.value = Math.round(100*Math.max(0,p - .1))/100;
	break;
	case 'incppp':
	pField.value = Math.round(100*(p + .01))/100;
	break;
	case 'decppp':
	pField.value = Math.round(100*Math.max(0,p - .01))/100;
	break;
    }
    resetBernoulli();
    return false;
}

function setSize() {
    var form = document.getElementById('values');
    fheight=window.innerHeight - form.offsetHeight;
    fwidth=window.innerWidth;
    canvas.height=fheight;
    canvas.width=fwidth;
    border = 20;
    width = fwidth - 2*border;
    height = fheight - 2*border;
    gwidth = width - bwidth;
    gheight = height - bheight;
}

function resize() {
    setSize();
    resetBernoulli();
}

function doMouseDown(e) {
    var coords = getRelativeCoords(e);
    var yc = coords.y - border;
    if (coords.x > width+border+5 && coords.x < width+border+15 && yc > 0 && yc < gheight) {
	inTouch = true;
	setColour(rgbToHsl(colourList.data[4*yc],colourList.data[4*yc+1],colourList.data[4*yc+2])*360);
	draw();
    }
}

function doMouseMove(e) {
    if (inTouch) {
	var coords = getRelativeCoords(e);
	var yc = coords.y - border;
	if (yc >= 0 && yc < gheight) {
	    setColour(rgbToHsl(colourList.data[4*yc],colourList.data[4*yc+1],colourList.data[4*yc+2])*360);
	    draw();
	}
    }
}

function doMouseUp(e) {
    if (inTouch) {
	var coords = getRelativeCoords(e);
	var yc = coords.y - border;
	if (yc > 0 && yc < gheight) {
	    setColour(rgbToHsl(colourList.data[4*yc],colourList.data[4*yc+1],colourList.data[4*yc+2])*360);
	    draw();
	}
    }
    inTouch = false;
}

function doMouseOut(e) {
    inTouch = false;
}


function getRelativeCoords(event) {
    if (event.offsetX !== undefined && event.offsetY !== undefined) { return { x: event.offsetX, y: event.offsetY }; }
    return { x: event.layerX, y: event.layerY };
}

function setColour(h) {
    bgHue = h;
    grHue = h;
    txtHue = bgHue + 180;
    if (window.localStorage)
	localStorage.setItem('bgHue',h);
}

window.addEventListener('resize', resize, false);
// init
function init() {
    // get context
    canvas=document.querySelector("#canvas");
    canvas.addEventListener("mousedown",doMouseDown,false);
    canvas.addEventListener("mouseup",doMouseUp,false);
    canvas.addEventListener("mouseout",doMouseOut,false);
    canvas.addEventListener("mousemove",doMouseMove,false);
    ctx = canvas.getContext("2d");
    ctx.font = "12px \"Trebuchet MS\"";
    var tm = ctx.measureText(".00");
    txtWidth = tm.width;
    bwidth = tm.width + 10;
    bheight = 30;
    theight = 20;
    setSize();

    lField = document.getElementById("lValue");
    nField = document.getElementById("nValue");
    pField = document.getElementById("pValue");
    var form = document.getElementById('values');
    var elts = form.elements;
    for (var i = 0, element; element = elts[i++];) {
	if (element.type === "button")
		element.onclick = processForm;
    }
    // init some values
    var h;
    if (window.localStorage) 
	h = localStorage.bgHue;
    if (!h) h = 100;
    setColour(h);
    resetBernoulli();
}

// From http://stackoverflow.com/a/9493060/315213
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h;

    if(max == min){
        h = 0; // achromatic
    }else{
        var d = max - min;
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return h;
}
