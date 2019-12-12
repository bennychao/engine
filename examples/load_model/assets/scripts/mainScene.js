
var MainSceneId = 838900;
var SubSceneId = 841570;    //inner car scene


function animate() {

    requestAnimationFrame(animate); // requestAnimationFrame可以看成setTimeout(animate, 17)

    TWEEN.update(); // 每隔一段时间，update方法会调用上面的onUpdate函数，这样让left变化，小球位置也变化

}


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
        count: "21.1w人",
        series:"博越",
        model:"car_001.json",
        logo:"logo.png",
        image:"car1_image.jpg",
        pos: new pc.Vec3(10.632, 0.994, 16.57)
    },
    {
        name: "Car2",
        count: "11.1w人",
        
        series:"领界",
        model:"car_001.json",
        logo:"logo.png",
        image:"car2_image.jpg",
        pos: new pc.Vec3(16.858, 1.426, 10.467)
    },
    {
        name: "Car3",
        count: "10.5w人",
        
        series:"宋Pro",
        model:"car_001.json",
        logo:"logo.png",
        image:"car3_image.jpg",
       pos: new pc.Vec3(19.577, 1.426, 2.152)
    },
    {
        name: "Car4",
        count: "11.5w人",
        
        series:"恩域",
        model:"car_001.json",
        logo:"logo.png",
        image:"car4_image.jpg",
       pos: new pc.Vec3(18.466, 1.426, -6.651)
    },

    {
        name: "Car5",
        count: "11.1w人",
        series:"途胜",
        model:"car_001.json",
        logo:"logo.png",
        image:"car5_image.jpg",
        pos: new pc.Vec3(13.511, 1.426, -13.98)
    },     
    {
        name: "Car6",
        count: "1.1w人",
        series:"胜达",
        model:"car_001.json",
        logo:"logo.png",
        image:"car6_image.jpg",
        pos: new pc.Vec3(5.832, 1.426, -18.422)
    },
    {
        name: "Car7",
        count: "11.1w人",
        series:"名图",
        model:"car_001.json",
        logo:"logo.png",
        image:"car7_image.jpg",
        pos: new pc.Vec3(-2.854, 1.426, -19.012)
    },
    {
        name: "Car8",
        count: "3.9w人",
        series:"途锐",
        model:"car_001.json",
        logo:"logo.png",
        image:"car8_image.jpg",
        pos: new pc.Vec3(-12.459, 1.426, 14.778)
    },
    {
        name: "Car9",
        count: "18.1w人",
        series:"探岳",
        model:"car_001.json",
        logo:"logo.png",
        image:"car9_image.jpg",
        pos: new pc.Vec3(-11.047, 1.426, -15.819)
    },
    {
        name: "Car10",
        count: "11.1w人",
        series:"楼兰",
        model:"car_001.json",
        logo:"logo.png",
        image:"car10_image.jpg",
        pos: new pc.Vec3(-16.693, 1.426, -9.382)
    },
    {
        name: "Car11",
        count: "21.1w人",
        series:"东风风神AX7",
        model:"car_001.json",
        logo:"logo.png",
        image:"car11_image.jpg",
        pos: new pc.Vec3(-18.979, 1.426, -0.863)
    },
    {
        name: "Car12",
        count: "11.1w人",
        series:"宝马3系",
        model:"car_001.json",
        logo:"logo.png",
        image:"car12_image.jpg",
        pos: new pc.Vec3(-17.714, 1.426, 7.71)
    },
    {
        name: "Car13",
        count: "1.1w人",
        series:"红旗HS7",
        model:"car_001.json",
        logo:"logo.png",
        image:"car13_image.jpg",
        pos: new pc.Vec3(-4.511, 1.426, 18.844)
    },
];    

var singleMainScene = null;

var MainScene = pc.createScript('mainScene');

// initialize code called once per entity
MainScene.prototype.initialize = function() {
    //car'panel's anim and control function

    this.mainUI = this.app.root.findByName("MainUI");
    this.animate();

    
    //https://launch.playcanvas.com/831774?debug=true&car=Car1
    //    
    var hintPanel = this.app.root.findByName("HintsPanel");
    var cur = this;
    hintPanel.enabled = false;
    
    setTimeout(function () {  
       // cur.checkSwithToCar();
       // 
       if (cur.sysInfo.bFirstLoad){           
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
            cur.mainUI.script.carController.showShareUI();
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
            cur.bMute = !cur.bMute;
            cur.Mute(cur.bMute);
        });
    }
    
    


    this.sysInfo = {bFirstLoad :  this.checkFirstLoad()};

    this.loadCars();
    
};

