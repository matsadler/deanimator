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

safari.self.addEventListener("message", function (event) {
    if (event.name === "imageAsDataURL") {
        var message = event.message, images = ImagesByURL.remove(message.url);
        images.forEach(function (image) {
            image.src = message.dataURL;
        });
    }
});

window.addEventListener("DOMContentLoaded", function (event) {
    deanimate(document.images);
});

window.addEventListener("DOMNodeInserted", function (event) {
    if (event.target.tagName === "IMG") {
        deanimate([event.target]);
    } else if (event.target.getElementsByTagName) {
        deanimate(event.target.getElementsByTagName("img"));
    }
});