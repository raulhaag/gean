import { VideoServer } from "./videoserver.js";
export class Hglink extends VideoServer {
    constructor() {
      super();
    }
    name(){
        return "StreamWish";
    }
    async getDDL(after, onError, web){
        try{
            const main = [
                'kravaxxa.com',
                'davioad.com',
                'haxloppd.com',
                'auvexiug.com',
                'dumbalag.com',
            ];
            const rules = [
                'dhcplay.com',
                'hglink.to',
                'test.hglink.to',
                'wish-redirect.aiavh.com',
            ];
            const url = new URL(web);
            const destination = main[Math.floor(Math.random() * main.length)];
            const finalURL = 'https://' + destination + url.pathname + url.search
            const content = await fGet(finalURL, {referer: 'https://' + url.hostname});
            const res = window.__unpack(content);
            if (res) {
                var dlink = JSON.parse(getFirstMatch(/var links\s*=\s*(.+?})/gm, res));
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
                    onError("No se encontro el enlace");
                    return;
                }
            }
        }catch(error){
            onError(error);
        }
    }
    can(www){
        const locations = [
                'kravaxxa.com',
                'davioad.com',
                'haxloppd.com',
                'auvexiug.com',
                'dumbalag.com',
                'dhcplay.com',
                'hglink.to',
                'test.hglink.to',
                'wish-redirect.aiavh.com',
                'hglink'];
        for (let i = 0; i < locations.length; i++) {
            if(www.indexOf(locations[i]) != -1){
                return true;
            }
        }
        return false;
    }
}
