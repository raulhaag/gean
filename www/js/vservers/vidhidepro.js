export class VidHidepro {
    constructor() {}
    async getDDL(after, onError, web){
        try{
            let data = await fGet(web);
            let pf = eval(getFirstMatch(/eval([\s\S]+?)<\/script>/gm, data));
            let jsonData = JSON.parse(getFirstMatch(/links=\s*?({[\s\S]+?});/gm, pf));
            for(const key in Object.keys(jsonData)){
                after({video: jsonData[Object.keys(jsonData)[key]]});
                return
            }
        }catch(e){
            onError(e);
        }
    }
}