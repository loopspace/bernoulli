var canvas; 
var form;
var nField;
var pField;
var ctx;
var strokeWidth = 1;
var r, g, b;
var rc, gc, bc;
var p = 0.3;
var n = 20;
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

// Binomial functions
function binom(n,k) {
    return factorial(1,n)/(factorial(1,k)*factorial(1,n-k));
}

function factorial(m,n) {
    if (n <= 0) {
        return m;
    } else {
        return factorial(m*n,n-1);
    }
}

function clear() {
    ctx.save();
    ctx.fillStyle = "rgb("+r+","+g+","+b+")";
    ctx.fillRect(0, 0, fwidth, fheight);
    // also fill bg (not necessary but looks nice when resizing)
    document.querySelector("body").style.backgroundColor = ctx.fillStyle;
    ctx.restore();
}


// drawing routine
function draw() {
    // clear background
    clear();
    ctx.save();
    ctx.fillStyle = "rgb("+rc+","+gc+","+bc+")";
    ctx.strokeStyle = "white";
    ctx.lineWidth = strokeWidth;
    ctx.translate(border,border);
    var mode = Math.floor((n+1)*p);
    var ht = binom(n,mode)*Math.pow(p,mode) * Math.pow(1-p,n-mode);
    var tm,x,y,q,lbl;
    for (var i=0;i<=n;i++) {
	x = bw*i + bwidth;
	q = binom(n,i)*Math.pow(p,i) * Math.pow(1-p,n-i);
	y = (gheight - theight)/ht * q;
	ctx.fillStyle = "rgb("+rc+","+gc+","+bc+")";
	ctx.fillRect(x,gheight - y,bw,y);
	ctx.strokeStyle = "black";
	ctx.strokeRect(x,gheight-y,bw,y);
	if (n < 50 || i%5 == 0) {
	    tm = ctx.measureText(i);
	    ctx.fillStyle = "rgb("+rt+","+gt+","+bt+")";
	    ctx.fillText(i,x+bw/2-tm.width/2,height-10);
	}
	ctx.strokeStyle = "rgb("+rt+","+gt+","+bt+")";
	ctx.beginPath();
	ctx.moveTo(x,gheight);
	ctx.lineTo(x,gheight+10);
	ctx.stroke();
	ctx.moveTo(bwidth,gheight - y);
	ctx.lineTo(bwidth/2,gheight - y);
	ctx.stroke();
	lbl = q.toFixed(2).replace(/^0*/,'');
	ctx.fillStyle = "rgb("+rt+","+gt+","+bt+")";
	if (lbl != '.00')
	    if (i < (n+1)*p) {
		ctx.fillText(lbl,x+bw-txtWidth-5,gheight - y-5);
	    } else {
		ctx.fillText(lbl,x+5,gheight - y-5);
	    }
    }
    ctx.strokeStyle = "rgb("+rt+","+gt+","+bt+")";
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
    ctx.restore();
}

function resetBernoulli() {
    n = parseInt(nField.value,10);
    p = parseFloat(pField.value);
    if (p == 1) p = .999999; // p = 1 causes an error
    bw = gwidth/(n+1.5);
    draw();
}

function processForm() {
    switch (this.value) {
	case 'incn':
	nField.value = n + 5;
	break;
	case 'decn':
	nField.value = n - 5;
	break;
	case 'incnn':
	nField.value = n + 1;
	break;
	case 'decnn':
	nField.value = n - 1;
	break;
	case 'incp':
	pField.value = Math.round(100*Math.min(1,p + .1))/100;
	break;
	case 'decp':
	pField.value = Math.round(100*Math.max(0,p - .1))/100;
	break;
	case 'incpp':
	pField.value = Math.round(100*Math.min(1,p + .01))/100;
	break;
	case 'decpp':
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

window.addEventListener('resize', resize, false);
// init
function init() {
    // get context
    canvas=document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    ctx.font = "12px \"Trebuchet MS\"";
    var tm = ctx.measureText(".00");
    txtWidth = tm.width;
    bwidth = tm.width + 10;
    bheight = 30;
    theight = 20;
    setSize();

    nField = document.getElementById("nValue");
    pField = document.getElementById("pValue");
    var form = document.getElementById('values');
    var elts = form.elements;
    for (var i = 0, element; element = elts[i++];) {
	if (element.type === "button")
		element.onclick = processForm;
    }
    // init some values
    r = 40;
    g = 40;
    b = 127;
    rc = 50;
    gc = 200;
    bc = 200;
    rt = 200;
    gt = 160;
    bt = 0;
    resetBernoulli();
}
