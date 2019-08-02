const GISTS_URL = "https://api.github.com/gists"
function DataGists(token,id=false) {
  this.token = token;
  this.id = id;
  this.get_headers = function() {
    if (typeof this.token !== "undefined") {
      this.headers = {
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "Authorization": "token "+this.token
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
          "content": "DataGist initialized"
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
      throw new Error("Gist Not Found, check provided ID");
    } else if (gist.status == 401) {
      throw new Error("Authorization Failure !");
    }
  };
  this.init = async function() {
    try {
      try {
        this.get_headers();
      } catch(e) {
        throw e;
      }
      this.id = (this.id === false) ? await this.create():this.id;
      try {
        await this.verify_gist();
      } catch(e) {
        throw e;
      }
      console.log("DataGist initialized with ID "+this.id);
    }
    catch(e) {
      console.error(e.message);
    }
  }
  this.raw = async function(file) {
    if (typeof file === "undefined") {
      throw new Error("Usage: DataGists.raw(file_name)");
    }
    let gist = await fetch(GISTS_URL+"/"+this.id, {
      headers: this.headers,
      method: "GET"
    });
    gist = await gist.json();
    try {
      gist = gist.files[file].content;
      return gist;
    } catch {
      throw new Error("File not found");
    }
  };
  this.putContent = async function(file,content,append=false) {
    content = (append) ? content+"\n"+(await this.raw(file)):content;
    let gist = await fetch(GISTS_URL+"/"+this.id, {
      headers: this.headers,
      method: "PATCH",
      body: '{"files":{"'+file+'":{"content":'+JSON.stringify(content)+'}}}'
    });
    return true;
  }
}
export { DataGists };