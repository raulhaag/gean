

export class ZippyShare {
    constructor() {}
    async getDDL(after, onError, web) {
        

        try{
            let headers = { Referer: "https://www.zippyshare.com"};
            let result = await fGet(web, headers);
            let zout = {"omg":"", "href": ""};
            let filev = getAllMatches(/javascript">\s+(var[\s\S]+?)..script>/gm, result)[0][1]
                        .replace(/document\.getElementById('fimage')/g, "zout")
                        .replace(/document\.getElementById('dlbutton')/g, "zout")
            eval(filev);
            var url = new URL(web);
            var video = url.protocol + "//" + url.hostname + zout.href
            after({"video": video});
            return
        }catch(e){
            onError(e);
        }
        try{
            //this method needs cookies to work properly
            let headers = { Referer: "https://www.zippyshare.com"};
            let result = await fGet(web, headers);
            let video = "https:" + getFirstMatch(/source src="([^"]+)/gm, result);
            after({"video": video});
            return
        }catch(e){
            onError("Error getting video from server: " + e.message);
        }
    }
}