
uniform sampler2D uDiffuseMap;

varying vec2 vUvMirror;
varying vec4 vUvMirror2;

float lerp(float a, float b, float w) {
  return a + w*(b-a);
}

vec3 lerp(vec3 a, vec3 b, vec3 w) {
  return a + w*(b-a);
}

vec3 lerp(vec3 a, vec3 b, float w) {
  return a + w*(b-a);
}

vec3 zunpackNormal(vec4 nmap) {
    vec3 normal;
    normal.xy = nmap.wy * 2.0 - 1.0;
    normal.z = sqrt(1.0 - saturate(dot(normal.xy, normal.xy)));
    return normal;
}

/*
float fresnel(vec3 worldViewDir, vec3 worldNormal)
{
    float fresnel = _FresnelScale + (1.0 - _FresnelScale) * pow(1.0 - dot(worldViewDir, worldNormal), _FresnelRange);
    //float fresnel = pow(1.0 - dot(worldViewDir, worldNormal), 2.0);
    return saturate(fresnel);
}
    
*/

void main(void)
{
    //dAlbedo = vec3(1.0);
    
    vec3 mirrorColor = texture2D(uDiffuseMap, vUvMirror).xyz;
    
    vec3 mirrorColor2 = texture2DProj(uDiffuseMap, vUvMirror2).xyz;
    
    dAlbedo = texture2DSRGB(texture_diffuseMap, vUv0).xyz;
    
    dAlbedo = lerp(dAlbedo, mirrorColor2, 0.5);
    //dAlbedo = mirrorColor;
    
    //dAlbedo = vec3(1.0, 0.0, 1.0);
    
    dDiffuseLight= vec3(0); //ret;//vec3(1.0, 0.0, 1.0);
    dSpecularLight=vec3(0);
    dReflection=vec4(0);
    dSpecularity=vec3(1.0, 0.0, 0.0);