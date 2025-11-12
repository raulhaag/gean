import { Hglink } from "./hglink.js";

export class StreamWish {
    constructor() {}
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
                }else{
                    new Hglink().getDDL(after, onError, web);
                }
            }
        }catch(error){
            onError(error);
        }
    }
}
