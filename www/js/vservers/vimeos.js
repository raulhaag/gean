
import { VideoServer } from "./videoserver.js";
export class Vimeos extends VideoServer {
    constructor() {
      super();
    }
    name(){
        return "Vimeos";
    }
    async getDDL(after, onError, web) {
        try{
            const urlw = new URL(web);
            const headers = { "User-Agent": window.navigator.userAgent};
            const result = await window.fGet(web, headers);
            const res = window.__unpack(result);
            const dlink = window.getFirstMatch(/file:"(.+?)"/gm, res);
            after({"video": window.serverHost + "m3u8/" + window.enc(dlink) + "/" + window.enc(JSON.stringify({"User-Agent": window.navigator.userAgent, "Referer": urlw.protocol + "//" +urlw.hostname, "origin": urlw.origin}))  + "/maskfile.m3u8", "direct": dlink, "proxy": window.serverHost + "m3u8/" + window.enc(dlink) + "/" + window.enc(JSON.stringify({"User-Agent": window.navigator.userAgent, "Referer": urlw.protocol + "//" +urlw.hostname, "origin": urlw.origin}))  + "/maskfile.m3u8"});
        }catch(e){
            onError(e);
        }
    }
    can(www){
        if(www.indexOf("vimeos") != -1){
            return true;
        }
        return false;
    }
}