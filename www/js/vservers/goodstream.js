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
            let data = await window.fGet(url);
            let dlink = window.getFirstMatch(/file:"(.+?)"/gm, data);
            if(dlink != ""){
                after({"video": window.serverHost + "m3u8/" + enc(dlink) + "/" + enc(JSON.stringify({
                    "Referer": url,
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    "origin": new URL(url).origin
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