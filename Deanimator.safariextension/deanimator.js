var imagesBySrc;

safari.self.addEventListener("message", function (event) {
    if (event.name.match(/^https?:\/\//)) {
        var images = imagesBySrc[event.name], i;
        if (images) {
            for (i = 0; i < images.length; i += 1) {
                images[i].src = event.message;
            }
        }
        delete imagesBySrc[event.name];
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
    imagesBySrc = groupBy("src", document.images);
    
    for (url in imagesBySrc) {
        if (imagesBySrc.hasOwnProperty(url)) {
            safari.self.tab.dispatchMessage("toDataURL", url);
        }
    }
});