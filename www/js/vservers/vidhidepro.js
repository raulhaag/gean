export class VidHidepro {
    constructor() {}


    async getDDL(after, onError, web) {
        try {
            let data = await fGet(web);
            let pf = window.__unpack(data);
            if (!pf) {
                onError("Ocurrió un error al procesar el video [1].");
                return;
            }
            
            // Extraer el JSON de los enlaces del script desofuscado.
            let jsonData = JSON.parse(getFirstMatch(/links=\s*?({[\s\S]+?});/gm, pf));
            
            // Encontrar el enlace del video.
            if (jsonData) {
                Object.keys(jsonData).forEach(key => {
                    if(jsonData[key].indexOf("http") != -1){               
                        after({ video: jsonData[key]});
                        return
                    }
                })
            } else {
                onError("No se encontró una enlace de video válido.");
            }

        } catch (e) {
            console.error("Error en VidHidepro getDDL:", e);
            onError("Ocurrió un error al procesar el video de VidHidepro: " + e.message);
        }
    }
}