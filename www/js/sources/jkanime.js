export class JKAnime {
  constructor() {
    this.name = "jkanime";
    this.baseUrl = "https://jkanime.net"
  }
  
  getSection = (lista) => {
    let out = [];
    for(let i = 0; i < lista.length; i++){
      const element = lista[i];
      const pparts = element.getElementsByTagName('a')[0].getAttribute("href").split("/");
      out.push({
        'name': element.getElementsByTagName('img')[0].getAttribute('alt'),
        'path': this.name + "/getLinks/" + window.enc(element.getElementsByTagName('a')[0].getAttribute("href")),
        'image': element.getElementsByTagName('img')[0].getAttribute('src'),
        'parentPath': this.name + "/getDescription/" + window.enc(pparts.slice(0, pparts.length - 2).join("/"))
      })
    };
    return out;
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
    try {
      ncs = this.getSection(doc.getElementById('animes').getElementsByClassName('dir1'))
    } catch (nerror) {
      error(nerror);
    }

    let dcs = [];
    try {
      dcs = this.getSection(doc.getElementById('donghuas').getElementsByClassName('dir1'))
    }catch (nerror) {
      error(nerror);
    }

    let nas = [];
    try {
      const flis = doc.getElementsByClassName('trending_div')[0].getElementsByClassName('d-flex');
      for (var i = 0; i < flis.length; i++) {
        const element = flis[i];
        const epath = this.name + "/getDescription/" + window.enc(element.getElementsByTagName("a")[0].getAttribute("href"));
        nas.push({
          'name': element.getElementsByTagName('img')[0].getAttribute('alt'),
          'image': element.getElementsByTagName('img')[0].getAttribute('src'),
          "path": epath,
        });
      }
    } catch (nerror) {
      error(nerror);
    }
    let etc = [];
    try {
      etc = this.getSection(doc.getElementById('ovas').getElementsByClassName('dir1'));
    } catch (nerror) {
      error(nerror);
    }

    let pg = [
      {"name":"Accion","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=accion')},
      {"name":"Aventura","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=aventura')},
      {"name":"Autos","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=autos')},
      {"name":"Comedia","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=comedia')},
      {"name":"Dementia","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=dementia')},
      {"name":"Demonios","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=demonios')},
      {"name":"Misterio","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=misterio')},
      {"name":"Drama","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=drama')},
      {"name":"Ecchi","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=ecchi')},
      {"name":"Fantasia","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=fantasia')},
      {"name":"Juegos","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=juegos')},
      {"name":"Historico","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=historico')},
      {"name":"Terror","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=terror')},
      {"name":"Magia","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=magia')},
      {"name":"Artes Marciales","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=artes-marciales')},
      {"name":"Mecha","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=mecha')},
      {"name":"Musica","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=musica')},
      {"name":"Parodia","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=parodia')},
      {"name":"Samurai","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=samurai')},
      {"name":"Romance","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=romance')},
      {"name":"Colegial","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=colegial')},
      {"name":"Sci-Fi","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=sci-fi')},
      {"name":"Space","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=space')},
      {"name":"Deportes","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=deportes')},
      {"name":"Super Poderes","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=super-poderes')},
      {"name":"Vampiros","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=vampiros')},
      {"name":"Harem","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=harem')},
      {"name":"Cosas de la vida","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=cosas-de-la-vida')},
      {"name":"Sobrenatural","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=sobrenatural')},
      {"name":"Militar","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=militar')},
      {"name":"Policial","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=policial')},
      {"name":"Psicologico","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=psicologico')},
      {"name":"Thriller","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=thriller')},
      {"name":"Español Latino","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=espaol-latino')},
      {"name":"Isekai","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=isekai')}]
    let tipo = [{"name":"Animes","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=animes')},
      {"name":"Peliculas","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=peliculas')},
      {"name":"Especiales","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=especiales')},
      {"name":"Ovas","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=ovas')},
      {"name":"Onas","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=onas')}];
    after({
      "Últimos Capítulos": ncs,
      "Últimos donghuas": dcs,
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
      out.push({name: opts[opt].innerText, path: `this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero=${opts[opt].dataset.value}/')`});
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
        let pl = doc.querySelector('a[rel="prev"]');
        let nl = doc.querySelector('a[rel="next"]');
        if(pl){
          pd.push({"name": "Pagina Anterior", "image": "./images/prev_nav.png", "path": this.name + "/getMore/" + window.enc(pl.getAttribute("href"))});  
        }
        try{
          let jsSerie = JSON.parse(getFirstMatch(/var animes = (\[[\s\S]+?\]);/gm, result));
          for(let i = 0; i < jsSerie.length; i++){
            pd.push({"name": jsSerie[i].title, 
                     "path": this.name + "/getDescription/" + window.enc(this.baseUrl + "/" + jsSerie[i].slug + '/'),
                     "image": jsSerie[i].image
            })
          }
        }catch(e){
        }
        if(pd.length == 0){
          let series = doc.getElementsByClassName("custom_item2");
          for(let s = 0; s < series.length; s++){
            pd.push({"name":series[s].getElementsByTagName("a")[1].getAttribute('title'),
              "path":this.name + "/getDescription/" + window.enc(series[s].getElementsByTagName("a")[0].getAttribute("href")),
              "image":series[s].getElementsByTagName("img")[0].getAttribute("src")
              })
          }
        }
        if(nl){
          pd.push({"name": "Pagina siguiente", "image": "./images/next_nav.png", "path": this.name + "/getMore/" + window.enc(nl.getAttribute("href"))});
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
      const data = await window.fGet(window.dec(path),{"User-Agent": window.navigator.userAgent}, true);
      const result = data.body;
      if (result.indexOf("error") == 0) {
        onError(result + ": " + window.dec(path));
        return;
      }
      const tok = getFirstMatch(/<meta name="csrf-token" content="(.+?)"/gm, result);
      const id = getFirstMatch(/\/ajax\/episodes\/(.+?)\//gm, result);
      var parser = new DOMParser();
      var doc = parser.parseFromString(result, "text/html");
      const sname = doc.querySelector(".anime_info > h3:nth-child(2)").innerText;
      const description = doc.querySelector(".scroll").textContent.trim();
      const genres = doc.querySelector("div.card:nth-child(3) > div:nth-child(1) > ul:nth-child(1) > li:nth-child(2)").textContent.trim();
      const image = doc.querySelector(".anime_pic > img:nth-child(1)").getAttribute("src");
      const chapters = [];
      let lep = getFirstMatch(/<div id="proxep".+?\/(\d+?)\/"/gm, result);
      if(lep == ""){
        lep = getFirstMatch(/Episodios:<\/span> (\d+)/gm, result);
      }
      const clen = parseInt(lep);
      let dpath = window.dec(path);
      if(!dpath.endsWith("/")){
        dpath = dpath + "/";
      }
      for (let i = 1; i <= clen; i++) {
        chapters.push({ "name": "Capítulo " + i, "path": this.name + "/getLinks/" + window.enc(dpath+ i + "/") });
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
      fetch(window.serverHost + "get/" + window.enc("https://jkanime.net/directorio?genero="))
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
      let response = await fGet("https://jkanime.net/buscar/" + encodeURIComponent(query));
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

