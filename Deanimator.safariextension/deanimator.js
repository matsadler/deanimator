var imagesByURL = {};

imagesByURL.constructor.prototype.add = function (image) {
    var url = image.src,
        store = (this[url] || (this[url] = []));
    if (store.indexOf(image) < 0) {
        store.push(image);
    }
    return image;
};

safari.self.addEventListener("message", function (event) {
    if (event.name === "imageAsDataURL") {
        var message = event.message, images = imagesByURL[message.url], i;
        if (images) {
            for (i = 0; i < images.length; i += 1) {
                images[i].src = message.dataURL;
            }
        }
        delete imagesByURL[message.url];
    }
});

function deanimate(event) {
    var nodeList, images;
    if (event.target.tagName === "IMG") {
        images = [event.target];
    } else if (event.target.getElementsByTagName) {
        nodeList = event.target.getElementsByTagName("img");
        images = Array.prototype.slice.call(nodeList);
    } else {
        return;
    }
    
    images.forEach(function (image, index) {
        var URLKnown = imagesByURL[image.src];
        imagesByURL.add(image);
        if (!URLKnown) {
            safari.self.tab.dispatchMessage("toDataURL", image.src);
        }
    });
}

window.addEventListener("DOMContentLoaded", deanimate);
window.addEventListener("DOMNodeInserted", deanimate);