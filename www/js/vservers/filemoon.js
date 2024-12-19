export class FileMoon {
    constructor() {}
    async getDDL(after, onError, web){
        try{
            let content = await fGet(web);
            var match = getFirstMatch(/iframe src="(.+?)"/gm, content)
            if(match){                    
                var newWeb = URL.parse(match)
                let content2 = await fGet(match, 
                    {
                        "User-Agent": window.navigator.userAgent,
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                        "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
                        "Sec-Fetch-Dest": "iframe",
                    });
                match = getFirstMatch(/(eval\(function\(p,a,c,k,e,d\)[\S\s]+?\.split\('\|'\)\)\))/gm, content2);
                if (match) {

                    var funcionDesofuscada = match.replace('eval', 'return');
                    var desofuscado = new Function(funcionDesofuscada);
                    var data = desofuscado();
                    var dlink = getFirstMatch(/file:"(.+?)"/gm, data);
                    after({video:dlink}) //No funciona con localhost !!!!
                    /*after({video:  window.serverHost + "m3u8/" + enc(dlink) + "/" + enc(JSON.stringify(
                        {   "Referer": newWeb.protocol + "//" + newWeb.host + "/",
                            "Origin": newWeb.protocol + "//" + newWeb.host + "/",
                            "User-Agent": window.navigator.userAgent,
                            "Accept": "* /*",
                            "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
                            "Sec-Fetch-Dest": "empty",
                            "Sec-Fetch-Mode": "cors",
                            "Sec-Fetch-Site": "same-origin"})) + "/maskfile.m3u8"})*/
                    return
                }
            }//from here if rollback
            match = getFirstMatch(/(eval\(function\(p,a,c,k,e,d\)[\S\s]+?\.split\('\|'\)\)\))/gm, content);
            if (match) {
                var funcionDesofuscada = match.replace('eval', 'return');
                var desofuscado = new Function(funcionDesofuscada);
                var data = desofuscado();
                var dlink = getFirstMatch(/file:"(.+?)"/gm, data);
                after({"video":dlink});
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