
Object.assign(prefabs, function () {

    var Car = function Car() {
        this.curScene = "";
    };

    Object.assign(Car.prototype, {
        createEntity: function (parent){
            entity = new pc.Entity();
            //asset.id = 1001;
            var asset = app.assets.find("ball", "model");
            entity.addComponent("model", {
                type: "asset",
                asset: asset,
                castShadows: true
            });

            parent.addChild(entity);
            //app.root.addChild(entity);
        }
    });
    return {
        Car: Car,
        Car: new Car()
    };
}());


