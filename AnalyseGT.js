var AnalyseGT = null;

/* Dans le cas d'un chargement hors bookmark */
if (typeof helper === "undefined" && typeof queuedFetch === "undefined") {
    const __delay = ms => new Promise(res => setTimeout(res, ms));

    function _loadScript(e, t) {
        var i = document.createElement("script");
        i.type = "text/javascript";
        i.onload = function () { t() };
        i.src = e; document.getElementsByTagName("head")[0].appendChild(i)
    };
    _loadScript(
        "https://rico91130.github.io/Tools/Helper.js?" + (new Date()).getTime(),
        function () {
            helper.loadScripts("Tools/QueuedFetch.js").then(
                setTimeout(function () {
                    AnalyseGT = new _AnalyseGT();
                }, 1000)
            );
        });
}


function _AnalyseGT() {
    var initialized = false;

    function initialize() {

        /* On initialise qu'une fois */
        if (initialized)
            return;
        initialized = true;
    }

    initialize();
}
