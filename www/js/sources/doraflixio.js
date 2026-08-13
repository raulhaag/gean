import { NJP } from "../lib/njp.js";
import { SourceBase } from "../sourcebase.js";
export class DoraFlixIO extends SourceBase {
    constructor() {
      super();
      this.name = "DoraFlixIO";
      //zO-XBQyyzd-N6luloEA8n
      this.host = atob("aHR0cHM6Ly9kb3JhbWFzZmxpeC5pby8=");
      this.api = atob("aHR0cHM6Ly9zdjUuZmx1eGNlZGVuZS5uZXQvYXBpL2dxbA");
      this.tags = {"6001bbf86a59ac892792cc66": "Comedia Romantica", "6006213bbce98d11e5f101f6": "Juvenil", "601079241e359f3cddc02abe": "Vida", "6010791a1e359f3cddc02abd": "Amistad", "60109975131a041d23230e2d": "Suspenso", "60c7a4277a9aab74f8dd12b0": "Secretos", "60033f023eadfcb8c24cb2b7": "Escolar", "6062162a36c07b56269ead9c": "Fantasia", "600377a0fa369cb9f16cd6f6": "Histórico", "60437f29a9e3972718d155f5": "Girl power", "6003218232c4bbb1bd0dd089": "Triangulo amoroso", "603ea8e4814c8a4c38905c8b": "Familiar", "6057e80edd3fad36908ce785": "Minidrama", "600b1fec1e359f3cddc02880": "Música", "6004aada6a416cf935dffcfe": "Psicológico", "60a6218b6eac98b6bcba0fd3": "Idols", "6001bb916a59ac892792cc64": "Seres de fantasía", "600894d81e359f3cddc0273f": "Policial", "60ea0d8f0b9539786418e0cd": "+18", "60070078ed0fd0490ce9000c": "Oficina", "6001f08c59dc5d9e93ae46fc": "Supernatural", "608a0a7bf635cb337d9360f6": "Ficción", "60a47c0f6eac98b6bcba0f97": "Melodrama", "6070ee88ff487fea93c7158d": "Venganza", "60a621966eac98b6bcba0fd4": "Entretenimiento", "6048ff13173782fe76304af0": "KShow", "6064e029253cf7b8c4b92cc8": "Live action", "618ff4410b53570c5ee0e00f": "Navidad", "60108079996e5e0965c5a17f": "Deportes", "601076221e359f3cddc02aaf": "Negocios", "60088cd31e359f3cddc02710": "Médico", "6081b12249bae3a14ae71324": "Investigación", "60107a661e359f3cddc02aca": "Leyes", "60437fcda9e3972718d155fb": "Bad boys", "60871f597e696f77fbf4a7e2": "Empresa", "61bb7720ed17d77d0def2e48": "Dc Comics", "600637ada9b4b11ee8ede64e": "Para llorar", "6004acf36a416cf935dffd07": "Universidad", "649bd71a723b67345ffb0fe4": "Estrenos 2023", "600746081e359f3cddc02632": "Fiscales", "601087b8996e5e0965c5a1af": "Comida", "600ad5351e359f3cddc027c4": "Belleza", "600b28111e359f3cddc028a1": "Viajes en el tiempo", "6100887a72755abd07cbfa4a": "Kpop", "64768137298d8d8fd888a2d7": "TikTok", "600b26611e359f3cddc02898": "Fantasmas", "613434623b839a80132c5e84": "Eróticas", "6081b13149bae3a14ae71325": "Detectives", "60971d0c2c048deabe64de21": "Medicina", "60be6ff9f8ac680ef2d78c25": "Web-Drama", "6007577d1e359f3cddc02680": "Ejército", "6012dc3f063b05733e0a5376": "Guerra", "600b315e1e359f3cddc028bb": "Catástrofe", "60f193509ecaeb212c716e11": "Magia", "610a31334b8d9a1d1598679a": "Hechos reales", "6075bf3f8e15f932c84a3dbc": "cocina", "601572a819cfe8caa9725451": "Lucha", "61097189c097428eb592dffa": "Carros", "602e86bbad86ce98c74fcc07": "Robots", "60887ffaf635cb337d935748": "Legal", "67acd5bc6a900d692c09ffc0": "Del Odio al Amor", "60f192d09ecaeb212c716e10": "Superhéroes", "61135a904ecd05616f4c6f58": "Animales", "60a7ec8282ad69829bee2647": "Pérdida de memoria", "619e67cb1115373a48d2006d": "Enfermedad", "6057e763dd3fad36908ce784": "Vampiros", "610a3b944b8d9a1d159868c1": "Zombies", "60feb0b2c6360f9c7ebb1ccf": "Videojuegos", "61a1240a1115373a48d2165a": "Futbol", "60bae1d13bfda1e6c585c704": "Maquillaje", "610a3d804b8d9a1d15986a21": "Magos", "60f9df630832a08f92afee5e": "Hacker", "619801931115373a48d1f6c0": "Dibujos", "608712887e696f77fbf4a7ac": "Diseño", "609887b42c048deabe64e2d4": "Bélico", "6197fe271115373a48d1f4de": "Realeza", "61fecdff4819d2ad1fc61a1e": "Telenovela", "64da7954003cd821e1e31532": "Series", "68acf7f8dab02149a2ad07c7": "Época", "694f3ebfdab02149a2cc7d46": "Anime"}
      this.bid = "";
    }

