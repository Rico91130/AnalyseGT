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

    var editor = null;

    var initialized = false;

    function initialize() {

        /* On initialise qu'une fois */
        if (initialized)
            return;
        initialized = true;

        console.log("Analyse GT : init");
        var id = document.getElementById("drawflow");
        editor = new Drawflow(id);
        editor.reroute = true;
        const dataToImport = {
            "drawflow": {
                "Home": {
                    "data": {
    
                    }
                },
                "Other": {
                    "data": {
                    }
                }
            }
        };
    
        editor.start();
        editor.import(dataToImport);

    }

    /* DRAG EVENT */

    /* Mouse and Touch Actions */

    var elements = document.getElementsByClassName('drag-drawflow');
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('touchend', drop, false);
        elements[i].addEventListener('touchmove', positionMobile, false);
        elements[i].addEventListener('touchstart', drag, false);
    }

    var mobile_item_selec = '';
    var mobile_last_move = null;
    function positionMobile(ev) {
        mobile_last_move = ev;
    }

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(ev) {
        if (ev.type === "touchstart") {
            mobile_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node');
        } else {
            ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));
        }
    }

    function drop(ev) {
        if (ev.type === "touchend") {
            var parentdrawflow = document.elementFromPoint(mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY).closest("#drawflow");
            if (parentdrawflow != null) {
                addNodeToDrawFlow(mobile_item_selec, mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY);
            }
            mobile_item_selec = '';
        } else {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("node");
            addNodeToDrawFlow(data, ev.clientX, ev.clientY);
        }

    }

    function addNodeToDrawFlow(name, pos_x, pos_y) {
        if (editor.editor_mode === 'fixed') {
            return false;
        }
        pos_x = pos_x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
        pos_y = pos_y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));


        switch (name) {
            case 'APIQuery':
                var APIQueryTemplate = `
  <div>
    <div class="title-box">Requetage API</div>
    <div class="box">
      <p>URL : </p>
    <input type="text" df-name>
    </div>
  </div>
  `;
                editor.addNode('APIQuery', 0, 1, pos_x, pos_y, 'APIQuery', { "name": '' }, APIQueryTemplate);
                break;
            case 'FilterQuery':
                var FilterQueryTemplate = `
  <div>
    <div class="title-box">Filtrer liste</div>
    <div class="box">
        Condition
        <textarea df-template></textarea>
        Element courant : item
      </div>
    </div>
  `;
                editor.addNode('FilterQuery', 1, 1, pos_x, pos_y, 'FilterQuery', { "name": '' }, FilterQueryTemplate);
                break;
            default:
        }
    }

    initialize();
}