import { registerInterceptor } from "../vservers/vserver.js";
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
        let image = this.baseUrl + doc.getElementsByClassName("sticky-top")[0].getElementsByTagName("img")[0].getAttribute("src");            
        let chapters = [];
       
        try{
          if(window.dec(path).indexOf("/serie/") != -1){
            let data = JSON.parse(doc.getElementById('__NEXT_DATA__').innerText).props.pageProps.post;
            let season = data.seasons;
            for(let i in season){
              for(let c in season[i].episodes){
                let slug = data.slug.name + "-" + season[i].number + "x" + season[i].episodes[c].number;
                chapters.push({"name": season[i].episodes[c].title, "path": this.name + "/getLinks/" + window.enc(this.baseUrl + "/episodio/" + slug)});
              }
            }
          }else{
            chapters.push({"name": "Ver película" ,"path": this.name + "/getLinks/" + path})
          }
          
        }catch(e){/*continue*/}
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

    async getLinks(after, onError, path) {
      try{
        registerInterceptor("player.cuevana2", async (web) => {
          let data = await fGet(web);
          return getFirstMatch(/var url = '(.+?)'/gm, data);
        });
        let result = await fGet(dec(path));
        if (result.indexOf("error") == 0) {
          onError(result);
          return;
        }
        let id = getFirstMatch(/postid-(\d+)/gm, result);
        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "text/html");
        let data = JSON.parse(doc.getElementById('__NEXT_DATA__').innerText).props.pageProps.post.players;
        let vlinks = []
        for(let lan in data){
          if(lan){
            for(let idx in data[lan]){
              vlinks = vlinks.concat(data[lan][idx].result + "||server_name_" + data[lan][idx].cyberlocker + "||info_" + lan);
            }
          }
        }
        after(vlinks);
      } catch (error) {
        onError(error);
      }
    }
  }
