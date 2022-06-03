// common variables
const shadingNames = ["flat", "gouraud", "phong", "toon"];
// const shadingNames = ["flat"];
var gl;
var shaderProgram;
var shaderPrograms = {};
var allModels = [];
var modelViewMatrix = mat4.create();
var perspectiveMatrix  = mat4.create();
var lights = [];
var ambientLight = new Float32Array([0.2, 0.2, 0.2]);

const myTextureUnit = 0;
var myTexture;

var globalRotationAngle = 180;
var lastTime = 0;


function initGL(canvas) {
    try {
        gl = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl");
        resizeCanvasToDisplaySize(gl);
        
    } 
    catch (e) {
    }

    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function initShaders() {
    shadingNames.forEach((shading) =>{
        var program = initShader(gl, shading);
        shaderPrograms[shading] = program;
    });
}

function initLights(){
    var posX = -20;
    var posY = -50;
    for(var i=0; i<3; i++){
        var light = new Light();
        light.position[0] = posX;
        light.position[1] = posY;
        if(i == 0){
            light.setActive(true);
            // light.diffuseColor = color_red;
            // light.specularColor = color_red;
        }
        // else if (i == 1) {
        //     light.diffuseColor = color_green;
        //     light.specularColor = color_green;
        // }
        // else{
        //     light.diffuseColor = color_blue;
        //     light.specularColor = color_blue;
        // }

        lights.push(light);
        posX += 20;
        posY += 50;
        html_appendLight(i, light);
    }

}

function setShaderUniforms(program, model) {

    gl.uniformMatrix4fv(program.pMatrixUniform, false, perspectiveMatrix);
    gl.uniformMatrix4fv(program.mvMatrixUniform, false, modelViewMatrix);

    var normalMatrix = mat3.create();
    mat4.toInverseMat3(modelViewMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(program.nMatrixUniform, false, normalMatrix);

    var diffuseColors = [];
    var specularColors = [];
    var lightPositions = [];
    var lightActives = [];

    for(var i=0; i<3; i++){ //3 lights
        for(var j =0; j<3; j++){ //rgb, xyz
            diffuseColors.push(lights[i].diffuseColor[j]);
            specularColors.push(lights[i].specularColor[j]);
            lightPositions.push(lights[i].position[j]);
        }
        lightActives.push(lights[i].active);
    }
    
    gl.uniform3fv(program.ambientLightUniform, ambientLight);
    gl.uniform3fv(program.diffuseLightUniform, diffuseColors);
    gl.uniform3fv(program.specularLightUniform, specularColors);
    gl.uniform3fv(program.lightPositionUniform, lightPositions);
    gl.uniform1fv(program.lightActiveUniform, lightActives);
    
    gl.uniform1f(program.materialShininessUniform, model.materialShininess);
    gl.uniform3fv(program.materialAmbientUniform, model.ambientColor);
    gl.uniform3fv(program.materialDiffuseUniform, model.diffuseColor);
    gl.uniform3fv(program.materialSpecularUniform, model.specularColor);

    gl.uniform1i(program.applyTextureUniform, model.applyTexture);
    
    gl.activeTexture(gl.TEXTURE0 + myTextureUnit);
    gl.bindTexture(gl.TEXTURE_2D, myTexture);

    gl.uniform1i(program.samplerUniform, myTextureUnit);
}

function drawModel(model){
    var program = shaderPrograms[model.shading];
    gl.useProgram(program);

    if (model.positionBuffer   == null || 
        model.normalBuffer     == null || 
        model.colorBuffer == null) {
        
        return;
    }

    // Setup Projection Matrix
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, perspectiveMatrix);

    // Setup Model-View Matrix
    mat4.identity(modelViewMatrix);
    
    mat4.translate(modelViewMatrix, model.position);
    
    // animation
    mat4.rotate(modelViewMatrix, degToRad(globalRotationAngle), [0, 1, 0]);
    
    mat4.rotateX(modelViewMatrix, degToRad(model.rotation[0]));
    mat4.rotateY(modelViewMatrix, degToRad(model.rotation[1]));
    mat4.rotateZ(modelViewMatrix, degToRad(model.rotation[2]));
    mat4.shearY_by_X(modelViewMatrix, model.shearY[0]);
    
    mat4.scale(modelViewMatrix, model.size);
    
    mat4.rotateX(modelViewMatrix, degToRad(model.defaultRotation[0]));
    mat4.rotateY(modelViewMatrix, degToRad(model.defaultRotation[1]));
    mat4.rotateZ(modelViewMatrix, degToRad(model.defaultRotation[2]));
    
    setShaderUniforms(program, model);

    // Setup model position data
    gl.bindBuffer(gl.ARRAY_BUFFER, model.positionBuffer );
    gl.vertexAttribPointer(0, 
                            model.positionBuffer .itemSize, 
                            gl.FLOAT, 
                            false, 
                            0, 
                            0);

    // Setup model normal data
    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.vertexAttribPointer(1, 
                            model.normalBuffer.itemSize, 
                            gl.FLOAT, 
                            false, 
                            0, 
                            0);
                            
    // Setup model front color data
    gl.bindBuffer(gl.ARRAY_BUFFER, model.colorBuffer);
    gl.vertexAttribPointer(2, 
                            model.colorBuffer.itemSize, 
                            gl.FLOAT, 
                            false, 
                            0, 
                            0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.texCoordBuffer);
    gl.vertexAttribPointer(3, 
        model.texCoordBuffer.itemSize, 
        gl.FLOAT, 
        false, 
        0, 
        0);

    gl.drawArrays(gl.TRIANGLES, 0, model.positionBuffer.numItems);
}

function drawScene() {
    resizeCanvasToDisplaySize(gl);
    
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    allModels.forEach(function(model){
        drawModel(model);
    });
}

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        globalRotationAngle += 0.03 * elapsed;
    }
    
    lastTime = timeNow;
}

function tick() {
    requestAnimFrame(tick);
    drawScene();
    animate();
}

const webGLStart = async () => {
	const image = await loadImage('../textures/wood.jpg');
    console.log('image loaded');

    var canvas = document.getElementById("ICG-canvas");
    initGL(canvas);
    myTexture = initTexture(image, myTextureUnit);
    initShaders();
    initLights();
    initModels();
    gl.clearColor(0.7, 0.7, 0.7, 1.0);
    gl.enable(gl.DEPTH_TEST);

    tick();
};