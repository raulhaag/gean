export class Voe {
    constructor() {}
    async getDDL(after, onError, web){
            try{
                let data = await fGet(web, {"User-Agent":navigator.userAgent});
                let dlink = getFirstMatch(/sources [^\{]+{([^}]+)/gm, data);
                if(dlink == ''){
                    let nlink = getFirstMatch(/href = '(ht.+?)'/gm, data);
                    data = await fGet(nlink, {"User-Agent":navigator.userAgent, "Referer": web});
                    dlink = getFirstMatch(/sources [^\{]+{([^}]+)/gm, data);
                }

                let filev = getAllMatches(/['"]([^'"]+?)["']\s*:\s*['"]([^'"]+?)["']/gm, dlink);
                if (filev.length == 1){
                    
                    after({"video":  atob(filev[0][2])});
                    return;
                }
                if (filev.length > 0) {        
                    let videos = {};
                    for (let i = 0; i < filev.length; i++) {
                        videos[filev[i][1]] = atob(filev[i][2]);
                    }
                    videos["video"] = atob(filev[filev.length - 1][2]);
                    after(videos);
                }else{
                    onError("can't find video");
                }
            }catch(e){
                onError(e);
            }
        }
        
    }