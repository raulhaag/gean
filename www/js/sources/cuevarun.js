export class CuevaRun {
    constructor() {
      this.name = "CuevaRun";
      this.baseUrl = "https://cuevana2.run";
    }
    
    getSeries = (flis, onError = console.log) => {
        let nas = [];
        try {
            for (var i = 0; i < flis.length; i++) {
                nas.push({
                  "name": flis[i].getElementsByTagName("h2")[0].innerText,
                  "image": this.baseUrl + flis[i].getElementsByTagName('img')[0].getAttribute('src'),
                  "path": this.name + "/getDescription/" + enc(this.baseUrl + flis[i].getElementsByTagName('a')[0].getAttribute("href")),
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

    //document.getElementsByClassName('row')[x]  3:Peliculas destacadas, 5:Series destacadas, 7: ultimas peliculas, 9:ultimas series
      var parser = new DOMParser();
      var doc = parser.parseFromString(result, "text/html");
      let allPages = doc.getElementsByClassName('row');
      after({
        "Películas destacadas": this.getSeries(allPages[3].getElementsByTagName("article")),
        "Últimas películas": this.getSeries(allPages[7].getElementsByTagName("article")),
        "Series destacadas": this.getSeries(allPages[5].getElementsByTagName("article")),
        "Últimas series": this.getSeries(allPages[9].getElementsByTagName("article")),
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
        let sname =  doc.getElementsByTagName("h1")[0].innerText;
        let description = doc.getElementsByClassName("row")[0].innerText;
        let image = doc.getElementsByClassName("sticky-top")[0].getElementsByTagName("img")[0].src;
        let jsChapters = doc.querySelectorAll("div.se-c > div > ul > li");
        let chapters = [];
        let clen = 0;
        try{
          for (let i = 0; i < jsChapters.length; i++) {
            chapters.push({"name": "Capítulo " + doc.querySelectorAll("div.se-c > div > ul > li")[i].getElementsByClassName("numerando")[0].innerText, "path": this.name + "/getLinks/" + window.enc(doc.querySelectorAll("div.se-c > div > ul > li")[i].getElementsByTagName("a")[0].getAttribute("href"))});
          }
        }catch(e){/*continue*/}
        if((chapters.length == 0) && (window.dec(path).indexOf("/pelicula/") != -1)){
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
