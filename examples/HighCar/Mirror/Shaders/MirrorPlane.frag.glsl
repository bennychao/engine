#version 300 es
#define varying in
#define gl_FragColor pc_fragColor
#define texture2D texture
    
precision highp float;  

uniform sampler2D uDiffuseMap;

varying vec2 vUv0;

out vec4 fragColor;

void main(void)
{
    fragColor = texture2D(uDiffuseMap, vUv0);
}