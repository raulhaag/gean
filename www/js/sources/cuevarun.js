import { registerInterceptor } from "../vservers/vserver.js";
export class CuevaRun {
    constructor() {
      this.name = "CuevaRun";
      this.baseUrl = "https://www.cuevana2espanol.net";
    }
    
    getSeries = (flis, onError = console.log) => {
        let nas = [];
        try {
            for (var i = 0; i < flis.length; i++) {
                nas.push({
                  "name": flis[i].getElementsByTagName("h3")[0].innerText,
                  "image": this.baseUrl + flis[i].getElementsByTagName('img')[0].getAttribute('src'),
                  "path": this.name + "/getDescription/" + window.enc(this.baseUrl + flis[i].getElementsByTagName('a')[0].getAttribute("href")),
                });
            }
          } catch (nerror) {
            onError(nerror);
          }
        return nas;
    }

    async getMore(after, onError = console.log, more , title = ""){
      let web = window.dec(more);
      if(web === "Homepage"){
        this.getFrontPage(after, onError);
        return;
      }
      let preLinks = [
        {
          "name": "Home",
          "image": "./images/home_nav.png",
          "path": this.name + "/getMore/" + window.enc("Homepage"),
        }
      ];
      let posLinks = [];
      if(/^.*(\d)$/gm.test(web)){
        let parted = web.split("/");
        let page = parseInt(parted.pop(), 10);
        let wbase = parted.join("/") + "/";
        if(page > 1){
          preLinks.push({"name": "Pagina Anterior", "image": "./images/prev_nav.png", "path": this.name + "/getMore/" + window.enc(wbase + (page - 1))}); 
        }
        posLinks.push({"name": "Pagina siguiente", "image": "./images/next_nav.png", "path": this.name + "/getMore/" + window.enc(wbase + (page + 1))});
      }else{
        posLinks.push({"name": "Pagina siguiente", "image": "./images/next_nav.png", "path": this.name + "/getMore/" + window.enc(web + "/page/2")});

      }
      try{
        let result = await fGet(window.dec(more));
        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "text/html");
        let allPages = doc.getElementsByClassName('row');
        let pd = this.getSeries(allPages[2].getElementsByTagName("article"));
        title = doc.getElementsByTagName("h2")[0].innerText;
        after({
          [title]: preLinks.concat(pd, posLinks),
        });
      }catch(e){
        onError(e);
      }
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
      let pd = this.getSeries(allPages[3].getElementsByTagName("article"));
      pd.push({"name": "Más películas destacadas","path": this.name + "/getMore/" + window.enc(this.baseUrl + "/archives/movies/top/day"),"image": "./images/next_nav.png"});
      let up = this.getSeries(allPages[7].getElementsByTagName("article"));
      up.push({"name": "Más películas","path": this.name + "/getMore/" + window.enc(this.baseUrl + "/archives/movies"),"image": "./images/next_nav.png"});
      let sd = this.getSeries(allPages[5].getElementsByTagName("article")); 
      sd.push({"name": "Más series destacadas","path": this.name + "/getMore/" + window.enc(this.baseUrl + "/archives/series/top/day"),"image": "./images/next_nav.png"});
      let us = this.getSeries(allPages[9].getElementsByTagName("article"));
      us.push({"name": "Más series","path": this.name + "/getMore/" + window.enc(this.baseUrl + "/archives/series"),"image": "./images/next_nav.png"});

      after({
        "Películas destacadas": pd,
        "Últimas películas": up,
        "Series destacadas": sd,
        "Últimas series": us,
        "Por género": [{"name": "Acción", "path": this.name + "/getMore/" + window.enc(this.baseUrl + "/genres/accion")},
          {"name": "Animación", "path": this.name + "/getMore/" + window.enc(this.baseUrl + "/genres/animacion")},
          {"name": "Crimen", "path": this.name + "/getMore/" + window.enc(this.baseUrl + "/genres/crimen")},
          {"name": "Comedia", "path": this.name + "/getMore/" + window.enc(this.baseUrl + "/genres/comedia")},
          {"name": "Fámilia", "path": this.name + "/getMore/" + window.enc(this.baseUrl + "/genres/familia")},
          {"name": "Misterio", "path": this.name + "/getMore/" + window.enc(this.baseUrl + "/genres/misterio")},
          {"name": "Suspenso", "path": this.name + "/getMore/" + window.enc(this.baseUrl + "/genres/suspenso")},
          {"name": "Aventura", "path": this.name + "/getMore/" + window.enc(this.baseUrl + "/genres/aventura")},
          {"name": "Ciencia ficción", "path": this.name + "/getMore/" + window.enc(this.baseUrl + "/genres/ciencia-ficcion")},
          {"name": "Drama", "path": this.name + "/getMore/" + window.enc(this.baseUrl + "/genres/drama")},
          {"name": "Fantasia", "path": this.name + "/getMore/" + window.enc(this.baseUrl + "/genres/fantasia")},
          {"name": "Romance", "path": this.name + "/getMore/" + window.enc(this.baseUrl + "/genres/romance")},
          {"name": "Terror", "path": this.name + "/getMore/" + window.enc(this.baseUrl + "/genres/terror")},
        ]
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
        let data = JSON.parse(doc.getElementById('__NEXT_DATA__').innerText).props.pageProps.post;
        let sname =  doc.getElementsByTagName("h1")[0].innerText;
        let description = data.overview;
        let image = this.baseUrl + doc.getElementsByClassName("sticky-top")[0].getElementsByTagName("img")[0].getAttribute("src");            
        let chapters = [];
       
        try{
          if(window.dec(path).indexOf("/series/") != -1){
            
            let season = data.seasons;
            for(let i in season){
              for(let c in season[i].episodes){
                //let slug = data.slug.name + "-" + season[i].number + "x" + season[i].episodes[c].number; ///series/el-eternauta/seasons/1/episodes/1
                chapters.push({"name": season[i].episodes[c].title, "path": this.name + "/getLinks/" + window.enc(this.baseUrl + "/series/" + data.slug.name + "/seasons/" + season[i].number + "/episodes/" + season[i].episodes[c].number)});
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
        let response = await fGet(this.baseUrl + "/search?q=" + query);
        var parser = new DOMParser();
        var doc = parser.parseFromString(response, "text/html");
        let allPages = doc.getElementsByClassName('container');
        let pd = this.getSeries(allPages[2].getElementsByTagName("article"));
        after(pd);
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
        let result = await fGet(window.dec(path));
        if (result.indexOf("error") == 0) {
          onError(result);
          return;
        }
        //let id = getFirstMatch(/postid-(\d+)/gm, result);
        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "text/html");
        let fdata = JSON.parse(doc.getElementById('__NEXT_DATA__').innerText);
        let data = {};
        if(fdata.props.pageProps.post){
          data = fdata.props.pageProps.post.players;
        }else{
          data = fdata.props.pageProps.episode.players;
        }
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
