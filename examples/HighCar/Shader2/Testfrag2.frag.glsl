
uniform sampler2D uMatCapMap;

//uniform mat4 matrix_view;
uniform mat3 matrix_normal;

uniform float _FresnelScale;
uniform float _FresnelRange;

uniform vec3 uMatColor;
uniform vec3 uFresnelColor;
	varying vec3 vVertexTangent;

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

float fresnel(vec3 worldViewDir, vec3 worldNormal)
{
    float fresnel = _FresnelScale + (1.0 - _FresnelScale) * pow(1.0 - dot(worldViewDir, worldNormal), _FresnelRange);
    //float fresnel = pow(1.0 - dot(worldViewDir, worldNormal), 2.0);
    return saturate(fresnel);
}


//void getTBN() {
//    dTBN = mat3(normalize(dTangentW), normalize(dBinormalW), normalize(dVertexNormalW));
//}



void main(void)
{
    dTangentW = vTangentW;
    dBinormalW = vBinormalW;
    
    getTBN();
    
    vec3 znormal = zunpackNormal(texture2D(texture_normalMap, vUv0));
    vec3 zdWorldName = dTBN * znormal;
    
    vec3 zNormal = normalize(matrix_normal * zdWorldName);
    dViewDirW = normalize(view_position - vPositionW);
    

     
    vec3 eyeNormal = zNormal * 0.5 + 0.5;
    
    vec3 cap = texture2D(uMatCapMap, eyeNormal.xy).xyz;
    
    //remap
    vec3 ret =(0.3 + cap * (1.0 - 0.3) / (1.0 - 0.0)) * uMatColor * 2.0;
    
    //vNormalW is vertex normal 
    float f = saturate(fresnel(dViewDirW, zNormal));   //vNormalW is vertex's normal
    
    ret = lerp(ret, uFresnelColor, f);
    
    //dAlbedo = uFresnelColor;//vec3(f, f, f);
    
    dAlbedo = normalize(eyeNormal);
    
    dDiffuseLight= vec3(0); //ret;//vec3(1.0, 0.0, 1.0);
    dSpecularLight=vec3(0);
    dReflection=vec4(0);
    dSpecularity=vec3(1.0, 0.0, 0.0);
    