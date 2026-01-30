export class LaMovie {
    constructor() {
        this.name = "lamovie";
        this.baseUrl = "https://la.movie";
        this.apiUrl = "https://la.movie/wp-api/v1/";
        this.imageBaseUrl = "https://la.movie/wp-content/uploads";
    }
    
    getSeries = (jsondata, onError = console.log) => {
        let items = [];
        try{
            for(let i = 0; i < jsondata.data.posts.length; i++){
                const post = jsondata.data.posts[i];
                let item = {                
                    'name': post.title,
                    'image': this.imageBaseUrl + post.images.poster,
                    "resume": post.overview,
                    'kind': post.type,
                    'id': post._id
                };
                try{
                item.path= this.name + "/getDescription/" + window.enc(JSON.stringify(item).replace(/[^\x20-\x7E]/g, ""));
                items.push(item);
                }catch(e){
                    console.log(e);
                }
            }
        }catch(e){
            onError(e);
        }
        return items;
    }

    async getFrontPage(after, onError) {
        let mvs = [], ser = [], ans = [];
        try {
            let jsondata = JSON.parse(await window.fGet(`${this.apiUrl}listing/movies?filter=%7B%7D&page=1&orderBy=latest&order=DESC&postType=movies&postsPerPage=12`))
            mvs = this.getSeries(jsondata);
        } catch (error) {
            console.log(error.toString());
        }
        try {
            let jsondata = JSON.parse(await window.fGet(`${this.apiUrl}listing/tvshows?filter=&page=1&orderBy=latest&order=DESC&postType=tvshows&postsPerPage=12`))
            ser = this.getSeries(jsondata);
        } catch (error) {
            console.log(error.toString());
        }
        try {
            let jsondata = JSON.parse(await window.fGet(`${this.apiUrl}listing/animes?filter=%7B%7D&page=1&orderBy=latest&order=DESC&postType=animes&postsPerPage=12`))
            ans = this.getSeries(jsondata);
        } catch (error) {
            console.log(error.toString());
        }
        if((mvs.length + ser.length + ans.length) == 0){
            onError("No series found");
            return;
        }
         after({
        "Últimas Películas": mvs,
        "Últimas Series": ser,
        "Últimos animes": ans
      });
    }

    async getSearch(after, onError, query) {
        try {
            const data = JSON.parse(await window.fGet(`${this.apiUrl}search?filter={}&postType=any&q=${encodeURI(query)}&postsPerPage=26`));
            after(this.getSeries(data, "others"));
        } catch (error) {
            onError(error.toString());
        }
    }

    async getDescription(after, onError, path) {
        try {
            let itemdata = JSON.parse(window.dec(path));
            if(itemdata.kind == "movies"){    
                after({ "name": itemdata.name, "path": itemdata.path, "image": itemdata.image, 
                    "items": [itemdata.resume], "chapters": [{ "name": "Ver película", 
                    "path": this.name + "/getLinks/" + window.enc("m_" + itemdata.id)}] });
            }else{
                let data = JSON.parse(await window.fGet(`${this.apiUrl}single/episodes/list?_id=${itemdata.id}&season=1&page=1&postsPerPage=15`));
                if (data.error != false) {
                    onError(`Error: ${data.message}`);
                    return;
                }
                const chapters = [];
                if(data.data.seasons.length == 1){
                    for (let i = 0; i < data.data.pagination.total; i++) {
                        chapters.push({"name": "Capítulo " + (i + 1), "path": this.name + "/getLinks/" + window.enc(itemdata.id + "_1_" + i)});
                    }
                }else{
                    data.data.seasons.sort((a, b) => a - b);
                    const seasons = data.data.seasons;
                    for (let i = 0; i < data.data.pagination.total; i++) {
                        chapters.push({"name": "Temp 1 Capítulo " + (i + 1), "path": this.name + "/getLinks/" + window.enc(itemdata.id + "_1_" + i)});
                    }
                    for (let i = 1; i < seasons.length; i++) {
                        data = JSON.parse(await window.fGet(`${this.apiUrl}single/episodes/list?_id=${itemdata.id}&season=${data.data.seasons[i]}&page=1&postsPerPage=15`));
                        for (let j = 0; j < data.data.pagination.total; j++) {
                            chapters.push({"name": "Temp "+ seasons[i] + " Capítulo " + (j + 1), "path": this.name + "/getLinks/" + window.enc(itemdata.id + "_" + seasons[i] + "_" + j)});
                        }
                    }
                }
                after({ "name": itemdata.name, "path": itemdata.path, "image": itemdata.image, 
                    "items": [itemdata.resume], "chapters": chapters});
            }

        } catch (error) {
            onError(error.toString());
        }
    }

    async adquire_chapter_id(sid, season, cidx, onError){
        const page = Math.floor(parseInt(cidx) / 15); 
        const indexAtPage = parseInt(cidx) - (page * 15);
        const data = JSON.parse(await window.fGet(`${this.apiUrl}single/episodes/list?_id=${sid}&season=${season}&page=${page + 1}&postsPerPage=15`));
        return data.data.posts[indexAtPage]._id;
    }

    async getLinks(after, onError, path) {
        let id = null;
        let dpath = window.dec(path).split("_");
        if(dpath[0] == "m"){
            id = dpath[1];
        }else{
            id = await this.adquire_chapter_id(dpath[0], dpath[1], dpath[2], onError);
        }

        try {
            let response = JSON.parse(await window.fGet(`https://la.movie/wp-api/v1/player?postId=${id}&demo=0`));
            if (response.message != 'ok') {
                onError(`Error: ${response.message}`);
                return;
            }
            const links = [];
            for(let i = 0; i < response.data.embeds.length; i++){
                links.push(response.data.embeds[i].url + "||info_" + response.data.embeds[i].lang);
            }
            for(let i = 0; i < response.data.downloads.length; i++){
                links.push(response.data.downloads[i].url + "||info_" + response.data.downloads[i].lang);
            }
            after(links);
        } catch (error) {
            onError(error.toString());
        }
    }

    async getMore(after, onError, more, title = "") {
        // The API doesn't seem to support pagination in a standard way.
        // This function could be implemented if pagination details are found.
        onError("Pagination not supported for this source.");
    }
}