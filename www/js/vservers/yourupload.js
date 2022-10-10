export class YourUpload {
    constructor() {}
    async getDDL(after, onError, web) {
        let headers = { Referer: "https://www.yourupload.com"};
        let result = await fGet(web, headers);
        let filev = getFirstMatch(/og:video.+?"(h[^"]+)"/gm, result);
        if(filev.indexOf("vidcache") != -1) {
          headers["Referer"] = web;
          let pw = window.serverHost + "file/" + enc(filev) + "/" + enc(JSON.stringify(headers));
          after({"video": pw});
          return
        }/*
        filev = [...result.matchAll(/https:\/\/vidcache[^'^"]+?.mp4/gm)][0][1]; //getFirstMatch(/https:\/\/vidcache[^'^"]+?.mp4/gm, result);
        if("vidcache" in filev) {
          headers["Referer"] = web;
          let pw = window.serverHost + "file/" + enc(filev) + "/" + enc(JSON.stringify(headers));
          console.log(pw);
          return
        }
        let file1 = [...result.matchAll(/href="(\/download\?file=[^"]+)/gm)][0][1];
        result = await fGet("https://www.yourupload.com" + file1, headers);
        let file2 = [...result.matchAll(/"(\/download[^"]+)"/gm)][0][1].replace(/&amp;/g, '&');
        headers = { Referer: "https://www.yourupload.com" + file2 };
        result = await fRGet("https://www.yourupload.com" + file2, headers);
        let pw = window.serverHost + "file/" + enc(result) + "/" + enc(JSON.stringify(headers));
        console.log(pw);/*/
        onError("Error");
    }
}