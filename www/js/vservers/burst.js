export class BurstCloud{
    constructor() {}
    async getDDL(after, onError, web){
        try{
            let content = await fGet(web);
            var match = getFirstMatch(/data-file-id="(.+?)"/gm, content);
            if (match) {
               content = await fPost("https://www.burstcloud.co/file/play-request/", {"Referer": web, "User-Agent": window.navigator.userAgent}, {"fileId": match});
               let jsondata = JSON.parse(content);
               let ddl = await fRGet(jsondata['purchase']['cdnUrl'].replace(/ /gm, "%20"), {"Referer": "https://www.burstcloud.co", "User-Agent": window.navigator.userAgent})
               after({"video": ddl});
               console.log(ddl);
            }else{
                onError("No encontrado");
            }
        }catch(error){
            onError(error);
        }
    }
}