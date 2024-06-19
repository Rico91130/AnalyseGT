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


class _AnalyseGT {

    constructor() {
        this.editor = null;
        this.initialized = false;
        this.elements = document.getElementsByClassName('drag-drawflow');
    }

    initialize() {

        /* On initialise qu'une fois */
        if (initialized)
            return;
        initialized = true;

        console.log("Analyse GT : init");
        var id = document.getElementById("drawflow");
        this.editor = new Drawflow(id);
        this.editor.reroute = true;
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

        this.editor.start();
        this.editor.import(dataToImport);

        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener('touchend', drop, false);
            elements[i].addEventListener('touchmove', positionMobile, false);
            elements[i].addEventListener('touchstart', drag, false);
        }

        this.mobile_item_selec = '';
        this.mobile_last_move = null;


    }

    /* DRAG EVENT */

    /* Mouse and Touch Actions */



    positionMobile(ev) {
        this.mobile_last_move = ev;
    }

    allowDrop(ev) {
        ev.preventDefault();
    }

    drag(ev) {
        if (ev.type === "touchstart") {
            this.mobile_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node');
        } else {
            ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));
        }
    }

    drop(ev) {
        if (ev.type === "touchend") {
            var parentdrawflow = document.elementFromPoint(this.mobile_last_move.touches[0].clientX, this.mobile_last_move.touches[0].clientY).closest("#drawflow");
            if (parentdrawflow != null) {
                addNodeToDrawFlow(this.mobile_item_selec, this.mobile_last_move.touches[0].clientX, this.mobile_last_move.touches[0].clientY);
            }
            this.mobile_item_selec = '';
        } else {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("node");
            addNodeToDrawFlow(data, ev.clientX, ev.clientY);
        }

    }

    addNodeToDrawFlow(name, pos_x, pos_y) {
        if (this.editor.editor_mode === 'fixed') {
            return false;
        }
        pos_x = pos_x * (this.editor.precanvas.clientWidth / (this.editor.precanvas.clientWidth * this.editor.zoom)) - (this.editor.precanvas.getBoundingClientRect().x * (this.editor.precanvas.clientWidth / (this.editor.precanvas.clientWidth * this.editor.zoom)));
        pos_y = pos_y * (this.editor.precanvas.clientHeight / (this.editor.precanvas.clientHeight * this.editor.zoom)) - (this.editor.precanvas.getBoundingClientRect().y * (this.editor.precanvas.clientHeight / this.(editor.precanvas.clientHeight * this.editor.zoom)));


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
                this.editor.addNode('APIQuery', 0, 1, pos_x, pos_y, 'APIQuery', { "name": '' }, APIQueryTemplate);
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
                this.editor.addNode('FilterQuery', 1, 1, pos_x, pos_y, 'FilterQuery', { "name": '' }, FilterQueryTemplate);
                break;
            default:
        }
    }
}