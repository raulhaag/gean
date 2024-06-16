//based on https://github.com/recloudstream/cloudstream/blob/master/app/src/main/java/com/lagradost/cloudstream3/extractors/Vidguard.kt
export class Vidguard{
    constructor() {}
    async getDDL(after, onError, web) {
        let headers = { "User-Agent": window.navigator.userAgent};
        let result = await fGet(web, headers);
        let filev = getAllMatches(/"(url\d+)":"(.+?)"/gm, result)
        eval(getFirstMatch(/eval\(([\s\S]+?)\);</gm, result));
        console.log(svg);
        try{
            let videos = {};
           /*if(filev2.length > 0) {
                let cwe = filev2[0][2].replace(/\\/g, "");
                videos["hls"] = window.serverHost + "m3u8/" + enc(cwe) + "/" + enc(JSON.stringify(
                    {   "Referer": web, 
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Site": "same-origin"})) + "/maskfile.m3u8";
                videos["video"] = videos["hls"];
            }*/
            if (filev.length > 0) {        
                for (let i = 0; i < filev.length; i++) {
                    videos[filev[i][1]] = filev[i][2].replace(/\\/g, "");
                }
                videos["video"] = filev[filev.length - 1][2].replace(/\\/g, "");

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

    sigDecode(url) {
        // Extraer el valor de 'sig' de la URL
        const sig = url.split("sig=")[1].split("&")[0];
        let t = "";
    
        // Iterar sobre el valor de 'sig' en bloques de 2 caracteres
        for (let i = 0; i < sig.length; i += 2) {
            // Convertir cada bloque de 2 caracteres de hexadecimal a entero y aplicar XOR con 2
            const byteValue = parseInt(sig.substr(i, 2), 16) ^ 2;
            // Convertir el valor obtenido a carácter y concatenarlo a 't'
            t += String.fromCharCode(byteValue);
        }
    
        let padding = "";
        // Determinar el padding necesario para la decodificación Base64
        switch (t.length % 4) {
            case 2:
                padding = "==";
                break;
            case 3:
                padding = "=";
                break;
            default:
                padding = "";
                break;
        }
    
        // Decodificar la cadena 't' junto con el padding, luego revertirla y eliminar los últimos 5 caracteres
        const decoded = Buffer.from(t + padding, 'base64').toString('utf-8').slice(0, -5).split('').reverse().join('');
    
        // Convertir la cadena decodificada en un arreglo de caracteres
        const charArray = decoded.split('');
    
        // Intercambiar caracteres consecutivos en el arreglo
        for (let i = 0; i < charArray.length - 1; i += 2) {
            const temp = charArray[i];
            charArray[i] = charArray[i + 1];
            charArray[i + 1] = temp;
        }
    
        // Convertir el arreglo de caracteres de nuevo a una cadena y eliminar los últimos 5 caracteres
        const modifiedSig = charArray.join('').slice(0, -5);
    
        // Reemplazar el valor original de 'sig' en la URL con el valor modificado y retornar la URL actualizada
        return url.replace(sig, modifiedSig);
    }
}