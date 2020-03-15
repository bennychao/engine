#version 300 es

#define textureCube texture
#define texture2D texture
precision highp float;


uniform sampler2D uDiffuseMap;
uniform float material_reflectivity;

uniform mat3   matrix_normal;
  
in vec2 vUv0;
in vec2 vUv1;
in float vertOutTexCoord;
in vec3 lightDir;
in vec3 viewDir;
in vec3 vNormal;
in vec3 vPositionW;

out vec4 fragColor;



void main(void)
{
    vec4 normal = texture2D(uDiffuseMap, vUv1);
    

    fragColor = normal;
    //fragColor = vec4(vUv1,1,  1);
}