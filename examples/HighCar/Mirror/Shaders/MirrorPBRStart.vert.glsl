//attribute vec4 vertex_tangent;
varying vec3 vVertexTangent;
varying vec2 vUvMirror;
varying vec4 vUvMirror2;

vec3 getTangent() {
    return normalize(matrix_normal * vertex_tangent.xyz); 
}

vec3 getBinormal() {
    return cross(vNormalW, vTangentW) * vertex_tangent.w;
}

vec4 ComputeScreenPos1(vec4 pos, float d) {
    vec4 o = pos * 0.5;
    o.xy = vec2(o.x / d + 0.5, o.y / d * 1.0 + 0.5);
    //o.xy = float2(o.x / o.w, o.y / o.w * 1) + 0.5f;
    //o.zw = pos.zw;
    return o;
}

vec4 ComputeScreenPos2(vec4 pos) {
    vec4 o = pos * 0.5f;
    o.xy = vec2(o.x, o.y * 1.0 ) + o.w;
    o.zw = pos.zw;
    return o;
}


void main(void) {

    vec4 pos = getPosition();
    //vec4 ppos = matrix_viewProjection * pos;
    gl_Position = pos;
    
    vUvMirror = ComputeScreenPos1(pos, pos.w).xy;    
    vUvMirror.x = 1.0 - vUvMirror.x;
    
    vUvMirror2 = ComputeScreenPos2(pos);
    
    vUvMirror2.x = vUvMirror2.w - vUvMirror2.x;
