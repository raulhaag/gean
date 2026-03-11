
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
            const result = await fGet(web, headers);
            const res = window.__unpack(result);
            const dlink = getFirstMatch(/file:"(.+?)"/gm, res);
            after({"video": dlink});
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