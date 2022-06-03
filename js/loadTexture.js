
function initTexture(image, texUnit){
    
    var newTexture = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0 + texUnit); // Activate texture #0
	gl.bindTexture(gl.TEXTURE_2D, newTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);

    return newTexture;
}

function loadImage(filePath){
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.src = filePath;
    });
}