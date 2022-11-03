export class SoloLatinoSyP {
  constructor() {
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

  async getDescription(after, onError, path, page = 0) {
    try{
      let result = await fGet(dec(path));
      var parser = new DOMParser();
      var doc = parser.parseFromString(result, "text/html");
      let sname =  doc.getElementsByTagName("h1")[1].innerText;
      let description =  doc.getElementsByTagName("p")[0].innerText.trim();
      let image = doc.getElementsByClassName("poster")[0].getElementsByTagName("img")[0].getAttribute("src");
      let chapters = [];
      let ch = [];
      let sh = doc.querySelectorAll("ul.episodios");
      for (var i = 0; i < sh.length; i++) {//for multiple seasons
        ch = [...ch, ...sh[i].getElementsByTagName("li")];
      }
      for(var i = 0; i < ch.length; i++){
        chapters.push({"name":ch[i].querySelector(".numerando").innerText  + " - " + ch[i].querySelector(".epst").innerText,
                       "path": this.name + "/getLinks/" + window.enc(ch[i].firstChild.getAttribute("href"))});
      }

      if(chapters.length == 0){
        chapters.push({"name":"Película", "path": this.name + "/getLinks/" + path});
      }
      after({"name": sname, "path": this.name + "/getDescription/" + path, "image": image, "items":[description], "chapters": chapters});
    }catch(nerror){
      onError(nerror);
    };
  }

  async getParent(after, path) {
    let dpath = (window.dec(path)).replace("episodios", "series").replace(/-[^-]+?\d\/$/gm, "/");
    
    let reduce = function(v){after({"name": v.name, "image": v.image, "path": v.path}, path)};
    this.getDescription(reduce, console.log, window.enc(dpath));
  }

  async getList(page, filter = "") {}

  async getSearch(after, onError, query) {
    try{
      let ra = [];
      let result = await fGet("https://sololatino.net/?s=" + encodeURIComponent(query));
      var parser = new DOMParser();
      var doc = parser.parseFromString(result, "text/html");
      let flis = doc.getElementsByClassName("item"); //doc.querySelectorAll("html body.error404 div#dt_contenedor div#contenedor div.module div.content.full_width_layout div#archive-content.animation-2.items div.items article");
      for (var i = 0; i < flis.length; i++) {
        ra.push({
          "name": flis[i].getElementsByTagName("h3")[0].innerText,
          "path": this.name + "/getDescription/" + window.enc(flis[i].getElementsByTagName("a")[0].getAttribute("href")),
          "image": flis[i].getElementsByTagName("img")[0].getAttribute("data-srcset")
        });
      }
      after(ra);
      }catch(error){
        onError(error);
      }
  }

  async getLinks(after, onError, path) {
    try{
      let result = await fGet(dec(path));
      let web = [...result.matchAll(/"pframe"><iframe class="[^"]+" src="([^"]+)/gm)][0][1];
      result = await fGet(web);
            var parser = new DOMParser();
            var doc = parser.parseFromString(result, "text/html");
            var lis = doc.getElementsByTagName("li");
            let links = [];
            for (const link of lis) {
              try{
                if(link.hasAttribute("data-r")){
                  let linkd = atob(link.getAttribute("data-r"));
                  if(linkd.indexOf("sypl.xyz")){
                    linkd = linkd.replace("sypl.xyz", "owodeuwu.xyz");
                  }
                  links.push(linkd);
                }else{
                  links.push([...link.getAttribute("onclick").matchAll(/go_to_player\('(.+?)'/gm)][0][1]);
                }
              }catch(e){}//continue
            }
            if(links.length == 0 && web.includes("xyz")){
              links.push(web)
            }
            after(links);
    }catch(error){
        onError(error);
    };
  }
}
