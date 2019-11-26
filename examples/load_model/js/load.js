var canvas = document.getElementById("application-canvas");

// Create the app and start the update loop
var app = new pc.Application(canvas);
app.start();

// Set the canvas to fill the window and automatically change resolution to be the same as the canvas size
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);

// app.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);

var entity, light, camera;

//load json
// var file = {
//     filename: "scene1.json",
//     url: "./assets/scenes/scene1.json",
//   };

// app.preload( function(){

//     var data = json._resources[0].branch_id;


//     entity = new pc.Entity();
//     //asset.id = 1001;
//     entity.addComponent("model", {
//         type: "asset",
//         asset: asset,
//         castShadows: true
//     });
//     app.root.addChild(entity);
// });

// asset.on("load", function(asset){

//pc.SceneMgr.loadAsset(null);
// });

pc.SceneMgr.load("scene1", function(){});

    //25021783
    // var url = "./assets/models/ball.json";

    // app.assets.loadFromUrl(url, "model",function(err, asset){

    //     asset.id = 2502178115;
       
    // });

      url = "./assets/models/ball.json";

//     // app.assets.loadFromUrl(url, "model",function(){});
// app.assets.loadFromUrl(url, "model", function (err, asset) {
//         //asset.id = 2502178115;
//       entity = new pc.Entity();
//      var asset = app.assets.find("ball.json", "model");
//     // //asset.id = 1001;
//     entity.setLocalPosition(0, 0, 0.1);
//     entity.addComponent("model", {
//         type: "asset",
//         asset: asset,
//         castShadows: true
//     });
//     app.root.addChild(entity);
    
// });

// Create an Entity with a camera component
// var camera = new pc.Entity();
// camera.addComponent("camera", {
//     clearColor: new pc.Color(0.4, 0.45, 0.5)
// });
// camera.translate(0, 7, 24);
// app.root.addChild(camera);

// Create an Entity with a point light component
// var light = new pc.Entity();
// light.addComponent("light", {
//     type: "point",
//     color: new pc.Color(1, 1, 1),
//     range: 100,
//     castShadows: true
// });
// light.translate(5, 0, 15);
// app.root.addChild(light);

//init keyboard
app.keyboard = new pc.Keyboard(document.body);
app.mouse = new pc.Mouse(document.body);



app.on("update", function (dt) {
    if (entity) {
        entity.rotate(0,10*dt,0);
    }
});