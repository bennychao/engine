const prefabs = {}

Object.assign(pc, function () {

    var SceneMgr = function SceneMgr() {
        this.curScene = "";
    };

    Object.assign(SceneMgr.prototype, {
        load: function (scene, callback){
            var cur = this;
            pc.http.get("./assets/scenes/" + scene + ".assets.json", function (err, response) {
                cur.curScene = scene;
                console.log(response);
            
                response.forEach(element => {
                    cur.loadAsset(element);
                });

                app.preload( function(){
                    cur.mapMaterial();
                    app.loadSceneHierarchy("./assets/scenes/" + scene + ".json", function(err, entity){
                    if (!err) callback();
                    else console.log("load scene error");
                    });
                });
            });
        },

        loadAsset: function(item){
            if (item.type == "folder")
                return;
            if (item.type == "model")
            {
                var url = "./assets/models/"+ item.name + ".json";
                var asset = new pc.Asset(item.name, item.type, 
                    {url: url, preload:true});
                asset.id = item.id;
                asset.preload = true;
                app.assets.add(asset);

                //map the model 
                //app.assets.loadFromUrl(url, "model",function(){});
            }
            else if (item.type == "script")
            {
                var asset = new pc.Asset(item.name, item.type, 
                    {url: "./assets/scripts/"+ item.name, preload:true});
                asset.id = item.id;
                asset.preload = true;
                app.assets.add(asset);
            }
            else if (item.type == "material")
            {
                var asset = new pc.Asset(item.name, item.type, 
                    {url: "./assets/models/" + item.id + "/"+ item.name + ".json", preload:true});
                asset.id = item.id;
                asset.preload = true;
                app.assets.add(asset);
            }
            else if (item.type == "texture")
            {
                var asset = new pc.Asset(item.name + ".png", item.type, 
                    {url: "./assets/models/" + item.id + "/"+ item.name + ".png", preload:true});
                asset.id = item.id;
                asset.preload = true;
                app.assets.add(asset);
            }
        },

        mapMaterial: function(){
            app.assets._assets.forEach(element => {
                if (element.type == "model"){
                    
                    var asset = app.assets.find(element.name, "material");

                    //meshInstances
                    var mode = element.resources[0];

                    if (asset != null && mode != null){                        
                        mode.meshInstances[0].material = asset.resources[0];
                    }
                }
            }); 
        }
    });
    return {
        SceneMgr: SceneMgr,
        SceneMgr: new SceneMgr()
    };
}());