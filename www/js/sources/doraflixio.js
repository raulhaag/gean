import { SourceBase } from "../sourcebase.js";
export class DoraFlixIO extends SourceBase {
    constructor() {
      super();
      this.name = "DoraFlixIO";
      this.host = atob("aHR0cHM6Ly9kb3JhbWFzZmxpeC5pby8=");//
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
          "name": movi["data"]["paginationMovie"]["items"][i]["name"],
          "image": "https://image.tmdb.org/t/p/w220_and_h330_face/" + movi["data"]["paginationMovie"]["items"][i]["poster_path"],
          "path": this.name + "/getDescription/" +  window.enc(basepath + "/" + movi["data"]["paginationMovie"]["items"][i]["slug"])
        });
      }

      after({
        "Doramas": ncs,
        "Películas": movies
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
        let sname = result["pageProps"]["dorama"]["name"];
        let info = [];
        info.push(result["pageProps"]["dorama"]["overview"]);
        info.concat(result["pageProps"]["dorama"]["genres"].map((g=>g.name)));
        let image = "https://image.tmdb.org/t/p/w220_and_h330_face/" + result["pageProps"]["dorama"]["poster_path"];

        const seasons = result["pageProps"]["seasons"].map((s)=> s["season_number"]);
        const id = result["pageProps"]["dorama"]["_id"];

    }
  
    async getDescription(after, onError, path, page = 0,) {
      try {
        const result = JSON.parse(await fGet(`https://doramasflix.io/_next/data/HxpZkSJGId8_QDC2gonOI/${window.dec(path)}.json`));
        if("dorama" in result["pageProps"]){
          after(await this.getDorama(after, onError, path, page));
          return;
        }
        after(await this.getMovie(after, onError, path, page));
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

        after();
      } catch (error) {
        onError(error);
      }
    }
  
    async getParent(after, path) {
    }
    
    async getSearch(after, onError, query) {
    }
  
    async getLinks(after, onError, path) {
      try {
        const data = JSON.parse(window.dec(path));
        const links = [];
        for(let i = 0; i < data.links_online.length; i++){
          links.push(data.links_online[i].link + "||info_" + data.links_online[i].language_code);
        }
        after(links);
      } catch (error) {
        onError(error);
      }
    }
  }
  
  