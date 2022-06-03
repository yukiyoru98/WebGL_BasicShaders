#version 300 es
// //VERTEX SHADER
layout(location  = 0) in vec3 aVertexPosition;
layout(location  = 1) in vec3 aVertexNormal;
layout(location  = 2) in vec3 aFrontColor;
layout(location = 3) in vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uPerspectiveMatrix;
uniform mat3 uNormalMatrix;

uniform vec3 uLightPosition[3];
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

out vec4 fragColor;
out vec2 vTexCoord;
out vec3 fragLight;

void main(){
    gl_Position = uPerspectiveMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);

    vec3 normalDirection = normalize(uNormalMatrix * aVertexNormal);
    
    vec3 vertexPosition = (uModelViewMatrix * vec4((aVertexPosition), 1.0)).xyz;
    vec3 eyeDirection = normalize(-vertexPosition);

    //Ambient
    vec3 totalLight = uAmbientLight * uMaterialAmbient;

    for(int i=0; i<3; i++){
        if(uLightActive[i] == 0.0)    continue;
        vec3 lightDirection = normalize(uLightPosition[i] - vertexPosition);
        
        //Diffuse
        float diffuseWeight = max( dot(lightDirection, normalDirection), 0.0);
        vec3 diffuseColor = uDiffuseLight[i] * diffuseWeight * uMaterialDiffuse;

        //Specular
        vec3 reflectDirection = reflect(-lightDirection, normalDirection);
        float specularWeight = pow( max( dot( reflectDirection, eyeDirection), 0.0), uMaterialShininess);
        vec3 specularColor = uSpecularLight[i] * specularWeight * uMaterialSpecular;

        //Total
        totalLight += diffuseColor + specularColor;
    }
    
    // if apply texture
    // if(uApplyTexture == 1){
    //     vec4 texture_fragColor = texture(uSampler, aTexCoord);
    //     fragColor = vec4(texture_fragColor.rgb * totalLight, texture_fragColor.a);
    // }
    // else
    fragColor = vec4(aFrontColor.rgb * totalLight, 1.0);
    fragLight = totalLight;
    vTexCoord = aTexCoord;
}
