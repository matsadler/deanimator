var ImagesByURL = {
    hash: {},
    add: function (url, image) {
        var store = (this.hash[url] || (this.hash[url] = []));
        if (store.indexOf(image) < 0) {
            store.push(image);
        }
        return image;
    },
    remove: function (url) {
        var value = this.hash[url];
        delete this.hash[url];
        return value || [];
    },
    include: function (url) {
        return this.hash.hasOwnProperty(url);
    }
};

function deanimate(images) {
    [].slice.call(images).forEach(function (image) {
        if (!ImagesByURL.include(image.src)) {
            safari.self.tab.dispatchMessage("toDataURL", image.src);
        }
        ImagesByURL.add(image.src, image);
    });
}


function deanimateBackground(elements) {
    [].slice.call(elements).forEach(function (element) {
        var style = window.getComputedStyle(element, null),
            match = style.backgroundImage.match(/^url\((.*)\)$/),
            url = match ? match[1] : null;
        if (url) {
            if (!ImagesByURL.include(url)) {
                safari.self.tab.dispatchMessage("toDataURL", url);
            }
            ImagesByURL.add(url, element);
        }
    });
}

var Responders = {
    imageAsDataURL: function (event) {
        var message = event.message, images = ImagesByURL.remove(message.url);
        images.forEach(function (image) {
            if (image.src === message.url) {
                image.src = message.dataURL;
            }
        });
        images.forEach(function (image) {
            var style = window.getComputedStyle(image, null);
            if (style.backgroundImage === "url(" + message.url + ")") {
                image.style.backgroundImage = "url(" + message.dataURL + ")";
            }
        });
    },
    applyToBackgroundImages: function (event) {
        deanimateBackground(document.querySelectorAll("*"));
    }
};

safari.self.addEventListener("message", function (event) {
    var responder = Responders[event.name];
    if (responder) {
        responder(event);
    }
});

window.addEventListener("DOMContentLoaded", function (event) {
    deanimate(document.images);
});

window.addEventListener("load", function (event) {
    safari.self.tab.dispatchMessage("applyToBackgroundImages");
});

window.addEventListener("DOMNodeInserted", function (event) {
    if (event.target.tagName === "IMG") {
        deanimate([event.target]);
    } else if (event.target.getElementsByTagName) {
        deanimate(event.target.getElementsByTagName("img"));
    }
});