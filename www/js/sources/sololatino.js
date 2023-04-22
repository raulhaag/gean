export class SoloLatino {
  constructor() {
    this.name = "sololatino";
    this.baseUrl = "https://sololatino.net/animes/";
  }
  async getFrontPage(after, onError) {
    var nc = [];
    var na = [];
    var out = {};
    let result = await fGet("https://sololatino.net/animes/novedades/");
    try{
      var parser = new DOMParser();
      var doc = parser.parseFromString(result, "text/html");
      let flis = doc.getElementsByClassName("item se episodes"); //doc.querySelectorAll("html body.error404 div#dt_contenedor div#contenedor div.module div.content.full_width_layout div#archive-content.animation-2.items div.items article");
      for (var i = 0; i < flis.length; i++) {
        nc.push({
          name: flis[i].getElementsByTagName("h3")[0].innerText,
          path:
            this.name +
            "/getLinks/" +
            window.enc(
              flis[i].getElementsByTagName("a")[0].getAttribute("href")
            ),
          image: flis[i]
            .getElementsByTagName("img")[0]
            .getAttribute("data-srcset"),
        });
      }
      out["Nuevos capítulos"] = nc;
    }catch(e){}
    result = await fGet("https://sololatino.net/animes/");
    try{
      var parser = new DOMParser();
      var doc = parser.parseFromString(result, "text/html");
      let flis = doc.getElementsByClassName("item animes"); //doc.querySelectorAll("html body.error404 div#dt_contenedor div#contenedor div.module div.content.full_width_layout div#archive-content.animation-2.items div.items article");
      for (var i = 0; i < flis.length; i++) {
        na.push({
          "name": flis[i].getElementsByTagName("h3")[0].innerText,
          "path": this.name + "/getDescription/" + window.enc(flis[i].getElementsByTagName("a")[0].getAttribute("href")),
          "image": flis[i].getElementsByTagName("img")[0].getAttribute("data-srcset")
        });
      }
      out["Nuevos animes"] = na;
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
      let image = doc.getElementsByClassName("poster")[0].getElementsByTagName("img")[0].getAttribute("data-src");
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
    let dpath = (window.dec(path)).replace("episodios", "animes").replace(/-[^-]+?\d\/$/gm, "/");
    
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
      let links = [];
      let linkpages = [...result.matchAll(/data-type='([^']+)' data-post='([^']+)' data-nume='([^']+)'/gm)];
      for(let i = 0; i < linkpages.length; i++){
          let presp = await fPost("https://sololatino.net/wp-admin/admin-ajax.php",
          {"Referer": dec(path)},
          {"action":"doo_player_ajax", "post": linkpages[i][2], "nume": linkpages[i][3],"type":	linkpages[i][1]}
          );
          let bData = await fGet(getFirstMatch(/<iframe class='[^']+' src='([^']+)/gm, presp), {"Referer": dec(path)});
          links = links.concat(this.parseLinks(bData));
      }
      if (links.length === 0) {// if no links
        let web = [...result.matchAll(/"pframe"><iframe class="[^"]+" src="([^"]+)/gm)][0][1];
        result = await fGet(web);
        links = links.concat(this.parseLinks(result));
        if(links.length == 0 && web.includes("xyz")){
          links.push(web)
        }
      }
      after(links);
    }catch(error){
        onError(error);
    };
  }


  parseLinks(htmlContent){
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlContent, "text/html");
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
          var decoded =  getFirstMatch(/\.php\?link=(.+?)&servidor=/gm,link.getAttribute("onclick"))
          if(decoded){
            links.push(atob(decoded));
          }
          links.push([...link.getAttribute("onclick").matchAll(/go_to_player\('(.+?)'/gm)][0][1]);
          links.push(atob([...link.getAttribute("onclick").matchAll(/go_to_player\('(.+?)'/gm)][0][1]));
        }
      }catch(e){}//continue
    }
    return links;
  }
}
