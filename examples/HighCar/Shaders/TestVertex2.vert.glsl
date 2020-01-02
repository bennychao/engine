

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUv0;


uniform vec3 view_position;
uniform mat4 matrix_model;
uniform mat4 matrix_view;
uniform mat4 matrix_viewProjection;
uniform mat3 matrix_normal;
uniform float uTime;

uniform vec3  uLightPos;

//uniform vec3  u;

varying vec2 vUv0;
varying float vertOutTexCoord;
varying vec3 lightDir;
varying vec3 viewDir;


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
    

    
    vec4 pos = matrix_model * vec4(aPosition, 1.0);
    //pos.x += sin(uTime + pos.y * 4.0) * 0.1;
    vUv0 = aUv0;
    
    viewDir = normalize(view_position - vertexEyePos);
    
    gl_Position = matrix_viewProjection * pos;
    
    
}