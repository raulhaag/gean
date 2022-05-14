export class SoloLatino {
    constructor() {
      this.name = "sololatino";
      this.baseUrl = "https://sololatino.net/animes/";
    }
    getFrontPage(after, onError) {
        var nc = [];
        fetch(window.serverHost + "get/" + window.enc("https://sololatino.net/animes/novedades/"))
        .then(response => response.text())
        .then(result => {
            var parser = new DOMParser();
            var doc = parser.parseFromString(result, "text/html");
            let flis = doc.getElementsByClassName("item se episodes");//doc.querySelectorAll("html body.error404 div#dt_contenedor div#contenedor div.module div.content.full_width_layout div#archive-content.animation-2.items div.items article");
            for (var i = 0; i < flis.length; i++) {
                nc.push({"name": flis[i].getElementsByTagName("h3")[0].innerText,
                "path":  this.name + "/getLinks/" + window.enc(flis[i].getElementsByTagName("a")[0].getAttribute("href")),
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
        fetch(window.serverHost + "get/" + path)
        .then(response => response.text())
        .then(result => {
            let id = result.match(/embed\.php\?id=([^"]+)/gm)[0];
            fetch(window.serverHost + "get/" + window.enc('https://re.sololatino.net/' + id ))
            .then(response => response.text())
            .then((result) => {
                let linkh = [...result.matchAll(/go_to_player\('(.+?)'/gm)];
                let links = [];
                for (const link of linkh) {
                    links.push(link[1]);
                }
                after(links);
            })
        }).catch(error => {
            onError(error);
        });
        //onError("no implementado");
    }
  }