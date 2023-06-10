export class Plusvip {
    constructor() {}
    async getDDL(after, onError, web){
            let data = await fGet(web);
            let pdata  = getFirstMatch(/moe\?data=([\w|\+]+)/gm, web).replace("+", " ")
            let ppath = getFirstMatch(/'(\/sources\/.+?)'/gm, data)
            let dlink = await fPost("https://plusvip.net" + ppath, {}, {link: pdata});
            after({video: JSON.parse(dlink).link});
        }
    }