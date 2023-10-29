export class AnimeFlvNet {
    constructor() {
      this.name = "animeflv.net";
      this.baseUrl = "https://www3.animeflv.net";
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
        flis = doc.getElementsByClassName("fa-play");
        for (var i = 1; i < flis.length; i++) {
          ncs.push({
            "name": flis[i].getElementsByClassName("Title")[0].innerText + " - " + flis[i].getElementsByClassName("Capi")[0].innerText,
            "image": this.baseUrl + flis[i].getElementsByTagName('img')[0].getAttribute('src'),
            "path": this.name + "/getLinks/" + enc(this.baseUrl + flis[i].getAttribute("href")),
          });
        }
      } catch (nerror) {
        onError(nerror);
      }
      let nas = [];
      try {
        flis = doc.getElementsByClassName("Anime alt B");
        for (var i = 0; i < flis.length; i++) {
            nas.push({
                "name": flis[i].getElementsByClassName("Title")[0].innerText,
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
        let result = await fGet(dec(path), {"Referer": this.baseUrl});
        if (result.indexOf("error") == 0) {
          onError(result);
          return;
        }
        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "text/html");
        let sname =  doc.querySelector("h1.Title").innerText;
        let description =  doc.querySelector(".Description > p:nth-child(1)").innerText.trim();
        let genres = doc.querySelector(".Nvgnrs").innerText.trim().replace(/\n\n\n/g, ", ");
        let image = this.baseUrl + doc.querySelector(".Image > figure:nth-child(1) > img:nth-child(1)").getAttribute('src');
        let elis = getFirstMatch(/episodes = \[(.+?\])\]/gm,result);
        let elis2 = getAllMatches(/\[(\d+),(\d+)\]/gm, elis);
        let chapters = [];
        let basechapter = dec(path).replace("/anime/", "/ver/");
        for (let i = 0; i < elis2.length; i++) {
          chapters.unshift({"name": "Capítulo " + elis2[i][1], "path": this.name + "/getLinks/" + window.enc(basechapter + "-" +  elis2[i][1])});
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
        let response = await fGet("https://www3.animeflv.net/browse?q=" + query);
        if (response.indexOf("error") == 0) {
          onError(response);
          return;
        }
        var parser = new DOMParser();
        var doc = parser.parseFromString(response, "text/html");
        let nas = [];
        let flis = doc.getElementsByClassName("Anime alt B");
        for (var i = 0; i < flis.length; i++) {
            nas.push({
                "name": flis[i].getElementsByClassName("Title")[0].innerText,
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
        let fames = [...result.matchAll(/code":"(.+?)"/gm)];
        let links = [];
        for (let i = 0; i < fames.length; i++) {
            links.push((fames[i][1]).replace(/\\/g, ""));
        }
        after(links);
      } catch (error) {
        onError(error);
      }
    }
  }
