
export class Mixdrop{
    constructor() {}
    async getDDL(after, onError, web) {
        const urlw = new URL(web);
        let headers = { "User-Agent": window.navigator.userAgent};
        let result = await fGet(web, headers);
        let videos = [];
        let m1 = getFirstMatch(/eval([\s\S]+?)<\/script>/gm, result);
        let m2 = eval(m1);
        let m3 = getFirstMatch(/=\"([^;]+?mp4[^;]+?)\";/gm, m2);
        //videos["video"] = "https:" + m3;
        if(m3){
            videos["video"] = window.serverHost + "file/" + enc("https:" + m3) + "/" + enc(JSON.stringify({"Referer": urlw.protocol + "//" +urlw.hostname, "User-Agent": window.navigator.userAgent}));
            after(videos);
            return;
        }else{
            onError("Mixdrop: video no encontrado")
        }
    }
}