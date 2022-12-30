import { SoloLatino } from "./sololatino.js";
export class SoloLatinoSyP extends SoloLatino {
  constructor() {
    super();
    this.name = "sololatinosyp";
    this.baseUrl = "https://sololatino.net/";
  }
  async getFrontPage(after, onError) {
    var nc = [];
    var na = [];
    var out = {};
    let result = await fGet("https://sololatino.net/animes/novedades/");
    result = await fGet("https://sololatino.net/series/");
    try{
      var parser = new DOMParser();
      var doc = parser.parseFromString(result, "text/html");
      let flis = doc.getElementsByClassName("item"); //doc.querySelectorAll("html body.error404 div#dt_contenedor div#contenedor div.module div.content.full_width_layout div#archive-content.animation-2.items div.items article");
      for (var i = 0; i < flis.length; i++) {
        nc.push({
          "name": flis[i].getElementsByTagName("h3")[0].innerText,
          "path": this.name + "/getDescription/" + window.enc(flis[i].getElementsByTagName("a")[0].getAttribute("href")),
          "image": flis[i].getElementsByTagName("img")[0].getAttribute("data-srcset")
        });
      }
      out["Series"] = nc;
    }catch(e){}
    result = await fGet("https://sololatino.net/peliculas/");
    try{
      var parser = new DOMParser();
      var doc = parser.parseFromString(result, "text/html");
      let flis = doc.getElementsByClassName("item"); //doc.querySelectorAll("html body.error404 div#dt_contenedor div#contenedor div.module div.content.full_width_layout div#archive-content.animation-2.items div.items article");
      for (var i = 0; i < flis.length; i++) {
        na.push({
          "name": flis[i].getElementsByTagName("h3")[0].innerText,
          "path": this.name + "/getDescription/" + window.enc(flis[i].getElementsByTagName("a")[0].getAttribute("href")),
          "image": flis[i].getElementsByTagName("img")[0].getAttribute("data-srcset")
        });
      }
      out["Películas"] = na;
    }catch(e){}
    after(out);
  }

  async getParent(after, path) {
    let dpath = (window.dec(path)).replace("episodios", "series").replace(/-[^-]+?\d\/$/gm, "/");
    
    let reduce = function(v){after({"name": v.name, "image": v.image, "path": v.path}, path)};
    this.getDescription(reduce, console.log, window.enc(dpath));
  }

}
