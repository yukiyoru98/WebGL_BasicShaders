
const color_red = new Float32Array([1, 0, 0]);
const color_green = new Float32Array([0, 1, 0]);
const color_blue = new Float32Array([0, 0, 1]);

function color_hexStr_to_floatArray(color) {
    const r = parseFloat(parseInt(color.substr(1,2), 16) / 255);
    const g = parseFloat(parseInt(color.substr(3,2), 16) / 255);
    const b = parseFloat(parseInt(color.substr(5,2), 16) / 255);
    var rgb = [r, g, b];
    return rgb;
}

function color_floatArray_to_hexStr(color){
    var r = parseInt(color[0] * 255).toString(16);
    var g = parseInt(color[1] * 255).toString(16);
    var b = parseInt(color[2] * 255).toString(16);
    if (r.length == 1)  r = "0" + r;
    if (g.length == 1)  g = "0" + g;
    if (b.length == 1)  b = "0" + b;  

    return "#" + r + g + b;
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function loadTextResource(url) {
    console.log("HHHH");
    var request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);
    if (request.status === 200) {
        return request.responseText;
    }
    return "";
}

function resizeCanvasToDisplaySize(gl) {
    var canvas = gl.canvas;
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    const needResize = canvas.width  !== displayWidth ||
                       canvas.height !== displayHeight;

    if (needResize) {
        // Make the canvas the same size
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
        gl.viewportWidth  = canvas.width;
        gl.viewportHeight = canvas.height;
    }

    return needResize;
  }