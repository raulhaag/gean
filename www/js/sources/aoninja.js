export class AnimeOnlineNinja {
    constructor() {
      this.name = "AONinja";
      this.baseUrl = "https://ww3.animeonline.ninja";
    }

    getSeries = (flis, onError = console.log) => {
        let nas = [];
        try {
            for (var i = 0; i < flis.length; i++) {
                nas.push({
                    "name": flis[i].getElementsByTagName('h3')[0].innerText,
                    "image": flis[i].getElementsByTagName('img')[0].getAttribute('data-src'),
                    "path": this.name + "/getDescription/" + enc(flis[i].getElementsByTagName('a')[0].getAttribute("href")),
                });
            }
          } catch (nerror) {
            onError(nerror);
          }
        return nas;
    }

    async getFrontPage(after, onError = console.log) {
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
        flis = doc.getElementsByClassName("animation-2 items")[0].getElementsByTagName("article");
        for (var i = 1; i < flis.length; i++) {
            ncs.push({
              "name": flis[i].getElementsByTagName('h3')[0].innerText + " - " + flis[i].getElementsByTagName('h4')[0].innerText.trim(),
              "image": flis[i].getElementsByTagName('img')[0].getAttribute('data-src'),
              "path": this.name + "/getLinks/" + enc(flis[i].getElementsByTagName('a')[0].getAttribute("href")),
            });
          }
      } catch (nerror) {
        onError(nerror);
      }
      let nas = [];
      try {
        flis = doc.getElementById("featured-titles").getElementsByClassName("tvshows");
        nas = this.getSeries(flis);
      } catch (nerror) {
        onError(nerror);
      }
      let naa;
      try {
        flis = doc.getElementsByClassName("items")[2].getElementsByTagName("article");
        naa = this.getSeries(flis);
      } catch (nerror) {
        onError(nerror);
      }
      let nam;
      try {
        flis = doc.getElementsByClassName("items")[3].getElementsByTagName("article");
        nam = this.getSeries(flis);
      } catch (nerror) {
        onError(nerror);
      }

      after({
        "Últimos Episodios": ncs,
        "En Emisión": nas,
        "Últimos Animes Agregados": naa,
        "Últimos Peliculas Agregadas": nam
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
        let sname =  doc.querySelector(".sheader > div:nth-child(2) > h1:nth-child(1)").innerText;
        let ps = doc.querySelectorAll(".wp-content > p");
        let description = "";
        for(let i = 0; i < ps.length; i++){
          description += ps[i].innerText;
        }
        let image = doc.querySelector(".poster > img:nth-child(1)").getAttribute("data-src");
        let jsChapters = doc.querySelectorAll("div.se-c > div > ul > li");
        let chapters = [];
        let clen = 0;
        try{
          for (let i = 0; i < jsChapters.length; i++) {
            chapters.push({"name": "Capítulo " + doc.querySelectorAll("div.se-c > div > ul > li")[i].getElementsByClassName("numerando")[0].innerText, "path": this.name + "/getLinks/" + window.enc(doc.querySelectorAll("div.se-c > div > ul > li")[i].getElementsByTagName("a")[0].getAttribute("href"))});
          }
        }catch(e){/*continue*/}
        if((chapters.length == 0) && (window.dec(path).indexOf("/pelicula/") != -2)){
          chapters.push({"name":"Película", "path":this.name + "/getLinks/" + path});
        }
        after({"name": sname, "path": this.name + "/getDescription/" + path, "image": image, "items":[description], "chapters": chapters});
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
        let response = await fGet(this.baseUrl + "/?s=" + query);
        if (response.indexOf("error") == 0) {
          onError(response);
          return;
        }
        var parser = new DOMParser();
        var doc = parser.parseFromString(response, "text/html");
        let flis = doc.querySelectorAll("div.result-item > article")
      let nas = [];
        try {
            for (var i = 0; i < flis.length; i++) {
                nas.push({
                    "name": flis[i].getElementsByClassName('title')[0].innerText,
                    "image": flis[i].getElementsByTagName('img')[0].getAttribute('data-src'),
                    "path": this.name + "/getDescription/" + enc(flis[i].getElementsByTagName('a')[0].getAttribute("href")),
                });
            }
          } catch (nerror) {
            onError(nerror);
          }
        after(nas);
      } catch (error) {
        onError(error);
      }
    }

    async getLinksP1(page, rpage, extra = ""){
      if(extra == "MULTISERVER"){
        extra = "";
      }
      let rjd = JSON.parse(await fGet(rpage, {"Referer": page}));
      let rds = await fGet(rjd["embed_url"], {"Referer": page});
      let rgroups = getAllMatches(/OD_(...)([\s\S]+?)<\/div>\r\n\t\t\t\t/gm, rds)
      let oLinks = [];
      for(var j = 0; j < rgroups.length; j++){
        let rglinks = getAllMatches(/go_to_player\('(.+?)'\)/gm, rgroups[j][2]);
        for(var k = 0; k < rglinks.length; k++){
          oLinks.push(rglinks[k][1] + ("||info_"+ extra + "_" + rgroups[j][1]).replace("__","_"));
        }
      }
      return oLinks
    }

    async getLinks(after, onError, path) {
      try{
        let result = await fGet(dec(path));
        if (result.indexOf("error") == 0) {
          onError(result);
          return;
        }
        let id = getFirstMatch(/postid-(\d+)/gm, result);
        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "text/html");
        var lle = doc.getElementsByClassName("dooplay_player_option");
        let vlinks = []
        if(lle.length > 0){
          for(var i = 0; i < lle.length; i++){
            let title = lle[i].getElementsByClassName("title")[0].innerHTML
            vlinks = vlinks.concat(await this.getLinksP1(dec(path), this.baseUrl + "/wp-json/dooplayer/v1/post/" + id + "?type=movie&source=" + (i+1), title));
          }
        }else{
          let id = getFirstMatch(/postid-(\d+)/gm, result);
          vlinks = await this.getLinksP1(dec(path), this.baseUrl + "/wp-json/dooplayer/v1/post/" + id + "?type=movie&source=1");
        }

        after(vlinks);
      } catch (error) {
        onError(error);
      }
    }
  }
