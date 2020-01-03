//attribute vec4 vertex_tangent;
	varying vec3 vVertexTangent;

vec3 getTangent() {
    return normalize(matrix_normal * vertex_tangent.xyz);
}

vec3 getBinormal() {
    return cross(vNormalW, vTangentW) * vertex_tangent.w;
}

void main(void) {

    gl_Position = getPosition();
    vPositionW    = getWorldPosition();
    vVertexTangent = vertex_tangent.xyz;
    vNormalW    = dNormalW = normalize(matrix_normal * vertex_normal); // c dNormalMatrix
    vTangentW = getTangent();
    vBinormalW  = getBinormal();