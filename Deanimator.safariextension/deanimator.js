var count = 0;

function deanimate(img) {
    if (!img.complete) {
        img.addEventListener("load", function (event) {
            deanimate(event.target);
        });
        return;
    }
    var id = "deanimator-gif-" + count,
        width = img.offsetWidth,
        height = img.offsetHeight,
        context = document.getCSSCanvasContext("2d", id, width, height),
        style = document.defaultView.getComputedStyle(img),
        paddingLeft = style.getPropertyValue("padding-left"),
        paddingTop = style.getPropertyValue("padding-top");
    context.drawImage(img, parseInt(paddingLeft), parseInt(paddingTop));
    img.style.paddingLeft = width + "px";
    img.style.paddingTop = height + "px";
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