var canvas = document.getElementById("application-canvas");

// Create the app and start the update loop
var app = new pc.Application(canvas);
app.start();

// Set the canvas to fill the window and automatically change resolution to be the same as the canvas size
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);

app.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);

var entity, light, camera;


//app.preload(null);
// Load a model file and create a Entity with a model component
//var url = "../assets/statue/Statue_1.json";
var url = "./assets/models/ball.json";

//load json
// var file = {
//     filename: "scene1.json",
//     url: "./assets/scenes/scene1.json",
//   };

pc.http.get("./assets/scenes/scene1.json", function (err, response) {
    console.log(response);
});

var json = new pc.Asset("My json", "json", {url: "./assets/scenes/scene1.json"});
json.preload = true;


app.assets.add(json);

var asset = new pc.Asset("My ball", "model", {url: "./assets/models/ball.json", preload:true});
asset.id = 1001;
asset.preload = true;
app.assets.add(asset);
app.preload( function(){

    var data = json._resources[0].branch_id;


    entity = new pc.Entity();
    //asset.id = 1001;
    entity.addComponent("model", {
        type: "asset",
        asset: asset,
        castShadows: true
    });
    app.root.addChild(entity);
});

asset.on("load", function(asset){


});

app.assets.loadFromUrl(url, "model", function (err, asset) {
    entity = new pc.Entity();
    //asset.id = 1001;
    entity.addComponent("model", {
        type: "asset",
        asset: asset,
        castShadows: true
    });
    app.root.addChild(entity);
});

// Create an Entity with a camera component
var camera = new pc.Entity();
camera.addComponent("camera", {
    clearColor: new pc.Color(0.4, 0.45, 0.5)
});
camera.translate(0, 7, 24);
app.root.addChild(camera);

// Create an Entity with a point light component
var light = new pc.Entity();
light.addComponent("light", {
    type: "point",
    color: new pc.Color(1, 1, 1),
    range: 100,
    castShadows: true
});
light.translate(5, 0, 15);
app.root.addChild(light);

app.on("update", function (dt) {
    if (entity) {
        entity.rotate(0,10*dt,0);
    }
});