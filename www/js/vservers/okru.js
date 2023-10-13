export class OkRu{
    constructor() {}
    async getDDL(after, onError, web) {
        let headers = { "User-Agent": window.navigator.userAgent};
        let result = await fGet(web, headers);
        result = result.replace(/\\&quot;/g, "'").replace(/%3B/g, ";").replace(/\\\\u0026/g, "&");
        let filev = getAllMatches(/{'name':'([^']+)','url':'([^']+)'/gm, result);
        if (filev.length > 0) {        
            let videos = {};
            for (let i = 0; i < filev.length; i++) {
                videos[filev[i][1]] = filev[i][2];
            }
            videos["video"] = filev[filev.length - 1][2];
            after(videos);
        }else{
            onError("can't find video");
        }
    }
}