MainScene.prototype.checkFirstLoad = function(){
     var bFirst = localStorage.getItem("firstLoad");
    
    if (!bFirst){
        localStorage.setItem("firstLoad", true);
    }
    
    return bFirst === undefined || bFirst === false || bFirst === null;
};

MainScene.prototype.animate = function() {

    animate();

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
            
            var car = c;
            cur.loadCarAsset(c, function(){
                var tt = carTemplate.clone();

                tt.name = car.name;
                var pos = c.pos.clone();
                pos.y = tt.getPosition().y;
                
                tt.findByName("hint1").name = car.name + "hint1";
                tt.findByName("hint2").name = car.name + "hint2";
                
                tt.setLocalPosition(pos);
                tt.enabled = true;
                cur.app.root.addChild(tt);
                
               
            });

        });

        carTemplate.enabled = false; 
        carTemplate.parent.removeChild(carTemplate);
        resolve();
    });
    
    //init the detail trigger
    var carsObstacle = this.entity.findByName("carsObstacle");
    
    if (carsObstacle){
        carsObstacle.children.forEach(function(ob){

            var bShow = false;
           ob.on("onCollisionEnter", function(pos){
               //check the distance
               var obPos = ob.getPosition().clone();
               obPos.sub(pos);
                var dis = obPos.length();
               console.log("dis is " + dis);

               if (dis < 5){
                   //show the Car's Detail UI
                   bShow = true;
                   cur.mainUI.fire("showCarDetail", ob);
               }
           });


            ob.on("onCollisionLeave", function(pos){
               if (bShow){
                   cur.mainUI.fire("hideCarDetail", ob);
               }
           }); 

        });
    }

};

MainScene.prototype.loadCarAsset = function(car, callback) {
    //init the cars
    var urls = new Array();
    
    urls.push(car.logo);
    urls.push(car.image);
    
    //preload
    var modelJsonAsset = this.app.assets.find(car.model, "json");
    
    //var carParts = Enumerable.From(modelJsonAsset.resource).Select("x=>x.tex").ToArray();
    
    if (modelJsonAsset){
        modelJsonAsset.resources.forEach(function(part){urls.push(part.tex);});
    }

    
    var count = urls.length;
    
    var cur = this;
    urls.forEach(function(url){
       var asset = cur.app.assets.find(url, "texture");
        if (asset && asset.loaded){
            count--;
            
            if (count <= 0){
                callback();
            }
        }
        else if (asset && !asset.loaded){
            
            cur.app.assets.load(asset);
            
            asset.on("load", function(a){
               count--; 
                
                if (count <= 0){
                    callback();
                }
            });
        }
        else{
            //error//
            //            
            count--;
            
            if (count <= 0){
                callback();
            }
        }
        
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
    
    var asset = this.app.assets.find(name, type);
    
    if (asset && asset.loaded){    
        
        if (callback){
            callback(asset);
            
            return;
        }
    }
    
    if (asset && !asset.loaded){
        
        this.app.assets.load(asset);
        asset.on("load", function(asset){
            if (callback){
                callback(asset);
            }
        });
        
        return;
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
    
    var cur = this;
    
    //bMute = !bMute;
    
    if (bMute){
        var muteImg = this.getAsset("voice-off.png", "texture", function(asset){
            
            cur.MuteBtn.element.textureAsset = asset;

            var sounds = cur.app.root.find(function(node) {
                return node.sound;
            });

            sounds.forEach(function(node){
               node.sound.pause(); 
            });
        });

    }
    else{
        var muteImg = this.getAsset("voice-on.png", "texture", function(asset){
            cur.MuteBtn.element.textureAsset = asset;
        
            var sounds = cur.app.root.find(function(node) {
                return node.sound;
            });

            sounds.forEach(function(node){
               node.sound.resume(); 
            });
        });

    }

};

// swap method called for script hot-reloading
// inherit your script state here
// MainScene.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/