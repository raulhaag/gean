export class VidHidepro {
    constructor() {}
    async getDDL(after, onError, web){
        try{
            let data = await fGet(web);
            let dlink = getFirstMatch(/file:"(.+?)"/gm, data);
            after({video: dlink});
        }catch(e){
            onError(e);
        }
    }
}