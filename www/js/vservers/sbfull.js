export class SbFull{
    constructor(){}
    async getDDL(after, onError, web){
        let data = await fGet(web.replace("/e/", "/d/"));
        let res = getAllMatches(/download_video\('([^'?]+)','([^'?]+)','([^'?]+)'/gm,data);
        let headers = {"Referer":web.replace("/e/", "/d/")}
        data = await fGet("https://sbfull.com/dl?op=download_orig&id=" + res[0][1] + "&mode=" + res[0][2] + "&hash=" + res[0][3])
        // then recaptcha f***
    }
    
}