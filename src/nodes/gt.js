(function(global) {
    var LiteGraph = global.LiteGraph;

    function GetFoldersByGTQuery() {
        this.addInput("URL", "string");
        this.widget = this.addWidget("toggle","All pages ?", true, null , { on: "oui", off: "non" });
        this.addOutput("Folders", "JSON");

        this.flags = {};
        this.errorOpacity = 0;
        this.errorTimer = null;
    }

    GetFoldersByGTQuery.title = "GetFoldersByGTQuery";
    GetFoldersByGTQuery.desc = "Récupérer une liste de folders par une URL GT";
    GetFoldersByGTQuery.size = [200, 100];

    GetFoldersByGTQuery.prototype.onDrawBackground = function(ctx) {
        if (this.flags.collapsed) {
            return;
        }
    };

    GetFoldersByGTQuery.prototype.onExecute = function() {
        var url = this.getInputData(0);
        console.log(url);

        fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(content => {
          this.setOutputData(0, content);
          this.setOutputData(1, null);
        })
        .catch(error => {
            this.setError();
            this.setOutputData(0, null);
            this.setOutputData(1, `Error: ${error.message}`);
        });

    };

    GetFoldersByGTQuery.prototype.setError = function() {
        this.flags.error = true;
        this.errorOpacity = 1;

        if (this.errorTimer) {
            clearTimeout(this.errorTimer);
        }

        this.errorTimer = setTimeout(() => {
            this.startFading();
        }, 1000);
    };

    GetFoldersByGTQuery.prototype.startFading = function() {
        const fadeInterval = setInterval(() => {
            this.errorOpacity -= 0.05;
            if (this.errorOpacity <= 0) {
                this.errorOpacity = 0;
                this.flags.error = false;
                clearInterval(fadeInterval);
            }
            this.setDirtyCanvas(true, true);
        }, 50); 
    }


    GetFoldersByGTQuery.prototype.onDrawForeground = function(ctx) {
        if (this.flags.error) {
            // Changer la couleur du nœud
            ctx.fillStyle = `rgba(255,0,0,${0.8 * this.errorOpacity})`;
            ctx.fillRect(0, 0, this.size[0], this.size[1]);
        }
    }

    LiteGraph.registerNodeType("GT/GetFoldersByGTQuery", GetFoldersByGTQuery);

})(this);