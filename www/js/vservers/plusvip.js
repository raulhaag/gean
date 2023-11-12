export class Plusvip {
    constructor() {}
    async getDDL(after, onError, web){
        try{
            var link = web.split("data=")[1]; 
            var data = await fGet(web, {"User-Agent": navigator.userAgent});
            var parser = new DOMParser();
            var doc = parser.parseFromString(data, "text/html");
            var u = JSON.parse(doc.getElementById("cuca").text);
            var R = CryptoJS.enc.Utf8.parse('d41d8cd98f00b204e9800998ecf8427e');
            var N = CryptoJS.AES.decrypt(u, R, { mode: CryptoJS.mode.ECB });
            var web2 = "https://plusvip.net" + N.toString(CryptoJS.enc.Utf8);
            var webC1 = await fPost(web2, {"User-Agent":navigator.userAgent}, {"link":link});
            after({video: JSON.parse(webC1).link});
        }catch(error){
            onError(error);
        }
    }
}