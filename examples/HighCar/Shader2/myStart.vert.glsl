//attribute vec4 vertex_tangent;
	varying vec3 vVertexTangent;

vec3 getTangent() {
    return normalize(dNormalMatrix * vertex_tangent.xyz);
}

vec3 getBinormal() {
    return cross(vNormalW, vTangentW) * vertex_tangent.w;
}

void main(void) {
    vVertexTangent = vertex_tangent.xyz;
    gl_Position = getPosition();
    vPositionW    = getWorldPosition();
    vNormalW    = dNormalW = getNormal(); // c dNormalMatrix
    vTangentW = getTangent();
    vBinormalW  = getBinormal();