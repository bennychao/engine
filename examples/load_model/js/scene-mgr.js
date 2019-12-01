const prefabs = {}



var splash = new Vue({
    el: '#application-splash',
    data: {
      show : true,
      progress: 30
    }
  });

Object.assign(pc, function () {

    var Progress = function (length) {
        this.length = length;
        this.count = 0;

        this.inc = function () {
            this.count++;
        };

        this.done = function () {
            return (this.count === this.length);
        };
    };

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

                var offset = 70  / response.length;
                app.assets._assets.on("load", function(){
    
                    splash.progress += offset;

                    if (splash.progress > 100)
                        splash.progress = 100;
                });

                //cur.startLoadAsset("material", response);

                cur.preload2("material", function(){
                    //cur.clearPreload();
                    var mateAssets = app.assets.filter(function(asset) {
                        return asset.type == "material";
                    });

                    cur.loadTextureAssets(mateAssets);

                    //cur.startLoadAsset("texture", response);
                    cur.preload2("texture", function(){

                        //cur.startLoadAsset("model", response);
                        cur.preload2("model", function(){
                            app.preload( function(){
                                //cur.mapMaterial();
                                app.loadSceneHierarchy("./assets/scenes/" + scene + ".json", function(err, entity){
                                if (!err) callback();
                                else console.log("load scene error");
                                });
                            });

                        });
                    });

                });


            });
        },

        clearPreload: function(){
            app.assets._assets.forEach(element => {
                    element.preload = false;
            }); 
        },

        setOtherFlag: function(){
            app.assets._assets.forEach(element => {
                if (!element.loaded){
                    element.preload = true;
                }
            }); 
        },

        startLoadAsset: function(target, response){
            response.forEach(element => {
                if (element.type == target){
                    this.loadAsset(element);
                }
            });
        },

                /**
         * @function
         * @name pc.Application#preload
         * @description Load all assets in the asset registry that are marked as 'preload'
         * @param {pc.callbacks.PreloadApp} callback Function called when all assets are loaded
         */
        preload2: function (target, callback) {
            var self = this;
            var i, total;

            //self.fire("preload:start");

            // app.assets._assets.forEach(element => {
            //     if (element.type == target){
            //         element.preload = true;
            //     }
            // }); 

            // get list of assets to preload
            // var assets = app.assets.list({
            //     preload: true
            // });
            var assets = app.assets.filter(function(asset) {
                return asset.type == target;
            });


            var _assets = new Progress(assets.length);

            var _done = false;

            // check if all loading is done
            var done = function () {
                // do not proceed if application destroyed
                // if (!self.graphicsDevice) {
                //     return;
                // }

                if (!_done && _assets.done()) {
                    _done = true;
                    //self.fire("preload:end");
                    callback();
                }
            };

            // totals loading progress of assets
            total = assets.length;
            var count = function () {
                return _assets.count;
            };

            if (_assets.length) {
                var onAssetLoad = function (asset) {
                    _assets.inc();
                    //self.fire('preload:progress', count() / total);

                    if (_assets.done())
                        done();
                };

                var onAssetError = function (err, asset) {
                    _assets.inc();
                    //self.fire('preload:progress', count() / total);

                    if (_assets.done())
                        done();
                };

                // for each asset
                for (i = 0; i < assets.length; i++) {
                    if (!assets[i].loaded) {
                        assets[i].once('load', onAssetLoad);
                        assets[i].once('error', onAssetError);

                        app.assets.load(assets[i]);
                    } else {
                        _assets.inc();
                        //self.fire("preload:progress", count() / total);

                        if (_assets.done())
                            done();
                    }
                }
            } else {
                done();
            }
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

                this.loadModelMapping(asset, function(asset){
                    asset.preload = true;
                    app.assets.add(asset);                    
                });

                //asset.preload = true;
                //map the model 
                //app.assets.loadFromUrl(url, "model",function(){});
            }
            else if (item.type == "css")
            {
                var asset = new pc.Asset(item.name, item.type, 
                    {url: "./assets/css/"+ item.name, preload:true});
                asset.id = item.id;
                asset.preload = true;
                app.assets.add(asset);
                //
            }
            else if (item.type == "html")
            {
                var asset = new pc.Asset(item.name, item.type, 
                    {url: "./assets/html/"+ item.name, preload:true});
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
                var asset = new pc.Asset(item.name, item.type, 
                    {url: "./assets/images/"+ item.name, preload:true});

                asset.id = item.id;
                asset.preload = true;
                app.assets.add(asset);
            }
            else if (item.type == "mp3")
            {
                var asset = new pc.Asset(item.name, item.type, 
                    {url: "./assets/mv/"+ item.name, preload:true});

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
        },

        loadModelMapping : function(asset, callback){
            var url = asset.getFileUrl();
            var dir = pc.path.getDirectory(url);
            var basename = pc.path.getBasename(url);
            var ext = pc.path.getExtension(url);

            // playcanvas model format supports material mapping file
            var mappingUrl = pc.path.join(dir, basename.replace(".json", ".mapping.json"));
            pc.http.get(mappingUrl, function (err, data) {
                if (err) {
                    asset.data = { mapping: [] };
                    callback(asset);
                    return;
                }
                asset.data = data;
                callback(asset);
            });
        },

        // private method used for engine-only loading of model data
        loadTextureAssets: function (materialAssets, callback) {
            var self = this;
            var i;
            var used = {}; // prevent duplicate urls
            var urls = [];
            var textures = [];
            var count = 0;
            for (i = 0; i < materialAssets.length; i++) {
                var materialData = materialAssets[i].data;

                if (materialData.mappingFormat !== 'path') {
                    console.warn('Skipping: ' + materialAssets[i].name + ', material files must be mappingFormat: "path" to be loaded from URL');
                    continue;
                }

                var url = materialAssets[i].getFileUrl();
                var dir = pc.path.getDirectory(url);
                var textureUrl;

                for (var pi = 0; pi < pc.StandardMaterial.TEXTURE_PARAMETERS.length; pi++) {
                    var paramName = pc.StandardMaterial.TEXTURE_PARAMETERS[pi];

                    if (materialData[paramName]) {
                        var texturePath = materialData[paramName];
                        textureUrl = pc.path.join(dir, texturePath);
                        if (!used[textureUrl]) {
                            used[textureUrl] = true;
                            var name = pc.path.getBasename(textureUrl);
                            var asset = new pc.Asset(name, "texture", 
                                {url: textureUrl, preload:true});
        
                            //asset.id = item.id;
                            asset.preload = true;
                            app.assets.add(asset);
                            count++;
                        }
                    }
                }

            }
        }
    });
    return {
        SceneMgr: SceneMgr,
        SceneMgr: new SceneMgr()
    };
}());