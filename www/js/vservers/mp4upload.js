import { VideoServer } from "./videoserver.js";
export class Mp4Upload extends VideoServer {
    constructor() {
      super();
    }
    name(){
        return "Mp4Upload";
    }
    async getDDL(after, onError, web){
        try{
            let data = await fGet(web, {"User-Agent": window.navigator.userAgent});
            let dlink = getFirstMatch(/src:\s*\"(.+?)\"/gm, data);
            if(dlink){
                after({video: window.serverHost + "file/" + enc(dlink) + "/" + enc(JSON.stringify({"Referer": web}))});
                return;
            }else{
                onError("Video no encontrado");
                return;
            }
        }catch(e){
            onError(e);
        }
    }
    can(www){
        if(www.indexOf("mp4upload.com") == -1){
            return false;
        }
        return true;
    }
}