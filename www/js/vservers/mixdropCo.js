
export class Mixdrop{
    constructor() {}
    async getDDL(after, onError, web) {
        let headers = { "User-Agent": window.navigator.userAgent};
        let result = await fGet(web, headers);
        let videos = [];
        let m1 = getFirstMatch(/eval([\s\S]+?)<\/script>/gm, result);
        let m2 = eval(m1);
        let m3 = getFirstMatch(/=\"([^;]+?mp4[^;]+?)\";/gm, m2);
        //videos["video"] = "https:" + m3;
        videos["video"] = "https:" + m3;//window.serverHost + "file/" + enc("https:" + m3) + "/" + enc(JSON.stringify({"Referer": "https://mixdrop.co/"}));
        after(videos);
    }
}