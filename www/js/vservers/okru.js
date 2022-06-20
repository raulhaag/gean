export class OkRu{
    constructor() {}
    async getDDL(after, onError, web) {
        let headers = { "User-Agent": window.navigator.userAgent};
        let result = await fGet(web, headers);
        result = result.replace(/\\&quot;/g, "'").replace(/%3B/g, ";").replace(/\\\\u0026/g, "&");
        let filev = getAllMatches(/{'name':'([^']+)','url':'([^']+)'/gm, result);
        if (filev.length > 0) {
            after({"video": filev[filev.length - 1][2]});
        }else{
            onError("can't find video");
        }
    }

}