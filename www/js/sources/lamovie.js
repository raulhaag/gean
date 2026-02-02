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
        const genres = {"Drama":"17", "Comedia":"18", "Suspense":"33", "Acción":"32", "Animación":"520", "Terror":"96", "Aventura":"130", "Crimen":"180", "Romance":"115", "Familia":"398", "Misterio":"97", "Fantasía":"229", "Ciencia ficción":"131", "Sci-Fi &amp; Fantasy":"704", "Action &amp; Adventure":"705", "Historia":"165", "Documental":"164", "Música":"8", "Bélica":"3056", "Pelécula de TV":"6787", "Western":"674", "War &amp; Politics":"786", "Kids":"703", "Reality":"12485", "Soap":"19824"}
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
        mvs.push({
            "name": "Ver más películas",
            "image": "./images/next_nav.png",
            "path": this.name + "/getMore/" + window.enc(`${this.apiUrl}listing/movies?filter=%7B%7D&page=2&orderBy=latest&order=DESC&postType=movies&postsPerPage=24`)
        });
        ser.push({
            "name": "Ver más series",
            "image": "./images/next_nav.png",
                "path": this.name + "/getMore/" + window.enc(`${this.apiUrl}listing/tvshows?filter=&page=2&orderBy=latest&order=DESC&postType=tvshows&postsPerPage=24`)
        });
        ans.push({
            "name": "Ver más animes",
            "image": "./images/next_nav.png",
            "path": this.name + "/getMore/" + window.enc(`${this.apiUrl}listing/animes?filter=%7B%7D&page=2&orderBy=latest&order=DESC&postType=animes&postsPerPage=24`)
        });

        const keys = Object.keys(genres);
        const ansbygenre = [];
        for(let i = 0; i < keys.length; i++){
            ansbygenre.push({
                "name": keys[i],//{"genres"%3A[8]}
                "path": this.name + "/getMore/" + window.enc(`${this.apiUrl}listing/animes?filter=%7B%22genres%22%3A%5B${genres[keys[i]]}%5D%7D&page=1&orderBy=latest&order=DESC&postType=animes&postsPerPage=24`)
            })
        }

        const mvbygenre = [];
        for(let i = 0; i < keys.length; i++){
            mvbygenre.push({
                "name": keys[i],//{"genres"%3A[8]}
                "path": this.name + "/getMore/" + window.enc(`${this.apiUrl}listing/movies?filter=%7B%22genres%22%3A%5B${genres[keys[i]]}%5D%7D&page=1&orderBy=latest&order=DESC&postType=movies&postsPerPage=24`)
            })
        }

        const serbygenre = [];
        for(let i = 0; i < keys.length; i++){
            serbygenre.push({
                "name": keys[i],
                "path": this.name + "/getMore/" + window.enc(`${this.apiUrl}listing/tvshows?filter=%7B%22genres%22%3A%5B${genres[keys[i]]}%5D%7&page=1&orderBy=latest&order=DESC&postType=tvshows&postsPerPage=24`)
            })
        }


        after({
            "Últimas Películas": mvs,
            "Últimas Series": ser,
            "Últimos animes": ans,
            "Películas por género": mvbygenre,
            "Series por género": serbygenre,
            "Animes por género": ansbygenre
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
                after({ "name": itemdata.name, "path": this.name + "/getDescription/" + path, "image": itemdata.image, 
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
                after({ "name": itemdata.name, "path": this.name + "/getDescription/" + path, "image": itemdata.image, 
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
            /* al parecer son comprimidos por lo que no nos sirve
            for(let i = 0; i < response.data.downloads.length; i++){
                links.push(response.data.downloads[i].url + "||info_" + response.data.downloads[i].lang);
            } */
            after(links);
        } catch (error) {
            onError(error.toString());
        }
    }

    async getMore(after, onError, more, title = "") {
        let web = window.dec(more);
        if (web === "Homepage") {
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
        try {
            let jsondata = JSON.parse(await window.fGet(web));
            let items = this.getSeries(jsondata, onError);
            
            if(jsondata.data && jsondata.data.pagination){
                let page = parseInt(jsondata.data.pagination.current_page);
                let total = parseInt(jsondata.data.pagination.last_page);
                let urlObj = new URL(web);
                
                if(page > 1){
                     urlObj.searchParams.set("page", page - 1);
                     preLinks.push({
                        "name": "Pagina Anterior", 
                        "image": "./images/prev_nav.png", 
                        "path": this.name + "/getMore/" + window.enc(urlObj.toString())
                    }); 
                }
                if(page < total){
                    urlObj.searchParams.set("page", page + 1);
                    posLinks.push({
                        "name": "Pagina siguiente", 
                        "image": "./images/next_nav.png", 
                        "path": this.name + "/getMore/" + window.enc(urlObj.toString())
                    });
                }
            }
            
            after({
                [title]: preLinks.concat(items, posLinks),
            });
        } catch (error) {
            onError(error.toString());
        }
    }
}