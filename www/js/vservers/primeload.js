import { VideoServer } from "./videoserver.js";
export class Primeload extends VideoServer {
    constructor() {
      super();
    }
    name(){
        return "PrimeLoad";
    }
    async getDDL(after, onError, web){
        try{

            const headers = {Origin:new URL(web).origin, Referer: web};
            const vid = this.getVideoId(web);//window.getFirstMatch(/\/embed\/(.+?)$/gm, web);
            let data = "";
            if(vid){
                 data = JSON.parse(await window.fGet("https://primeload.co/api/v1/player/" + vid,
                    {
                        Referer: web,
                    }, 
                    
                ));
            }else{
                onError("id no encontrado")
                return
            }
            const videos = [];
            for(let i = 0; i < data.sources.length; i++){
                videos[data.sources[i].resolution] = this.getProxyHLS(data.sources[i].src, headers);
            }
            videos.video = this.getProxyHLS(data.sources[0].src, headers)
            after(videos);
        }catch(e){
            onError(e);
        }
    }
    can(www){
        return /primeload\.co/.test(www);
    }
}