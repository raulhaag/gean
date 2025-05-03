//based on https://github.com/recloudstream/cloudstream/blob/master/app/src/main/java/com/lagradost/cloudstream3/extractors/Vidguard.kt
function aadecode(text) {
    // Extraer cuerpo principal del código
    const bodyMatch = text.match(/\[\s*['"]_['"]\s*\]\s*\(\s*(.*?)\s*\)\s*\(\s*['"]_['"]\s*\)/s);
    if (!bodyMatch) {
        throw new Error("No se pudo encontrar el cuerpo principal de la función.");
    }

    let encoded = bodyMatch[1];

    // Tabla de reemplazo con Unicode escapado
    const digits = {
        '(\u0063\u005e\u005f\u005e\u006f)': '0',  // (c^_^o)
        '(\uFF9A\u03B8\uFF9A)': '1',             // (ﾟΘﾟ)
        '((\u006F\u005e\u005f\u005e\u006F) - (\uFF9A\u03B8\uFF9A))': '2',
        '(\u006F\u005e\u005f\u005e\u006F)': '3',
        '(\uFF9A\uFF70\uFF9A)': '4',
        '((\uFF9A\uFF70\uFF9A) + (\uFF9A\u03B8\uFF9A))': '5',
        '((\u006F\u005e\u005f\u005e\u006F) +(\u006F\u005e\u005f\u005e\u006F))': '6',
        '((\uFF9A\uFF70\uFF9A) + (\u006F\u005e\u005f\u005e\u006F))': '7',
        '((\uFF9A\uFF70\uFF9A) + (\uFF9A\uFF70\uFF9A))': '8',
        '((\uFF9A\uFF70\uFF9A) + (\uFF9A\uFF70\uFF9A) + (\uFF9A\u03B8\uFF9A))': '9'
    };

    // Reemplazar por dígitos
    for (const [pattern, digit] of Object.entries(digits)) {
        const escaped = pattern.replace(/([\(\)\+\^\-\*])/g, '\\$1');
        encoded = encoded.replace(new RegExp(escaped, 'g'), digit);
    }

    // Procesar el texto codificado
    const tokens = encoded
        .replace(/[^\d+oﾟｰﾟ]/g, '')
        .split('+')
        .map(s => s.trim())
        .filter(Boolean);

    let result = '';
    for (let i = 0; i < tokens.length;) {
        if (tokens[i] === 'oﾟｰﾟo') {
            i++;
            let hex = '';
            for (let j = 0; j < 4 && i < tokens.length; j++, i++) {
                hex += parseInt(tokens[i], 10).toString(16);
            }
            result += String.fromCharCode(parseInt(hex, 16));
        } else {
            let oct = '';
            for (let j = 0; j < 3 && i < tokens.length; j++, i++) {
                oct += tokens[i];
            }
            result += String.fromCharCode(parseInt(oct, 8));
        }
    }

    return result;
}

export class Vidguard{
    constructor() {}
    async getDDL(after, onError, web) {
        try{
            aadecode('')
            let headers = { "User-Agent": window.navigator.userAgent};
            let result = await fGet(web, headers);
            var parser = new DOMParser();
            var doc = parser.parseFromString(result, "text/html");
            let data4 = doc.getElementsByTagName("script")[6];
            let data = getFirstMatch(/eval\("window\.ADBLOCKER\s*=\s*false;(\\n.+?);"\);<\/script/gm, result);
            data = aadecode(data);
            data = data.replaceAll('\\u0027', "'");
            data = data.replaceAll('\\u0022', '"');
            data = data.replaceAll('\\u002b', '+');
            data = data.replaceAll('\\/', '/');
            data = data.replaceAll('\\\\', '\\');
            data = data.replaceAll('\\"', '"');
            console.log(data4);
            data = this.aadecode(data);
            eval(data);
            console.log(svg);
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
            onError(e);
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
