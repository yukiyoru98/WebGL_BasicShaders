function Model(){
    this.name = "";
    this.shading = "flat";
    this.positionBuffer = undefined;
    this.normalBuffer = undefined;
    this.colorBuffer = undefined;
    this.texCoordBuffer = undefined;

    this.position = new Float32Array([0, 0, 0]);
    
    this.rotation = new Float32Array([0, 0, 0]); //in degrees
    this.defaultRotation = new Float32Array([0, 0, 0]); //in degrees

    this.sizeFactor = new Float32Array([1, 1, 1]);
    this.defaultSize = new Float32Array([1, 1, 1]);
    this.size = new Float32Array([1, 1, 1]);

    this.shearY = new Float32Array([0, 0]);

    this.ambientColor = new Float32Array([0.2, 0.2, 0.2]);
    this.diffuseColor = new Float32Array([1, 1, 1]);
    this.specularColor = new Float32Array([1, 1, 1]);
    this.materialShininess = 30.0;

    this.hasTexCoord = false;
    this.applyTexture = 0; //1: apply

    this.init = function (modelName, defaultProp, buffers) {
        this.name = modelName;
        this.defaultSize = new Float32Array(defaultProp.size);
        this.size = new Float32Array(defaultProp.size);
        this.defaultRotation = defaultProp.rotation;
        this.position = defaultProp.position;
        this.positionBuffer = buffers.position;
        this.normalBuffer = buffers.normal;
        this.colorBuffer = buffers.color;
        this.texCoordBuffer = buffers.texCoord;
        this.hasTexCoord = defaultProp.hasTexCoord;
    };

    this.setShading = function(shading){
        this.shading = shading;
    }

    this.move = function (val, axis) {
        this.position[axis] = val;
    };
    
    this.rotate = function (val, axis) {
        this.rotation[axis] = val;
    };

    this.scale = function (val, axis){
        if(axis == -1){ // all axis
            this.sizeFactor = [val, val, val];
            vec3.scaleAxis(this.defaultSize, this.sizeFactor, this.size);
        }
        else{
            this.sizeFactor[axis] = val;
            vec3.scaleAxis(this.defaultSize, this.sizeFactor, this.size);
        }
    }

    this.shearY_by_X = function (val){
        this.shearY[0] = val;
    }

    this.setAmbientColor = function (color){
        this.ambientColor = color;
    }

    this.setDiffuseColor = function (color){
        this.diffuseColor = color;
    }

    this.setSpecularColor = function (color){
        this.specularColor = color;
    }

    this.setShininess = function(val){
        this.materialShininess = val;
    }
}

function initModels(){ //get 3 models' name from html and load
    
    var defaultProps = loadModelDefaultProp("./model/modelDefaultProp.json");
    var model_posX = -20.0;
    const posX_spacing = 20;
    var model_posZ = -40.0;
    var index = 0;
    
    for( var modelName in defaultProps) {
        var newModel = new Model();
        var data = loadJSONModel("./model/" + modelName + ".json");
        var buffers = setupModelBuffers(gl, data);

        var _default = defaultProps[modelName];
        _default.position = [model_posX, 0, model_posZ];
        newModel.init(modelName, _default, buffers);
        allModels.push(newModel);

        html_appendModel(index, modelName, newModel);

        model_posX += posX_spacing;

        index += 1;
    }
}

function loadJSONModel(url) {
    var modelText = loadTextResource(url);
    return JSON.parse(modelText);
}

function loadModelDefaultProp(url) {
    var prop = loadTextResource(url);
    return JSON.parse(prop);
}

function setupModelBuffers(gl, jsonData) {
    // vertex position buffer
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(jsonData.vertexPositions), gl.STATIC_DRAW);
    positionBuffer.itemSize = 3;
    positionBuffer.numItems = jsonData.vertexPositions.length / 3;

    // vertex normal buffer
    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(jsonData.vertexNormals), gl.STATIC_DRAW);
    normalBuffer.itemSize = 3;
    normalBuffer.numItems = jsonData.vertexNormals.length / 3;

    // vertex color buffer
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(jsonData.vertexFrontcolors), gl.STATIC_DRAW);
    colorBuffer.itemSize = 3;
    colorBuffer.numItems = jsonData.vertexFrontcolors.length / 3;

    // texture coordinate buffer
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    if(jsonData.vertexTextureCoords != undefined){
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(jsonData.vertexTextureCoords), gl.STATIC_DRAW);
        texCoordBuffer.itemSize = 2;
        texCoordBuffer.numItems = jsonData.vertexFrontcolors.length / 2;
    }
    else{
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(0), gl.STATIC_DRAW);
        texCoordBuffer.itemSize = 2;
        texCoordBuffer.numItems = 0;
    }

    return {
        position: positionBuffer,
        normal: normalBuffer,
        color:  colorBuffer,
        texCoord: texCoordBuffer
    };
}

