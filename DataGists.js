const GISTS_URL = "https://api.github.com/gists";
function DataGists(token) {
  this.token = token;
  this.gists = [];
  this.setHeaders = function() {
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
  this.init = function() {
    try {
      this.setHeaders();
    } catch(e) {
      console.error(e.message);
    }
  }
  this.listGists = async function() {
    try {
      let list = await fetch(GISTS_URL, {
        headers: this.headers,
        method: "GET"
      });
      list = await list.json();
      list = list.map(e => ({id:e.id,description:e.description}));
      this.gists = list;
      return list;
    } catch(e) {
      console.error(e.message);
    }
  }
  this.createGist = async function(file_name,content) {
    let gist = {"files":{}};
    gist.files[file_name] = {"content":content};
    gist = await fetch(GISTS_URL, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(gist)
    });
    gist = await gist.json();
    return gist.id;
  };
  this.useGist = async function(gist) {
    try {
      if ((typeof gist === "undefined") ||
          ((typeof gist.id === "undefined") &&
          (typeof gist.description === "undefined"))) {
        throw new Error("Gist couldn't be used. Provide id or description");
      } else if ((typeof gist.id === "undefined") &&
                (typeof gist.description !== "undefined")) {
        if (this.gists.length == 0) {this.listGists();}
        gist = this.gists.filter((e) => (e.description == gist.description))[0];
        if (typeof gist === "undefined") {
          throw new Error("Provided description didn't match any Gist");
        }
      }
      gist = new Gist(gist.id,this.headers);
      await gist.verifyGist();
      return gist;
    } catch (e) {
      console.error(e.message);
    }
  }
}
function Gist(id,headers) {
  this.id = id;
  this.headers = headers;
  this.verifyGist = async function() {
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
  this.getContent = async function(file) {
    if (typeof file === "undefined") {
      throw new Error("Usage: Gist.getContent(file_name)");
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
    try {
      if ((typeof file === "undefined") || (typeof content === "undefined")) {
        throw new Error("Usage: Gist.putContent(file_name,content,[append])");
      }
      content = (append)?content+"\n"+(await this.getContent(file)):content;
      let gist = {"files":{}};
      gist.files[file] = {"content":content};
      gist = await fetch(GISTS_URL+"/"+this.id, {
          headers: this.headers,
          method: "PATCH",
          body: JSON.stringify(gist)
        });
      return true;
    } catch (e) {
      console.error(e.message);
    }
  }
}
export { DataGists };
