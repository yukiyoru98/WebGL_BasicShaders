
function loadShaderSource(vs_path, fs_path) {
    vs_src = loadTextResource(vs_path);
    fs_src = loadTextResource(fs_path);
}
function makeShader(gl, src, type) {
    try {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    } catch (e) {
        console.log(e);
        return null;
    }
}
function initShader(gl, shading_method) {
    loadShaderSource("shaders/" + shading_method + ".vert", "shaders/" + shading_method + ".frag");

    var fragmentShader = makeShader(gl, fs_src, gl.FRAGMENT_SHADER);
    var vertexShader = makeShader(gl, vs_src, gl.VERTEX_SHADER);

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexFrontColorAttribute = gl.getAttribLocation(shaderProgram, "aFrontColor");
    gl.enableVertexAttribArray(shaderProgram.vertexFrontColorAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTexCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.pMatrixUniform  = gl.getUniformLocation(shaderProgram, "uPerspectiveMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");

    shaderProgram.ambientLightUniform = gl.getUniformLocation(shaderProgram, "uAmbientLight");
    shaderProgram.diffuseLightUniform = gl.getUniformLocation(shaderProgram, "uDiffuseLight");
    shaderProgram.specularLightUniform = gl.getUniformLocation(shaderProgram, "uSpecularLight");
    shaderProgram.lightPositionUniform = gl.getUniformLocation(shaderProgram, "uLightPosition");
    shaderProgram.lightActiveUniform = gl.getUniformLocation(shaderProgram, "uLightActive");
    
    shaderProgram.materialShininessUniform = gl.getUniformLocation(shaderProgram, "uMaterialShininess");
    shaderProgram.materialAmbientUniform = gl.getUniformLocation(shaderProgram, "uMaterialAmbient");
    shaderProgram.materialDiffuseUniform = gl.getUniformLocation(shaderProgram, "uMaterialDiffuse");
    shaderProgram.materialSpecularUniform = gl.getUniformLocation(shaderProgram, "uMaterialSpecular");
    
    shaderProgram.applyTextureUniform = gl.getUniformLocation(shaderProgram, "uApplyTexture");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

    
    return shaderProgram;
}