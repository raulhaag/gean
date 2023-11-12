export class Plusvip {
    constructor() {}
    async getDDL(after, onError, web){
        try{
            var link = web.split("data=")[1]; 
            var data = await fGet(web);
            var parser = new DOMParser();
            var doc = parser.parseFromString(data, "text/html");
            var u = doc.getElementById("cuca").text.replace('"', '');
            var R = CryptoJS.enc.Utf8.parse(dec('ZDQxZDhjZDk4ZjAwYjIwNGU5ODAwOTk4ZWNmODQyN2U='));
            var N = CryptoJS.AES.decrypt(u, R, { mode: CryptoJS.mode.ECB });
            var web2 = "https://plusvip.net" + N.toString(CryptoJS.enc.Utf8);
            var webC1 = await fPost(web2, {"Referer":web}, {"link":link});
            after({video: JSON.parse(webC1).link});
        }catch(error){
            onError(error);
        }
    }
}