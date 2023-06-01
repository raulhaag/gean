export class Plusvip {
    constructor() {}
    async getDDL(after, onError, web){
            let data = await fGet(web);
            let dlink = "https://plusvip.net/" +  getFirstMatch(/file["|']\s*:\s*["|'](.+?)["|']/gm , data);
            after({video: dlink});
        }
    }