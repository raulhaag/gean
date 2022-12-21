export class JKAnime {
  constructor() {
    this.name = "jkanime";
  }
  async getFrontPage(after, error) {
    let result = await fGet("https://jkanime.net/");
    if(result.indexOf("error") == 0){
      error(result);
      return;
    }
    var parser = new DOMParser();
    var doc = parser.parseFromString(result, "text/html");
    let ncs = [];
    let flis;
    try {
      flis = doc.querySelectorAll("body section.hero div.container div.row div.col-lg-4.pt-3 div.anime__sidebar__comment div.listadoanime-home div.maximoaltura a.bloqq");
      for (var i = 0; i < flis.length; i++) {
        let name =
          flis[i].getElementsByTagName("h5")[0].textContent + " - " + flis[i].getElementsByTagName("h6")[0].textContent.replace(/\s+/gm, " ").trim();
        let epath = this.name + "/getLinks/" + window.enc(flis[i].getAttribute("href"));
        let pparts = flis[i].getAttribute("href").split("/");
        let ppath = this.name + "/getDescription/" + window.enc(pparts.slice(0, pparts.length - 2).join("/") + "/");
        ncs.push({
          "name": name,
          "image": flis[i].getElementsByTagName("img")[0].getAttribute("src"),
          "path": epath,
          "parentPath": ppath 
        });
      }
    } catch (nerror) {
      error(nerror);
    }
    let nas = [];
    try {
      flis = doc.querySelectorAll("html body section.contenido.spad div.container div.row div.col-lg-8 div.trending__anime div.row div.col-lg-3.col-md-6.col-sm-6 div.anime__item");
      for (var i = 0; i < flis.length; i++) {
        let name = flis[i].getElementsByTagName("h5")[0].textContent.trim();
        let epath = this.name + "/getDescription/" + window.enc(flis[i].firstChild.nextSibling.getAttribute("href"));
        nas.push({
          "name": name,
          "image": flis[i]
            .getElementsByTagName("div")[0]
            .getAttribute("data-setbg"),
          "path": epath,
        });
      }
    } catch (nerror) {
      error(nerror);
    }
    let etc = [];
    try {
      flis = doc.querySelectorAll("html body section.hero div.container div.row div.col-lg-8 div.solopc div.row div.col-lg-3.col-md-6.col-sm-6.col-6 div.anime__item");
      for (var i = 0; i < flis.length; i++) {
        let name =
          flis[i].getElementsByTagName("h5")[0].textContent.trim() + " - " + flis[i].getElementsByTagName("li")[0].textContent.replace(/\s+/gm, " ").trim();
        let epath;
        if (flis[i].getElementsByTagName("a")[0].getAttribute("href").match(/\/\d+\/$/) != null) {
          epath =
            this.name + "/getLinks/" + window.enc(flis[i].getElementsByTagName("a")[0].getAttribute("href"));
        } else {
          epath = this.name + "/getDescription/" + window.enc(flis[i].getElementsByTagName("a")[0].getAttribute("href"));
        }
        etc.push({
          "name": name,
          "image": flis[i]
            .getElementsByTagName("div")[0]
            .getAttribute("data-setbg"),
          "path": epath,
        });
      }
    } catch (nerror) {
      error(nerror);
    }
    after({
      "Últimos Capítulos": ncs,
      "Últimos animes": nas,
      "Ovas, Películas, etc.": etc,
    });
  }

  async getDescription(after, onError, path, page = 0, ) {
    try{
      let result = await fGet(window.dec(path));
      if (result.indexOf("error") == 0) {
        onError(result + ": " + window.dec(path));
        return;
      }
      var parser = new DOMParser();
      var doc = parser.parseFromString(result, "text/html");
      let sname =  doc.querySelector("html body section.contenido.spad div.container div.anime__details__content div.row div.col-lg-9 div.anime__details__text div.anime__details__title h3").innerText;
      let description =  doc.querySelector("html body section.contenido.spad div.container div.anime__details__content div.row div.col-lg-9 div.anime__details__text p").textContent.trim();
      let genres = doc.querySelector("html body section.contenido.spad div.container div.anime__details__content div.row div.col-lg-9 div.anime__details__text div.anime__details__widget div.row div.col-lg-6.col-md-6 ul li").textContent.trim();
      let image = doc.querySelector("html body section.contenido.spad div.container div.anime__details__content div.row div.col-lg-3 div.anime__details__pic.set-bg").getAttribute("data-setbg");
      let chapters = [];
      let clen = parseInt([...result.matchAll(/#pag\d*" rel="nofollow">.+?(\d+)<\/a>[\s]+?<\/div/gm)][0][1]);
      for (let i = 1; i <= clen; i++) {
        chapters.push({"name": "Capítulo " + i, "path": this.name + "/getLinks/" + window.enc(window.dec(path) + "/" + i + "/")});
      }
      after({"name": sname, "path": this.name + "/getDescription/" + path, "image": image, "items":[description, genres], "chapters": chapters});
    } catch (error) {
      onError(error);
    }
  }

  async getParent(after, path) {
    let reduce = function(v){after({"name": v.name, "image": v.image, "path": v.path}, path)};
    let dpath = (window.dec(path)).split("/");
    this.getDescription(reduce, console.log, window.enc(dpath.slice(0, dpath.length - 2).join("/")));
  }

  async getList(page, filter = "") {
    if(filter == ""){
      fetch(window.serverHost + "get/" + window.enc("https://jkanime.net/directorio/"))
      .then((response) => response.text())
      .then((result) => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "text/html");
        let flis = doc.querySelectorAll("html body section.contenido.spad div.container div.row div.col-lg-12 div.anime__page__content section#dirmenu div.menupc div.genre-list.addmenu ul li a");
        let glist = [];
        for (var i = 0; i < flis.length; i++) {
          glist.push({"name": flis[i].textContent.trim(), "path": this.name + "/getList/" + window.enc(flis[i].getAttribute("href"))});
        }
      }).catch((nerror) => {
        console.log(nerror);
      });
    }
  }

  async getSearch(after, onError, query) {
    let fres = [];
    let cidx = 1;
    while(true){
      let response = await fGet("https://jkanime.net/buscar/" + encodeURIComponent(query) + "/" + cidx);
      if (response.indexOf("error") == 0) {
        onError(response);
        return;
      }
      var parser = new DOMParser();
      var doc = parser.parseFromString(response, "text/html");
      let res = [];
      try {
        let flis = doc.querySelectorAll("div.anime__item");
        for (var i = 0; i < flis.length; i++) {
          let name =
            flis[i].getElementsByTagName("h5")[0].textContent.trim() + " - " + flis[i].getElementsByTagName("li")[0].textContent.replace(/\s+/gm, " ").trim();
          let epath;
          if (flis[i].getElementsByTagName("a")[0].getAttribute("href").match(/\/\d+\/$/) != null) {
            epath =
              this.name + "/getLinks/" + window.enc(flis[i].getElementsByTagName("a")[0].getAttribute("href"));
          } else {
            epath = this.name + "/getDescription/" + window.enc(flis[i].getElementsByTagName("a")[0].getAttribute("href"));
          }
          res.push({
            "name": name,
            "image": flis[i]
              .getElementsByTagName("div")[0]
              .getAttribute("data-setbg"),
            "path": epath,
          });
        }
      } catch (nerror) {
        onError(nerror);
      }
      fres = fres.concat(res);
      if(res.length != 12){
        break;
      }
      cidx++;
    }
    after(fres);
  }

  async getLinks(after, onError, path) {
    try{
      let result = await fGet(window.dec(path));
      if (result.indexOf("error") == 0) {
        onError(result);
        return;
      }
      let fames = [...result.matchAll(/video\[\d+\] = '<iframe.+?src="([^"]+)/gm)]
      let links = [];
      for (let i = 0; i < fames.length; i++) {
        if(fames[i][1].indexOf('fembed') > -1){
          links.push(fames[i][1].replace('https://jkanime.net/jkfembed.php?u=', 'https://www.fembed.com/v/'));
        }else{
          links.push(fames[i][1]);
        }
      }
      after(links);
    } catch (error) {
      onError(error);
    }
  }
}

