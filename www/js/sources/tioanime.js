export class TioAnime {
    constructor() {
      this.name = "tioanime";
      this.baseUrl = "https://tioanime.com/";
    }
    async getFrontPage(after, onError) {
      let result = await fGet(this.baseUrl);
      if(result.indexOf("error") == 0){
        onError(result);
        return;
      }
      var parser = new DOMParser();
      var doc = parser.parseFromString(result, "text/html");
      let ncs = [];
      let flis;
      try {
        flis = doc.getElementsByClassName("episode");
        for (var i = 0; i < flis.length; i++) {
          ncs.push({
            "name": flis[i].getElementsByTagName('h3')[0].innerText,
            "image": this.baseUrl + flis[i].getElementsByTagName('img')[0].getAttribute('src'),
            "path": this.name + "/getLinks/" + enc(this.baseUrl + flis[i].getElementsByTagName('a')[0].getAttribute("href")),
          });
        }
      } catch (nerror) {
        onError(nerror);
      }
      let nas = [];
      try {
        flis = doc.getElementsByClassName("anime");
        for (var i = 0; i < flis.length; i++) {
            nas.push({
                "name": flis[i].getElementsByTagName('h3')[0].innerText,
                "image": this.baseUrl + flis[i].getElementsByTagName('img')[0].getAttribute('src'),
                "path": this.name + "/getDescription/" + enc(this.baseUrl + flis[i].getElementsByTagName('a')[0].getAttribute("href")),
            });
        }
      } catch (nerror) {
        onError(nerror);
      }

      after({
        "Últimos Capítulos": ncs,
        "Últimas Péliculas, Ovas y Animes": nas,
      });
    }

    async getDescription(after, onError, path, page = 0, ) {
      try{
        let result = await fGet(dec(path));
        if (result.indexOf("error") == 0) {
          onError(result);
          return;
        }
        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "text/html");
        let sname =  doc.querySelector("h1.title").innerText;
        let description =  doc.querySelector("p.sinopsis").innerText.trim();
        let genres = doc.querySelector("p.genres").innerText.trim().replace(/\n\n\n/g, ", ");
        let image = this.baseUrl + doc.querySelector(".thumb figure img").getAttribute('src');
        let chaptersIndex = [...result.matchAll(/var episodes = \[([^\]]+)\]/gm)][0][1].split(",")
        let chapters = [];
        let basechapter = dec(path).replace("/anime/", "/ver/");
        for (let i = 0; i < chaptersIndex.length; i++) {
          chapters.unshift({"name": "Capítulo " + chaptersIndex[i], "path": this.name + "/getLinks/" + window.enc(basechapter + "-" + chaptersIndex[i])});
        }
        after({"name": sname, "path": this.name + "/getDescription/" + path, "image": image, "items":[description, genres], "chapters": chapters});
      } catch (error) {
        onError(error);
      }
    }

    async getParent(after, path) {
      //let reduce = function(v){after({"name": v.name, "image": v.image, "path": v.path}, path)};
      //let dpath = (window.dec(path)).split("/");
      //this.getDescription(reduce, console.log, window.enc(dpath.slice(0, dpath.length - 2).join("/")));
    }

    async getList(page, filter = "") {

    }

    async getSearch(after, onError, query) {
      try{
        let response = await fGet("https://tioanime.com/directorio?q=" + query);
        if (response.indexOf("error") == 0) {
          onError(response);
          return;
        }
        var parser = new DOMParser();
        var doc = parser.parseFromString(response, "text/html");
        let nas = [];
        let flis = doc.getElementsByClassName("anime");
        for (var i = 0; i < flis.length; i++) {
            nas.push({
                "name": flis[i].getElementsByTagName('h3')[0].innerText,
                "image": this.baseUrl + flis[i].getElementsByTagName('img')[0].getAttribute('src'),
                "path": this.name + "/getDescription/" + enc(this.baseUrl + flis[i].getElementsByTagName('a')[0].getAttribute("href")),
            });
        }
        after(nas);
      } catch (error) {
        onError(error);
      }
    }

    async getLinks(after, onError, path) {
      try{
        let result = await fGet(dec(path));
        if (result.indexOf("error") == 0) {
          onError(result);
          return;
        }
        let fames = [...result.matchAll(/\["[^"]+","([^"]+)",.+?,.+?\]/gm)]
        let links = [];
        for (let i = 0; i < fames.length; i++) {
            links.push((fames[i][1]).reeplace(/\\/g, ""));
        }
        after(links);
      } catch (error) {
        onError(error);
      }
    }
  }
