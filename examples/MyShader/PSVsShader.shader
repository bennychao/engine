1:	#version 300 es
2:	
3:	 
4:	
5:	#define attribute in
6:	#define varying out
7:	#define texture2D texture
8:	#define GL2
9:	#define VERTEXSHADER
10:	varying vec3 vPositionW;
11:	varying vec3 vNormalW;
12:	varying vec3 vTangentW;
13:	varying vec2 vUv0;
14:	
15:	attribute vec3 vertex_position;
16:	attribute vec3 vertex_normal;
17:	attribute vec4 vertex_tangent;
18:	attribute vec2 vertex_texCoord0;
19:	attribute vec2 vertex_texCoord1;
20:	attribute vec4 vertex_color;
21:	uniform mat4 matrix_viewProjection;
22:	uniform mat4 matrix_model;
23:	uniform mat3 matrix_normal;
24:	vec3 dPositionW;
25:	mat4 dModelMatrix;
26:	mat3 dNormalMatrix;
27:	vec3 dLightPosW;
28:	vec3 dLightDirNormW;
29:	vec3 dNormalW;
30:	#ifdef NINESLICED
31:	vec2 getUv0() {
32:	    vec2 uv = vertex_position.xz;
33:	    // offset inner vertices inside
34:	    // (original vertices must be in [-1;1] range)
35:	    vec2 positiveUnitOffset = clamp(vertex_position.xz, vec2(0.0), vec2(1.0));
36:	    vec2 negativeUnitOffset = clamp(-vertex_position.xz, vec2(0.0), vec2(1.0));
37:	    uv += (-positiveUnitOffset * innerOffset.xy + negativeUnitOffset * innerOffset.zw) * vertex_texCoord0.xy;
38:	    uv = uv * -0.5 + 0.5;
39:	    uv = uv * atlasRect.zw + atlasRect.xy;
40:	    vMask = vertex_texCoord0.xy;
41:	    return uv;
42:	}
43:	#else
44:	vec2 getUv0() {
45:	    return vertex_texCoord0;
46:	}
47:	#endif
48:	#ifdef PIXELSNAP
49:	    uniform vec4 uScreenSize;
50:	#endif
51:	mat4 getModelMatrix() {
52:	    #ifdef DYNAMICBATCH
53:	        return getBoneMatrix(vertex_boneIndices);
54:	    #elif defined(SKIN)
55:	        return matrix_model * (getBoneMatrix(vertex_boneIndices.x) * vertex_boneWeights.x +
56:	               getBoneMatrix(vertex_boneIndices.y) * vertex_boneWeights.y +
57:	               getBoneMatrix(vertex_boneIndices.z) * vertex_boneWeights.z +
58:	               getBoneMatrix(vertex_boneIndices.w) * vertex_boneWeights.w);
59:	    #elif defined(INSTANCING)
60:	        return mat4(instance_line1, instance_line2, instance_line3, instance_line4);
61:	    #else
62:	        return matrix_model;
63:	    #endif
64:	}
65:	vec4 getPosition() {
66:	    dModelMatrix = getModelMatrix();
67:	    vec3 localPos = vertex_position;
68:	    #ifdef NINESLICED
69:	        // outer and inner vertices are at the same position, scale both
70:	        localPos.xz *= outerScale;
71:	        // offset inner vertices inside
72:	        // (original vertices must be in [-1;1] range)
73:	        vec2 positiveUnitOffset = clamp(vertex_position.xz, vec2(0.0), vec2(1.0));
74:	        vec2 negativeUnitOffset = clamp(-vertex_position.xz, vec2(0.0), vec2(1.0));
75:	        localPos.xz += (-positiveUnitOffset * innerOffset.xy + negativeUnitOffset * innerOffset.zw) * vertex_texCoord0.xy;
76:	        vTiledUv = (localPos.xz - outerScale + innerOffset.xy) * -0.5 + 1.0; // uv = local pos - inner corner
77:	        localPos.xz *= -0.5; // move from -1;1 to -0.5;0.5
78:	        localPos = localPos.xzy;
79:	    #endif
80:	    vec4 posW = dModelMatrix * vec4(localPos, 1.0);
81:	    #ifdef SCREENSPACE
82:	        posW.zw = vec2(0.0, 1.0);
83:	    #endif
84:	    dPositionW = posW.xyz;
85:	    vec4 screenPos;
86:	    #ifdef UV1LAYOUT
87:	        screenPos = vec4(vertex_texCoord1.xy * 2.0 - 1.0, 0.5, 1);
88:	    #else
89:	        #ifdef SCREENSPACE
90:	            screenPos = posW;
91:	        #else
92:	            screenPos = matrix_viewProjection * posW;
93:	        #endif
94:	        #ifdef PIXELSNAP
95:	            // snap vertex to a pixel boundary
96:	            screenPos.xy = (screenPos.xy * 0.5) + 0.5;
97:	            screenPos.xy *= uScreenSize.xy;
98:	            screenPos.xy = floor(screenPos.xy);
99:	            screenPos.xy *= uScreenSize.zw;
100:	            screenPos.xy = (screenPos.xy * 2.0) - 1.0;
101:	        #endif
102:	    #endif
103:	    return screenPos;
104:	}
105:	vec3 getWorldPosition() {
106:	    return dPositionW;
107:	}
108:	vec3 getNormal() {
109:	    #ifdef SKIN
110:	        dNormalMatrix = mat3(dModelMatrix[0].xyz, dModelMatrix[1].xyz, dModelMatrix[2].xyz);
111:	    #elif defined(INSTANCING)
112:	        dNormalMatrix = mat3(instance_line1.xyz, instance_line2.xyz, instance_line3.xyz);
113:	    #else
114:	        dNormalMatrix = matrix_normal;
115:	    #endif
116:	    return normalize(dNormalMatrix * vertex_normal);
117:	}
118:	
119:	attribute vec4 vertex_tangent;
120:	
121:	vec3 getTangent() {
122:	    return normalize(dNormalMatrix * vertex_tangent.xyz);
123:	}
124:	
125:	vec3 getBinormal() {
126:	    return cross(vNormalW, vTangentW) * vertex_tangent.w;
127:	}
128:	
129:	void main(void) {
130:	    gl_Position = getPosition();111   vPositionW    = getWorldPosition();
131:	   vNormalW    = dNormalW = getNormal();
132:	   vec2 uv0 = getUv0();
133:	   vUv0 = uv0;
134:	}

ERROR: 0:119: 'vertex_tangent' : redefinition
ERROR: 0:130: 'vPositionW' : syntax error