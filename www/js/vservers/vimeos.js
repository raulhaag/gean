
export class Vimeos{
    constructor() {}
    async getDDL(after, onError, web) {
        try{
            const urlw = new URL(web);
            const headers = { "User-Agent": window.navigator.userAgent};
            const result = await fGet(web, headers);
            const res = window.__unpack(result);
            const dlink = getFirstMatch(/file:"(.+?)"/gm, res);
            after({"video": dlink});
        }catch(e){
            onError(e);
        }
    }
}