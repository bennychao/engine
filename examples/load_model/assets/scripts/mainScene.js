
var MainSceneId = 831774;
var SubSceneId = 838927;

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
        model:"Car1",
        logo:"logo.png",
        image:"image.png",
        pos: {x:1, y:0, z:1}
    },
    {
        name: "Car2",
        count: "1.1w",
        
        model:"Car1",
        logo:"logo.png",
        image:"image.png",
        pos: {x:3, y:0, z:1}
    },
    {
        name: "Car3",
        count: "1.1w",
        
        model:"Car1",
        logo:"logo.png",
        image:"image.png",
        pos: {x:4, y:0, z:1}
    },
    {
        name: "Car4",
        count: "1.1w",
        
        model:"Car1",
        logo:"logo.png",
        image:"image.png",
        pos: {x:5, y:0, z:1}
    },

    {
        name: "Car5",
        count: "1.1w",
        model:"Car1",
        logo:"logo.png",
        image:"image.png",
        pos: {x:7, y:0, z:1}
    },     
    {
        name: "Car6",
        count: "1.1w",
        model:"Car1",
        logo:"logo.png",
        image:"image.png",
        pos: {x:8, y:0, z:1}
    },
    {
        name: "Car7",
        count: "1.1w",
        model:"Car1",
        logo:"logo.png",
        image:"image.png",
        pos: {x:6, y:0, z:1}
    },
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
    
        //check the system buttons' function
    //
    
    this.ExitBtn = this.entity.findByName("Exit");
    if (this.ExitBtn){
        this.ExitBtn.on("click", function(e){
            
        });
    }
    
    this.ShareBtn = this.entity.findByName("Share");
    if (this.ShareBtn){
        this.ShareBtn.on("click", function(e){
            
        });
    }
    
    this.ReturnBtn = this.entity.findByName("Return");
    if (this.ReturnBtn){
        this.ReturnBtn.on("click", function(e){
            singleMainScene.loadScene(MainSceneId, null);
        });
    }
    
    this.bMute = false;
    this.MuteBtn = this.entity.findByName("Sound");
    if (this.MuteBtn){
        this.MuteBtn.on("click", function(e){
            //TODO change the pic
            cur.bMute = !this.bMute;
            cur.Mute(cur.bMute);
        });
    }
    
    

    this.loadCars();
    
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


// update code called every frame
MainScene.prototype.loadCars = function(dt) {
        //init the cars
    var carTemplate = this.entity.findByName("Car1");
    
    if (!carTemplate)
        return;
    
    var cur = this;
    let promise = new Promise(function(resolve, reject){

        cars.forEach(function (c){
            var tt = carTemplate.clone();

            tt.name = c.name;

            tt.setLocalPosition(c.pos);

            cur.app.root.addChild(tt);
        });

        carTemplate.enabled = false; 
        resolve();
    });
};

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

MainScene.prototype.getAsset = function (name, type, callback) {
    
    var asset = app.assets.find(name, type);
    
    if (asset && asset.loaded){    
        
        if (callback){
            callback(asset);
            
            return;
        }
    }
    
    if (asset && !asset.loaded){
        asset.on("load", function(asset){
            if (callback){
                callback(asset);
            }
        });
    }
    
    //load form URL
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


MainScene.prototype.Mute = function(bMute) {
    if (bMute){
        var muteImg = this.getAsset("voice-off.png", "texture", function(asset){
            
            this.MuteBtn.element.textureAsset = asset;

            var sounds = this.app.root.find(function(node) {
                return node.sound;
            });

            sounds.forEach(function(node){
               node.sound.stop(); 
            });
        });

    }
    else{
        var muteImg = this.getAsset("voice-on.png", "texture", function(asset){
            this.MuteBtn.element.textureAsset = muteImg;
        
            var sounds = this.app.root.find(function(node) {
                return node.sound;
            });

            sounds.forEach(function(node){
               node.sound.play(); 
            });
        });

    }

};

// swap method called for script hot-reloading
// inherit your script state here
// MainScene.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/