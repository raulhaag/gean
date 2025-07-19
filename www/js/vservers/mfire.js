export class Mediafire {
    constructor() {}
    async getDDL(after, onError, web){
        try{
            let data = await fGet(web);
            //let dlink = getFirstMatch(/Download file\"\s+href=\"(.+?)\"/gm, data);
            let dlink = window.dec(getFirstMatch(/data-scrambled-url="([^"]+)/gm, data));
            after({video: dlink});
            // then recaptcha f***
        }catch(e){
            onError(e);
        }
    }
}