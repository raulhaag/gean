export class AnimeFlvNet {
    constructor() {
      this.name = "animeflv.net";
      this.baseUrl = "https://www3.animeflv.net";
    }
    async getFrontPage(after, onError) {
      try {
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
          "Por genero": [
            {
              "name": "Acción",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=accion&order=default")
            },
            {
              "name": "Artes Marciales",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=artes-marciales&order=default")
            },
            {
              "name": "Aventuras",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=aventura&order=default")
            },
            {
              "name": "Carreras",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=carreras&order=default")
            },
            {
              "name": "Ciencia Ficción",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=ciencia-ficcion&order=default")
            },
            {
              "name": "Comedia",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=comedia&order=default")
            },
            {
              "name": "Demencia",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=demencia&order=default")
            },
            {
              "name": "Demonios",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=demonios&order=default")
            },
            {
              "name": "Deportes",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=deportes&order=default")
            },
            {
              "name": "Drama",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=drama&order=default")
            },
            {
              "name": "Ecchi",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=ecchi&order=default")
            },
            {
              "name": "Escolares",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=escolares&order=default")
            },
            {
              "name": "Espacial",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=espacial&order=default")
            },
            {
              "name": "Fantasía",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=fantasia&order=default")
            },
            {
              "name": "Harem",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=harem&order=default")
            },
            {
              "name": "Historico",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=historico&order=default")
            },
            {
              "name": "Infantil",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=infantil&order=default")
            },
            {
              "name": "Josei",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=josei&order=default")
            },
            {
              "name": "Juegos",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=juegos&order=default")
            },
            {
              "name": "Magia",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=magia&order=default")
            },
            {
              "name": "Mecha",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=mecha&order=default")
            },
            {
              "name": "Militar",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=militar&order=default")
            },
            {
              "name": "Misterio",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=misterio&order=default")
            },
            {
              "name": "Música",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=musica&order=default")
            },
            {
              "name": "Parodia",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=parodia&order=default")
            },
            {
              "name": "Policía",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=policia&order=default")
            },
            {
              "name": "Psicológico",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=psicologico&order=default")
            },
            {
              "name": "Recuentos de la vida",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=recuentos-de-la-vida&order=default")
            },
            {
              "name": "Romance",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=romance&order=default")
            },
            {
              "name": "Samurai",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=samurai&order=default")
            },
            {
              "name": "Seinen",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=seinen&order=default")
            },
            {
              "name": "Shoujo",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=shoujo&order=default")
            },
            {
              "name": "Shounen",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=shounen&order=default")
            },
            {
              "name": "Sobrenatural",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=sobrenatural&order=default")
            },
            {
              "name": "Superpoderes",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=superpoderes&order=default")
            },
            {
              "name": "Suspenso",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=suspenso&order=default")
            },
            {
              "name": "Terror",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=terror&order=default")
            },
            {
              "name": "Vampiros",
              "path": this.name + '/getMore/' + window.enc(this.baseUrl + "/browse?genre%5B%5D=vampiros&order=default")
            },
          ]
        });
      } catch (error) {
        onError(error.name)
      }
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
        let flis = doc.getElementsByClassName("Anime alt B");
        for (var i = 0; i < flis.length; i++) {
            nas.push({
                "name": flis[i].getElementsByClassName("Title")[0].innerText,
                "image": flis[i].getElementsByTagName('img')[0].getAttribute('src'),
                "path": this.name + "/getDescription/" + enc(this.baseUrl + flis[i].getElementsByTagName('a')[0].getAttribute("href")),
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
        let sname =  doc.querySelector("h1.Title").innerText;
        let description =  doc.querySelector(".Description > p:nth-child(1)").innerText.trim();
        let genres = doc.querySelector(".Nvgnrs").innerText.trim().replace(/\n\n\n/g, ", ");
        let image = this.baseUrl + doc.querySelector(".Image > figure:nth-child(1) > img:nth-child(1)").getAttribute('src');
        let elis = window.getFirstMatch(/episodes = \[(.+?\])\]/gm,result);
        let elis2 = window.getAllMatches(/\[(\d+),(\d+)\]/gm, elis);
        let chapters = [];
        let basechapter = window.dec(path).replace("/anime/", "/ver/");
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


  /*
  //let lis, i, out
document.getElementsByTagName("ul")[2].getElementsByTagName("li")[3].children[0].children[0].children[0].value
lis = document.getElementsByTagName("ul")[2].getElementsByTagName("li")
out = [];
for(i = 0; i < lis.length; i++){
  out.push({"title":lis[i].innerText, "path":'/browse?genre%5B%5D=' + lis[i].children[0].children[0].children[0].value + '&order=default'})
}
console.log(out)
  */