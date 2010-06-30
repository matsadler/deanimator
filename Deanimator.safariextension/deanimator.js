var map = {}

safari.self.addEventListener("message", function (event) {
    var name = event.name,
        image = map[name];
    console.log(name);
    if (image) {
        image.src = event.message;
        delete map[name]
    }
});

function deanimate(image) {
    var url = image.src,
        eventName = "toDataURL: " + url;
    map[eventName] = image;
    safari.self.tab.dispatchMessage(eventName, url);
}

function withImages(func) {
    safari.self.addEventListener("message", function (event) {
        console.log("hello");
        if (event.name === "applyToAll" && event.message) {
            func(document.images);
        } else if (event.name === "applyToAll") {
            func(document.querySelectorAll('img[src$=".gif"]'));
        }
    });
    safari.self.tab.dispatchMessage("applyToAll");
}

window.addEventListener("DOMContentLoaded", function () {
    var host = new RegExp("^(" + location.protocol + ")?//" + location.host);
    
    withImages(function (images) {
        var i;
        for (i = 0; i < images.length; i += 1) {
            images[i].addEventListener("load", function (event) {
                deanimate(event.target);
            });
        }
    });
});