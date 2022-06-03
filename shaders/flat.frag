#version 300 es
//FRAGMENT SHADER
precision mediump float;
in vec3 vertexPosition;
in vec3 lightDirection[3];
in vec4 fragColor;
in vec2 vTexCoord;

uniform vec3 uAmbientLight;
uniform vec3 uDiffuseLight[3];
uniform vec3 uSpecularLight[3];
uniform float uLightActive[3];

uniform float uMaterialShininess;
uniform vec3 uMaterialAmbient;
uniform vec3 uMaterialDiffuse;
uniform vec3 uMaterialSpecular;

uniform int uApplyTexture;
uniform sampler2D uSampler;

out vec4 FragColor;

void main(){

    vec3 dx = dFdx(vertexPosition);
	vec3 dy = dFdy(vertexPosition);
	vec3 tn = normalize(cross(dx, dy));

    vec3 eyeDirection = normalize(-vertexPosition.xyz);
    //Ambient
    vec3 totalLight = uAmbientLight * uMaterialAmbient;
    for(int i=0; i<3; i++){
        if(uLightActive[i] == 0.0)    continue;

        //Diffuse
        float diffuseWeight = max(dot(tn, lightDirection[i]), 0.0);
        vec3 diffuseColor = uDiffuseLight[i] * diffuseWeight * uMaterialDiffuse;

        //Specular
        vec3 reflectDirection = reflect(-lightDirection[i], tn);
        float specularWeight = pow(max(dot(reflectDirection, eyeDirection), 0.0), uMaterialShininess); 
        vec3 specularColor = uSpecularLight[i] * specularWeight * uMaterialSpecular;

        //total
        totalLight += diffuseColor + specularColor;
    }

    // if apply texture
    if(uApplyTexture == 1){
        vec4 texture_fragColor = texture(uSampler, vTexCoord);
        FragColor = vec4(texture_fragColor.rgb * totalLight, texture_fragColor.a);
    }
    else
        FragColor = vec4(fragColor.rgb * totalLight, fragColor.a);
}