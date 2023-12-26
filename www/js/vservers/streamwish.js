export class StreamWish {
    constructor() {}
    async getDDL(after, onError, web){
        let content = await fGet(web);
        let vLink = getFirstMatch(/file:"(.+?)"/gm, content)
        let videos = {};
        videos["hls"] = vLink;
        videos["video"] = vLink;
        after(videos);
    }
    
}