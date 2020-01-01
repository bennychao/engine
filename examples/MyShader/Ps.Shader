Failed to compile fragment shader:

1:	#version 300 es
2:	#define varying in
3:	out highp vec4 pc_fragColor;
4:	#define gl_FragColor pc_fragColor
5:	#define texture2D texture
6:	#define textureCube texture
7:	#define texture2DProj textureProj
8:	#define texture2DLodEXT textureLod
9:	#define texture2DProjLodEXT textureProjLod
10:	#define textureCubeLodEXT textureLod
11:	#define texture2DGradEXT textureGrad
12:	#define texture2DProjGradEXT textureProjGrad
13:	#define textureCubeGradEXT textureGrad
14:	#define GL2
15:	precision highp float;
16:	#ifdef GL2
17:	precision highp sampler2DShadow;
18:	#endif
19:	varying vec4 vMainShadowUv;
20:	varying vec3 vPositionW;
21:	varying vec3 vNormalW;
22:	varying vec2 vUv0;
23:	
24:	uniform vec3 view_position;
25:	uniform vec3 light_globalAmbient;
26:	float square(float x) {
27:	    return x*x;
28:	}
29:	float saturate(float x) {
30:	    return clamp(x, 0.0, 1.0);
31:	}
32:	vec3 saturate(vec3 x) {
33:	    return clamp(x, vec3(0.0), vec3(1.0));
34:	}
35:	vec4 dReflection;
36:	mat3 dTBN;
37:	vec3 dAlbedo;
38:	vec3 dNormalW;
39:	vec3 dVertexNormalW;
40:	vec3 dViewDirW;
41:	vec3 dReflDirW;
42:	vec3 dDiffuseLight;
43:	vec3 dSpecularLight;
44:	vec3 dLightDirNormW;
45:	vec3 dLightDirW;
46:	vec3 dLightPosW;
47:	vec3 dShadowCoord;
48:	vec3 dNormalMap;
49:	vec3 dSpecularity;
50:	float dGlossiness;
51:	float dAlpha;
52:	float dAtten;
53:	uniform vec3 light0_color;
54:	uniform vec3 light0_direction;
55:	uniform mat4 light0_shadowMatrix;
56:	uniform vec3 light0_shadowParams;
57:	uniform sampler2DShadow light0_shadowMap;
58:	
59:	vec3 unpackNormal(vec4 nmap) {
60:	    return nmap.xyz * 2.0 - 1.0;
61:	}
62:	uniform sampler2D texture_normalMap;
63:	uniform float material_bumpiness;
64:	void getNormal() {
65:	    vec3 normalMap = unpackNormal(texture2D(texture_normalMap, vUv0));
66:	    dNormalMap = normalMap;
67:	    normalMap = normalize(mix(vec3(0.0, 0.0, 1.0), normalMap, material_bumpiness));
68:	    dNormalW = dTBN * normalMap;
69:	}
70:	// http://www.thetenthplanet.de/archives/1180
71:	void getTBN() {
72:	    vec2 uv = vUv0;
73:	    // get edge vectors of the pixel triangle
74:	    vec3 dp1 = dFdx( vPositionW );
75:	    vec3 dp2 = dFdy( vPositionW );
76:	    vec2 duv1 = dFdx( uv );
77:	    vec2 duv2 = dFdy( uv );
78:	    // solve the linear system
79:	    vec3 dp2perp = cross( dp2, dVertexNormalW );
80:	    vec3 dp1perp = cross( dVertexNormalW, dp1 );
81:	    vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;
82:	    vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;
83:	    // construct a scale-invariant frame
84:	    float invmax = 1.0 / sqrt( max( dot(T,T), dot(B,B) ) );
85:	    dTBN = mat3( T * invmax, B * invmax, dVertexNormalW );
86:	}
87:	vec3 gammaCorrectInput(vec3 color) {
88:	    return pow(color, vec3(2.2));
89:	}
90:	float gammaCorrectInput(float color) {
91:	    return pow(color, 2.2);
92:	}
93:	vec4 gammaCorrectInput(vec4 color) {
94:	    return vec4(pow(color.rgb, vec3(2.2)), color.a);
95:	}
96:	vec4 texture2DSRGB(sampler2D tex, vec2 uv) {
97:	    vec4 rgba = texture2D(tex, uv);
98:	    rgba.rgb = gammaCorrectInput(rgba.rgb);
99:	    return rgba;
100:	}
101:	vec4 texture2DSRGB(sampler2D tex, vec2 uv, float bias) {
102:	    vec4 rgba = texture2D(tex, uv, bias);
103:	    rgba.rgb = gammaCorrectInput(rgba.rgb);
104:	    return rgba;
105:	}
106:	vec4 textureCubeSRGB(samplerCube tex, vec3 uvw) {
107:	    vec4 rgba = textureCube(tex, uvw);
108:	    rgba.rgb = gammaCorrectInput(rgba.rgb);
109:	    return rgba;
110:	}
111:	vec3 gammaCorrectOutput(vec3 color) {
112:	#ifdef HDR
113:	    return color;
114:	#else
115:	    color += vec3(0.0000001);
116:	    return pow(color, vec3(0.45));
117:	#endif
118:	}
119:	uniform float exposure;
120:	vec3 toneMap(vec3 color) {
121:	    return color * exposure;
122:	}
123:	vec3 addFog(vec3 color) {
124:	    return color;
125:	}
126:	vec3 decodeRGBM(vec4 rgbm) {
127:	    vec3 color = (8.0 * rgbm.a) * rgbm.rgb;
128:	    return color * color;
129:	}
130:	vec3 texture2DRGBM(sampler2D tex, vec2 uv) {
131:	    return decodeRGBM(texture2D(tex, uv));
132:	}
133:	vec3 textureCubeRGBM(samplerCube tex, vec3 uvw) {
134:	    return decodeRGBM(textureCube(tex, uvw));
135:	}
136:	vec3 fixSeams(vec3 vec, float mipmapIndex) {
137:	    float scale = 1.0 - exp2(mipmapIndex) / 128.0;
138:	    float M = max(max(abs(vec.x), abs(vec.y)), abs(vec.z));
139:	    if (abs(vec.x) != M) vec.x *= scale;
140:	    if (abs(vec.y) != M) vec.y *= scale;
141:	    if (abs(vec.z) != M) vec.z *= scale;
142:	    return vec;
143:	}
144:	vec3 fixSeams(vec3 vec) {
145:	    float scale = 1.0 - 1.0 / 128.0;
146:	    float M = max(max(abs(vec.x), abs(vec.y)), abs(vec.z));
147:	    if (abs(vec.x) != M) vec.x *= scale;
148:	    if (abs(vec.y) != M) vec.y *= scale;
149:	    if (abs(vec.z) != M) vec.z *= scale;
150:	    return vec;
151:	}
152:	vec3 fixSeamsStatic(vec3 vec, float invRecMipSize) {
153:	    float scale = invRecMipSize;
154:	    float M = max(max(abs(vec.x), abs(vec.y)), abs(vec.z));
155:	    if (abs(vec.x) != M) vec.x *= scale;
156:	    if (abs(vec.y) != M) vec.y *= scale;
157:	    if (abs(vec.z) != M) vec.z *= scale;
158:	    return vec;
159:	}
160:	vec3 cubeMapProject(vec3 dir) {
161:	    return dir;
162:	}
163:	vec3 processEnvironment(vec3 color) {
164:	    return color;
165:	}
166:	
167:	#undef MAPFLOAT
168:	
169:	#undef MAPCOLOR
170:	
171:	#undef MAPVERTEX
172:	
173:	#undef MAPTEXTURE
174:	#ifdef MAPCOLOR
175:	uniform vec3 material_diffuse;
176:	#endif
177:	#ifdef MAPTEXTURE
178:	uniform sampler2D texture_diffuseMap;
179:	#endif
180:	void getAlbedo() {
181:	    dAlbedo = vec3(1.0);
182:	    #ifdef MAPCOLOR
183:	        dAlbedo *= material_diffuse.rgb;
184:	    #endif
185:	    #ifdef MAPTEXTURE
186:	        dAlbedo *= texture2DSRGB(texture_diffuseMap, UV).CH;
187:	    #endif
188:	    #ifdef MAPVERTEX
189:	        dAlbedo *= gammaCorrectInput(saturate(vVertexColor.VC));
190:	    #endif
191:	}
192:	
193:	#undef MAPFLOAT
194:	
195:	#undef MAPCOLOR
196:	 #define MAPCOLOR
197:	
198:	#undef MAPVERTEX
199:	
200:	#undef MAPTEXTURE
201:	#ifdef MAPCOLOR
202:	uniform vec3 material_emissive;
203:	#endif
204:	#ifdef MAPFLOAT
205:	uniform float material_emissiveIntensity;
206:	#endif
207:	#ifdef MAPTEXTURE
208:	uniform sampler2D texture_emissiveMap;
209:	#endif
210:	vec3 getEmission() {
211:	    vec3 emission = vec3(1.0);
212:	    #ifdef MAPFLOAT
213:	        emission *= material_emissiveIntensity;
214:	    #endif
215:	    #ifdef MAPCOLOR
216:	        emission *= material_emissive;
217:	    #endif
218:	    #ifdef MAPTEXTURE
219:	        emission *= texture2DSAMPLE(texture_emissiveMap, UV).CH;
220:	    #endif
221:	    #ifdef MAPVERTEX
222:	        emission *= gammaCorrectInput(saturate(vVertexColor.VC));
223:	    #endif
224:	    return emission;
225:	}
226:	float antiAliasGlossiness(float power) {
227:	    float rlen = 1.0 / saturate(length(dNormalMap));
228:	    float toksvig = 1.0 / (1.0 + power * (rlen - 1.0));
229:	    return power * mix(1.0, toksvig, material_bumpiness);
230:	}
231:	
232:	#undef MAPFLOAT
233:	 #define MAPFLOAT
234:	
235:	#undef MAPCOLOR
236:	
237:	#undef MAPVERTEX
238:	
239:	#undef MAPTEXTURE
240:	void processMetalness(float metalness) {
241:	    const float dielectricF0 = 0.04;
242:	    dSpecularity = mix(vec3(dielectricF0), dAlbedo, metalness);
243:	    dAlbedo *= 1.0 - metalness;
244:	}
245:	#ifdef MAPFLOAT
246:	uniform float material_metalness;
247:	#endif
248:	#ifdef MAPTEXTURE
249:	uniform sampler2D texture_metalnessMap;
250:	#endif
251:	void getSpecularity() {
252:	    float metalness = 1.0;
253:	    #ifdef MAPFLOAT
254:	        metalness *= material_metalness;
255:	    #endif
256:	    #ifdef MAPTEXTURE
257:	        metalness *= texture2D(texture_metalnessMap, UV).CH;
258:	    #endif
259:	    #ifdef MAPVERTEX
260:	        metalness *= saturate(vVertexColor.VC);
261:	    #endif
262:	    processMetalness(metalness);
263:	}
264:	
265:	#undef MAPFLOAT
266:	 #define MAPFLOAT
267:	
268:	#undef MAPCOLOR
269:	
270:	#undef MAPVERTEX
271:	
272:	#undef MAPTEXTURE
273:	#ifdef MAPFLOAT
274:	uniform float material_shininess;
275:	#endif
276:	#ifdef MAPTEXTURE
277:	uniform sampler2D texture_glossMap;
278:	#endif
279:	void getGlossiness() {
280:	    dGlossiness = 1.0;
281:	    #ifdef MAPFLOAT
282:	        dGlossiness *= material_shininess;
283:	    #endif
284:	    #ifdef MAPTEXTURE
285:	        dGlossiness *= texture2D(texture_glossMap, UV).CH;
286:	    #endif
287:	    #ifdef MAPVERTEX
288:	        dGlossiness *= saturate(vVertexColor.VC);
289:	    #endif
290:	    dGlossiness += 0.0000001;
291:	}
292:	// Schlick's approximation
293:	uniform float material_fresnelFactor; // unused
294:	void getFresnel() {
295:	    float fresnel = 1.0 - max(dot(dNormalW, dViewDirW), 0.0);
296:	    float fresnel2 = fresnel * fresnel;
297:	    fresnel *= fresnel2 * fresnel2;
298:	    fresnel *= dGlossiness * dGlossiness;
299:	    dSpecularity = dSpecularity + (1.0 - dSpecularity) * fresnel;
300:	}
301:	uniform samplerCube texture_prefilteredCubeMap128;
302:	uniform samplerCube texture_prefilteredCubeMap64;
303:	uniform samplerCube texture_prefilteredCubeMap32;
304:	uniform samplerCube texture_prefilteredCubeMap16;
305:	uniform samplerCube texture_prefilteredCubeMap8;
306:	#ifndef PMREM4
307:	#define PMREM4
308:	uniform samplerCube texture_prefilteredCubeMap4;
309:	#endif
310:	uniform float material_reflectivity;
311:	void addReflection() {
312:	    // Unfortunately, WebGL doesn't allow us using textureCubeLod. Therefore bunch of nasty workarounds is required.
313:	    // We fix mip0 to 128x128, so code is rather static.
314:	    // Mips smaller than 4x4 aren't great even for diffuse. Don't forget that we don't have bilinear filtering between different faces.
315:	    float bias = saturate(1.0 - dGlossiness) * 5.0; // multiply by max mip level
316:	    int index1 = int(bias);
317:	    int index2 = int(min(bias + 1.0, 7.0));
318:	    vec3 fixedReflDir = fixSeams(cubeMapProject(dReflDirW), bias);
319:	    fixedReflDir.x *= -1.0;
320:	    vec4 cubes[6];
321:	    cubes[0] = textureCube(texture_prefilteredCubeMap128, fixedReflDir);
322:	    cubes[1] = textureCube(texture_prefilteredCubeMap64, fixedReflDir);
323:	    cubes[2] = textureCube(texture_prefilteredCubeMap32, fixedReflDir);
324:	    cubes[3] = textureCube(texture_prefilteredCubeMap16, fixedReflDir);
325:	    cubes[4] = textureCube(texture_prefilteredCubeMap8, fixedReflDir);
326:	    cubes[5] = textureCube(texture_prefilteredCubeMap4, fixedReflDir);
327:	    // Also we don't have dynamic indexing in PS, so...
328:	    vec4 cube[2];
329:	    for(int i = 0; i < 6; i++) {
330:	        if (i == index1) {
331:	            cube[0] = cubes[i];
332:	        }
333:	        if (i == index2) {
334:	            cube[1] = cubes[i];
335:	        }
336:	    }
337:	    // another variant
338:	    /*if (index1==0){ cube[0]=cubes[0];
339:	    }else if (index1==1){ cube[0]=cubes[1];
340:	    }else if (index1==2){ cube[0]=cubes[2];
341:	    }else if (index1==3){ cube[0]=cubes[3];
342:	    }else if (index1==4){ cube[0]=cubes[4];
343:	    }else if (index1==5){ cube[0]=cubes[5];}
344:	    if (index2==0){ cube[1]=cubes[0];
345:	    }else if (index2==1){ cube[1]=cubes[1];
346:	    }else if (index2==2){ cube[1]=cubes[2];
347:	    }else if (index2==3){ cube[1]=cubes[3];
348:	    }else if (index2==4){ cube[1]=cubes[4];
349:	    }else if (index2==5){ cube[1]=cubes[5];}*/
350:	    vec4 cubeFinal = mix(cube[0], cube[1], fract(bias));
351:	    vec3 refl = processEnvironment(decodeRGBM(cubeFinal).rgb);
352:	    dReflection += vec4(refl, material_reflectivity);
353:	}
354:	vec3 lessThan2(vec3 a, vec3 b) {
355:	    return clamp((b - a)*1000.0, 0.0, 1.0); // softer version
356:	}
357:	#ifndef UNPACKFLOAT
358:	#define UNPACKFLOAT
359:	float unpackFloat(vec4 rgbaDepth) {
360:	    const vec4 bitShift = vec4(1.0 / (256.0 * 256.0 * 256.0), 1.0 / (256.0 * 256.0), 1.0 / 256.0, 1.0);
361:	    return dot(rgbaDepth, bitShift);
362:	}
363:	#endif
364:	// ----- Direct/Spot Sampling -----
365:	#ifdef GL2
366:	    float _getShadowPCF3x3(sampler2DShadow shadowMap, vec3 shadowParams) {
367:	        float z = dShadowCoord.z;
368:	        vec2 uv = dShadowCoord.xy * shadowParams.x; // 1 unit - 1 texel
369:	        float shadowMapSizeInv = 1.0 / shadowParams.x;
370:	        vec2 base_uv = floor(uv + 0.5);
371:	        float s = (uv.x + 0.5 - base_uv.x);
372:	        float t = (uv.y + 0.5 - base_uv.y);
373:	        base_uv -= vec2(0.5);
374:	        base_uv *= shadowMapSizeInv;
375:	        float sum = 0.0;
376:	        float uw0 = (3.0 - 2.0 * s);
377:	        float uw1 = (1.0 + 2.0 * s);
378:	        float u0 = (2.0 - s) / uw0 - 1.0;
379:	        float u1 = s / uw1 + 1.0;
380:	        float vw0 = (3.0 - 2.0 * t);
381:	        float vw1 = (1.0 + 2.0 * t);
382:	        float v0 = (2.0 - t) / vw0 - 1.0;
383:	        float v1 = t / vw1 + 1.0;
384:	        u0 = u0 * shadowMapSizeInv + base_uv.x;
385:	        v0 = v0 * shadowMapSizeInv + base_uv.y;
386:	        u1 = u1 * shadowMapSizeInv + base_uv.x;
387:	        v1 = v1 * shadowMapSizeInv + base_uv.y;
388:	        sum += uw0 * vw0 * texture(shadowMap, vec3(u0, v0, z));
389:	        sum += uw1 * vw0 * texture(shadowMap, vec3(u1, v0, z));
390:	        sum += uw0 * vw1 * texture(shadowMap, vec3(u0, v1, z));
391:	        sum += uw1 * vw1 * texture(shadowMap, vec3(u1, v1, z));
392:	        sum *= 1.0f / 16.0;
393:	        return sum;
394:	    }
395:	    float getShadowPCF3x3(sampler2DShadow shadowMap, vec3 shadowParams) {
396:	        return _getShadowPCF3x3(shadowMap, shadowParams);
397:	    }
398:	    float getShadowSpotPCF3x3(sampler2DShadow shadowMap, vec4 shadowParams) {
399:	        return _getShadowPCF3x3(shadowMap, shadowParams.xyz);
400:	    }
401:	#else
402:	    float _xgetShadowPCF3x3(mat3 depthKernel, sampler2D shadowMap, vec3 shadowParams) {
403:	        mat3 shadowKernel;
404:	        vec3 shadowCoord = dShadowCoord;
405:	        vec3 shadowZ = vec3(shadowCoord.z);
406:	        shadowKernel[0] = vec3(greaterThan(depthKernel[0], shadowZ));
407:	        shadowKernel[1] = vec3(greaterThan(depthKernel[1], shadowZ));
408:	        shadowKernel[2] = vec3(greaterThan(depthKernel[2], shadowZ));
409:	        vec2 fractionalCoord = fract( shadowCoord.xy * shadowParams.x );
410:	        shadowKernel[0] = mix(shadowKernel[0], shadowKernel[1], fractionalCoord.x);
411:	        shadowKernel[1] = mix(shadowKernel[1], shadowKernel[2], fractionalCoord.x);
412:	        vec4 shadowValues;
413:	        shadowValues.x = mix(shadowKernel[0][0], shadowKernel[0][1], fractionalCoord.y);
414:	        shadowValues.y = mix(shadowKernel[0][1], shadowKernel[0][2], fractionalCoord.y);
415:	        shadowValues.z = mix(shadowKernel[1][0], shadowKernel[1][1], fractionalCoord.y);
416:	        shadowValues.w = mix(shadowKernel[1][1], shadowKernel[1][2], fractionalCoord.y);
417:	        return dot( shadowValues, vec4( 1.0 ) ) * 0.25;
418:	    }
419:	    float _getShadowPCF3x3(sampler2D shadowMap, vec3 shadowParams) {
420:	        vec3 shadowCoord = dShadowCoord;
421:	        float xoffset = 1.0 / shadowParams.x; // 1/shadow map width
422:	        float dx0 = -xoffset;
423:	        float dx1 = xoffset;
424:	        mat3 depthKernel;
425:	        depthKernel[0][0] = unpackFloat(texture2D(shadowMap, shadowCoord.xy + vec2(dx0, dx0)));
426:	        depthKernel[0][1] = unpackFloat(texture2D(shadowMap, shadowCoord.xy + vec2(dx0, 0.0)));
427:	        depthKernel[0][2] = unpackFloat(texture2D(shadowMap, shadowCoord.xy + vec2(dx0, dx1)));
428:	        depthKernel[1][0] = unpackFloat(texture2D(shadowMap, shadowCoord.xy + vec2(0.0, dx0)));
429:	        depthKernel[1][1] = unpackFloat(texture2D(shadowMap, shadowCoord.xy));
430:	        depthKernel[1][2] = unpackFloat(texture2D(shadowMap, shadowCoord.xy + vec2(0.0, dx1)));
431:	        depthKernel[2][0] = unpackFloat(texture2D(shadowMap, shadowCoord.xy + vec2(dx1, dx0)));
432:	        depthKernel[2][1] = unpackFloat(texture2D(shadowMap, shadowCoord.xy + vec2(dx1, 0.0)));
433:	        depthKernel[2][2] = unpackFloat(texture2D(shadowMap, shadowCoord.xy + vec2(dx1, dx1)));
434:	        return _xgetShadowPCF3x3(depthKernel, shadowMap, shadowParams);
435:	    }
436:	    float getShadowPCF3x3(sampler2D shadowMap, vec3 shadowParams) {
437:	        return _getShadowPCF3x3(shadowMap, shadowParams);
438:	    }
439:	    float getShadowSpotPCF3x3(sampler2D shadowMap, vec4 shadowParams) {
440:	        return _getShadowPCF3x3(shadowMap, shadowParams.xyz);
441:	    }
442:	#endif
443:	// ----- Point Sampling -----
444:	float _getShadowPoint(samplerCube shadowMap, vec4 shadowParams, vec3 dir) {
445:	    vec3 tc = normalize(dir);
446:	    vec3 tcAbs = abs(tc);
447:	    vec4 dirX = vec4(1,0,0, tc.x);
448:	    vec4 dirY = vec4(0,1,0, tc.y);
449:	    float majorAxisLength = tc.z;
450:	    if ((tcAbs.x > tcAbs.y) && (tcAbs.x > tcAbs.z)) {
451:	        dirX = vec4(0,0,1, tc.z);
452:	        dirY = vec4(0,1,0, tc.y);
453:	        majorAxisLength = tc.x;
454:	    } else if ((tcAbs.y > tcAbs.x) && (tcAbs.y > tcAbs.z)) {
455:	        dirX = vec4(1,0,0, tc.x);
456:	        dirY = vec4(0,0,1, tc.z);
457:	        majorAxisLength = tc.y;
458:	    }
459:	    float shadowParamsInFaceSpace = ((1.0/shadowParams.x) * 2.0) * abs(majorAxisLength);
460:	    vec3 xoffset = (dirX.xyz * shadowParamsInFaceSpace);
461:	    vec3 yoffset = (dirY.xyz * shadowParamsInFaceSpace);
462:	    vec3 dx0 = -xoffset;
463:	    vec3 dy0 = -yoffset;
464:	    vec3 dx1 = xoffset;
465:	    vec3 dy1 = yoffset;
466:	    mat3 shadowKernel;
467:	    mat3 depthKernel;
468:	    depthKernel[0][0] = unpackFloat(textureCube(shadowMap, tc + dx0 + dy0));
469:	    depthKernel[0][1] = unpackFloat(textureCube(shadowMap, tc + dx0));
470:	    depthKernel[0][2] = unpackFloat(textureCube(shadowMap, tc + dx0 + dy1));
471:	    depthKernel[1][0] = unpackFloat(textureCube(shadowMap, tc + dy0));
472:	    depthKernel[1][1] = unpackFloat(textureCube(shadowMap, tc));
473:	    depthKernel[1][2] = unpackFloat(textureCube(shadowMap, tc + dy1));
474:	    depthKernel[2][0] = unpackFloat(textureCube(shadowMap, tc + dx1 + dy0));
475:	    depthKernel[2][1] = unpackFloat(textureCube(shadowMap, tc + dx1));
476:	    depthKernel[2][2] = unpackFloat(textureCube(shadowMap, tc + dx1 + dy1));
477:	    vec3 shadowZ = vec3(length(dir) * shadowParams.w + shadowParams.z);
478:	    shadowKernel[0] = vec3(lessThan2(depthKernel[0], shadowZ));
479:	    shadowKernel[1] = vec3(lessThan2(depthKernel[1], shadowZ));
480:	    shadowKernel[2] = vec3(lessThan2(depthKernel[2], shadowZ));
481:	    vec2 uv = (vec2(dirX.w, dirY.w) / abs(majorAxisLength)) * 0.5;
482:	    vec2 fractionalCoord = fract( uv * shadowParams.x );
483:	    shadowKernel[0] = mix(shadowKernel[0], shadowKernel[1], fractionalCoord.x);
484:	    shadowKernel[1] = mix(shadowKernel[1], shadowKernel[2], fractionalCoord.x);
485:	    vec4 shadowValues;
486:	    shadowValues.x = mix(shadowKernel[0][0], shadowKernel[0][1], fractionalCoord.y);
487:	    shadowValues.y = mix(shadowKernel[0][1], shadowKernel[0][2], fractionalCoord.y);
488:	    shadowValues.z = mix(shadowKernel[1][0], shadowKernel[1][1], fractionalCoord.y);
489:	    shadowValues.w = mix(shadowKernel[1][1], shadowKernel[1][2], fractionalCoord.y);
490:	    return 1.0 - dot( shadowValues, vec4( 1.0 ) ) * 0.25;
491:	}
492:	float getShadowPointPCF3x3(samplerCube shadowMap, vec4 shadowParams) {
493:	    return _getShadowPoint(shadowMap, shadowParams, dLightDirW);
494:	}
495:	void _getShadowCoordOrtho(mat4 shadowMatrix, vec3 shadowParams, vec3 wPos) {
496:	    dShadowCoord = (shadowMatrix * vec4(wPos, 1.0)).xyz;
497:	    dShadowCoord.z = saturate(dShadowCoord.z) - 0.0001;
498:	    #ifdef SHADOWBIAS
499:	        dShadowCoord.z += getShadowBias(shadowParams.x, shadowParams.z);
500:	    #endif
501:	}
502:	void _getShadowCoordPersp(mat4 shadowMatrix, vec4 shadowParams, vec3 wPos) {
503:	    vec4 projPos = shadowMatrix * vec4(wPos, 1.0);
504:	    projPos.xy /= projPos.w;
505:	    dShadowCoord.xy = projPos.xy;
506:	    dShadowCoord.z = length(dLightDirW) * shadowParams.w;
507:	    #ifdef SHADOWBIAS
508:	        dShadowCoord.z += getShadowBias(shadowParams.x, shadowParams.z);
509:	    #endif
510:	}
511:	void getShadowCoordOrtho(mat4 shadowMatrix, vec3 shadowParams) {
512:	    _getShadowCoordOrtho(shadowMatrix, shadowParams, vPositionW);
513:	}
514:	void getShadowCoordPersp(mat4 shadowMatrix, vec4 shadowParams) {
515:	    _getShadowCoordPersp(shadowMatrix, shadowParams, vPositionW);
516:	}
517:	void getShadowCoordPerspNormalOffset(mat4 shadowMatrix, vec4 shadowParams) {
518:	    float distScale = abs(dot(vPositionW - dLightPosW, dLightDirNormW)); // fov?
519:	    vec3 wPos = vPositionW + dVertexNormalW * shadowParams.y * clamp(1.0 - dot(dVertexNormalW, -dLightDirNormW), 0.0, 1.0) * distScale;
520:	    _getShadowCoordPersp(shadowMatrix, shadowParams, wPos);
521:	}
522:	void getShadowCoordOrthoNormalOffset(mat4 shadowMatrix, vec3 shadowParams) {
523:	    vec3 wPos = vPositionW + dVertexNormalW * shadowParams.y * clamp(1.0 - dot(dVertexNormalW, -dLightDirNormW), 0.0, 1.0); //0.08
524:	    _getShadowCoordOrtho(shadowMatrix, shadowParams, wPos);
525:	}
526:	void normalOffsetPointShadow(vec4 shadowParams) {
527:	    float distScale = length(dLightDirW);
528:	    vec3 wPos = vPositionW + dVertexNormalW * shadowParams.y * clamp(1.0 - dot(dVertexNormalW, -dLightDirNormW), 0.0, 1.0) * distScale; //0.02
529:	    vec3 dir = wPos - dLightPosW;
530:	    dLightDirW = dir;
531:	}
532:	#ifdef GL2
533:	#define SHADOW_SAMPLERVS sampler2DShadow
534:	#else
535:	#define SHADOW_SAMPLERVS sampler2D
536:	#endif
537:	float getShadowPCF3x3VS(SHADOW_SAMPLERVS shadowMap, vec3 shadowParams) {
538:	    dShadowCoord = vMainShadowUv.xyz;
539:	    dShadowCoord.z = saturate(dShadowCoord.z) - 0.0001;
540:	    #ifdef SHADOWBIAS
541:	        dShadowCoord.z += getShadowBias(shadowParams.x, shadowParams.z);
542:	    #endif
543:	    return _getShadowPCF3x3(shadowMap, shadowParams);
544:	}
545:	float getLightDiffuse() {
546:	    return max(dot(dNormalW, -dLightDirNormW), 0.0);
547:	}
548:	// Energy-conserving (hopefully) Blinn-Phong
549:	float getLightSpecular() {
550:	    vec3 h = normalize( -dLightDirNormW + dViewDirW );
551:	    float nh = max( dot( h, dNormalW ), 0.0 );
552:	    float specPow = exp2(dGlossiness * 11.0); // glossiness is linear, power is not; 0 - 2048
553:	    specPow = antiAliasGlossiness(specPow);
554:	    // Hack: On Mac OS X, calling pow with zero for the exponent generates hideous artifacts so bias up a little
555:	    specPow = max(specPow, 0.0001);
556:	    return pow(nh, specPow) * (specPow + 2.0) / 8.0;
557:	}
558:	vec3 combineColor() {
559:	    return mix(dAlbedo * dDiffuseLight, dSpecularLight + dReflection.rgb * dReflection.a, dSpecularity);
560:	}
561:	#ifndef PMREM4
562:	#define PMREM4
563:	uniform samplerCube texture_prefilteredCubeMap4;
564:	#endif
565:	void addAmbient() {
566:	    vec3 fixedReflDir = fixSeamsStatic(dNormalW, 1.0 - 1.0 / 4.0);
567:	    fixedReflDir.x *= -1.0;
568:	    dDiffuseLight += processEnvironment(decodeRGBM(textureCube(texture_prefilteredCubeMap4, fixedReflDir)).rgb);
569:	}
570:	void getViewDir() {
571:	    dViewDirW = normalize(view_position - vPositionW);
572:	}
573:	void getReflDir() {
574:	    dReflDirW = normalize(-reflect(dViewDirW, dNormalW));
575:	}
576:	
577:	uniform sampler2D uMatCapMap;
578:	
579:	uniform mat4 matrix_view;
580:	uniform mat3 matrix_normal;
581:	
582:	vec3 zunpackNormal(vec4 nmap) {
583:	    vec3 normal;
584:	    normal.xy = nmap.wy * 2.0 - 1.0;
585:	    normal.z = sqrt(1.0 - saturate(dot(normal.xy, normal.xy)));
586:	    return normal;
587:	}
588:	
589:	
590:	void main(void)
591:	{
592:	    vec3 znormal = zunpackNormal(texture2D(texture_normalMap, vUv0));
593:	    vec3 eyeNormal = normalize(matrix_normal * znormal);
594:	    
595:	    eyeNormal = eyeNormal * 0.5 + 0.5;
596:	    
597:	    vec3 cap = texture2D(uMatCapMap, eyeNormal.xy);
598:	    
599:	    vec3 ret =(0.3 + cap.r * (1.0 - 0.3) / (1.0 - 0.0)) * vec3(1.0, 0.0, 1.0) * 2.0;
600:	    
601:	    dDiffuseLight= ret;//vec3(1.0, 0.0, 1.0);
602:	    dSpecularLight=vec3(0);
603:	    dReflection=vec4(0);
604:	    dSpecularity=vec3(1.0, 0.0, 0.0);
605:	       dVertexNormalW = vNormalW;
606:	   dAlpha = 1.0;
607:	   getViewDir();
608:	   getTBN();
609:	   getNormal();
610:	   getReflDir();
611:	   getAlbedo();
612:	   getSpecularity();
613:	   getGlossiness();
614:	   getFresnel();
615:	   addAmbient();
616:	   addReflection();
617:	   dLightDirNormW = light0_direction;
618:	   dAtten = 1.0;
619:	       dAtten *= getLightDiffuse();
620:	       dAtten *= getShadowPCF3x3VS(light0_shadowMap, light0_shadowParams);
621:	       dDiffuseLight += dAtten * light0_color;
622:	       dAtten *= getLightSpecular();
623:	       dSpecularLight += dAtten * light0_color;
624:	
625:	
626:	   gl_FragColor.rgb = combineColor();
627:	   gl_FragColor.rgb += getEmission();
628:	   gl_FragColor.rgb = addFog(gl_FragColor.rgb);
629:	   #ifndef HDR
630:	    gl_FragColor.rgb = toneMap(gl_FragColor.rgb);
631:	    gl_FragColor.rgb = gammaCorrectOutput(gl_FragColor.rgb);
632:	   #endif
633:	gl_FragColor.a = 1.0;
634:	
635:	}
636:	

ERROR: 0:597: '=' : dimension mismatch
ERROR: 0:597: '=' : cannot convert from 'lowp 4-component vector of float' to 'highp 3-component vector of float'
