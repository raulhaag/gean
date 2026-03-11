import { VideoServer } from "./videoserver.js";
export class Uqload extends VideoServer{
    constructor() {
        super();
    }
    name(){
        return "Uqload";
    }
    async getDDL(after, onError, web) {
        try{
            const urlw = new URL(web);
            let headers = { "User-Agent": window.navigator.userAgent};
            let result = await fGet(web, headers);
            let videos = [];
            let m3 = getFirstMatch(/sources: \["([^"]+)/gm, result);
            //videos["video"] = "https:" + m3;
            if(m3){
                videos["video"] = window.serverHost + "file/" + enc(m3) + "/" + enc(JSON.stringify({"Referer": urlw.protocol + "//" +urlw.hostname, "User-Agent": window.navigator.userAgent}));
                after(videos);
                return;
            }else{
                onError("Uqload: video no encontrado")
            }
        }catch(e){
            onError(e);
        }
    }
    can(www){
        if(www.indexOf("uqload") != -1){
            return true;
        }
        return false;
    }

}