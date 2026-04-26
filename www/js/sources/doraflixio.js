import { SourceBase } from "../sourcebase.js";
export class DoraFlixIO extends SourceBase {
    constructor() {
      super();
      this.name = "DoraFlixIO";
      this.host = atob("aHR0cHM6Ly9kb3JhbWFzZmxpeC5pby8=");
      this.tags = {"6001bbf86a59ac892792cc66": "Comedia Romantica", "6006213bbce98d11e5f101f6": "Juvenil", "601079241e359f3cddc02abe": "Vida", "6010791a1e359f3cddc02abd": "Amistad", "60109975131a041d23230e2d": "Suspenso", "60c7a4277a9aab74f8dd12b0": "Secretos", "60033f023eadfcb8c24cb2b7": "Escolar", "6062162a36c07b56269ead9c": "Fantasia", "600377a0fa369cb9f16cd6f6": "Histórico", "60437f29a9e3972718d155f5": "Girl power", "6003218232c4bbb1bd0dd089": "Triangulo amoroso", "603ea8e4814c8a4c38905c8b": "Familiar", "6057e80edd3fad36908ce785": "Minidrama", "600b1fec1e359f3cddc02880": "Música", "6004aada6a416cf935dffcfe": "Psicológico", "60a6218b6eac98b6bcba0fd3": "Idols", "6001bb916a59ac892792cc64": "Seres de fantasía", "600894d81e359f3cddc0273f": "Policial", "60ea0d8f0b9539786418e0cd": "+18", "60070078ed0fd0490ce9000c": "Oficina", "6001f08c59dc5d9e93ae46fc": "Supernatural", "608a0a7bf635cb337d9360f6": "Ficción", "60a47c0f6eac98b6bcba0f97": "Melodrama", "6070ee88ff487fea93c7158d": "Venganza", "60a621966eac98b6bcba0fd4": "Entretenimiento", "6048ff13173782fe76304af0": "KShow", "6064e029253cf7b8c4b92cc8": "Live action", "618ff4410b53570c5ee0e00f": "Navidad", "60108079996e5e0965c5a17f": "Deportes", "601076221e359f3cddc02aaf": "Negocios", "60088cd31e359f3cddc02710": "Médico", "6081b12249bae3a14ae71324": "Investigación", "60107a661e359f3cddc02aca": "Leyes", "60437fcda9e3972718d155fb": "Bad boys", "60871f597e696f77fbf4a7e2": "Empresa", "61bb7720ed17d77d0def2e48": "Dc Comics", "600637ada9b4b11ee8ede64e": "Para llorar", "6004acf36a416cf935dffd07": "Universidad", "649bd71a723b67345ffb0fe4": "Estrenos 2023", "600746081e359f3cddc02632": "Fiscales", "601087b8996e5e0965c5a1af": "Comida", "600ad5351e359f3cddc027c4": "Belleza", "600b28111e359f3cddc028a1": "Viajes en el tiempo", "6100887a72755abd07cbfa4a": "Kpop", "64768137298d8d8fd888a2d7": "TikTok", "600b26611e359f3cddc02898": "Fantasmas", "613434623b839a80132c5e84": "Eróticas", "6081b13149bae3a14ae71325": "Detectives", "60971d0c2c048deabe64de21": "Medicina", "60be6ff9f8ac680ef2d78c25": "Web-Drama", "6007577d1e359f3cddc02680": "Ejército", "6012dc3f063b05733e0a5376": "Guerra", "600b315e1e359f3cddc028bb": "Catástrofe", "60f193509ecaeb212c716e11": "Magia", "610a31334b8d9a1d1598679a": "Hechos reales", "6075bf3f8e15f932c84a3dbc": "cocina", "601572a819cfe8caa9725451": "Lucha", "61097189c097428eb592dffa": "Carros", "602e86bbad86ce98c74fcc07": "Robots", "60887ffaf635cb337d935748": "Legal", "67acd5bc6a900d692c09ffc0": "Del Odio al Amor", "60f192d09ecaeb212c716e10": "Superhéroes", "61135a904ecd05616f4c6f58": "Animales", "60a7ec8282ad69829bee2647": "Pérdida de memoria", "619e67cb1115373a48d2006d": "Enfermedad", "6057e763dd3fad36908ce784": "Vampiros", "610a3b944b8d9a1d159868c1": "Zombies", "60feb0b2c6360f9c7ebb1ccf": "Videojuegos", "61a1240a1115373a48d2165a": "Futbol", "60bae1d13bfda1e6c585c704": "Maquillaje", "610a3d804b8d9a1d15986a21": "Magos", "60f9df630832a08f92afee5e": "Hacker", "619801931115373a48d1f6c0": "Dibujos", "608712887e696f77fbf4a7ac": "Diseño", "609887b42c048deabe64e2d4": "Bélico", "6197fe271115373a48d1f4de": "Realeza", "61fecdff4819d2ad1fc61a1e": "Telenovela", "64da7954003cd821e1e31532": "Series", "68acf7f8dab02149a2ad07c7": "Época", "694f3ebfdab02149a2cc7d46": "Anime"}
    }

