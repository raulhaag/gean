import { VideoServer } from "./videoserver.js";
export class FileLions extends VideoServer {
    constructor() {
      super();
    }
    name(){
        return "FileLions";
    }
    async getDDL(after, onError, web){
        try{
            let content = await fGet(web);
            var data = window.__unpack(content);
            if (data) {
                var dlink = JSON.parse(getFirstMatch(/var links\s*=\s*(.+?})/gm, data));//getFirstMatch(/file:"(.+?)"/gm, data);
                for(const key in dlink){
                    if(dlink[key].indexOf("http") != -1){
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
                    onError("No se encontro el enlace");
                    return;
                }
            }
        }catch(error){
            onError(error);
        }
    }
    can(www){
        if(www.indexOf("filelions.") == -1){
            return false;
        }
        return true;
    }
}