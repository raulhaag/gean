export class Hglink {
    constructor() {}
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
}
