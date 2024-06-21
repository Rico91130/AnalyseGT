var job = new Job("APIQuery", "Requetage API");

job.template = `
<div>
  <div class="title-box">Requetage API</div>
  <div class="box">
    <p>URL : </p>
  <input type="text" df-name>
  </div>
</div>
`;

job.nbInput = 0;
job.nbOutput = 1;
job.className = "APIQuery";

Job.register(job);
