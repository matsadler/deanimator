function dataURLReplace(img) {
    var canvas = document.createElement("canvas");
        context = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, img.width, img.height);
    img.src = canvas.toDataURL();
}

var UID = (function () {
    var count = -1;
    return function () {
        return (count += 1);
    };
})();

function getPadding(img) {
    var style = document.defaultView.getComputedStyle(img),
        paddingLeft = parseInt(style.getPropertyValue("padding-left"), 10),
        paddingTop = parseInt(style.getPropertyValue("padding-top"), 10);
    return {top: paddingTop, left: paddingLeft};
}

function updateBackground(img) {
    var id = "deanimator-image-" + UID(),
        padding = getPadding(img),
        ctx = document.getCSSCanvasContext("2d", id, padding.left, padding.top);
    ctx.drawImage(img, 0, 0);
    img.style.backgroundImage = "-webkit-canvas(" + id + ")";
}

function backgroundReplace(img) {
    var id = "deanimator-image-" + UID(),
        context = document.getCSSCanvasContext("2d", id, img.width, img.height),
        padding = getPadding(img);
    context.drawImage(img, padding.left, padding.top, img.width, img.height);
    img.style.paddingLeft = img.width + padding.left + "px";
    img.style.paddingTop = img.height + padding.top + "px";
    img.style.width = "0";
    img.style.height = "0";
    img.style.backgroundImage = "-webkit-canvas(" + id + ")";
    img.style.backgroundRepeat = "no-repeat";
    img.addEventListener("load", function (event) {
        updateBackground(event.target);
    });
}

function withImages(func) {
    safari.self.addEventListener("message", function (event) {
        if (event.name === "applyToAll" && event.message) {
            func(document.images);
        } else if (event.name === "applyToAll") {
            func(document.querySelectorAll('img[src$=".gif"]'));
        }
    });
    safari.self.tab.dispatchMessage("applyToAll");
}

function onComplete(img, func) {
    if (img.complete) {
        func(img);
    } else {
        img.addEventListener("load", function (event) {
            func(event.target);
        });
    }
}

window.addEventListener("DOMContentLoaded", function () {
    var host = new RegExp("^(" + location.protocol + ")?//" + location.host);
    
    withImages(function (images) {
        var image = null,
            i;
        for (i = 0; i < images.length; i += 1) {
            image = images[i];
            if (image.src.match(host)) {
                onComplete(image, dataURLReplace);
            } else if (!image.useMap && !image.style.backgroundImage) {
                onComplete(image, backgroundReplace);
            }
        }
    });
});