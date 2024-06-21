var job = new Job("FilterQuery", "Filtrer liste");

job.template = `
<div>
  <div class="title-box">Filtrer liste</div>
  <div class="box">
      Condition
      <textarea df-template></textarea>
      Element courant : item
    </div>
  </div>
`;

job.nbInput = 1;
job.nbOutput = 1;
job.className = "FilterQuery";

Job.register(job);
