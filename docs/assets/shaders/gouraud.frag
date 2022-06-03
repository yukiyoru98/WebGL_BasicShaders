#version 300 es
//FRAGMENT SHADER
precision mediump float;

in vec4 fragColor;
in vec3 fragLight;
in vec2 vTexCoord;
out vec4 FragColor;

uniform int uApplyTexture;
uniform sampler2D uSampler;

void main(){
    if(uApplyTexture == 1){
        vec4 texture_fragColor = texture(uSampler, vTexCoord);
        FragColor = vec4(texture_fragColor.rgb * fragLight, texture_fragColor.a);
    }
    else
        FragColor = fragColor;
}