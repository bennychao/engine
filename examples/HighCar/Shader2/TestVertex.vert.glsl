#version 300 es
//#define GL2
#define VERTEXSHADER    
    //attribute
in vec3 aPosition;
in vec3 aNormal;
in vec2 aUv0;


uniform vec3 view_position;
uniform mat4 matrix_model;
uniform mat4 matrix_view;  
uniform mat4 matrix_viewProjection;
uniform mat3 matrix_normal;
uniform float uTime;

uniform vec3  uLightPos; 

//uniform vec3  u;

out vec2 vUv0;
out float vertOutTexCoord;
out vec3 lightDir;
out vec3 viewDir;
out vec3 vNormal;
out vec3 vPositionW;

void main(void)
{
    mat4 modelView = matrix_view * matrix_model;
    vec4 vertexPos = modelView * vec4(aPosition, 1.0);
    vec3 vertexEyePos = vertexPos.xyz / vertexPos.w;
    vec3 eyeNormal = normalize(matrix_normal * aNormal);
    
    lightDir = normalize(uLightPos - vertexEyePos);

    // Dot product gives us diffuse intensity. The diffuse intensity will be
    // used as the 1D color texture coordinate to look for the color of the
    // resulting fragment (see fragment shader).
    vertOutTexCoord = max(0.0, dot(eyeNormal, lightDir));
    
    vNormal = eyeNormal;
    
    vec4 pos = matrix_model * vec4(aPosition, 1.0);
    //pos.x += sin(uTime + pos.y * 4.0) * 0.1;
    vUv0 = aUv0;
    
    viewDir = normalize(view_position - pos.xyz);
    vPositionW = pos.xyz;
    
    gl_Position = matrix_viewProjection * pos;
    
    
}