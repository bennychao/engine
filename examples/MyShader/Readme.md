```csharp

var CustomRenderTarget = pc.createScript('customRenderTarget');

//以便在编辑中指定纹理要应用到的目标实体
CustomRenderTarget.attributes.add("target", {
    type: 'entity',
    title: 'Texture Target'
});

// postInitialize code called once per entity
CustomRenderTarget.prototype.postInitialize = function() {
    var app = this.app;
    var shadowLayer = app.scene.layers.getLayerByName("Shadow");

    this.shadowTexture = new pc.Texture(app.graphicsDevice, {
        width: 512,
        height: 512,
        format: pc.PIXELFORMAT_R8_G8_B8
    });

    var renderTarget = new pc.RenderTarget({
        colorBuffer: this.shadowTexture,
        depth: true
    });

    shadowLayer.renderTarget = renderTarget;

    var material = this.target.model.material;
    material.diffuseMap = shadowLayer.renderTarget.colorBuffer;
    material.update();
};
```

[

](https://www.jianshu.com/p/577d9e1d8175)