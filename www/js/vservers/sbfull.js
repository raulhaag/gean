export class SbFull{
    constructor(){}
    async getDDL(after, onError, web){
        let data = await fGet(web, {Referer: "https://sololatino.net/"});
        let res = getAllMatches(/download_video\('([^'?]+)','([^'?]+)','([^'?]+)'/gm,data);
        let headers = {"Referer":web.replace("/e/", "/d/")}
        let web2 = "https://sbfull.com/dl?op=download_orig&id=" + res[0][1] + "&mode=" + res[0][2] + "&hash=" + res[0][3];
        data = await fGet(web2, headers);
        // then recaptcha f***
        let data2 = await fPost(web2, {"Referer":web},{"op":"download_orig", "id":res[0][1], "mode":res[0][2] , "hash":res[0][3]});
    }    
}