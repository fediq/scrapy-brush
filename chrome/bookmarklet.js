importJS(chrome.runtime.getURL('plugin/loader.js'));

function importJS(src) {
    var ready = false;
    var scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.src = src;

    scriptTag.id = "scrapybrush_plugin";
    scriptTag.setAttribute("data-id", chrome.runtime.id);
    scriptTag.setAttribute("data-url", document.location.href);

    scriptTag.onload = scriptTag.onreadystatechange = function () {
        if (!ready && (!this.readyState || this.readyState === 'complete')) {
            ready = true;
        }
    };

    var head = document.getElementsByTagName('head')[0];
    if (head) {
        head.appendChild(scriptTag);
    } else {
        document.body.appendChild(scriptTag);
    }
}