    async getTag(labelid) {
      const pobj = {"operationName":"listMoviesLabel","variables":{"labelId":labelid},"query":"query listMoviesLabel($labelId: MongoID!) {\n  listMovies(filter: {labelId: $labelId}) {\n    _id\n    name\n    name_es\n    slug\n    overview\n    release_date\n    runtime\n    poster_path\n    __typename\n  }\n}\n"}
      const dobj = {"operationName":"listDoramasLabel","variables":{"labelId":labelid},"query":"query listDoramasLabel($labelId: MongoID!) {\n  listDoramas(filter: {labelId: $labelId}) {\n    _id\n    name\n    name_es\n    isTVShow\n    slug\n    overview\n    first_air_date\n    episode_run_time\n    poster_path\n    __typename\n  }\n}\n"}
      const series = JSON.parse(await window.fPost(this.api, 
        {"content-type": "application/json"},
        dobj
      ));
      const pelis = JSON.parse(await window.fPost(this.api, 
        {"content-type": "application/json"},
        pobj
      ));
      const max = Math.max(series.data.listDoramas.length, pelis.data.listMovies.length);
      const items = [];
      for(let i = 0; i < max; i++){
        if(i < series.data.listDoramas.length){ 
          items.push({
            "name": series.data.listDoramas[i].name,
            "image": "https://image.tmdb.org/t/p/w220_and_h330_face/" + series.data.listDoramas[i].poster_path,
            "path": this.name + "/getDescription/" +  window.enc("doramas/" + series.data.listDoramas[i].slug)
          });
        }
        if(i < pelis.data.listMovies.length){
          items.push({
            "name": pelis.data.listMovies[i].name + " [Movie]",
            "image": "https://image.tmdb.org/t/p/w220_and_h330_face/" + pelis.data.listMovies[i].poster_path,
            "path": this.name + "/getDescription/" +  window.enc("peliculas/" + pelis.data.listMovies[i].slug)
          });
        }
      }
      return items;
    }

