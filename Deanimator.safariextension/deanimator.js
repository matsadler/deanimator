var grouped;

safari.self.addEventListener("message", function (event) {
    if (event.name.match(/^https?:\/\//)) {
        var images = grouped[event.name], i;
        if (images) {
            for (i = 0; i < images.length; i += 1) {
                images[i].src = event.message;
            }
        }
        delete grouped[event.name];
    }
});

function withImages(func) {
    var callback = function (event) {
        if (event.name === "shouldApplyToAll") {
            if (event.message) {
                func(document.images);
            } else {
                func(document.querySelectorAll('img[src$=".gif"]'));
            }
            safari.self.removeEventListener("message", callback);
        }
    };
    
    safari.self.addEventListener("message", callback);
    safari.self.tab.dispatchMessage("shouldApplyToAll");
}

function groupBy(property, toGroup) {
    var map = {}, obj, i;
    for (i = 0; i < toGroup.length; i += 1) {
        obj = toGroup[i];
        (map[obj[property]] || (map[obj[property]] = [])).push(obj);
    }
    return map;
}

window.addEventListener("DOMContentLoaded", function () {
    withImages(function (images) {
        var property, group;
        grouped = groupBy("src", images);
        
        for (property in grouped) {
            if (grouped.hasOwnProperty(property)) {
                group = grouped[property];
                safari.self.tab.dispatchMessage("toDataURL", group[0].src);
            }
        }
    });
});