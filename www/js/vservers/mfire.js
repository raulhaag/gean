export class Mediafire {
    constructor() {}
    async getDDL(after, onError, web){
        try{
            let data = await fGet(web);
            let dlink = getFirstMatch(/Download file\"\s+href=\"(.+?)\"/gm, data);
            after({video: dlink});
            // then recaptcha f***
        }catch(e){
            onError(e);
        }
    }
}