    async getMore(after, onError, path) {
      const dpath = window.dec(path);
      if (dpath === "Homepage") {
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
      if(dpath in this.tags){
          after({
                [this.tags[dpath]]: preLinks.concat(await this.getTag(dpath)),
            });
          return
      }
      onError("No more");
    }

    async getFrontPage(after, onError) {
      try{
        const ncs = [];
        const movies = [];

        try{
          const dora = JSON.parse(await window.fPost(this.api, 
            {"content-type": "application/json"},
            {"operationName":"paginationDorama","variables":{"perPage":24,"sort":"CREATEDAT_DESC","filter":{},"page":1},"query":"query paginationDorama($page: Int, $perPage: Int, $sort: SortFindManyDoramaInput, $filter: FilterFindManyDoramaInput) {\n  paginationDorama(page: $page, perPage: $perPage, sort: $sort, filter: $filter) {\n    count\n    pageInfo {\n      currentPage\n      hasNextPage\n      hasPreviousPage\n      __typename\n    }\n    items {\n      _id\n      name\n      name_es\n      slug\n      isTVShow\n      poster\n      poster_path\n      genres {\n        name\n        slug\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"}
          ));
          for(let i = 0; i < dora["data"]["paginationDorama"]["items"].length; i++){
            const basepath = dora["data"]["paginationDorama"]["items"][i]["__typename"] == "Dorama" ? "doramas" : "peliculas";
            ncs.push({
              "name": dora["data"]["paginationDorama"]["items"][i]["name"],
              "image": "https://image.tmdb.org/t/p/w220_and_h330_face/" + dora["data"]["paginationDorama"]["items"][i]["poster_path"],
              "path": this.name + "/getDescription/" +  window.enc(basepath + "/" + dora["data"]["paginationDorama"]["items"][i]["slug"])
            });
          }
        }catch(e){
          //continue to movies
          console.log(e);
        }

        try{
          const movi = JSON.parse(await window.fPost(this.api, 
            {"content-type": "application/json"},
            {"operationName":"paginationMovie","variables":{"perPage":24,"sort":"CREATEDAT_DESC","filter":{},"page":2},"query":"query paginationMovie($page: Int, $perPage: Int, $sort: SortFindManyMovieInput, $filter: FilterFindManyMovieInput) {\n  paginationMovie(page: $page, perPage: $perPage, sort: $sort, filter: $filter) {\n    count\n    pageInfo {\n      currentPage\n      hasNextPage\n      hasPreviousPage\n      __typename\n    }\n    items {\n      _id\n      name\n      name_es\n      slug\n      poster_path\n      poster\n      __typename\n    }\n    __typename\n  }\n}\n"}
          ));
          for(let i = 0; i < movi["data"]["paginationMovie"]["items"].length; i++){
            const basepath = movi["data"]["paginationMovie"]["items"][i]["__typename"] == "Dorama" ? "doramas" : "peliculas";

            movies.push({
              "name": movi["data"]["paginationMovie"]["items"][i]["name"]  + " [Movie]",
              "image": "https://image.tmdb.org/t/p/w220_and_h330_face/" + movi["data"]["paginationMovie"]["items"][i]["poster_path"],
              "path": this.name + "/getDescription/" +  window.enc(basepath + "/" + movi["data"]["paginationMovie"]["items"][i]["slug"])
            });
          }
        }catch(e){
        //continue
          console.log(e);
        }

        const tags = [];
        const keys = Object.keys(this.tags);
        for(let key in keys){
          tags.push({
            "name": this.tags[keys[key]],
            "path": this.name + "/getMore/" + window.enc(keys[key])
          });
        }
      
        if(ncs.length == 0 && movies.length == 0){
          throw new Error("No data colected");
        }

        after({
          "Doramas": ncs,
          "Películas": movies,
          "Por generos": tags
        });
     }catch(e){
        onError("Error al cargar la pagina principal");
     }
    }

   getChapter(data){
      return {"name": data.name , "path": this.name + "/getLinks/" + window.enc(JSON.stringify(data))};
    }

    async getSeason(season_number, info){
        const result = await window.fPost(`${this.host}${info.path}`
        , {
            "next-action": "402fbf5040dc380544392d3f77fe836722d4fa95c3","Content-Type": "text/plain;charset=UTF-8",
            "next-router-state-tree": `%5B%22%22%2C%7B%22children%22%3A%5B%22doramas%22%2C%7B%22children%22%3A%5B%5B%22slug%22%2C%22${info.slug}%22%2C%22d%22%2Cnull%5D%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C16%5D%7D%2Cnull%2Cnull%2C8%5D%2C%22modal%22%3A%5B%22__DEFAULT__%22%2C%7B%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C24%5D`
          },
            `[{"serie_id":"${info.id}","season_number":${season_number},"page":1,"limit":8,"sort":"NUMBER_ASC","excludedLabelSlugs":"$undefined","brandHost":"doramasflix.io"}]`
        );        
        const chapters = [];

        try{ 
        let episodes = JSON.parse(window.getFirstMatch(/({"items":[\S\s]+?)$/gm, result));
        for (let i = 0; i < episodes.items.length; i++) {
          if(episodes.items[i].count_links > 0) chapters.push(this.getChapter(episodes.items[i]));
        }
        let currentPage = 1
        while(episodes.pageInfo.hasNextPage){
          currentPage++;
          const result = await window.fPost(`${this.host}${info.path}`
            , {
                "next-action": "402fbf5040dc380544392d3f77fe836722d4fa95c3","Content-Type": "text/plain;charset=UTF-8",
                "next-router-state-tree": `%5B%22%22%2C%7B%22children%22%3A%5B%22doramas%22%2C%7B%22children%22%3A%5B%5B%22slug%22%2C%22${info.slug}%22%2C%22d%22%2Cnull%5D%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C16%5D%7D%2Cnull%2Cnull%2C8%5D%2C%22modal%22%3A%5B%22__DEFAULT__%22%2C%7B%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C24%5D`
              },
                `[{"serie_id":"${info.id}","season_number":${season_number},"page":${currentPage},"limit":8,"sort":"NUMBER_ASC","excludedLabelSlugs":"$undefined","brandHost":"doramasflix.io"}]`
            );
          episodes = episodes = JSON.parse(window.getFirstMatch(/({"items":[\S\s]+?)$/gm, result));
          for (let i = 0; i < episodes.items.length; i++) {
            if(episodes.items[i].count_links > 0) chapters.push(this.getChapter(episodes.items[i]));
          }
        }
        }catch(e){
          console.log("cached");
          console.log(e);
        }
        return chapters;

    }

    async getDorama(info, path, page = 0,){
      
      const seasons = info.seasons.map((s)=> s["season_number"]);

      let chapters = [];
      for(let i = 0; i < seasons.length; i++){
        chapters = chapters.concat(await this.getSeason(seasons[i], info));
      }
      return { "name": info.name, "path": this.name + "/getDescription/" + window.enc(info.path), "image": info.image, "items": [info.info], "chapters": chapters }
    }

    async getDescription(after, onError, path, page = 0,) {
      try {
        const result = await window.fGet(`${this.host}${window.dec(path)}`, 
        {
          "rsc": 1,
          "next-router-state-tree": "%5B%22%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2Cnull%2Cnull%2C0%5D%2C%22modal%22%3A%5B%22__DEFAULT__%22%2C%7B%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C16%5D"
        });

                const out = {};
        const frm = (/{"id":"([^"]+?)","slug":"([^"]+?)","name":"([^"]+?)","name_es":"([^"]+?)"/gm).exec(result);
        out.path = window.dec(path);
        out.name = frm[3];
        out.id = frm[1];
        out.slug = frm[2];
        out.image = window.getFirstMatch(/"image":"(.+?)"/, result);
        out.info = frm[4] + "\n" + window.getFirstMatch(/"description":"(.+?)"/, result);

        if(window.dec(path).indexOf("dorama") != -1){
          const data = JSON.parse(window.getFirstMatch(/({"serie_id":.+?}})]}]/g,result));
          out.seasons = data.seasons;
          after(await this.getDorama(out, path, page));
          return;
        }

        after({ "name": out.name , "path": this.name + "/getDescription/" + path, "image": out.image, "items": [out.info], "chapters": [{ "name": "Ver película", "path": this.name + "/getLinks/" + window.enc("slug:" + JSON.stringify(out))}]});
  
      } catch (error) {
        onError(error);
      }
    }
  
