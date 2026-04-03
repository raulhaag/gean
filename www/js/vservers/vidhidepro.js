import { VideoServer } from "./videoserver.js";
export class VidHidepro extends VideoServer {
    constructor() {
      super();
    }
    name() {
        return "VidHidepro";
    }
    async getDDL(after, onError, web) {
        try {
            let data = await fGet(web);
            let pf = window.__unpack(data);
            if (!pf) {
                onError("Ocurrió un error al procesar el video [1].");
                return;
            }
            
            // Extraer el JSON de los enlaces del script desofuscado.
            const jsonData = JSON.parse(getFirstMatch(/links=\s*?({[\s\S]+?});/gm, pf));
            const headers = { "Referer": web, "User-Agent": window.navigator.userAgent, "origin":  new URL(web).origin};
            // Encontrar el enlace del video.
            const videos = {};
            if (jsonData) {
                Object.keys(jsonData).forEach(key => {
                    if(jsonData[key].indexOf("http") != -1){ 
                        videos[key] = jsonData[key];
                        return
                    }else {
                        videos[key] = window.serverHost + "m3u8/" + enc(new URL(web).origin + jsonData[key]) + "/" + enc(JSON.stringify(headers))  + "/maskfile.m3u8";
                    }
                })
                videos["video"] = videos[Object.keys(videos)[0]];
                after(videos);
                return;   
            } else {
                onError("No se encontró una enlace de video válido.");
            }

        } catch (e) {
            console.error("Error en VidHidepro getDDL:", e);
            onError("Ocurrió un error al procesar el video de VidHidepro: " + e.message);
        }
    }
    can(www) {
        if(/vidhide|dintezuvio|callistanise|minochinos/.test(www)){
            return true;
        }
        return false;
    }
}