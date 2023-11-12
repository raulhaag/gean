export class Voe {
    constructor() {}
    async getDDL(after, onError, web){
            let data = await fGet(web, {"User-Agent":navigator.userAgent});
            let dlink = getFirstMatch(/sources [^\{]+{([^}]+)/gm, data);
            after({video: dlink});
        }
    }