function html_appendModel(index, modelName, newModel){
    console.log(newModel);
    var str = `<div class="modelProperties" id="${modelName}Properties" data-modelindex="${index}" >
    ${modelName}:
    <select class="dropDownList" onchange="SelectShading(this);">
            <option value="flat">Flat</option>
            <option value="gouraud">Gouraud</option>
            <option value="phong">Phong</option>
            <option value="toon">Toon</option>
    </select>
    <p class="PropertyTopLabel">Material</p>
    <label>Ambient: </label>
    <input type="color" class="PropertyColorPicker" name="ambient" value="${color_floatArray_to_hexStr(newModel.ambientColor)}" onchange='changeMaterialColor(${index}, "ambient", this.value);'>
    <br/>
    <label>Diffuse: </label>
    <input type="color" class="PropertyColorPicker" name="diffuse" value="${color_floatArray_to_hexStr(newModel.diffuseColor)}" onchange='changeMaterialColor(${index}, "diffuse", this.value);'>
    <br/>
    <label>Specular: </label>
    <input type="color" class="PropertyColorPicker" name="specular" value="${color_floatArray_to_hexStr(newModel.specularColor)}" onchange='changeMaterialColor(${index}, "specular", this.value);'>
    <br/>
    <label>Shininess: </label>
    <input class="PropertySlider" type="range" name="shininess" min="1" max="150" value="${newModel.materialShininess}"
    oninput="setMaterialShininess(this, this.value);">
    <span name="shininess_value">${newModel.materialShininess}</span>
    <p class="PropertyTopLabel">Position</p>
    <span class="PropertySliderLabel">X:</span>
    <input class="PropertySlider" type="range" name="positionX" min="-100" max="100" value="${newModel.position[0]}"
            oninput="move(this, this.value, 0);">
    <span name="positionX_value">${newModel.position[0]}</span>
    
    <br/>
    <span class="PropertySliderLabel">Y:</span>
    <input class="PropertySlider" type="range" name="positionY" min="-100" max="100" value="${newModel.position[1]}"
            oninput="move(this, this.value, 1);">
    <span name="positionY_value">${newModel.position[1]}</span>

    <br/>
    <span class="PropertySliderLabel">Z:</span>
    <input class="PropertySlider" type="range" name="positionZ" min="-100" max="100" value="${newModel.position[2]}"
            oninput="move(this, this.value, 2);">
    <span name="positionZ_value">${newModel.position[2]}</span>
    
    <p class="PropertyTopLabel">Rotation</p>

    <span class="PropertySliderLabel">X:</span>
    <input class="PropertySlider" type="range" name="rotationX" min="0" max="360" value="0"
            oninput="rotate(this, this.value, 0);">
    <span name="rotationX_value">0</span>
    <br/>

    <span class="PropertySliderLabel">Y:</span>
    <input class="PropertySlider" type="range" name="rotationY" min="0" max="360" value="0"
            oninput="rotate(this, this.value, 1);">
    <span name="rotationX_value">0</span>
    <br/>

    <span class="PropertySliderLabel">Z:</span>
    <input class="PropertySlider" type="range" name="rotationZ" min="0" max="360" value="0"
            oninput="rotate(this, this.value, 2);">
    <span name="rotationZ_value">0</span>

    <p class="PropertyTopLabel">Scale</p>
    <span class="PropertySliderLabel">X:</span>
    <input class="PropertySlider" type="range" name="scaleX" min="0.1" max="10.0" step="0.1" value="1"
            oninput="scale(this, this.value, 0);">
    <span name="scale_valueX">1</span>
    <br/>

    <span class="PropertySliderLabel">Y:</span>
    <input class="PropertySlider" type="range" name="scaleY" min="0.1" max="10.0" step="0.1" value="1"
            oninput="scale(this, this.value, 1);">
    <span name="scale_valueY">1</span>
    <br/>

    <span class="PropertySliderLabel">Z:</span>
    <input class="PropertySlider" type="range" name="scaleZ" min="0.1" max="10.0" step="0.1" value="1"
            oninput="scale(this, this.value, 2);">
    <span name="scale_valueZ">1</span>

    <p class="PropertyTopLabel">Shear</p>
    <input class="PropertySlider" type="range" name="shearYX" min="-5.0" max="5.0" step="0.1" value="0"
            oninput="shearY_by_X(this, this.value);">
    <span name="shear_value_Y_X">0</span>
</div>`;
    $("#modelLayoutGroup").append(str);
    if(newModel.hasTexCoord){
        const textureCheckbox = 
        `<input type="checkbox" id="applyTexture" onclick="ApplyTexture(${index}, this.checked);">
        <label for="applyTexture">Texture</label>
        `;
        $(`#${modelName}Properties`).find(".dropDownList").first().after(textureCheckbox);
    }
}