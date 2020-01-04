(function(){
    var LAYER_ROOT = "layers";
    var LAYER_TYPE = "png";
    var CANVAS_WIDTH = 612;
    var CANVAS_HEIGHT = 461;
    var layers = ["Base","Thong","Pants","Shirt"];
    var base = 0;
    var layer1 = 1;

    var canvas = document.getElementById("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    var context = canvas.getContext("2d");
    context.font = "22px Arial";

    var layerData = new Array(layers.length).fill(true);

    var buttonContainer = document.body.querySelector("div.toggle-buttons");

    for(var i = 1;i<layers.length;i++) {
        (function(layerIndex){
            var button = document.createElement("button");
            button.appendChild(document.createTextNode("Toggle " + layers[layerIndex]));
            button.onclick = function() {
                layerData[layerIndex] = !layerData[layerIndex];
                renderLayers();
            }
            buttonContainer.appendChild(button);
        })(i);
    }

    function renderClear() {
        context.fillStyle = "black";
        context.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    }
    function renderText(message) {
        context.fillStyle = "white";
        context.fillText(message,5,5);
    }
    function renderImage(index) {
        context.drawImage(layers[index],0,0);
    }
    
    function renderLayers() {
        if(layerData[layer1]) {
            renderImage(layer1);
        } else {
            renderImage(base);
        }
        for(var i = 2;i<layerData.length;i++) {
            if(layerData[i]) {
                renderImage(i);
            }
        }
    }

    function renderLoading() {
        renderClear();
        renderText("Loading images...");

    }
    function renderError() {
        renderClear();
        renderText("Error loading images. Please try again later.");
    }

    renderLoading();

    var loaded = 0;
    var failed = false;
    var finishedLoad = false;

    function shouldSkipLoadOrFail() {
        if(finishedLoad || failed) {
            return;
        }
    }

    function imageLoaded() {
        if(shouldSkipLoadOrFail()) {
            return;
        }
        loaded++;
        if(loaded >= layers.length) {
            finishedLoad = true;
            renderLayers();
        }
    }
    function imageFailed() {
        if(shouldSkipLoadOrFail()) {
            return;
        }
        failed = true;
        renderError();
    }
    function getPath(layerIndex) {
        return LAYER_ROOT + "/" + layers[layerIndex] + "." + LAYER_TYPE;
    }
    
    for(var i = 0;i<layers.length;i++) {
        var image = new Image();
        image.onerror = imageFailed;
        image.onload = imageLoaded;
        image.src = getPath(i);
        layers[i] = image;
    }

})();
