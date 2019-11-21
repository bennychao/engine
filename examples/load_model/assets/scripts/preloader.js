// More information about streaming assets at runtime can be found here
// http://developer.playcanvas.com/en/user-manual/assets/preloading-and-streaming/

// Note: All the texture and material assets that would like to be streamed at runtime
// should have 'level' unticked and in this demo's case, have been tagged with
// 'level'
var Preloader = pc.createScript('preloader');

Preloader.attributes.add("runeCards", {type: "entity", title: "Rune Cards"});

// initialize code called once per entity
Preloader.prototype.initialize = function() {
    this.loadAssets();
};

Preloader.prototype.loadAssets = function() {
    var self = this;
    
    // Find all the assets that have been tagged 'level'
    // In this example, they are in the 'assets-to-load' folder
    var assets = this.app.assets.findByTag('level');
    var assetsLoaded = 0;
    var assestTotal = assets.length;
        
    // Callback function when an asset is loaded
    var onAssetLoad = function() {
        assetsLoaded += 1;        
        
        // Once we have loaded all the assets
        if (assetsLoaded === assestTotal) {
            self.onAssetsLoaded();
        }        
    };
    
    // Start loading all the assets
    for(var i = 0; i < assets.length; i++) {
        if (assets[i].resource) {
            onAssetLoad();
        } else {
            assets[i].once('load', onAssetLoad);
            this.app.assets.load(assets[i]);
        }
    }
    
    if (!assets.length) {
        this.onAssetsLoaded();
    }    
};

Preloader.prototype.onAssetsLoaded = function() {
    // Show the runes now that all the assets are loaded
    this.runeCards.enabled = true;
};