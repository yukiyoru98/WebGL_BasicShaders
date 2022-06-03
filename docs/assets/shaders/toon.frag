#version 300 es
//FRAGMENT SHADER
precision mediump float;

in vec3 vertexPosition;
in vec3 normalDirection;
in vec3 eyeDirection;
in vec4 fragColor;
in vec2 vTexCoord;

uniform vec3 uLightPosition[3];
uniform vec3 uAmbientLight;
uniform vec3 uDiffuseLight[3];
uniform vec3 uSpecularLight[3];
uniform float uLightActive[3];

uniform vec3 uMaterialAmbient;
uniform vec3 uMaterialDiffuse;
uniform vec3 uMaterialSpecular;
uniform float uMaterialShininess;
uniform int uApplyTexture;
uniform sampler2D uSampler;

out vec4 FragColor;

void main(){

    float strength = 0.3;
    float brightness = 0.2;

    vec3 tn = normalize(normalDirection);
    vec3 t_eye = normalize(eyeDirection);
    
    //Ambient
    vec3 totalLight = uAmbientLight * uMaterialAmbient;

    for(int i=0; i<3; i++){
        if(uLightActive[i] == 0.0)    continue;
        vec3 lightDirection = normalize(uLightPosition[i] - vertexPosition);

        //Diffuse
        float diffuseWeight = max(dot(tn, lightDirection), 0.0);
        vec3 diffuseColor = uDiffuseLight[i] * diffuseWeight * uMaterialDiffuse;

        //Specular
        vec3 reflectDirection = reflect( -lightDirection, tn);
        float specularWeight = pow(max(dot(reflectDirection, t_eye), 0.0), uMaterialShininess);
        vec3 specularColor = uSpecularLight[i] * specularWeight * uMaterialSpecular;

        //Total
        totalLight += diffuseColor + specularColor;
    }
    
    totalLight = floor(totalLight / 0.3) * strength;

    // if apply texture
    if(uApplyTexture == 1){
        vec4 texture_fragColor = texture(uSampler, vTexCoord);
        FragColor = vec4(texture_fragColor.rgb * totalLight + brightness, texture_fragColor.a);
    }
    else
        FragColor = vec4(fragColor.rgb * totalLight + brightness, fragColor.a);

}