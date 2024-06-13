export class JKAnime {
  constructor() {
    this.name = "jkanime";
    this.baseUrl = "https://jkanime.net"
  }
  
  async getFrontPage(after, error) {
    let result = await fGet("https://jkanime.net/");
    if (result.indexOf("error") == 0) {
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
        let ppath = this.name + "/getDescription/" + window.enc(pparts.slice(0, pparts.length - 2).join("/"));
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

    let pg = [
      {"name":"Accion","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/accion/')},
      {"name":"Aventura","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/aventura/')},
      {"name":"Autos","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/autos/')},
      {"name":"Comedia","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/comedia/')},
      {"name":"Dementia","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/dementia/')},
      {"name":"Demonios","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/demonios/')},
      {"name":"Misterio","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/misterio/')},
      {"name":"Drama","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/drama/')},
      {"name":"Ecchi","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/ecchi/')},
      {"name":"Fantasia","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/fantasia/')},
      {"name":"Juegos","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/juegos/')},
      {"name":"Historico","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/historico/')},
      {"name":"Terror","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/terror/')},
      {"name":"Magia","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/magia/')},
      {"name":"Artes Marciales","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/artes-marciales/')},
      {"name":"Mecha","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/mecha/')},
      {"name":"Musica","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/musica/')},
      {"name":"Parodia","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/parodia/')},
      {"name":"Samurai","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/samurai/')},
      {"name":"Romance","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/romance/')},
      {"name":"Colegial","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/colegial/')},
      {"name":"Sci-Fi","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/sci-fi/')},
      {"name":"Space","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/space/')},
      {"name":"Deportes","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/deportes/')},
      {"name":"Super Poderes","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/super-poderes/')},
      {"name":"Vampiros","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/vampiros/')},
      {"name":"Harem","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/harem/')},
      {"name":"Cosas de la vida","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/cosas-de-la-vida/')},
      {"name":"Sobrenatural","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/sobrenatural/')},
      {"name":"Militar","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/militar/')},
      {"name":"Policial","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/policial/')},
      {"name":"Psicologico","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/psicologico/')},
      {"name":"Thriller","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/thriller/')},
      {"name":"Español Latino","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/espaol-latino/')},
      {"name":"Isekai","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/isekai/')}]
    let tipo = [{"name":"Animes","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/animes/')},
      {"name":"Peliculas","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/peliculas/')},
      {"name":"Especiales","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/especiales/')},
      {"name":"Ovas","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/ovas/')},
      {"name":"Onas","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/onas/')}];
    after({
      "Últimos Capítulos": ncs,
      "Últimos animes": nas,
      "Ovas, Películas, etc.": etc,
      "Generos": pg,
      "Tipo": tipo
    });


  }

  /*
    let opts, opt, out;
    opts = document.getElementsByClassName("nice-select")[1].getElementsByTagName("li");
    out = [];
    for(opt in opts){
      try{
      out.push({name: opts[opt].innerText, path: `this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio/${opts[opt].dataset.value}/')`});
      }catch(e){};
    }
    console.log(JSON.stringify(out).replaceAll("\\", ""))
  */

  async getMore(after, onError = console.log, more , title = ""){
      let web = window.dec(more);
      if(web === "Homepage"){
        this.getFrontPage(after, onError);
        return;
      }
      let pd = [
        {
          "name": "Home",
          "image": "./images/home_nav.png",
          "path": this.name + "/getMore/" + window.enc("Homepage"),
        }
      ];

      try{
        let result = await window.fGet(window.dec(more));
        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "text/html");
        let pl = doc.getElementsByClassName("nav-prev")
        let nl = doc.getElementsByClassName("nav-next")
        if(pl.length > 0){
          pd.push({"name": "Pagina Anterior", "image": "./images/prev_nav.png", "path": this.name + "/getMore/" + window.enc(pl[0].getAttribute("href"))});  
        }
        
        let series = doc.getElementsByClassName("custom_item2");
        for(let s = 0; s < series.length; s++){
          pd.push({"name":series[s].getElementsByTagName("a")[1].getAttribute('title'),
            "path":this.name + "/getDescription/" + window.enc(series[s].getElementsByTagName("a")[0].getAttribute("href")),
            "image":series[s].getElementsByTagName("img")[0].getAttribute("src")
            })
        }
        if(nl.length > 0){
          pd.push({"name": "Pagina siguiente", "image": "./images/next_nav.png", "path": this.name + "/getMore/" + window.enc(nl[0].getAttribute("href"))});
        }
        after({
          [title]: pd,
        });
      }catch(e){
        onError(e);
      }
  }

  async getDescription(after, onError, path, page = 0,) {
    try {
      let result = await window.fGet(window.dec(path));
      if (result.indexOf("error") == 0) {
        onError(result + ": " + window.dec(path));
        return;
      }
      var parser = new DOMParser();
      var doc = parser.parseFromString(result, "text/html");
      let sname = doc.querySelector("html body section.contenido.spad div.container div.anime__details__content div.row div.col-lg-9 div.anime__details__text div.anime__details__title h3").innerText;
      let description = doc.querySelector("html body section.contenido.spad div.container div.anime__details__content div.row div.col-lg-9 div.anime__details__text p").textContent.trim();
      let genres = doc.querySelector("html body section.contenido.spad div.container div.anime__details__content div.row div.col-lg-9 div.anime__details__text div.anime__details__widget div.row div.col-lg-6.col-md-6 ul li").textContent.trim();
      let image = doc.querySelector("html body section.contenido.spad div.container div.anime__details__content div.row div.col-lg-3 div.anime__details__pic.set-bg").getAttribute("data-setbg");
      let chapters = [];
      let clen = 0;
      try { clen = parseInt([...result.matchAll(/#pag\d*" rel="nofollow">.+?(\d+)<\/a>[\s]+?<\/div/gm)][0][1]); } catch (e) { }
      for (let i = 1; i <= clen; i++) {
        chapters.push({ "name": "Capítulo " + i, "path": this.name + "/getLinks/" + window.enc(window.dec(path) + "/" + i + "/") });
      }
      after({ "name": sname, "path": this.name + "/getDescription/" + path, "image": image, "items": [description, genres], "chapters": chapters });
    } catch (error) {
      onError(error);
    }
  }

  async getParent(after, path) {
    let reduce = function (v) { after({ "name": v.name, "image": v.image, "path": v.path }, path) };
    let dpath = (window.dec(path)).split("/");
    this.getDescription(reduce, console.log, window.enc(dpath.slice(0, dpath.length - 2).join("/")));
  }

  async getList(page, filter = "") {
    if (filter == "") {
      fetch(window.serverHost + "get/" + window.enc("https://jkanime.net/directorio/"))
        .then((response) => response.text())
        .then((result) => {
          var parser = new DOMParser();
          var doc = parser.parseFromString(result, "text/html");
          let flis = doc.querySelectorAll("html body section.contenido.spad div.container div.row div.col-lg-12 div.anime__page__content section#dirmenu div.menupc div.genre-list.addmenu ul li a");
          let glist = [];
          for (var i = 0; i < flis.length; i++) {
            glist.push({ "name": flis[i].textContent.trim(), "path": this.name + "/getList/" + window.enc(flis[i].getAttribute("href")) });
          }
        }).catch((nerror) => {
          console.log(nerror);
        });
    }
  }

  async getSearch(after, onError, query) {
    let fres = [];
    let cidx = 1;
    while (true) {
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
      if (res.length != 12) {
        break;
      }
      cidx++;
    }
    after(fres);
  }

  trLink = (link) => {
    link = link.replace("/jkokru.php?u=", "https://ok.ru/videoembed/")
      .replace("/jkvmixdrop.php?u=", "https://mixdrop.co/e/")
      .replace("/jksw.php?u=", "https://streamwish.to/e/");
    return link
  }

  async getLinks(after, onError, path) {
    try {
      let result = await fGet(window.dec(path));
      if (result.indexOf("error") == 0) {
        onError(result);
        return;
      }
      let fames = [...result.matchAll(/video\[\d+\] = '<iframe.+?src="([^"]+)/gm)]
      let links = [];
      for (let i = 0; i < fames.length; i++) {
        links.push(this.trLink(fames[i][1]));
      }
      const remote = getFirstMatch(/remote\s*=\s*'([^']+)'/gm, result)
      if (remote) {
        const ssjs = JSON.parse(getFirstMatch(/var servers = (.+?}]);/gm,result).trim());
        for (var ss in ssjs) {
          links.push(dec(ssjs[ss].remote).trim()); //+ "||server_name_" + ssjs[ss].server.toLowerCase() + ".")
        }
      }
      after(links);
    } catch (error) {
      onError(error);
    }
  }
}

