var UseShader = pc.createScript('useShader');

UseShader.attributes.add('vertex', {
    type:'asset',
    assetType:'shader'
});

UseShader.attributes.add('fragment', {
    type:'asset',
    assetType:'shader'
});

UseShader.attributes.add('startVert', {
    type:'asset',
    assetType:'shader'
}); 

UseShader.attributes.add('difuse', {
    type:'asset',
    assetType:'shader'
});

UseShader.attributes.add('cube', {
    type:'asset',
    assetType:'cubemap'
});

UseShader.attributes.add('matcap', {
    type:'asset',
    assetType:'texture'
});

UseShader.attributes.add('carmat', {
    type:'asset',
    assetType:'material'
});

UseShader.attributes.add('light', {
    type: 'entity',
    title: 'Light',
    description: 'The Light Entity'
});

UseShader.attributes.add('fresnelScale', {
    type: 'number',
    default: 0.2
});

UseShader.attributes.add('fresnelRange', {
    type: 'number',
    default: 4
});

// initialize code called once per entity
UseShader.prototype.initialize = function() {
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
    
    var diffuseMap = this.entity.model.material.diffuseMap;
    
    var normalMap = this.entity.model.material.normalMap;
    
    var cubeMap = this.entity.model.material.cubeMap;

    this.shader = new pc.Shader(gd, shaderDefinition);
    
    var material = new pc.Material();
    //this.cube.resource.mipmaps = false;
    
    //material.shader = this.shader;
//     material.setParameter('uTime', 0.3);
//     material.setParameter('uDiffuseMap', diffuseMap);   
//     material.setParameter('uNormalMap', normalMap);
//     material.setParameter('uCubeMap', this.cube.resource);
    
//     material.setParameter('material_reflectivity', 1.0);
    
//     material.setParameter('_FresnelScale', this.fresnelScale);
    
//     material.setParameter('_FresnelRange', this.fresnelRange);//this.fresnelRange);
    
    
    var cur = this;
    
    this.entity.model.meshInstances.forEach(function (meshInstance) {
        
        if (meshInstance.material.name == "Standard_20")
            cur.bindMaterial(meshInstance.material);
    });
      

    
    var light = this.light;
    
    //var curM = this.entity.model.material;
    //curM.cubeMap = this.cube.resource;
    //
    //var curM = this.carmat.resource;
    
    var cur = this;
//     this.app.on("update", function (dt) {
//         //material.setParameter('uTexture', diffuseMap);
//         material.setParameter('uLightPos', light.getPosition().data);

//         //entity.rotate(0, 60*dt, 0);
//         material.setParameter('_FresnelScale', cur.fresnelScale);

//         material.setParameter('_FresnelRange', cur.fresnelRange);
        
//         var cc = curM;
        
//             //material.setParameter('uCubeMap', cubeMap);
//     });
};


UseShader.prototype.bindMaterial = function(curM) {
    var mychunks = {};
    
    mychunks.startVS =  this.startVert.resource;   
    
    mychunks.diffusePS =  this.difuse.resource; 
    
    mychunks.startPS =  this.fragment.resource;    

        //"\nvoid main(void) {\n dDiffuseLight = vec3(0);\n dSpecularLight = vec3(0);\n dReflection = vec4(0);\n dSpecularity = vec3(0);\n";
    mychunks.extensionVS = "\n \n";
    
    
    //mychunks.extensionVS = "\n \n";
    
    //update my chunks
    curM.chunks = mychunks;
    
    curM.setParameter('uMatCapMap', this.matcap.resource);
    
    curM.setParameter('_FresnelScale', this.fresnelScale);
    
    curM.setParameter('_FresnelRange', this.fresnelRange);//this.fresnelRange);
    
    this._colorUniform = new Float32Array([1, 0, 0]);
    
    curM.setParameter('uMatColor', this._colorUniform);
    
    this._fresnelColorUniform = new Float32Array([1, 1, 1]);
    
    curM.setParameter('uFresnelColor', this._fresnelColorUniform);
    
    var test = curM.chunks.startPS;
    
    
    

};

// update code called every frame
UseShader.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// UseShader.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/