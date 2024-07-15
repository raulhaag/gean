export class YourUpload {
    constructor() {}
    async getDDL(after, onError, web) {
        try{                                
          let headers = { "Referer": web, "User-Agent": window.navigator.userAgent};
          let page2 = web.replace("/embed/", "/watch/");
          let data = await fGet(page2, headers);
          let dpage = "https://www.yourupload.com" + (getFirstMatch(/href="(.dow.+?)"/gm,data))
          headers["Referer"] = page2;
          let data2 = await fGet(dpage, headers);
          let dlink = "https://www.yourupload.com" + decodeHtml(getFirstMatch(/data-url="(.+?)"/gm, data2));
          headers["Referer"] = dpage;
          let rwe = await fRGet(dlink, headers);
          headers["Referer"] = dlink;
          let rwe2 = await fRGet(rwe, headers);
          headers["Referer"] = "https://www.yourupload.com";
          let pw = window.serverHost + "file/" + enc(rwe2) + "/" + enc(JSON.stringify(headers));
          after({"video": pw});
        }catch(e){
          onError(e);
        }
       /* let result = await fGet(web, headers);
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
        //onError("Error");
    }
}