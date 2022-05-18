export class JKAnime {
  constructor() {
    this.name = "jkanime";
  }
  getFrontPage(after, error) {
    fetch(window.serverHost + "get/" + window.enc("https://jkanime.net/"))
      .then((response) => response.text())
      .then((result) => {
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
            ncs.push({
              "name": name,
              "image": flis[i].getElementsByTagName("img")[0].getAttribute("src"),
              "path": epath,
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
      })
      .catch((nerror) => {
        error(nerror);
      });
  }
  getDescription(after, onError, path, page = 0, ) {
    fetch(window.serverHost + "get/" + path)
      .then((response) => response.text())
      .then((result) => {
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
      }).catch((nerror) => {
        onError(nerror);
      });
  }

  getParent(after, path) {
    let reduce = function(v){after({"name": v.name, "image": v.image, "path": v.path})};
    let dpath = (atob(path)).split("/");
    this.getDescription(reduce, console.log, window.enc(dpath.slice(0, dpath.length - 2).join("/")));
  }

  getList(page, filter = "") {
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

  getSearch(after, onError, query) {
    fetch(window.serverHost + "get/" + window.enc("https://jkanime.net/ajax/ajax_search/?q=" + query))
    .then((response) => response.json()).then((result) => {
      let rList = [];
      for (let i = 0; i < result["animes"].length; i++) {
        rList.push({"name": result["animes"][i].title,
                    "path": this.name + "/getDescription/" + window.enc("https://jkanime.net/" + result["animes"][i].slug), 
                    "image": result["animes"][i].image});
      }
      after(rList);
    })
    .catch((nerror) => {
      onError(nerror);
    });
  }

  getLinks(after, onError, path) {
      fetch(window.serverHost + "get/" + path)
        .then((response) => response.text())
        .then((result) => {
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
        })
        .catch((nerror) => {
          onError(nerror);
        });
  }
}

