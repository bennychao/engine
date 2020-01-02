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
19:	varying vec3 vPositionW;
20:	varying vec3 vNormalW;
21:	
22:	uniform vec3 view_position;
23:	uniform vec3 light_globalAmbient;
24:	float square(float x) {
25:	    return x*x;
26:	}
27:	float saturate(float x) {
28:	    return clamp(x, 0.0, 1.0);
29:	}
30:	vec3 saturate(vec3 x) {
31:	    return clamp(x, vec3(0.0), vec3(1.0));
32:	}
33:	vec4 dReflection;
34:	vec3 dAlbedo;
35:	vec3 dNormalW;
36:	vec3 dVertexNormalW;
37:	vec3 dViewDirW;
38:	vec3 dReflDirW;
39:	vec3 dDiffuseLight;
40:	vec3 dSpecularLight;
41:	vec3 dLightDirNormW;
42:	vec3 dLightDirW;
43:	vec3 dLightPosW;
44:	vec3 dSpecularity;
45:	float dGlossiness;
46:	float dAlpha;
47:	float dAtten;
48:	float getSpotEffect(vec3 lightSpotDirW, float lightInnerConeAngle, float lightOuterConeAngle) {
49:	    float cosAngle = dot(dLightDirNormW, lightSpotDirW);
50:	    return smoothstep(lightOuterConeAngle, lightInnerConeAngle, cosAngle);
51:	}
52:	float getFalloffLinear(float lightRadius) {
53:	    float d = length(dLightDirW);
54:	    return max(((lightRadius - d) / lightRadius), 0.0);
55:	}
56:	void getLightDirPoint(vec3 lightPosW) {
57:	    dLightDirW = vPositionW - lightPosW;
58:	    dLightDirNormW = normalize(dLightDirW);
59:	    dLightPosW = lightPosW;
60:	}
61:	uniform vec3 light0_color;
62:	uniform vec3 light0_position;
63:	uniform float light0_radius;
64:	uniform vec3 light0_direction;
65:	uniform float light0_innerConeAngle;
66:	uniform float light0_outerConeAngle;
67:	uniform vec3 light1_color;
68:	uniform vec3 light1_position;
69:	uniform float light1_radius;
70:	uniform vec3 light1_direction;
71:	uniform float light1_innerConeAngle;
72:	uniform float light1_outerConeAngle;
73:	uniform vec3 light2_color;
74:	uniform vec3 light2_position;
75:	uniform float light2_radius;
76:	uniform vec3 light2_direction;
77:	uniform float light2_innerConeAngle;
78:	uniform float light2_outerConeAngle;
79:	uniform vec3 light3_color;
80:	uniform vec3 light3_position;
81:	uniform float light3_radius;
82:	uniform vec3 light3_direction;
83:	uniform float light3_innerConeAngle;
84:	uniform float light3_outerConeAngle;
85:	
86:	void getNormal() {
87:	    dNormalW = normalize(dVertexNormalW);
88:	}
89:	vec3 gammaCorrectInput(vec3 color) {
90:	    return pow(color, vec3(2.2));
91:	}
92:	float gammaCorrectInput(float color) {
93:	    return pow(color, 2.2);
94:	}
95:	vec4 gammaCorrectInput(vec4 color) {
96:	    return vec4(pow(color.rgb, vec3(2.2)), color.a);
97:	}
98:	vec4 texture2DSRGB(sampler2D tex, vec2 uv) {
99:	    vec4 rgba = texture2D(tex, uv);
100:	    rgba.rgb = gammaCorrectInput(rgba.rgb);
101:	    return rgba;
102:	}
103:	vec4 texture2DSRGB(sampler2D tex, vec2 uv, float bias) {
104:	    vec4 rgba = texture2D(tex, uv, bias);
105:	    rgba.rgb = gammaCorrectInput(rgba.rgb);
106:	    return rgba;
107:	}
108:	vec4 textureCubeSRGB(samplerCube tex, vec3 uvw) {
109:	    vec4 rgba = textureCube(tex, uvw);
110:	    rgba.rgb = gammaCorrectInput(rgba.rgb);
111:	    return rgba;
112:	}
113:	vec3 gammaCorrectOutput(vec3 color) {
114:	#ifdef HDR
115:	    return color;
116:	#else
117:	    color += vec3(0.0000001);
118:	    return pow(color, vec3(0.45));
119:	#endif
120:	}
121:	uniform float exposure;
122:	vec3 toneMap(vec3 color) {
123:	    return color * exposure;
124:	}
125:	vec3 addFog(vec3 color) {
126:	    return color;
127:	}
128:	vec3 cubeMapProject(vec3 dir) {
129:	    return dir;
130:	}
131:	vec3 processEnvironment(vec3 color) {
132:	    return color;
133:	}
134:	
135:	#undef MAPFLOAT
136:	
137:	#undef MAPCOLOR
138:	 #define MAPCOLOR
139:	
140:	#undef MAPVERTEX
141:	
142:	#undef MAPTEXTURE
143:	
144:	#ifdef MAPCOLOR
145:	uniform vec3 material_diffuse;
146:	#endif
147:	
148:	#ifdef MAPTEXTURE
149:	uniform sampler2D texture_diffuseMap;
150:	#endif
151:	
152:	void getAlbedo() {
153:	    //dAlbedo = vec3(1.0);
154:	
155:	    #ifdef MAPCOLOR
156:	        //dAlbedo *= material_diffuse.rgb;
157:	    #endif
158:	
159:	    #ifdef MAPTEXTURE
160:	        //dAlbedo *= texture2DSRGB(texture_diffuseMap, UV).CH;
161:	    #endif
162:	
163:	    #ifdef MAPVERTEX
164:	        dAlbedo *= gammaCorrectInput(saturate(vVertexColor.VC));
165:	    #endif
166:	}
167:	
168:	
169:	#undef MAPFLOAT
170:	
171:	#undef MAPCOLOR
172:	 #define MAPCOLOR
173:	
174:	#undef MAPVERTEX
175:	
176:	#undef MAPTEXTURE
177:	#ifdef MAPCOLOR
178:	uniform vec3 material_emissive;
179:	#endif
180:	#ifdef MAPFLOAT
181:	uniform float material_emissiveIntensity;
182:	#endif
183:	#ifdef MAPTEXTURE
184:	uniform sampler2D texture_emissiveMap;
185:	#endif
186:	vec3 getEmission() {
187:	    vec3 emission = vec3(1.0);
188:	    #ifdef MAPFLOAT
189:	        emission *= material_emissiveIntensity;
190:	    #endif
191:	    #ifdef MAPCOLOR
192:	        emission *= material_emissive;
193:	    #endif
194:	    #ifdef MAPTEXTURE
195:	        emission *= texture2DSAMPLE(texture_emissiveMap, UV).CH;
196:	    #endif
197:	    #ifdef MAPVERTEX
198:	        emission *= gammaCorrectInput(saturate(vVertexColor.VC));
199:	    #endif
200:	    return emission;
201:	}
202:	float antiAliasGlossiness(float power) {
203:	    return power;
204:	}
205:	
206:	#undef MAPFLOAT
207:	
208:	#undef MAPCOLOR
209:	 #define MAPCOLOR
210:	
211:	#undef MAPVERTEX
212:	
213:	#undef MAPTEXTURE
214:	#ifdef MAPCOLOR
215:	uniform vec3 material_specular;
216:	#endif
217:	#ifdef MAPTEXTURE
218:	uniform sampler2D texture_specularMap;
219:	#endif
220:	void getSpecularity() {
221:	    dSpecularity = vec3(1.0);
222:	    #ifdef MAPCOLOR
223:	        dSpecularity *= material_specular;
224:	    #endif
225:	    #ifdef MAPTEXTURE
226:	        dSpecularity *= texture2D(texture_specularMap, UV).CH;
227:	    #endif
228:	    #ifdef MAPVERTEX
229:	        dSpecularity *= saturate(vVertexColor.VC);
230:	    #endif
231:	}
232:	
233:	#undef MAPFLOAT
234:	 #define MAPFLOAT
235:	
236:	#undef MAPCOLOR
237:	
238:	#undef MAPVERTEX
239:	
240:	#undef MAPTEXTURE
241:	#ifdef MAPFLOAT
242:	uniform float material_shininess;
243:	#endif
244:	#ifdef MAPTEXTURE
245:	uniform sampler2D texture_glossMap;
246:	#endif
247:	void getGlossiness() {
248:	    dGlossiness = 1.0;
249:	    #ifdef MAPFLOAT
250:	        dGlossiness *= material_shininess;
251:	    #endif
252:	    #ifdef MAPTEXTURE
253:	        dGlossiness *= texture2D(texture_glossMap, UV).CH;
254:	    #endif
255:	    #ifdef MAPVERTEX
256:	        dGlossiness *= saturate(vVertexColor.VC);
257:	    #endif
258:	    dGlossiness += 0.0000001;
259:	}
260:	// Schlick's approximation
261:	uniform float material_fresnelFactor; // unused
262:	void getFresnel() {
263:	    float fresnel = 1.0 - max(dot(dNormalW, dViewDirW), 0.0);
264:	    float fresnel2 = fresnel * fresnel;
265:	    fresnel *= fresnel2 * fresnel2;
266:	    fresnel *= dGlossiness * dGlossiness;
267:	    dSpecularity = dSpecularity + (1.0 - dSpecularity) * fresnel;
268:	}
269:	#ifndef VIEWMATRIX
270:	#define VIEWMATRIX
271:	uniform mat4 matrix_view;
272:	#endif
273:	uniform sampler2D texture_sphereMap;
274:	uniform float material_reflectivity;
275:	void addReflection() {
276:	    vec3 reflDirV = (mat3(matrix_view) * dReflDirW).xyz;
277:	    float m = 2.0 * sqrt( dot(reflDirV.xy, reflDirV.xy) + (reflDirV.z+1.0)*(reflDirV.z+1.0) );
278:	    vec2 sphereMapUv = reflDirV.xy / m + 0.5;
279:	    dReflection += vec4(texture2DSRGB(texture_sphereMap, sphereMapUv).rgb, material_reflectivity);
280:	}
281:	uniform float material_refraction, material_refractionIndex;
282:	vec3 refract2(vec3 viewVec, vec3 Normal, float IOR) {
283:	    float vn = dot(viewVec, Normal);
284:	    float k = 1.0 - IOR * IOR * (1.0 - vn * vn);
285:	    vec3 refrVec = IOR * viewVec - (IOR * vn + sqrt(k)) * Normal;
286:	    return refrVec;
287:	}
288:	void addRefraction() {
289:	    // use same reflection code with refraction vector
290:	    vec3 tmp = dReflDirW;
291:	    vec4 tmp2 = dReflection;
292:	    dReflection = vec4(0.0);
293:	    dReflDirW = refract2(-dViewDirW, dNormalW, material_refractionIndex);
294:	    addReflection();
295:	    dDiffuseLight = mix(dDiffuseLight, dReflection.rgb * dAlbedo, material_refraction);
296:	    dReflDirW = tmp;
297:	    dReflection = tmp2;
298:	}
299:	float getLightDiffuse() {
300:	    return max(dot(dNormalW, -dLightDirNormW), 0.0);
301:	}
302:	// Energy-conserving (hopefully) Blinn-Phong
303:	float getLightSpecular() {
304:	    vec3 h = normalize( -dLightDirNormW + dViewDirW );
305:	    float nh = max( dot( h, dNormalW ), 0.0 );
306:	    float specPow = exp2(dGlossiness * 11.0); // glossiness is linear, power is not; 0 - 2048
307:	    specPow = antiAliasGlossiness(specPow);
308:	    // Hack: On Mac OS X, calling pow with zero for the exponent generates hideous artifacts so bias up a little
309:	    specPow = max(specPow, 0.0001);
310:	    return pow(nh, specPow) * (specPow + 2.0) / 8.0;
311:	}
312:	vec3 combineColor() {
313:	    return mix(dAlbedo * dDiffuseLight, dSpecularLight + dReflection.rgb * dReflection.a, dSpecularity);
314:	}
315:	
316:	void addAmbient() {
317:	    dDiffuseLight += light_globalAmbient;
318:	}
319:	void getViewDir() {
320:	    dViewDirW = normalize(view_position - vPositionW);
321:	}
322:	void getReflDir() {
323:	    dReflDirW = normalize(-reflect(dViewDirW, dNormalW));
324:	}
325:	
326:	uniform sampler2D uMatCapMap;
327:	
328:	uniform mat4 matrix_view;
329:	uniform mat3 matrix_normal;
330:	
331:	uniform float _FresnelScale;
332:	uniform float _FresnelRange;
333:	
334:	uniform vec3 uMatColor;
335:	uniform vec3 uFresnelColor;
336:	
337:	
338:	float lerp(float a, float b, float w) {
339:	  return a + w*(b-a);
340:	}
341:	
342:	vec3 lerp(vec3 a, vec3 b, vec3 w) {
343:	  return a + w*(b-a);
344:	}
345:	
346:	vec3 lerp(vec3 a, vec3 b, float w) {
347:	  return a + w*(b-a);
348:	}
349:	
350:	vec3 zunpackNormal(vec4 nmap) {
351:	    vec3 normal;
352:	    normal.xy = nmap.wy * 2.0 - 1.0;
353:	    normal.z = sqrt(1.0 - saturate(dot(normal.xy, normal.xy)));
354:	    return normal;
355:	}
356:	
357:	float fresnel(vec3 worldViewDir, vec3 worldNormal)
358:	{
359:	    float fresnel = _FresnelScale + (1.0 - _FresnelScale) * pow(1.0 - dot(worldViewDir, worldNormal), _FresnelRange);
360:	    //float fresnel = pow(1.0 - dot(worldViewDir, worldNormal), 2.0);
361:	    return saturate(fresnel);
362:	}
363:	
364:	
365:	void main(void)
366:	{
367:	    vec3 znormal = zunpackNormal(texture2D(texture_normalMap, vUv0));
368:	    vec3 zworldNormal = normalize(matrix_normal * znormal);
369:	    dViewDirW = normalize(view_position - vPositionW);
370:	    
371:	    vec3 eyeNormal = zworldNormal * 0.5 + 0.5;
372:	    
373:	    vec3 cap = texture2D(uMatCapMap, eyeNormal.xy).xyz;
374:	    
375:	    //remap
376:	    vec3 ret =(0.3 + cap.r * (1.0 - 0.3) / (1.0 - 0.0)) * uMatColor * 2.0;
377:	    
378:	    //vNormalW is vertex normal 
379:	    float f = saturate(fresnel(dViewDirW, vNormalW));
380:	    
381:	    ret = lerp(ret, uFresnelColor, f);
382:	    
383:	    //dAlbedo = uFresnelColor;//vec3(f, f, f);
384:	    
385:	    dAlbedo = ret;
386:	    
387:	    dDiffuseLight= vec3(0); //ret;//vec3(1.0, 0.0, 1.0);
388:	    dSpecularLight=vec3(0);
389:	    dReflection=vec4(0);
390:	    dSpecularity=vec3(1.0, 0.0, 0.0);
391:	       dVertexNormalW = vNormalW;
392:	   dAlpha = 1.0;
393:	   getViewDir();
394:	   getNormal();
395:	   getReflDir();
396:	   getAlbedo();
397:	   getSpecularity();
398:	   getGlossiness();
399:	   getFresnel();
400:	   addAmbient();
401:	   addReflection();
402:	   getLightDirPoint(light0_position);
403:	   dAtten = getFalloffLinear(light0_radius);
404:	   if (dAtten > 0.00001) {
405:	       dAtten *= getSpotEffect(light0_direction, light0_innerConeAngle, light0_outerConeAngle);
406:	       dAtten *= getLightDiffuse();
407:	       dDiffuseLight += dAtten * light0_color;
408:	       dAtten *= getLightSpecular();
409:	       dSpecularLight += dAtten * light0_color;
410:	   }
411:	
412:	   getLightDirPoint(light1_position);
413:	   dAtten = getFalloffLinear(light1_radius);
414:	   if (dAtten > 0.00001) {
415:	       dAtten *= getSpotEffect(light1_direction, light1_innerConeAngle, light1_outerConeAngle);
416:	       dAtten *= getLightDiffuse();
417:	       dDiffuseLight += dAtten * light1_color;
418:	       dAtten *= getLightSpecular();
419:	       dSpecularLight += dAtten * light1_color;
420:	   }
421:	
422:	   getLightDirPoint(light2_position);
423:	   dAtten = getFalloffLinear(light2_radius);
424:	   if (dAtten > 0.00001) {
425:	       dAtten *= getSpotEffect(light2_direction, light2_innerConeAngle, light2_outerConeAngle);
426:	       dAtten *= getLightDiffuse();
427:	       dDiffuseLight += dAtten * light2_color;
428:	       dAtten *= getLightSpecular();
429:	       dSpecularLight += dAtten * light2_color;
430:	   }
431:	
432:	   getLightDirPoint(light3_position);
433:	   dAtten = getFalloffLinear(light3_radius);
434:	   if (dAtten > 0.00001) {
435:	       dAtten *= getSpotEffect(light3_direction, light3_innerConeAngle, light3_outerConeAngle);
436:	       dAtten *= getLightDiffuse();
437:	       dDiffuseLight += dAtten * light3_color;
438:	       dAtten *= getLightSpecular();
439:	       dSpecularLight += dAtten * light3_color;
440:	   }
441:	
442:	   addRefraction();
443:	
444:	   gl_FragColor.rgb = combineColor();
445:	   gl_FragColor.rgb += getEmission();
446:	   gl_FragColor.rgb = addFog(gl_FragColor.rgb);
447:	   #ifndef HDR
448:	    gl_FragColor.rgb = toneMap(gl_FragColor.rgb);
449:	    gl_FragColor.rgb = gammaCorrectOutput(gl_FragColor.rgb);
450:	   #endif
451:	gl_FragColor.a = 1.0;
452:	
453:	}
454:	

ERROR: 0:328: 'matrix_view' : redefinition
ERROR: 0:367: 'texture_normalMap' : undeclared identifier
ERROR: 0:367: 'vUv0' : undeclared identifier
ERROR: 0:367: 'texture' : no matching overloaded function found
ERROR: 0:367: 'zunpackNormal' : no matching overloaded function found
ERROR: 0:367: '=' : dimension mismatch
ERROR: 0:367: '=' : cannot convert from 'const mediump float' to 'highp 3-component vector of float'
