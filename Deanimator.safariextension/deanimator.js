var count = 0;

function deanimate(img) {
    if (!img.complete) {
        img.addEventListener("load", function (event) {
            deanimate(event.target);
        });
        return;
    }
    var id = "deanimator-gif-" + count,
        context = document.getCSSCanvasContext("2d", id, img.width, img.height),
        style = document.defaultView.getComputedStyle(img),
        paddingLeft = parseInt(style.getPropertyValue("padding-left")),
        paddingTop = parseInt(style.getPropertyValue("padding-top"));
    context.drawImage(img, paddingLeft, paddingTop, img.width, img.height);
    img.style.paddingLeft = img.width + paddingLeft + "px";
    img.style.paddingTop = img.height + paddingTop + "px";
    img.style.width = "0";
    img.style.height = "0";
    img.style.backgroundImage = "-webkit-canvas(" + id + ")";
    count += 1;
}

window.addEventListener("DOMContentLoaded", function () {
    var images = document.querySelectorAll('img[src$=".gif"]'),
        i;
    
    for (i = 0; i < images.length; i += 1) {
        deanimate(images[i]);
    }
});