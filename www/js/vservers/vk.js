export class VK{
    constructor() {}
    async getDDL(after, onError, web) {
        let headers = { "User-Agent": window.navigator.userAgent};
        let result = await fGet(web, headers);
        let filev = getAllMatches(/"(url\d+)":"(.+?)"/gm, result)
        //let filev2 = getAllMatches(/"(hls)":"(.+?)"/gm, result)
        try{
            let videos = {};
            /*if(filev2.length > 0) {
                videos["hls"] = window.serverHost + "m3u8/" + enc(filev2[0][2]) + "/" + enc(JSON.stringify(
                    {   "Referer": web, 
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Site": "same-origin"})) + "/maskfile.m3u8";
                videos["video"] = videos["hls"];
            }*/
            if (filev.length > 0) {        
                for (let i = 0; i < filev.length; i++) {
                    videos[filev[i][1]] = filev[i][2];
                }
                videos["video"] = filev[filev.length - 1][2];

            }
            if(videos["video"]){
                after(videos);
                return;
            }
        }catch(e){
            //ignore
        }      
        onError(`can't find video (${web})` );
    }
}