export class Mp4Upload {
    constructor() {}
    async getDDL(after, onError, web){
        try{
            let data = await fGet(web, {"User-Agent": window.navigator.userAgent});
            let dlink = getFirstMatch(/src:\s*\"(.+?)\"/gm, data);
            if(dlink){
                after({video: dlink});
            }else{
                onError("Video no encontrado");
            }
        }catch(e){
            onError(e);
        }
    }
}