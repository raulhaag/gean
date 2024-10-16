export class VidHidepro {
    constructor() {}
    async getDDL(after, onError, web){
        try{
            let data = await fGet(web);
            let pf = eval(getFirstMatch(/eval([\s\S]+?)<\/script>/gm, data));
            let dlink = getFirstMatch(/file:"(.+?)"/gm, pf);
            after({video: dlink});
        }catch(e){
            onError(e);
        }
    }
}