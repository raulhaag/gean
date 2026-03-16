import { VideoServer } from "./videoserver.js";

export  class  GoodStream extends VideoServer{
    constructor(){
        super();
    };    
    name(){
        return "GoodStream";
    };

    async getDDL(after, onError, url){
        try{
            let data = await window.fGet(url,{"Accept-Language": "es-AR,es;q=0.9,en-US;q=0.8,en;q=0.7","User-Agent": window.navigator.userAgent});
            let dlink = window.getFirstMatch(/file:"(.+?)"/gm, data);
            if(dlink != ""){
                after({"video": window.serverHost + "m3u8/" + enc(dlink) + "/" + enc(JSON.stringify({
                    "Accept-Language": "es-AR,es;q=0.9,en-US;q=0.8,en;q=0.7",
                    "User-Agent": window.navigator.userAgent,
                })) + "/maskfile.m3u8" });
                return;
            }else{
                onError("No se encontro el enlace");
                return;
            }
        }catch(e){
            onError(e);
        }
    };
    can(url){
        if(url.indexOf("goodstream.") == -1){
            return false;
        }
        return true;
    };
}   