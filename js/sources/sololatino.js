export class SoloLatino {
    constructor() {
      self.name = "sololatino";
      self.baseUrl = "https://sololatino.net/animes/";
    }
    getFrontPage(after, onError) {
        var nc = [];
        fetch(window.serverHost + "get/" + btoa("https://sololatino.net/animes/novedades/"))
        .then(response => response.text())
        .then(result => {
            var parser = new DOMParser();
            var doc = parser.parseFromString(result, "text/html");
            let flis = doc.getElementsByClassName("item se episodes");//doc.querySelectorAll("html body.error404 div#dt_contenedor div#contenedor div.module div.content.full_width_layout div#archive-content.animation-2.items div.items article");
            for (var i = 0; i < flis.length; i++) {
                nc.push({"name": flis[i].getElementsByTagName("h3")[0].innerText,
                "path":  self.name + "/getLinks/" + btoa(flis[i].getElementsByTagName("a")[0].getAttribute("href")),
                "image": flis[i].getElementsByTagName("img")[0].getAttribute("data-srcset")});
            }
            after({"Nuevos capítulos": nc})
        })
        .catch(error => {
            onError(error);
        });
    }

    getInfo(after, onError, path, page = 0, ) {

    }

    getParent(after, path) {

    }

    getList(page, filter = "") {

    }

    getSearch(after, onError, query) {

    }
    getLinks(after, onError, path) {
        onError("no implementado");
    }
  }