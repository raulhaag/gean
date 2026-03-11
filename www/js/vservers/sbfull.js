import { VideoServer } from "./videoserver.js";
export class SbFull extends VideoServer {
    constructor(){}
    name(){
        return "SbFull";
    }
    async getDDL(after, onError, web){
        try{
            let data = await fGet(web, {Referer: "https://sololatino.net/"});
            let res = getAllMatches(/download_video\('([^'?]+)','([^'?]+)','([^'?]+)'/gm,data);
            let headers = {"Referer":web.replace("/e/", "/d/")}
            let web2 = "https://sbfull.com/dl?op=download_orig&id=" + res[0][1] + "&mode=" + res[0][2] + "&hash=" + res[0][3];
            data = await fGet(web2, headers);
            // then recaptcha f***
            let data2 = await fPost(web2, {"Referer":web},{"op":"download_orig", "id":res[0][1], "mode":res[0][2] , "hash":res[0][3]});
        }catch(e){
            onError(e);
        }
    }
    can(www){
        if (/sbfull\.|sbfast\.|sbembed\.com|sbembed1\.com|sbplay\.org|sbvideo\.net|streamsb\.net|sbplay\.one|cloudemb\.com|playersb\.com|tubesb\.com|sbplay\d\.|embedsb\.com/.test(web)) {
            return true;
        }
        return false;
    }
   
}