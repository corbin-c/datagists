const GISTS_URL = "https://api.github.com/gists"
function DataGists(token,id=false) {
  this.get_token = function(tk) {
    if (typeof tk !== "undefined") {
      this.token = tk;
      this.headers = {
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "Authorization": "token "+tk
      }
    } else {
      throw new Error("Authorization token is mandatory !\n\
  Get one here : https://github.com/settings/tokens");
    }
  }
  this.create = async function() {
    let gist = await fetch(GISTS_URL, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify({"files": {
        "init": {
          "content": "DataGists Initiated"
          }
        }
      })
    });
    gist = await gist.json();
    return gist.id;
  };
  this.verify_gist = async function() {
    let gist = await fetch(GISTS_URL+"/"+this.id, {
      headers: this.headers,
      method: "GET"
    });
    if (gist.status == 404) {
      throw new Error("Gist Not Found, check the provided ID");
    } else if (gist.status == 401) {
      throw new Error("Authorization token looks wrong.");
    }
  };
  this.init = async function() {
    try {
      try {
        this.get_token(token);
      } catch(e) {
        throw e;
      }
      this.id = (id === false) ? await this.create():id;
      try {
        await this.verify_gist();
      } catch(e) {
        throw e;
      }
    }
    catch(e) {
      console.error(e.message);
    }
  }
  this.init();
}
export { DataGists };