export class FileLions{
    constructor() {}
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
                }else{
                    onError("No se encontro el enlace");
                }
            }

        }catch(error){
            onError(error);
        }
    }
}