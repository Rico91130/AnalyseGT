class Job {
    static registeredJobs = [];

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

    constructor(id, title, template) {
        this.id = id;
        this.title = title;
        this.template = template;
    }
}