    async getParent(after, path) {
    }
    
    async getSearch(after, onError, query) {
      try {
        const result = JSON.parse(await window.fPost(this.api, 
          {"content-type": "application/json"},
          {"operationName":"searchAll","variables":{"input":query},"query":"query searchAll($input: String!) {\n  searchDorama(input: $input, limit: 5) {\n    _id\n    slug\n    name\n    name_es\n    poster_path\n    poster\n    __typename\n  }\n  searchMovie(input: $input, limit: 5) {\n    _id\n    name\n    name_es\n    slug\n    poster_path\n    poster\n    __typename\n  }\n}\n"}
        ));
        const items = [];
        const max = Math.max(result.data.searchDorama.length, result.data.searchMovie.length);
        for(let i = 0; i < max; i++){
          if(i < result.data.searchDorama.length){
            items.push({
              "name": result.data.searchDorama[i].name,
              "image": "https://image.tmdb.org/t/p/w220_and_h330_face/" + result.data.searchDorama[i].poster_path,
              "path": this.name + "/getDescription/" +  window.enc("doramas/" + result.data.searchDorama[i].slug)
            });
          }
          if(i < result.data.searchMovie.length){
            items.push({
              "name": result.data.searchMovie[i].name + " [Movie]",
              "image": "https://image.tmdb.org/t/p/w220_and_h330_face/" + result.data.searchMovie[i].poster_path,
              "path": this.name + "/getDescription/" +  window.enc("peliculas/" + result.data.searchMovie[i].slug)
            });
          }
        }
        after(items);
      } catch (error) {
        onError(error);
      }
    }

