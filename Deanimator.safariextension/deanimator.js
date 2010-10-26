var imagesByURL = {};

imagesByURL.constructor.prototype.merge = function (hash) {
    var key;
    for (key in hash) {
        if (hash.hasOwnProperty(key)) {
            if (!this[key]) {
                this[key] = hash[key];
            } else {
                this[key] = this[key].concat(hash[key]);
            }
        }
    }
    return this;
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

function groupBy(property, array) {
    var hash = {}, obj, i;
    for (i = 0; i < array.length; i += 1) {
        obj = array[i];
        (hash[obj[property]] || (hash[obj[property]] = [])).push(obj);
    }
    return hash;
}

function deanimate(event) {
    var url, images, grouped;
    if (event.target.tagName === "IMG") {
        images = [event.target];
    } else if (event.target.parentNode) {
        images = event.target.parentNode.getElementsByTagName("img");
    } else {
        return;
    }
    grouped = groupBy("src", images);
    
    imagesByURL.merge(grouped);
    for (url in grouped) {
        if (grouped.hasOwnProperty(url)) {
            safari.self.tab.dispatchMessage("toDataURL", url);
        }
    }
}

window.addEventListener("DOMContentLoaded", deanimate);
window.addEventListener("DOMNodeInserted", deanimate);