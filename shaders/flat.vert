#version 300 es
// VERTEX SHADER
layout(location = 0) in vec3 aVertexPosition;
layout(location = 1) in vec3 aVertexNormal;
layout(location = 2) in vec3 aFrontColor;
layout(location = 3) in vec2 aTexCoord;
uniform mat4 uModelViewMatrix;
uniform mat4 uPerspectiveMatrix;
uniform mat3 uNormalMatrix;
uniform vec3 uLightPosition[3];

out vec4 fragColor;
out vec3 vertexPosition;
out vec3 lightDirection[3];
out vec2 vTexCoord;

void main(){
    gl_Position = uPerspectiveMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    
    vertexPosition = (uModelViewMatrix * vec4((aVertexPosition), 1.0)).xyz;

    for(int i=0; i<3; i++){
       lightDirection[i] = normalize(uLightPosition[i] - vertexPosition);
    }

    fragColor = vec4(aFrontColor, 1.0);
    vTexCoord = aTexCoord;
}