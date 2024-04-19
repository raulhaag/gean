export class DailyMotion{
    constructor() {}
    async getDDL(after, onError, web) {
        try{
            let id = getFirstMatch(/dailymotion.com\/(?:video\/|swf\/video\/|swf\/|embed\/video\/|)([A-z0-9]+)/g, web)
            let result = await fGet(`https://www.dailymotion.com/player/metadata/video/${id}`);    
            let data = JSON.parse(result)["qualities"]["auto"];
            let videos = {};

            for (let i = 0; i < data.length; i++) {
                if(data[i]["url"].includes("m3u8")){
                    videos[data[i]["type"]] = window.serverHost + "m3u8/" + enc(data[i]["url"]) + "/" + enc(JSON.stringify(
                        {"Referer": web, "Sec-Fetch-Mode": "cors", "Sec-Fetch-Site": "same-origin"})) + "/maskfile.m3u8"
                }else{
                    videos[data[i]["type"]] = data[i]["url"];
                }
            }
            videos["video"] = videos[data[0]["type"]];
            after(videos);
            return
        }catch(e){
            //ignore
        }      
        onError(`can't find video (${web})` );
    }
}