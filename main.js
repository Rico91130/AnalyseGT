if (typeof helper === "undefined" && typeof queuedFetch === "undefined") {

    function _loadScript(e, t) {
        var i = document.createElement("script");
        i.type = "text/javascript";
        i.onload = function () { t() };
        i.src = e; document.getElementsByTagName("head")[0].appendChild(i)
    };

    _loadScript(
        "https://rico91130.github.io/Tools/Helper.js?" + (new Date()).getTime(),
        function () {
            helper.loadScripts("Tools/QueuedFetch.js", "AnalyseGT/job.js").then(
                setTimeout(function () {
                    AnalyseGT = new _AnalyseGT();
                    AnalyseGT.initialize();
                }, 1000)
            );
        });

}


class _AnalyseGT {

    constructor() {
        this.container = null;
        this.editor = null;
        this.initialized = false;
    }

    initialize() {

        /* On initialise qu'une fois */
        if (this.initialized)
            return;
        this.initialized = true;

        console.log("Analyse GT : initialize");

        this.container = document.getElementById("drawflow");

        this.container.addEventListener('drop', this.drop.bind(this), false);
        this.container.addEventListener('dragover', this.allowDrop.bind(this), false);

        this.editor = new Drawflow(this.container);
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

        this.last_item_selec = '';
        this.mobile_last_move = null;

        helper.loadScripts("AnalyseGT/jobs/APIQuery.js", "AnalyseGT/jobs/FilterQuery.js");
    }

    /* DRAG EVENT */
    positionMobile(ev) {
        this.mobile_last_move = ev;
    }
    allowDrop(ev) {
        ev.preventDefault();
    }
    drag(ev) {
        if (ev.type === "touchstart") {
            this.last_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node');
        } else {
            this.last_item_selec = ev.target.getAttribute('data-node');
        }
    }
    drop(ev) {
        if (ev.type === "touchend") {
            var parentdrawflow = document.elementFromPoint(this.mobile_last_move.touches[0].clientX, this.mobile_last_move.touches[0].clientY).closest("#drawflow");
            if (parentdrawflow != null) {
                this.addNodeToDrawFlow(this.last_item_selec, this.mobile_last_move.touches[0].clientX, this.mobile_last_move.touches[0].clientY);
            }
            this.last_item_selec = '';
        } else {
            ev.preventDefault();
            this.addNodeToDrawFlow(this.last_item_selec, ev.clientX, ev.clientY);
        }

    }

    changeModule(moduleName, event) {
        this.editor.changeModule(moduleName);

        var all = document.querySelectorAll(".menu ul li");

        for (var i = 0; i < all.length; i++) {
            all[i].classList.remove('selected');
        }
        event.target.classList.add('selected');
    }

    changeMode(mode, option) {
        AnalyseGT.editor.editor_mode = mode;

        if (option == 'lock') {
            lock.style.display = 'none';
            unlock.style.display = 'block';
        } else {
            lock.style.display = 'block';
            unlock.style.display = 'none';
        }
    }


    addNodeToDrawFlow(name, pos_x, pos_y) {
        if (this.editor.editor_mode === 'fixed') {
            return false;
        }
        pos_x = pos_x * (this.editor.precanvas.clientWidth / (this.editor.precanvas.clientWidth * this.editor.zoom)) - (this.editor.precanvas.getBoundingClientRect().x * (this.editor.precanvas.clientWidth / (this.editor.precanvas.clientWidth * this.editor.zoom)));
        pos_y = pos_y * (this.editor.precanvas.clientHeight / (this.editor.precanvas.clientHeight * this.editor.zoom)) - (this.editor.precanvas.getBoundingClientRect().y * (this.editor.precanvas.clientHeight / (this.editor.precanvas.clientHeight * this.editor.zoom)));


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