var Mirror = pc.createScript('mirror');


Mirror.attributes.add('mainCamera', {
    type: 'entity',
    title: 'mainCamera',
    description: 'The Ground Entity'
});
Mirror.attributes.add('mirrorCamera', {
    type: 'entity',
    title: 'mirrorCamera',
    description: 'The Ground Entity'
});

Mirror.attributes.add('vertex', {
    type:'asset',
    assetType:'shader'
});

Mirror.attributes.add('fragment', {
    type:'asset',
    assetType:'shader'
});

Mirror.attributes.add('difuse', {
    type:'asset',
    assetType:'shader'
});

Mirror.attributes.add('mirrorplane', {
    type: 'entity',
    title: 'mirrorplane',
    description: 'The Ground Entity'
}); 

Mirror.attributes.add('vertex2', {
    type:'asset',
    assetType:'shader'
});

Mirror.attributes.add('fragment2', {
    type:'asset',
    assetType:'shader'
});

// initialize code called once per entity
Mirror.prototype.initialize = function() {
    
    var app = this.app;
    var shadowLayer = app.scene.layers.getLayerByName("Mirror");

    this.shadowTexture = new pc.Texture(app.graphicsDevice, {
        width: 512,
        height: 512,
        format: pc.PIXELFORMAT_R8_G8_B8
    });
    
    this.renderTarget = new pc.RenderTarget({
        colorBuffer: this.shadowTexture,
        depth: true
    });

    shadowLayer.renderTarget = this.renderTarget;

    //material.diffuseMap = shadowLayer.renderTarget.colorBuffer;
    //material.update();
    
    //init mirror shader
    var gd = this.app.graphicsDevice;

    var shaderDefinition = {
        attributes: {
            aPosition: pc.SEMANTIC_POSITION,
            aNormal: pc.SEMANTIC_NORMAL,  
            aUv0: pc.SEMANTIC_TEXCOORD0
        },
        vshader: this.vertex.resource,
        fshader: this.fragment.resource
    };
    
    this.shader = new pc.Shader(gd, shaderDefinition);
    
    //for custom shader
    //this.material = new pc.Material();
    //this.cube.resource.mipmaps = false;
    
    //this.material.shader = this.shader;
    //
    this.material = this.entity.model.material;
    
    //texture_diffuseMap
    //this.material.setParameter('uDiffuseMap', shadowLayer.renderTarget.colorBuffer);    
    this.bindMaterial(this.material, shadowLayer.renderTarget.colorBuffer);
    
    
    
    //init the mirror plane's mat
    //
    var shaderDefinition2 = {
        attributes: {
            aPosition: pc.SEMANTIC_POSITION,
            aNormal: pc.SEMANTIC_NORMAL,  
            aUv0: pc.SEMANTIC_TEXCOORD0
        },
        vshader: this.vertex2.resource,
        fshader: this.fragment2.resource
    };
    
    this.shader2 = new pc.Shader(gd, shaderDefinition2);
    
    var mat2 = new pc.Material();

    mat2.shader = this.shader2;
    mat2.setParameter('uTime', 0);
    mat2.setParameter('uDiffuseMap', shadowLayer.renderTarget.colorBuffer);
    
    var cur = this;
    this.mirrorplane.model.meshInstances.forEach(function (meshInstance) {
        //meshInstance.material.setParameter('texture_diffuseMap', shadowLayer.renderTarget.colorBuffer);   
        meshInstance.material = mat2;
    });  
    
    // this.app.on("update", function (dt) {
    //     //shadowLayer.renderTarget = cur.renderTarget;
    //     //cur.material.setParameter('uDiffuseMap', shadowLayer.renderTarget.colorBuffer);    
    // });
    
};

Mirror.prototype.bindMaterial = function(curM, map) {
    var mychunks = {};
    
    mychunks.startVS =  this.vertex.resource;   
    
    mychunks.diffusePS =  this.difuse.resource; 
    
    mychunks.startPS =  this.fragment.resource;    

        //"\nvoid main(void) {\n dDiffuseLight = vec3(0);\n dSpecularLight = vec3(0);\n dReflection = vec4(0);\n dSpecularity = vec3(0);\n";
    mychunks.extensionVS = "\n \n";
    
    
    //mychunks.extensionVS = "\n \n";
    
    //update my chunks
    curM.chunks = mychunks;
    
    curM.setParameter('uDiffuseMap', map);

};


// update code called every frame
Mirror.prototype.update = function(dt) {
    this.updateCameraMatrix(dt);
};

