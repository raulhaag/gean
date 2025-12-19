export class Mediafire {
    constructor() {}
    async getDDL(after, onError, web){
        try{
            let data = await fGet(web);
            let dlink = window.getFirstMatch(/Download file\"\s+href=\"(.+?)\"/gm, data);
            //let dlink = window.dec(getFirstMatch(/data-scrambled-url="([^"]+)/gm, data));
            if (dlink != "") {
                after({video: dlink});
                return;
            }
            // then recaptcha f***
        }catch(e){
            onError(e);
        }
        onError("No se encontro el enlace");
        return;
    }
}