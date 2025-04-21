export class VidHidepro {
    constructor() {}
    async getDDL(after, onError, web){
        try{
            let data = await fGet(web);
            let pf = eval(getFirstMatch(/eval([\s\S]+?)<\/script>/gm, data));
            let jsonData = JSON.parse(getFirstMatch(/links=({.+?});/gm, pf));
            for(key in jsonData){
                after({video: jsonData[key]});
                return
            }
        }catch(e){
            onError(e);
        }
    }
}