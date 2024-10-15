export class Mp4Upload {
    constructor() {}
    async getDDL(after, onError, web){
        try{
            let data = await fGet(web, {"User-Agent": window.navigator.userAgent});
            let dlink = getFirstMatch(/src:\s*\"(.+?)\"/gm, data);
            if(dlink){
                after({video: window.serverHost + "file/" + enc(dlink) + "/" + enc(JSON.stringify({"Referer": web}))});
            }else{
                onError("Video no encontrado");
            }
        }catch(e){
            onError(e);
        }
    }
}