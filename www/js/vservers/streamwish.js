import { Hglink } from "./hglink.js";
import { VideoServer } from "./videoserver.js";

export class StreamWish extends VideoServer {
    constructor() {
      super();
    }
    name(){
        return "StreamWish";
    }
    async getDDL(after, onError, web){
        try{
            let content = await fGet(web);
            var data = window.__unpack(content);
            if (data) {
                var dlink = JSON.parse(getFirstMatch(/var links\s*=\s*(.+?})/gm, data));//getFirstMatch(/file:"(.+?)"/gm, data);
                for(const key in dlink){
                    if((dlink[key].indexOf("http") != -1) && (dlink[key].indexOf(".m3u8") != -1)){
                        after({"video":dlink[key]});
                        return;
                    }
                }
            }else{
                let dlink = getFirstMatch(/file:"(.+?)"/gm, content);
                if(dlink != ""){
                    after({"video": dlink});
                    return;
                }else{
                    new Hglink().getDDL(after, onError, web);
                }
            }
        }catch(error){
            onError(error);
        }
    }
    can(www){
        if ((www.indexOf("wish") != -1) || www.indexOf("ghbrisk.com") != -1) return true;
        return true;
    }
}
