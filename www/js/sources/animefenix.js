export class AnimeFenix {
    constructor() {
      this.name = "AnimeFenix";
      this.baseUrl = "https://www3.animefenix.tv/";
      this.slist = JSON.parse(window.dec("eyIxIjogImh0dHBzOi8vdXB2aWQuY28vZW1iZWQtJCQkJCQkLmh0bWwiLCAiMiI6ICJodHRwczovL2ZpbGVsaW9ucy5saXZlL3YvJCQkJCQkIiwgIjMiOiAiaHR0cHM6Ly93d3cubXA0dXBsb2FkLmNvbS9lbWJlZC0kJCQkJCQuaHRtbCIsICI0IjogImh0dHBzOi8vc2VuZHZpZC5jb20vZW1iZWQvJCQkJCQkIiwgIjUiOiBudWxsLCAiNiI6ICJodHRwczovL3d3dy55b3VydXBsb2FkLmNvbS9lbWJlZC8kJCQkJCQiLCAiNyI6IG51bGwsICI4IjogbnVsbCwgIjkiOiAiLi4vc3RyZWFtL2Ftei5waHA/dj0kJCQkJCQiLCAiMTAiOiAiPHN0eWxlPiN2aWRlb19wbGF5ZXJ7cGFkZGluZzogMDt9PC9zdHlsZT48ZGl2IHN0eWxlPSIsICIxMSI6ICIvc3RyZWFtL2Ftei5waHA/dj0kJCQkJCQmZXh0PWVzIiwgIjEyIjogImh0dHBzOi8vb2sucnUvdmlkZW9lbWJlZC8kJCQkJCQiLCAiMTMiOiAiaHR0cHM6Ly9nYW1vdmlkZW8uY29tL2VtYmVkLSQkJCQkJC5odG1sIiwgIjE0IjogImh0dHBzOi8vY2RuLmp3cGxheWVyLmNvbS9wbGF5ZXJzLyQkJCQkJC5odG1sIiwgIjE1IjogImh0dHBzOi8vbWVnYS5uei9lbWJlZC8kJCQkJCQiLCAiMTYiOiAiaHR0cHM6Ly9zdHJlYW13aXNoLnRvL2UvJCQkJCQkIiwgIjE3IjogImh0dHBzOi8vdGVyYWJveC5jb20vc2hhcmluZy9lbWJlZD9zdXJsPSQkJCQkJCIsICIxOCI6IG51bGwsICIxOSI6ICIvL3ZpZGVhLmh1L3BsYXllcj92PSQkJCQkJCIsICIyMCI6ICJodHRwczovL3d3dy5zb2xpZGZpbGVzLmNvbS9lLyQkJCQkJCIsICIyMSI6ICJodHRwczovL3d3dy5idXJzdGNsb3VkLmNvL2VtYmVkLyQkJCQkJCIsICIyMiI6ICIvc3RyZWFtL2ZsLnBocD92PWh0dHBzOi8vJCQkJCQkJmZsPXRydWUiLCAiMjMiOiAiaHR0cHM6Ly9zYnRoZS5jb20vZS8kJCQkJCQuaHRtbCIsICIyNCI6ICJodHRwczovL3N0cmVhbWhpZGUuY29tL2UvJCQkJCQkIn0="));
    }
    async getFrontPage(after, onError) {
      let result = await fGet(this.baseUrl + "zerotwo");
      if(result.indexOf("error") == 0){
        onError(result);
        return;
      }
      var parser = new DOMParser();
      var doc = parser.parseFromString(result, "text/html");
      let ncs = [];
      let flis;
      try {
        flis = doc.getElementsByClassName("capitulos-grid")[0].getElementsByClassName("item");
        for (var i = 1; i < flis.length; i++) {
          ncs.push({
            "name": flis[i].getElementsByClassName("overtitle")[0].innerText + " - " + flis[i].getElementsByClassName("overepisode")[0].innerText,
            "image": flis[i].getElementsByTagName("img")[0].getAttribute("src"),
            "path": this.name + "/getLinks/" + window.enc(flis[i].getElementsByTagName("a")[0].getAttribute("href")),
          });
        }
      } catch (nerror) {
        onError(nerror);
      }
      let nas = [];
      try {
        flis = doc.getElementsByClassName("rounded-container")[0].getElementsByClassName("serie-card");
        for(let i = 0; i < flis.length; i++){
          nas.push({
            "name": flis[i].getElementsByClassName("title")[0].innerText,
            "image": flis[i].getElementsByTagName("img")[0].getAttribute("src"),
            "path": this.name + "/getDescription/" + window.enc(flis[i].getElementsByTagName("a")[0].getAttribute("href")),
          });        
        }
      } catch (nerror) {
        onError(nerror);
      }
      let naa = []
      try{
        flis= doc.getElementsByClassName("list-series")[0].getElementsByClassName("serie-card");
        for(let i = 0; i < flis.length; i++){
          naa.push({
            "name": flis[i].getElementsByClassName("title")[0].innerText,
            "image": flis[i].getElementsByTagName("img")[0].getAttribute("src"),
            "path": this.name + "/getDescription/" + window.enc(flis[i].getElementsByTagName("a")[0].getAttribute("href")),
          });    
        }
      }catch(e){}

      after({
        "Últimos Capítulos": ncs,
        "Animes Populares": nas,
        "Últimos añadidos": naa,
        "Por genero": [{"name":"Acción","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=accion&order=default')},{"name":"Artes Marciales","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=artes-marciales&order=default')},{"name":"Aventura","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=aventura&order=default')},{"name":"Ciencia Ficción","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=Ciencia Ficción&order=default')},{"name":"Comedia","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=comedia&order=default')},{"name":"Cyberpunk","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=cyberpunk&order=default')},{"name":"Demonios","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=demonios&order=default')},{"name":"Deportes","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=deportes&order=default')},{"name":"Dragones","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=dragones&order=default')},{"name":"Drama","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=drama&order=default')},{"name":"Ecchi","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=ecchi&order=default')},{"name":"Escolares","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=escolares&order=default')},{"name":"Fantasía","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=fantasia&order=default')},{"name":"Gore","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=gore&order=default')},{"name":"Harem","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=harem&order=default')},{"name":"Histórico","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=historico&order=default')},{"name":"Horror","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=horror&order=default')},{"name":"Infantil","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=infantil&order=default')},{"name":"Isekai","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=isekai&order=default')},{"name":"Josei","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=josei&order=default')},{"name":"Juegos","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=juegos&order=default')},{"name":"Magia","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=magia&order=default')},{"name":"Mecha","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=mecha&order=default')},{"name":"Militar","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=militar&order=default')},{"name":"Misterio","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=misterio&order=default')},{"name":"Música","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=Musica&order=default')},{"name":"Ninjas","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=ninjas&order=default')},{"name":"Parodia","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=parodia&order=default')},{"name":"Policía","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=policia&order=default')},{"name":"Psicológico","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=psicologico&order=default')},{"name":"Recuerdos de la vida","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=Recuerdos de la vida&order=default')},{"name":"Romance","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=romance&order=default')},{"name":"Samurai","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=samurai&order=default')},{"name":"Sci-Fi","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=sci-fi&order=default')},{"name":"Seinen","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=seinen&order=default')},{"name":"Shoujo","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=shoujo&order=default')},{"name":"Shoujo Ai","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=shoujo-ai&order=default')},{"name":"Shounen","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=shounen&order=default')},{"name":"Slice of life","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=slice-of-life&order=default')},{"name":"Sobrenatural","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=sobrenatural&order=default')},{"name":"Space","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=space&order=default')},{"name":"Spokon","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=spokon&order=default')},{"name":"Steampunk","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=steampunk&order=default')},{"name":"Superpoder","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=superpoder&order=default')},{"name":"Thriller","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=thriller&order=default')},{"name":"Vampiro","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=vampiro&order=default')},{"name":"Zombies","path":this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D=zombies&order=default')}]
      });
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
      try{
        let result = await window.fGet(web);
        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "text/html");
        if(/^.*(\d)$/gm.test(web)){
          let parted = web.split("=");
          let page = parseInt(parted.pop(), 10);
          let wbase = parted.join("=") + "=";
          if(page > 1){
            preLinks.push({"name": "Pagina Anterior", "image": "./images/prev_nav.png", "path": this.name + "/getMore/" + window.enc(wbase + (page - 1))}); 
          }
          posLinks.push({"name": "Pagina siguiente", "image": "./images/next_nav.png", "path": this.name + "/getMore/" + window.enc(wbase + (page + 1))});
        }else{
          posLinks.push({"name": "Pagina siguiente", "image": "./images/next_nav.png", "path": this.name + "/getMore/" + window.enc(web + "&page=2")});
        }

        let nas = [];
        let flis = doc.getElementsByClassName("list-series")[0].getElementsByClassName("serie-card");
        for(let i = 0; i < flis.length; i++){
          nas.push({
            "name": flis[i].getElementsByClassName("title")[0].innerText,
            "image": flis[i].getElementsByTagName("img")[0].getAttribute("src"),
            "path": this.name + "/getDescription/" + window.enc(flis[i].getElementsByTagName("a")[0].getAttribute("href")),
          });        
        }
        after({
          [title]: preLinks.concat(nas, posLinks),
        });
      }catch(e){
        onError(e);
      }
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
        let sname =  doc.getElementsByTagName("h1")[0].innerText;
        let description =  doc.getElementsByClassName("sinopsis")[0].innerText.trim();
        let image = doc.querySelector(".image > img:nth-child(1)").getAttribute("src");
        let generosT = doc.getElementsByClassName("genres")[0].getElementsByTagName("a");
        let genres = ""; 
        let chapters = [];
        let chaptersT = doc.getElementsByTagName("ul")[1].getElementsByTagName("li");
        for(let i = 0; i < generosT.length; i++){
            genres = generosT[i].innerText + " " + genres;
        }
        for(let i = 0; i < chaptersT.length; i++){
            chapters.unshift({"name": chaptersT[i].getElementsByTagName("span")[0].innerText,
                           "path": this.name + "/getLinks/" + window.enc(chaptersT[i].getElementsByTagName("a")[0].getAttribute("href"))});
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
        let response = await window.fGet("https://www3.animefenix.tv/animes?q=" + query);
        if (response.indexOf("error") == 0) {
          onError(response);
          return;
        }
        var parser = new DOMParser();
        var doc = parser.parseFromString(response, "text/html");
        let nas = [];
        let flis = doc.getElementsByClassName("list-series")[0].getElementsByClassName("serie-card");
        for(let i = 0; i < flis.length; i++){
          nas.push({
            "name": flis[i].getElementsByClassName("title")[0].innerText,
            "image": flis[i].getElementsByTagName("img")[0].getAttribute("src"),
            "path": this.name + "/getDescription/" + window.enc(flis[i].getElementsByTagName("a")[0].getAttribute("href")),
          });        
        }
      } catch (nerror) {
        onError(nerror);
      }
    }

    async getLinks(after, onError, path) {
      try{
        let result = await fGet(dec(path));
        if (result.indexOf("error") == 0) {
          onError(result);
          return;
        }
        let fames = [...result.matchAll(/player=(\d+).+?code=(.+?)&/gm)];
        let links = [];
        for (let i = 0; i < fames.length; i++) {
            links.push(this.slist[fames[i][1]].replace("$$$$$$", decodeURIComponent(fames[i][2])));
        }
        after(links);
      } catch (error) {
        onError(error);
      }
    }
  }

  /*
  items = document.getElementsByClassName("genres-select")[0].getElementsByTagName("li");
listag = []
for(let i = 0; i < items.length; i++){
  //https://www3.animefenix.tv/animes?genero%5B%5D=accion&order=default
  listag.push({"name": items[i].innerText,
            "path": "this.name + '/getMore/' + window.enc('https://www3.animefenix.tv/animes?genero%5B%5D="+ items[i].getElementsByTagName("input")[0].value +"&order=default')"});
}
console.log(JSON.stringify(listag))
*/