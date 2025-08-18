export class Hglink {
    constructor() {}
    async getDDL(after, onError, web){
        try{
            const main = [
                'kravaxxa.com',
                'davioad.com',
                'haxloppd.com',
                'tryzendm.com',
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
            var match = getFirstMatch(/(eval\(function\(p,a,c,k,e,d\)[\S\s]+?\.split\('\|'\)\)\))/gm, content);
            if (match) {
                var funcionDesofuscada = match.replace('eval', 'return');
                var desofuscado = new Function(funcionDesofuscada);
                var data = desofuscado();
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
