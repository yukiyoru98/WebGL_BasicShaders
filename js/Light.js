
var Light = function(){
    this.active = 0.0;
    this.position = new Float32Array(3);
    
    this.diffuseColor = new Float32Array([1, 1, 1]);
    this.specularColor = new Float32Array([1, 1, 1]);

    this.getActive = function (){
        return this.active == 1.0? true :false;
    }

    this.setActive = function (active){
        this.active = active ? 1.0 : 0.0;
    }

    this.move = function (val, axis) {
        this.position[axis] = val;
    };
    
    this.rotate = function (val, axis) {
        this.rotation[axis] = val;
    };

    this.setDiffuseColor = function (color){
        this.diffuseColor = color;
    }

    this.setSpecularColor = function (color){
        this.specularColor = color;
    }
}

function html_appendLight(index, light){
    var active = light.getActive() ? 'checked' : "";
    var str = `<div class="lightProperties" data-lightindex="${index}">
    <input type="checkbox" id="light${index}_active" onclick="setLightActive(${index}, this.checked);" ${active}>
    <label for="light${index}_active">Light ${index}</label>
    <br/>
    Position
    <br/>
    <label>X: </label>
    <input class="PropertySlider" type="range" name="positionX" min="-100" max="100" value="${light.position[0]}"
            oninput="moveLight(this, this.value, 0);">
    <span name="positionX_value">${light.position[0]}</span>
    
    <br/>
    <label>Y: </label>
    <input class="PropertySlider" type="range" name="positionY" min="-100" max="100" value="${light.position[1]}"
            oninput="moveLight(this, this.value, 1);">
    <span name="positionY_value">${light.position[1]}</span>

    <br/>
    <label>Z: </label>
    <input class="PropertySlider" type="range" name="positionZ" min="-100" max="100"  value="${light.position[2]}"
            oninput="moveLight(this, this.value, 2);">
    <span name="positionZ_value">${light.position[2]}</span>

    <br/>
    <label>Diffuse: </label>
    <input type="color" class="PropertyColorPicker" name="diffuse" value="${color_floatArray_to_hexStr(light.diffuseColor)}" onchange='changeLightColor(${index}, "diffuse", this.value);'>
    <br/>
    <label>Specular: </label>
    <input type="color" class="PropertyColorPicker" name="specular" value="${color_floatArray_to_hexStr(light.specularColor)}" onchange='changeLightColor(${index}, "specular", this.value);'>
</div>`;
    $("#lightLayoutGroup").append(str);

}