var script = document.currentScript || (function () {
        return document.getElementById("scrapybrush_plugin");
    })();

var baseUrl = "chrome-extension://" + script.getAttribute("data-id") + "/plugin/";

function importJS(src, callback) {
    var ready = false;
    var scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.src = src;

    scriptTag.onload = scriptTag.onreadystatechange = function () {
        if (!ready && (!this.readyState || this.readyState === 'complete')) {
            ready = true;
            callback();
        }
    };

    var head = document.getElementsByTagName('head')[0];
    if (head) {
        head.appendChild(scriptTag);
    } else {
        document.body.appendChild(scriptTag);
    }
}

function importCSS(href) {
    var linkTag = document.createElement('link');
    linkTag.setAttribute('rel', 'stylesheet');
    linkTag.setAttribute('type', 'text/css');
    linkTag.setAttribute('media', 'screen');
    linkTag.setAttribute('href', href);
    var head = document.getElementsByTagName('head')[0];
    if (head) {
        head.appendChild(linkTag);
    } else {
        document.body.appendChild(linkTag);
    }
}

try {
    importCSS(baseUrl + 'css/scrapybrush.css');
    importJS(baseUrl + 'js/jquery.js', function () {
        window.jQuerySG = jQuery.noConflict();
        importJS(baseUrl + 'js/scrapybrush.js', function () {
            ScrapyBrush.enable(baseUrl + 'scrapybrush-iframe.html');
        })
    });
} catch (err) {
    console.log("ScrapyBrush failed to load, error :: " + err.message)
}
