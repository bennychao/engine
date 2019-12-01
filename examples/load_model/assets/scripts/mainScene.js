
//car'panel's anim and control function

function animate() {

    requestAnimationFrame(animate); // requestAnimationFrame可以看成setTimeout(animate, 17)

    TWEEN.update(); // 每隔一段时间，update方法会调用上面的onUpdate函数，这样让left变化，小球位置也变化

}


animate();


function checkFirstLoad(){
     var bFirst = localStorage.getItem("firstLoad");
    
    if (!bFirst){
        localStorage.setItem("firstLoad", true);
    }
    
    return bFirst === undefined || bFirst === false || bFirst === null;
}


var sysInfo = {bFirstLoad :  checkFirstLoad()};

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}


//assets mgr



//global data
var cars = [
    {
        name: "Car1",
        count: "1.1w",
        pos: {x:1, y:0, z:1}
    },
    {
        name: "Ca2",
        count: "1.1w",
        pos: {x:3, y:0, z:1}
    },
    {
        name: "Car1",
        count: "1.1w",
        pos: {x:4, y:0, z:1}
    },
    {
        name: "Car3",
        count: "1.1w",
        pos: {x:5, y:0, z:1}
    },
    {
        name: "Car4",
        count: "1.1w",
        pos: {x:6, y:0, z:1}
    },

    {
        name: "Car5",
        count: "1.1w",
        pos: {x:7, y:0, z:1}
    },     
    {
        name: "Car6",
        count: "1.1w",
        pos: {x:8, y:0, z:1}
    }
];    

var singleMainScene = null;

var MainScene = pc.createScript('mainScene');

// initialize code called once per entity
MainScene.prototype.initialize = function() {
    
    //https://launch.playcanvas.com/831774?debug=true&car=Car1
    //    
    var hintPanel = this.app.root.findByName("HintsPanel");
    var cur = this;
    hintPanel.enabled = false;
    
    setTimeout(function () {  
       // cur.checkSwithToCar();
       // 
       if (sysInfo.bFirstLoad){

           
            var btn = hintPanel.findByName("Button");
            btn.element.useInput = false;
            cur.disableInput();
            hintPanel.enabled = true;
            btn.element.useInput = true;

           
           btn.button.on("click", function(event){
                hintPanel.enabled = false;
               cur.eableInput();
           });
       }

    }, 100);
    //check if show the hint UI
    singleMainScene = this;
};

// update code called every frame
MainScene.prototype.update = function(dt) {
    
};

/*
MainScene.prototype.checkSwithToCar = function () {

    var target = getQueryVariable("car");
    if (target){
        //switch the camera pos to face to it
        var camera = this.app.root.findByName("camera");
        
        var carTarget = this.app.root.findByName(target);
        
        if (carTarget)
            camera.fire("faceTo", carTarget);
          //camera.script.first_person_camera.faceTo(carTarget);
    }
};
*/

MainScene.prototype.disableInput = function () {

    //read the local setting
    
    var cameraCtrl = this.app.root.findByName("camera").script.first_person_camera;
    cameraCtrl.enabled = false;
    
    this.inputs = this.app.root.find(function(node) {
        return node.element && node.element.useInput && node.name != "HintsPanel"; // player
    });
    
    
    this.inputs.forEach(function(node){
        node.element.useInput = false;
    });
    
    //wait for the user close the hint
    
    
};


MainScene.prototype.eableInput = function () {

    //read the local setting
    
    var cameraCtrl = this.app.root.findByName("camera").script.first_person_camera;
    cameraCtrl.enabled = true;   

    
    this.inputs.forEach(function(node){
        node.element.useInput = true;
    });
    
    //wait for the user close the hint
    
    
};

//838927
MainScene.prototype.loadScene = function (id, callback) {
    
    var oldHierarchy = this.app.root.children[0];
    // Get the path to the scene
    var url = id  + ".json";
    
    // Load the scenes entity hierarchy
    this.app.loadSceneHierarchy(url, function (err, parent) {
        if (!err) {
            if (callback)
                callback(parent);
            
            oldHierarchy.destroy ();
        } else {
            console.error (err);
        }
    });
};

MainScene.prototype.loadAsset = function (name, type, callback) {
    
    var asset = app.assets.find(name, type);
    
    if (asset){
        if (callback){
            callback(asset);
            
            return;
        }
    }
    
    if (type == "texture"){
        url = "./assets/images/" + name;
    }
    else if (type == "css"){
        url = "./assets/css/" + name;
    }
    
    this.app.assets.loadFromUrl(url, type, function(err, asset){
        if (callback){
            callback(asset);
        }
    });
    
    return;
};


// swap method called for script hot-reloading
// inherit your script state here
// MainScene.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/