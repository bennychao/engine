var Marshader = pc.createScript('marshader');


Marshader.attributes.add('aoShader', {
    type:'asset',
    assetType:'shader'
});

Marshader.attributes.add('metaShader', {
    type:'asset',
    assetType:'shader'
});

Marshader.attributes.add('glossShader', {
    type:'asset',
    assetType:'shader'
});

Marshader.attributes.add('fragment', {
    type:'asset',
    assetType:'shader'
});

Marshader.attributes.add('marMap', {
    type:'asset',
    assetType:'texture'
});

// initialize code called once per entity
Marshader.prototype.initialize = function() {
    
    var cur = this;
    this.entity.model.meshInstances.forEach(function (meshInstance) {
        
        //if (meshInstance.material.name == "Standard_20")
            cur.bindMaterial(meshInstance.material);
    });
};

// update code called every frame
Marshader.prototype.update = function(dt) {
    
};

Marshader.prototype.bindMaterial = function(curM) {
    var mychunks = {};
    
    //mychunks.startVS =  this.startVert.resource;   
    
    mychunks.aoPS =  this.aoShader.resource; 
    mychunks.metalnessPS =  this.metaShader.resource; 
    mychunks.glossPS =  this.glossShader.resource; 
    mychunks.startPS =  this.fragment.resource;    

        //"\nvoid main(void) {\n dDiffuseLight = vec3(0);\n dSpecularLight = vec3(0);\n dReflection = vec4(0);\n dSpecularity = vec3(0);\n";
    mychunks.extensionVS = "\n \n";
    
    
    //mychunks.extensionVS = "\n \n";
    
    //update my chunks
    curM.chunks = mychunks;
    
    curM.setParameter('uMarMap', this.marMap.resource);
    

};

// swap method called for script hot-reloading
// inherit your script state here
// Marshader.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/