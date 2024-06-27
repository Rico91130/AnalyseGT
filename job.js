class Job {
    static registeredJobs = [];

    static getByName(name) {
        var j = Job.registeredJobs.filter(j => j.id == name);
        if (j.length > 0) {
            return j[0]
        } else {
            return null;
        }
    }

    static register(j) {

        Job.registeredJobs.push(j);

        var HTMLID = "drag" + j.id;
        document.getElementById("jobLists").innerHTML += `
<div id='${HTMLID}' class="drag-drawflow" draggable="true" data-node="${j.id}">
    <span>${j.title}</span>
</div>`;

        /* Besoin d'une temporisation avant d'ajouter les handlers le temps que le DOM soit modifié */
        setTimeout(function () {
            var obj = document.getElementById(HTMLID);
            obj.addEventListener('drag', AnalyseGT.drag.bind(AnalyseGT), false);
            obj.addEventListener('touchend', AnalyseGT.drop.bind(AnalyseGT), false);
            obj.addEventListener('touchmove', AnalyseGT.positionMobile.bind(AnalyseGT), false);
            obj.addEventListener('touchstart', AnalyseGT.drag.bind(AnalyseGT), false);
        }, 200)
    }

    static onNodeCreated(id) {
        Job.postProcessHTMLNode(id);
    }

    static postProcessHTMLNode(id) {
        var o = document.getElementById("node-" + id);
        var node = AnalyseGT.editor.getNodeFromId(id);
        var job = Job.getByName(node.name);
        if (job != null && job.nbInput == 0) {
            o.innerHTML += `
<div class="btnExecute" data-action="execute">
    Executer ▶
</div>
        `;
        }
    }

    static refreshOverlay() {
        var currentModule = AnalyseGT.editor.module;
        for (var o in AnalyseGT.editor.drawflow.drawflow[currentModule].data) {
            Job.postProcessHTMLNode(AnalyseGT.editor.drawflow.drawflow[currentModule].data[o].id);
        };
    
    }

    constructor(id, title) {

        this.id = id;
        this.title = title;

        this.template = `
        <div>
          <div class="title-box">title</div>
          <div class="box">content
          </div>
        </div>
        `;

        this.nbInput = 0;
        this.nbOutput = 0;
        this.className = '';

    }
}

document.addEventListener(`click`, e => {
    const origin = e.target;
    if (origin.hasAttribute("data-action")) {
      var nodeHTML = origin.closest(".drawflow-node");
      if (nodeHTML != null) {
        var nodeId = nodeHTML.id.split("-")[1];
        var node = AnalyseGT.editor.getNodeFromId(nodeId);
        var job = Job.getByName(node.name);
        if (job != null && typeof job.onClick === 'function') {
            job.onClick(node, nodeHTML.getAttribute("data-action"));
        }
      }
    }
  });