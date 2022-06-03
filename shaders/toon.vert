#version 300 es
// //VERTEX SHADER
layout(location  = 0) in vec3 aVertexPosition;
layout(location  = 1) in vec3 aVertexNormal;
layout(location  = 2) in vec3 aFrontColor;
layout(location = 3) in vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uPerspectiveMatrix;
uniform mat3 uNormalMatrix;

out vec3 vertexPosition;
out vec3 normalDirection;
out vec3 eyeDirection;
out vec4 fragColor;
out vec2 vTexCoord;

void main(){
    vertexPosition = (uModelViewMatrix * vec4((aVertexPosition), 1.0)).xyz;

    eyeDirection = normalize(-vertexPosition);

    normalDirection = normalize(uNormalMatrix * aVertexNormal);
    
    gl_Position = uPerspectiveMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    fragColor = vec4(aFrontColor.rgb, 1.0);
    vTexCoord = aTexCoord;

}
