import { SoloLatino } from "./sololatino.js";
export class SoloLatinoSyP extends SoloLatino {
  constructor() {
    super();
    this.name = "sololatinosyp";
    this.baseUrl = "https://sololatino.net/";
  }
  async getFrontPage(after, onError) {
    try {
      var out = {};
      //let result = await window.fGet("https://sololatino.net/animes/novedades/");
      let result = await window.fGet("https://sololatino.net/series/");
      try{
        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "text/html");
        let flis = doc.getElementsByClassName("item"); //doc.querySelectorAll("html body.error404 div#dt_contenedor div#contenedor div.module div.content.full_width_layout div#archive-content.animation-2.items div.items article");
        out["Series"] = this.parseList(flis);
      }catch(e){}
      result = await window.fGet("https://sololatino.net/peliculas/");
      try{
        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "text/html");
        let flis = doc.getElementsByClassName("item"); //doc.querySelectorAll("html body.error404 div#dt_contenedor div#contenedor div.module div.content.full_width_layout div#archive-content.animation-2.items div.items article");
        out["Películas"] = this.parseList(flis);//western,ciencia-ficcion,belica,accion,terror,suspenso,suspense
        out["Películas por genero"] = [
          {"name":"Acción","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/pelicula/filtro/?genre=accion')},
          {"name":"Aventura","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/pelicula/filtro/?genre=aventura-123-123-123-123')},
          {"name":"Ciencia ficción","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/pelicula/filtro/?genre=ciencia-ficcion')},        
          {"name":"Comedia","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/pelicula/filtro/?genre=comedia')},
          {"name":"Crimen","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/pelicula/filtro/?genre=crimen')},
          {"name":"Documental","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/pelicula/filtro/?genre=documental')},
          {"name":"Drama","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/pelicula/filtro/?genre=drama')},
          {"name":"Fantasía","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/pelicula/filtro/?genre=fantasia')},
          {"name":"Historia","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/pelicula/filtro/?genre=historia')},
          {"name":"Misterio","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/pelicula/filtro/?genre=misterio')},
          {"name":"Música","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/pelicula/filtro/?genre=musica')},
          {"name":"Película de TV","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/pelicula/filtro/?genre=pelicula-de-tv')},
          {"name":"Suspenso","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/pelicula/filtro/?genre=suspenso')},
          {"name":"Terror","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/pelicula/filtro/?genre=terror')},
          {"name":"Western","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/pelicula/filtro/?genre=western')}
        ]
        out["Series por genero"] = [{"name":"Acción y aventura","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/series/filtro/?genre=action-adventure/')},
          {"name":"Animación","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/series/filtro/?genre=animacion/')},
          {"name":"Comedia","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/series/filtro/?genre=comedia/')},
          {"name":"Crimen","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/series/filtro/?genre=crimen/')},
          {"name":"Documental","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/series/filtro/?genre=documental/')},
          {"name":"Drama","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/series/filtro/?genre=drama/')},
          {"name":"Fámilia","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/series/filtro/?genre=familia/')},
          {"name":"Kids","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/series/filtro/?genre=kids/')},
          {"name":"Misterio","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/series/filtro/?genre=misterio/')},
          {"name":"Reality","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/series/filtro/?genre=reality/')},
          {"name":"Romance","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/series/filtro/?genre=romance/')},
          {"name":"SCI-FI & Fantasia","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/series/filtro/?genre=sci-fi-fantasy/')},
          {"name":"SOAP","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/series/filtro/?genre=soap/')},
          {"name":"TALK","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/series/filtro/?genre=talk/')},
          {"name":"TOONS","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/series/filtro/?genre=toons/')},
          {"name":"Belicas","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/series/filtro/?genre=war-politics/')},
          {"name":"Western","path":this.name + '/getMore/' + window.enc(this.baseUrl + '/series/filtro/?genre=western/')}];
      }catch(e){}
      after(out);
    } catch (error) {
      onError(error.name);
    }
  }

  async getParent(after, path) {
    let dpath = (window.dec(path)).replace("episodios", "series").replace(/-[^-]+?\d\/$/gm, "/");
    let reduce = function(v){after({"name": v.name, "image": v.image, "path": v.path}, path)};
    this.getDescription(reduce, console.log, window.enc(dpath));
  }

}

/*
  //let opts, opt, out;
    opts = document.getElementById("bloque_principal").getElementsByTagName("li");
    out = [];
    for(opt in opts){
      try{
      out.push({name: opts[opt].innerText, path: `this.name + '/getMore/' + window.enc(this.baseUrl + '/pelicula/filtro/?genre=${opts[opt].dataset.value}/')`});
      }catch(e){};
    }
    console.log(JSON.stringify(out).replaceAll("\\", ""))

*/