Mirror.prototype.updateCameraMatrix = function(a) {
    var mirrorPos = this.entity.getPosition();
    var mirrorForward = this.entity.up;
    
    var offset = 0;
    var d = -mirrorForward.dot(mirrorPos) - offset;
    var reflectionPlane = new pc.Vec4(mirrorForward.x, mirrorForward.y, mirrorForward.z, d);

    // get reflection matrix
    //reflectionMat = Matrix4x4.zero;
    reflectionMat = this.CalculateReflectionMatrix(reflectionPlane);

    // set head position
    var curPos = this.mainCamera.getPosition();
    var reflectedPos = reflectionMat.transformPoint(curPos);
    //mirrorCamera.transform.position = Vector3.Lerp(mirrorCamera.transform.position, reflectedPos, 2);
    //
    
    this.mirrorCamera.setPosition(reflectedPos);    
        
    var e = this.mainCamera.getEulerAngles();
    this.mirrorCamera.setEulerAngles(0, e.y, e.z);
    
    //var target = 
    
     var pivotPos = this.mainCamera.script.orbitCamera.pivotPoint;
    
     var  reflectPivotPos = reflectionMat.transformPoint(pivotPos);
    
     var curUp = reflectionMat.transformVector(this.mainCamera.up.clone());
    this.mirrorCamera.lookAt(reflectPivotPos, curUp);
    var curViewMat = this.mainCamera.camera.viewMatrix.clone();  
    
    curViewMat.mul2(curViewMat, reflectionMat);
    
    // this.mirrorCamera.camera.calculateTransform = function(proj){
    //      proj = curViewMat.invert();
    //      //return proj;  
    // };

    
    var clipplane = this.CameraSpacePlane(curViewMat, mirrorPos, mirrorForward, 1);

    var clipP = this.mirrorCamera.camera.projectionMatrix;
    
    //this.mirrorCamera.camera.frustum.update(clipP, curViewMat);

    var newClip = this.CalculateObliqueMatrix(clipP, clipplane);


    //this.mirrorCamera.flipFaces = true;
    //mirrorCamera.projectionMatrix = clipP;
    //
    // this.mirrorCamera.camera.calculateProjection = function(proj){
    //     proj = newClip;
    //     return newClip;
    // };
};

Mirror.prototype.sgn = function(a) {
    if (a > 0.0)
        return 1.0;
    if (a < 0.0)
        return -1.0;
    return 0.0;
};

Mirror.prototype.CalculateObliqueMatrix = function(projection, clipPlane)
{
    var proj = projection.clone();
    proj.invert();
    var q = proj.transformVec4(new pc.Vec4(this.sgn(clipPlane.x), this.sgn(clipPlane.y), 1.0, 1.0));
    
    var c = clipPlane.clone();
    var f =  (2.0 / clipPlane.dot(q));
    c.mul(new pc.Vec4(f, f, f, f));
    
    proj.data[2] = c.x - proj.data[3];
    proj.data[6] = c.y - proj.data[7];
    proj.data[10] = c.z - proj.data[11];
    proj.data[14] = c.w - proj.data[15];
    
    return proj;
};


Mirror.prototype.CameraSpacePlane = function(camViewMat, pos, normal, sideSign)
{
    var offsetPos = normal.clone();
    offsetPos = offsetPos.mul(new pc.Vec3(0.02, 0.02, 0.02));
    offsetPos.add(pos);
    var m = camViewMat;//worldToCameraMatrix;
    var cpos = m.transformPoint(offsetPos);
    var cnormal = m.transformVector(normal);
    cnormal.normalize();
    cnormal.mul(new pc.Vec3(sideSign, sideSign, sideSign));
    
    return new pc.Vec4(cnormal.x, cnormal.y, cnormal.z, -cpos.dot(cnormal));
};


Mirror.prototype.CalculateReflectionMatrix = function(plane)
{
    var reflectionMat = new pc.Mat4();
    
    reflectionMat.data[0] = (1 - 2 * plane.data[0] * plane.data[0]);
    reflectionMat.data[1] = (-2 * plane.data[0] * plane.data[1]);
    reflectionMat.data[2] = (-2 * plane.data[0] * plane.data[2]);
    reflectionMat.data[3] = (-2 * plane.data[0] * plane.data[3]);

    reflectionMat.data[4] = (-2 * plane.data[1] * plane.data[0]);
    reflectionMat.data[5] = (1 - 2 * plane.data[1] * plane.data[1]);
    reflectionMat.data[6] = (-2 * plane.data[1] * plane.data[2]);
    reflectionMat.data[7] = (-2 * plane.data[1] * plane.data[3]);

    reflectionMat.data[8] = (-2 * plane.data[2] * plane.data[0]);
    reflectionMat.data[9] = (-2 * plane.data[2] * plane.data[1]);
    reflectionMat.data[10] = (1 - 2 * plane.data[2] * plane.data[2]);
    reflectionMat.data[11] = (-2 * plane.data[2] * plane.data[3]);

    reflectionMat.data[12] = 0;
    reflectionMat.data[13] = 0;
    reflectionMat.data[14] = 0;
    reflectionMat.data[15] = 1;
    
    return reflectionMat;
};


// swap method called for script hot-reloading
// inherit your script state here
// Mirror.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/