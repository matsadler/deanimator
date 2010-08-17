var imagesByURL;

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

window.addEventListener("DOMContentLoaded", function () {
    var url;
    imagesByURL = groupBy("src", document.images);
    
    for (url in imagesByURL) {
        if (imagesByURL.hasOwnProperty(url)) {
            safari.self.tab.dispatchMessage("toDataURL", url);
        }
    }
});