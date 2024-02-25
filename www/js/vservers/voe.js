export class Voe {
    constructor() {}
    async getDDL(after, onError, web){
            let data = await fGet(web, {"User-Agent":navigator.userAgent});
            let nscript = atob(getFirstMatch(/<script>\s+let .+?'(.+?)'/gm, data)).split('').reverse().join('');            
            let filev = getAllMatches(/file":"(.+?)"/gm, nscript);
            if (filev.length == 1){
                after({"video": filev[0][1]});
                return
            }
            if (filev.length > 0) {        
                let videos = {};
                for (let i = 0; i < filev.length; i++) {
                    videos["streams " + i] = filev[i][1];
                }
                videos["video"] = filev[filev.length - 1][2];
                after(videos);
            }else{
                onError("can't find video");
            }
        }
        
    }