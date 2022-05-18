export class SoloLatino {
  constructor() {
    this.name = "sololatino";
    this.baseUrl = "https://sololatino.net/animes/";
  }
  getFrontPage(after, onError) {
    var nc = [];
    var na = [];
    var out = {};
    fetch(
      window.serverHost +
        "get/" +
        window.enc("https://sololatino.net/animes/novedades/")
    )
      .then((response) => response.text())
      .then((result) => {
        try {
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
        } catch (e) {}
        fetch(
          window.serverHost +
            "get/" +
            window.enc("https://sololatino.net/animes/")
        )
          .then((response) => response.text())
          .then((result) => {
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
            after(out);
          })
          .catch((error) => {
            after(out);
          })

          .catch((error) => {
            onError(error);
          });
      })
      .catch((error) => {
        onError(error);
      });
  }

  getDescription(after, onError, path, page = 0) {
    fetch(window.serverHost + "get/" + path)
    .then((response) => response.text())
    .then((result) => {
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

      after({"name": sname, "path": this.name + "/getDescription/" + path, "image": image, "items":[description], "chapters": chapters});
    }).catch((nerror) => {
      onError(nerror);
    });
  }

  getParent(after, path) {}

  getList(page, filter = "") {}

  getSearch(after, onError, query) {
    let ra = [];
    fetch(
      window.serverHost +
        "get/" +
        window.enc("https://sololatino.net/?s=" + query)
    )
      .then((response) => response.text())
      .then((result) => {
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
      })
      .catch((error) => {
        onError(error);
      })
  }
  getLinks(after, onError, path) {
    fetch(window.serverHost + "get/" + path)
      .then((response) => response.text())
      .then((result) => {
        let id = result.match(/embed\.php\?id=([^"]+)/gm)[0];
        fetch(
          window.serverHost +
            "get/" +
            window.enc("https://re.sololatino.net/" + id)
        )
          .then((response) => response.text())
          .then((result) => {
            let linkh = [...result.matchAll(/go_to_player\('(.+?)'/gm)];
            let links = [];
            for (const link of linkh) {
              links.push(link[1]);
            }
            after(links);
          });
      })
      .catch((error) => {
        onError(error);
      });
    //onError("no implementado");
  }
}
