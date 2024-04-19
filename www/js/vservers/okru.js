export class OkRu{
    constructor() {}
    async getDDL(after, onError, web) {
        try{        
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
                return
            }else{
                let data = getFirstMatch(/data-video="({.+?})"/gm, result);
                let jsd = JSON.parse(data.replace(/&quot;/g, "\"").replace(/%3B/g, ";").replace(/\\u0026/g, "&"));   
                if(jsd.videoSrc){
                    after({"video": window.serverHost + "m3u8/" + enc(jsd.videoSrc) + "/" + enc(JSON.stringify(
                        {   "Referer": web, 
                            "Sec-Fetch-Mode": "cors",
                            "Sec-Fetch-Site": "same-origin"})) + "/maskfile.m3u8"});
                    return;
                }        
            }
        }catch(e){
            //ignore
        }      
        onError(`can't find video (${web})` );
    }
}