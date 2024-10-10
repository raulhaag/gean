export class FileMoon {
    constructor() {}
    async getDDL(after, onError, web){
        try{
            let content = await fGet(web);
            var match = getFirstMatch(/iframe src="(.+?)"/gm, content)
            if(match){
                let content2 = await fGet(match);
                console.log(content2)
                match = getFirstMatch(/(eval\(function\(p,a,c,k,e,d\)[\S\s]+?\.split\('\|'\)\)\))/gm, content2);
                if (match) {
                    var funcionDesofuscada = match.replace('eval', 'return');
                    var desofuscado = new Function(funcionDesofuscada);
                    var data = desofuscado();
                    var dlink = getFirstMatch(/file:"(.+?)"/gm, data);
                    after({"video":dlink});
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