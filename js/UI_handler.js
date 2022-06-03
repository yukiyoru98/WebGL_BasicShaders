// Select Shading
function SelectShading(dropDownList){
    var modelIndex = $(dropDownList).closest(".modelProperties").data("modelindex");
    allModels[modelIndex].setShading(dropDownList.value);
}
function ApplyTexture(index, checked){
    allModels[index].applyTexture = checked ? 1 : 0;
}
// Light 
function setLightActive(index, checked){
    lights[index].setActive(checked);
}

function changeLightColor(index, lightColorType, value){
    var color = color_hexStr_to_floatArray(value);
   
    if(lightColorType == "diffuse")
        lights[index].setDiffuseColor(color);
    else if(lightColorType == "specular")
        lights[index].setSpecularColor(color);
}

function moveLight(slider, value, axis) {
    
    var label = $(slider).next("span");
    label.html(value);
    
    var index = $(slider).closest(".lightProperties").data("lightindex");
    lights[index].move(value, axis);
}

// Model transformation
//translation
function move(slider, value, axis) {
    var label = $(slider).next("span");
    label.html(value);
    
    var modelIndex = $(slider).closest(".modelProperties").data("modelindex");
    allModels[modelIndex].move(value, axis);
}

//rotation
function rotate(slider, value, axis){
    var label = $(slider).next("span");
    label.html(value);
    
    var modelIndex = $(slider).closest(".modelProperties").data("modelindex");
    allModels[modelIndex].rotate(value, axis);
    
}

//scale
function scale(slider, value, axis) {
    var label = $(slider).next("span");
    label.html(slider.value);
    
    var modelIndex = $(slider).closest(".modelProperties").data("modelindex");
    allModels[modelIndex].scale(slider.value, axis);

    if(axis == -1){ //all axis
        slider = $(slider).siblings('.slider[name="scaleX"]');
        scale(slider, value, 0);
        slider = $(slider).siblings('.slider[name="scaleY"]');
        scale(slider, value, 1);
        slider = $(slider).siblings('.slider[name="scaleZ"]');
        scale(slider, value, 2);
    }
}

function shearY_by_X(slider, value){
    slider.value = value;
    $(slider).attr("value", value);

    var label = $(slider).next("span");
    label.html(slider.value);
    
    var modelIndex = $(slider).closest(".modelProperties").data("modelindex");
    allModels[modelIndex].shearY_by_X(slider.value);
}
//color
function changeMaterialColor(index, colorType, value){
    var color = color_hexStr_to_floatArray(value);
    if(colorType == "ambient")
        allModels[index].setAmbientColor(color);
    else if(colorType == "diffuse")
        allModels[index].setDiffuseColor(color);
    else if(colorType == "specular")
        allModels[index].setSpecularColor(color);
}

function changeAmbientColor(value){
    var color = color_hexStr_to_floatArray(value);
    ambientLight = color;
}

function setMaterialShininess(slider, value){
    console.log(value);
    var label = $(slider).next("span");
    label.html(value);
    var modelIndex = $(slider).closest(".modelProperties").data("modelindex");
    allModels[modelIndex].setShininess(value);
}