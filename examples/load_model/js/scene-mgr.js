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
                var asset = new pc.Asset(item.name, item.type, 
                    {url: "./assets/models/"+ item.name + ".json", preload:true});
                asset.id = item.id;
                asset.preload = true;
                app.assets.add(asset);
            }
            else if (item.type == "script")
            {
                var asset = new pc.Asset(item.name, item.type, 
                    {url: "./assets/scripts/"+ item.name, preload:true});
                asset.id = item.id;
                asset.preload = true;
                app.assets.add(asset);
            }
        }
    });
    return {
        SceneMgr: SceneMgr,
        SceneMgr: new SceneMgr()
    };
}());