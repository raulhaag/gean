export class FileMoon {
    constructor() {}
    async getDDL(after, onError, web){
        try{
            let content = await fGet(web);
            var match = getFirstMatch(/(eval\(function\(p,a,c,k,e,d\)[\S\s]+?\.split\('\|'\)\)\))/gm, content);
            if (match) {
                var funcionDesofuscada = match.replace('eval', 'return');
                var desofuscado = new Function(funcionDesofuscada);
                var data = desofuscado();
                var dlink = getFirstMatch(/file:"(.+?)"/gm, data);
                after({"video":dlink});
            } 
        }catch(error){
            onError(error);
        }
    }
}