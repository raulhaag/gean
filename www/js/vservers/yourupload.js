export class YourUpload {
    constructor() {}
    async getDDL(after, onError, web) {
        let headers = { Referer: "https://www.yourupload.com"};
        let result = await fGet(web, headers);
        let file1 = [...result.matchAll(/href="(\/download\?file=[^"]+)/gm)][0][1];
        result = await fGet("https://www.yourupload.com" + file1, headers);
        let file2 = [...result.matchAll(/"(\/download[^"]+)"/gm)][0][1].replace(/&amp;/g, '&');
        result = await fRGet("https://www.yourupload.com" + file2, headers);
        console.log(result);
    }
}