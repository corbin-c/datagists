const GISTS_URL = "https://api.github.com/gists";
const fetch = (typeof window === "undefined")?require("node-fetch"):window.fetch;

let DataGists = class {
  constructor(token) {
    this.token = token;
    this.gists = [];
  }
  setHeaders() {
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
  init() {
    try {
      this.setHeaders();
    } catch(e) {
      console.error("error while setting headers",e.message);
    }
  }
  async listGists() {
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
  async createGist(file_name,content,description,is_public) {
    let gist = {"files":{}};
    gist.files[file_name] = {"content":content};
    if ((typeof description !== "undefined") && (description != "")) {
      gist.description = description;
    }
    if (typeof is_public !== "undefined") {
      gist.public = is_public;
    }
    gist = await fetch(GISTS_URL, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(gist)
    });
    gist = await gist.json();
    return gist.id;
  }
  async useGist(gist) {
    try {
      if ((typeof gist === "undefined") ||
          ((typeof gist.id === "undefined") &&
          (typeof gist.description === "undefined"))) {
        throw new Error("Gist couldn't be used. Provide id or description");
      } else if ((typeof gist.id === "undefined") &&
                (typeof gist.description !== "undefined")) {
        if (this.gists.length == 0) {await this.listGists();}
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
let Gist = class {
  constructor(id,headers) {
    this.id = id;
    this.headers = headers;
  }
  async verifyGist() {
    let gist = await fetch(GISTS_URL+"/"+this.id, {
      headers: this.headers,
      method: "GET"
    });
    if (gist.status == 404) {
      throw new Error("Gist Not Found, check provided ID");
    } else if (gist.status == 401) {
      throw new Error("Authorization Failure !");
    }
  }
  async getContent(file) {
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
  }
  async putContent(file,content,prepend=false) {
    try {
      if ((typeof file === "undefined") || (typeof content === "undefined")) {
        throw new Error("Usage: Gist.putContent(file_name,content,[prepend])");
      }
      try {
        content = (prepend)?content+"\n"+(await this.getContent(file)):content;
      } catch {
        console.warn("Content couldn't be prepended.");
      }
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