    cleanLink(dirty){
      const c1 = dirty.replace("https://embedshortener.co/e/","").split(".")[1];
      return (window.dec(JSON.parse(window.dec(c1)).link));
    }
  
    async getLinks(after, onError, path) {
      try {
        const links = [];
        const decpath = window.dec(path);
        if(decpath.indexOf("slug:") != -1){
          const data = JSON.parse(decpath.replace("slug:",""));
          const result = await window.fPost(`${this.host}peliculas/${data.slug}`
          , {
              "next-action": "40a02cfc02b593c2ec630b4cd6c4ee48509defe57a","Content-Type": "text/plain;charset=UTF-8",
              "next-router-state-tree": `%5B%22%22%2C%7B%22children%22%3A%5B%22peliculas%22%2C%7B%22children%22%3A%5B%5B%22slug%22%2C%22${data.slug}%22%2C%22d%22%2Cnull%5D%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C16%5D%7D%2Cnull%2Cnull%2C8%5D%2C%22modal%22%3A%5B%22__DEFAULT__%22%2C%7B%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C16%5D`
            },
            `[{"movie_id":"${data.id}"}]`
          );
          const lpg = window.getAllMatches(/"link":"([^"]+?)"/gm, result);
          for(let i = 0; i < lpg.length; i++){
            links.push(this.cleanLink(lpg[i][1]));
          }
          after(links);
          return
        }

        const data = JSON.parse(decpath);
        const result = await window.fPost(`${this.host}capitulos/${data.slug}`
          , {
              "next-action": "40029b7568610a4e2e65963079a4d5f5d1cff1e6e3","Content-Type": "text/plain;charset=UTF-8",
              "next-router-state-tree": `%5B%22%22%2C%7B%22children%22%3A%5B%22capitulos%22%2C%7B%22children%22%3A%5B%5B%22slug%22%2C%22${data.slug}%22%2C%22d%22%2Cnull%5D%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C16%5D%7D%2Cnull%2Cnull%2C0%5D%2C%22modal%22%3A%5B%22__DEFAULT__%22%2C%7B%7D%2Cnull%2Cnull%2C0%5D%7D%2Cnull%2Cnull%2C24%5D`
            },
            `[{"episode_id":"${data._id}"}]`
          );
        const lpg = JSON.parse(window.getFirstMatch(/(\[{"server".+?$)/gm, result));
        for(let i = 0; i < lpg.length; i++){
          links.push(this.cleanLink(lpg[i].link));
        }
        after(links);
      } catch (error) {
        onError(error);
      }
    }
  }