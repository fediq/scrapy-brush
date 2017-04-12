var ScrapyBrush;

window.ScrapyBrush = ScrapyBrush = (function (window, $) {

    function ScrapyBrush() {
    }

    // General buttons

    ScrapyBrush.enable = function (iframeUrl) {
        var self = this;
        if (!window.scrapyBrush) {
            this.iframe = $('<iframe>')
                .attr('id', 'scrapybrush')
                .attr('class', 'scrapybrush_ignore')
                .attr('src', iframeUrl)
                .appendTo('body');

            this.listener = function (e) {
                var methodParts = e.data[0].split('scrapybrush_supervisor_');
                if (methodParts[0] === '') {
                    e.data.splice(0, 1);
                    self[methodParts[1]].apply(self, e.data);
                }
            };
            window.addEventListener('message', this.listener, false);
            window.scrapyBrush = this;
        }
    };

    ScrapyBrush.disable = function () {
        if (window.scrapyBrush) {
            window.removeEventListener('message', this.listener, false);
            this.iframe.remove();
            window.scrapyBrush = null;
        }
    };

    ScrapyBrush.togglePosition = function () {
        this.iframe.toggleClass('left');
    };

    // Selectors

    ScrapyBrush.hideSelection = function () {
        $('.scrapybrush_select').each(function () {
            $(this).removeClass('scrapybrush_select')
        })
    };

    ScrapyBrush.showSelection = function (css) {
        ScrapyBrush.hideSelection();
        try {
            $(css)
                .not('.scrapybrush_ignore, .scrapybrush_ignore_all, .scrapybrush_ignore_all *')
                .each(function () {
                    $(this).addClass('scrapybrush_select');
                })
        } catch (err) {
            // Do nothing - just invalid CSS
        }
    };

    return ScrapyBrush;

})(window, jQuerySG);
