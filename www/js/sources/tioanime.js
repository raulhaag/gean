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
      let gen = [
        {
          "name": "Acción",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=accion&sort=recent')
        },
        {
          "name": "Artes Marciales",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=artes-marciales&sort=recent')
        },
        {
          "name": "Aventuras",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=aventura&sort=recent')
        },
        {
          "name": "Carreras",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=carreras&sort=recent')
        },
        {
          "name": "Ciencia Ficción",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=ciencia-ficcion&sort=recent')
        },
        {
          "name": "Comedia",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=comedia&sort=recent')
        },
        {
          "name": "Demencia",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=demencia&sort=recent')
        },
        {
          "name": "Demonios",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=demonios&sort=recent')
        },
        {
          "name": "Deportes",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=deportes&sort=recent')
        },
        {
          "name": "Drama",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=drama&sort=recent')
        },
        {
          "name": "Ecchi",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=ecchi&sort=recent')
        },
        {
          "name": "Escolares",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=escolares&sort=recent')
        },
        {
          "name": "Espacial",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=espacial&sort=recent')
        },
        {
          "name": "Fantasía",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=fantasia&sort=recent')
        },
        {
          "name": "Harem",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=harem&sort=recent')
        },
        {
          "name": "Historico",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=historico&sort=recent')
        },
        {
          "name": "Infantil",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=infantil&sort=recent')
        },
        {
          "name": "Josei",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=josei&sort=recent')
        },
        {
          "name": "Juegos",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=juegos&sort=recent')
        },
        {
          "name": "Magia",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=magia&sort=recent')
        },
        {
          "name": "Mecha",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=mecha&sort=recent')
        },
        {
          "name": "Militar",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=militar&sort=recent')
        },
        {
          "name": "Misterio",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=misterio&sort=recent')
        },
        {
          "name": "Música",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=musica&sort=recent')
        },
        {
          "name": "Parodia",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=parodia&sort=recent')
        },
        {
          "name": "Policía",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=policia&sort=recent')
        },
        {
          "name": "Psicológico",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=psicologico&sort=recent')
        },
        {
          "name": "Recuentos de la vida",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=recuentos-de-la-vida&sort=recent')
        },
        {
          "name": "Romance",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=romance&sort=recent')
        },
        {
          "name": "Samurai",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=samurai&sort=recent')
        },
        {
          "name": "Seinen",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=seinen&sort=recent')
        },
        {
          "name": "Shoujo",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=shoujo&sort=recent')
        },
        {
          "name": "Shounen",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=shounen&sort=recent')
        },
        {
          "name": "Sobrenatural",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=sobrenatural&sort=recent')
        },
        {
          "name": "Superpoderes",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=superpoderes&sort=recent')
        },
        {
          "name": "Suspenso",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=suspenso&sort=recent')
        },
        {
          "name": "Terror",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=terror&sort=recent')
        },
        {
          "name": "Vampiros",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=vampiros&sort=recent')
        },
        {
          "name": "Yaoi",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=yaoi&sort=recent')
        },
        {
          "name": "Yuri",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + '/directorio?genero[]=yuri&sort=recent')
        }
      ]

      after({
        "Últimos Capítulos": ncs,
        "Últimas Péliculas, Ovas y Animes": nas,
        "Por genero": gen
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
          posLinks.push({"name": "Pagina siguiente", "image": "./images/next_nav.png", "path": this.name + "/getMore/" + window.enc(web + "&p=2")});
        }
        let nas = [], flis = [];
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
          [title]: preLinks.concat(nas, posLinks),
        });
      }catch(e){
        onError(e);
      }
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
            links.push((fames[i][1]).replace(/\\/g, ""));
        }
        after(links);
      } catch (error) {
        onError(error);
      }
    }
  }