    async getTag(labelid) {
      const pobj = {"operationName":"listMoviesLabel","variables":{"labelId":labelid},"query":"query listMoviesLabel($labelId: MongoID!) {\n  listMovies(filter: {labelId: $labelId}) {\n    _id\n    name\n    name_es\n    slug\n    overview\n    release_date\n    runtime\n    poster_path\n    __typename\n  }\n}\n"}
      const dobj = {"operationName":"listDoramasLabel","variables":{"labelId":labelid},"query":"query listDoramasLabel($labelId: MongoID!) {\n  listDoramas(filter: {labelId: $labelId}) {\n    _id\n    name\n    name_es\n    isTVShow\n    slug\n    overview\n    first_air_date\n    episode_run_time\n    poster_path\n    __typename\n  }\n}\n"}
      const series = JSON.parse(await window.fPost("https://sv5.fluxcedene.net/api/gql", 
        {"content-type": "application/json"},
        {"RAW_GEAN": dobj}
      ));
      const pelis = JSON.parse(await window.fPost("https://sv5.fluxcedene.net/api/gql", 
        {"content-type": "application/json"},
        {"RAW_GEAN": pobj}
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

    async getFrontPage(after, error) {
      const dora = JSON.parse(await window.fPost("https://sv5.fluxcedene.net/api/gql", 
        {"content-type": "application/json"},
        {"RAW_GEAN": {"operationName":"paginationDorama","variables":{"perPage":24,"sort":"CREATEDAT_DESC","filter":{},"page":1},"query":"query paginationDorama($page: Int, $perPage: Int, $sort: SortFindManyDoramaInput, $filter: FilterFindManyDoramaInput) {\n  paginationDorama(page: $page, perPage: $perPage, sort: $sort, filter: $filter) {\n    count\n    pageInfo {\n      currentPage\n      hasNextPage\n      hasPreviousPage\n      __typename\n    }\n    items {\n      _id\n      name\n      name_es\n      slug\n      isTVShow\n      poster\n      poster_path\n      genres {\n        name\n        slug\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"}
      }));
      const ncs = [];
      for(let i = 0; i < dora["data"]["paginationDorama"]["items"].length; i++){
        const basepath = dora["data"]["paginationDorama"]["items"][i]["__typename"] == "Dorama" ? "doramas" : "peliculas";

        ncs.push({
          "name": dora["data"]["paginationDorama"]["items"][i]["name"],
          "image": "https://image.tmdb.org/t/p/w220_and_h330_face/" + dora["data"]["paginationDorama"]["items"][i]["poster_path"],
          "path": this.name + "/getDescription/" +  window.enc(basepath + "/" + dora["data"]["paginationDorama"]["items"][i]["slug"])
        });
      }
      const movi = JSON.parse(await window.fPost("https://sv5.fluxcedene.net/api/gql", 
        {"content-type": "application/json"},
        {"RAW_GEAN": {"operationName":"paginationMovie","variables":{"perPage":24,"sort":"CREATEDAT_DESC","filter":{},"page":2},"query":"query paginationMovie($page: Int, $perPage: Int, $sort: SortFindManyMovieInput, $filter: FilterFindManyMovieInput) {\n  paginationMovie(page: $page, perPage: $perPage, sort: $sort, filter: $filter) {\n    count\n    pageInfo {\n      currentPage\n      hasNextPage\n      hasPreviousPage\n      __typename\n    }\n    items {\n      _id\n      name\n      name_es\n      slug\n      poster_path\n      poster\n      __typename\n    }\n    __typename\n  }\n}\n"}
      }));
      
      const movies = [];
      for(let i = 0; i < movi["data"]["paginationMovie"]["items"].length; i++){
        const basepath = movi["data"]["paginationMovie"]["items"][i]["__typename"] == "Dorama" ? "doramas" : "peliculas";

        movies.push({
          "name": movi["data"]["paginationMovie"]["items"][i]["name"]  + " [Movie]",
          "image": "https://image.tmdb.org/t/p/w220_and_h330_face/" + movi["data"]["paginationMovie"]["items"][i]["poster_path"],
          "path": this.name + "/getDescription/" +  window.enc(basepath + "/" + movi["data"]["paginationMovie"]["items"][i]["slug"])
        });
      }

      const tags = [];
      const keys = Object.keys(this.tags);
      for(let key in keys){
        tags.push({
          "name": this.tags[keys[key]],
          "path": this.name + "/getMore/" + window.enc(keys[key])
        });
      }

      after({
        "Doramas": ncs,
        "Películas": movies,
        "Por generos": tags
      });
    }

    getChapter(data){
      return {"name": data.name , "path": this.name + "/getLinks/" + window.enc(JSON.stringify(data))};
    }

    async getSeason(season_number, id){
        let episodes = JSON.parse(await window.fPost("https://sv5.fluxcedene.net/api/gql", 
        {"content-type": "application/json"},
        {"RAW_GEAN": {"operationName":"listEpisodesPagination","variables":{"page":1,"perPage":10,"serie_id":id,"season_number":season_number},"query":"query listEpisodesPagination($page: Int!, $serie_id: MongoID!, $season_number: Float!, $perPage: Int!) {\n  paginationEpisode(\n    page: $page\n    perPage: $perPage\n    sort: NUMBER_ASC\n    filter: {type_serie: \"dorama\", serie_id: $serie_id, season_number: $season_number}\n  ) {\n    count\n    items {\n      _id\n      name\n      still_path\n      episode_number\n      season_number\n      air_date\n      slug\n      serie_id\n      links_online\n      season_poster\n      serie_poster\n      poster\n      backdrop\n      __typename\n    }\n    pageInfo {\n      hasNextPage\n      __typename\n    }\n    __typename\n  }\n}\n"}}
        ));
        const chapters = [];
        for (let i = 0; i < episodes.data.paginationEpisode.items.length; i++) {
           if(episodes.data.paginationEpisode.items[i].links_online.length == 0) continue;
            chapters.push(this.getChapter(episodes.data.paginationEpisode.items[i]));
        }
        let currentPage = 1
        while(episodes.data.paginationEpisode.pageInfo.hasNextPage){
          currentPage++;
          episodes = JSON.parse(await window.fPost("https://sv5.fluxcedene.net/api/gql", 
            {"content-type": "application/json"},
            {"RAW_GEAN": {"operationName":"listEpisodesPagination","variables":{"page":currentPage,"perPage":10,"serie_id":id,"season_number":season_number},"query":"query listEpisodesPagination($page: Int!, $serie_id: MongoID!, $season_number: Float!, $perPage: Int!) {\n  paginationEpisode(\n    page: $page\n    perPage: $perPage\n    sort: NUMBER_ASC\n    filter: {type_serie: \"dorama\", serie_id: $serie_id, season_number: $season_number}\n  ) {\n    count\n    items {\n      _id\n      name\n      still_path\n      episode_number\n      season_number\n      air_date\n      slug\n      serie_id\n      links_online\n      season_poster\n      serie_poster\n      poster\n      backdrop\n      __typename\n    }\n    pageInfo {\n      hasNextPage\n      __typename\n    }\n    __typename\n  }\n}\n"}}
          ));
          for (let i = 0; i < episodes.data.paginationEpisode.items.length; i++) {
              if(episodes.data.paginationEpisode.items[i].links_online.length == 0) continue;
              chapters.push(this.getChapter(episodes.data.pagination.items[i]));
          }
        }
        return chapters;
    }

    async getDorama(after, onError, path, page = 0,){
        const result = JSON.parse(await fGet(`https://doramasflix.io/_next/data/HxpZkSJGId8_QDC2gonOI/${window.dec(path)}.json`));
        let sname = result["pageProps"]["dorama"]["name"];
        let info = [];
        info.push(result["pageProps"]["dorama"]["overview"]);
        info.concat(result["pageProps"]["dorama"]["genres"].map((g=>g.name)));
        let image = "https://image.tmdb.org/t/p/w220_and_h330_face/" + result["pageProps"]["dorama"]["poster_path"];

        const seasons = result["pageProps"]["seasons"].map((s)=> s["season_number"]);
        const id = result["pageProps"]["dorama"]["_id"];

        //https://sv5.fluxcedene.net/api/gql
       let chapters = [];
       for(let i = 0; i < seasons.length; i++){
        chapters = chapters.concat(await this.getSeason(seasons[i], id));
       }
       return { "name": sname, "path": this.name + "/getDescription/" + path, "image": image, "items": info, "chapters": chapters }
    }

    async getMovie(after, onError, path, page = 0,){
        const result = JSON.parse(await fGet(`https://doramasflix.io/_next/data/HxpZkSJGId8_QDC2gonOI/${window.dec(path)}.json`));
        let sname = result["pageProps"]["movie"]["name"];
        let info = [];
        info.push(result["pageProps"]["movie"]["overview"]);
        info.concat(result["pageProps"]["movie"]["genres"].map((g=>g.name)));
        let image = "https://image.tmdb.org/t/p/w220_and_h330_face/" + result["pageProps"]["movie"]["poster_path"];
        return { "name": sname, "path": this.name + "/getDescription/" + path, "image": image, "items": info, "chapters": [{ "name": "Ver película", "path": this.name + "/getLinks/" + window.enc("slug:" + result["pageProps"]["movie"]["slug"])}] };
    }
  
    async getDescription(after, onError, path, page = 0,) {
      try {
        const result = JSON.parse(await fGet(`https://doramasflix.io/_next/data/HxpZkSJGId8_QDC2gonOI/${window.dec(path)}.json`));
        if("dorama" in result["pageProps"]){
          after(await this.getDorama(after, onError, path, page));
          return;
        }
        after(await this.getMovie(after, onError, path, page));
      } catch (error) {
        onError(error);
      }
    }
  
    async getParent(after, path) {
    }
    
    async getSearch(after, onError, query) {
      try {
        const result = JSON.parse(await fPost(`https://sv5.fluxcedene.net/api/gql`, 
          {"content-type": "application/json"},
          {"RAW_GEAN": {"operationName":"searchAll","variables":{"input":query},"query":"query searchAll($input: String!) {\n  searchDorama(input: $input, limit: 5) {\n    _id\n    slug\n    name\n    name_es\n    poster_path\n    poster\n    __typename\n  }\n  searchMovie(input: $input, limit: 5) {\n    _id\n    name\n    name_es\n    slug\n    poster_path\n    poster\n    __typename\n  }\n}\n"}}
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
  
    async getLinks(after, onError, path) {
      try {
        const decpath = window.dec(path);
        let data = {};
        if(decpath.startsWith("slug:")){
            let links = JSON.parse(await window.fPost("https://sv5.fluxcedene.net/api/gql", 
              {"content-type": "application/json"},
              {"RAW_GEAN": {"operationName":"GetMovieLinks","variables":{"slug": decpath.split(":")[1],"app":"com.asiapp.doramasgo"},"query":"query GetMovieLinks($id: MongoID, $slug: String, $app: String, $iosapp: String, $externalLink: String) {\n  getMovieLinks(\n    id: $id\n    slug: $slug\n    app: $app\n    iosapp: $iosapp\n    externalLink: $externalLink\n  ) {\n    links_online\n    __typename\n  }\n}\n"}}
            ));
            data = links.data.getMovieLinks;
        }else{
          data = JSON.parse(decpath);
        }
        const links = [];
        for(let i = 0; i < data.links_online.length; i++){
          if("link" in data.links_online[i])  links.push(data.links_online[i].link + "||info_" + data.links_online[i].language_code);
          if("embed" in data.links_online[i]) links.push(data.links_online[i].embed + "||info_" + data.links_online[i].language_code);
        }
        after(links);
      } catch (error) {
        onError(error);
      }
    }
  }
  
  