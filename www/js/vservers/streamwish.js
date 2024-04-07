export class StreamWish {
    constructor() {}
    async getDDL(after, onError, web){
        try{
            let content = await fGet(web);
            let vLink = getFirstMatch(/file:"(.+?)"/gm, content)
            let videos = {};
            if(vLink === ''){
                onError("Error: video no encontrado");
                return;
            }
            videos["video"] = vLink;
            after(videos);
        }catch (e) {onError(e)}
    }
    
}