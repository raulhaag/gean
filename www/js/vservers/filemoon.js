import { VideoServer } from "./videoserver.js";
export class FileMoon extends VideoServer {
  constructor() {
    super();
  }
  name() {
    return "FileMoon";
  }
  //example web https://filemoon.sx/e/cfg0lk8u084o/
  async getDDL(after, onError, url) {
    try {
      const id = this.getVideoId(url);
      const content = await fGet(
        `https://f75s.com/api/videos/${id}/embed/playback`,
        {
          Accept: "*/*",
          "Accept-Language": "es-AR,es;q=0.9,en-US;q=0.8,en;q=0.7",
          "Accept-Encoding": "deflate",
          Referer: `https://f75s.com/${id}`,
          "X-Embed-Parent": `https://filemoon.sx/e/${id}/`,
        },
      );
      const json = JSON.parse(content);
      if (json) {
        const play = await this.decryptPlayback(
          json
        );
        const out = {};
        out["video"] = play.sources[0].url;
        for(let i = 0;i < play.sources.length;i++){
          out[play.sources[i].label] = play.sources[i].url;
        }
        after(out);
      } else {
        onError("No se encontro el data-src");
      }
    } catch (error) {
      onError(error);
    }
  }
  can(www) {
    if (www.indexOf("filemoon") == -1 && www.indexOf("bysedikamoum.") == -1) {
      return false;
    }
    return true;
  }

  generateId() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    return btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  async decryptPlayback(data) {
    const { playback } = data;

    // 1. Utilidad para decodificar Base64URL a Uint8Array
    const base64ToBytes = (base64) => {
      const standardBase64 = base64.replace(/-/g, "+").replace(/_/g, "/");
      const binaryStr = atob(standardBase64);
      return Uint8Array.from(binaryStr, (c) => c.charCodeAt(0));
    };

    try {
      // 2. Reconstruir la clave de 32 bytes (256 bits)
      // Concatenamos la parte 1 (16 bytes) + parte 2 (16 bytes)
      const keyPart1 = base64ToBytes(playback.key_parts[0]);
      const keyPart2 = base64ToBytes(playback.key_parts[1]);
      const finalKeyBytes = new Uint8Array(32);
      finalKeyBytes.set(keyPart1, 0);
      finalKeyBytes.set(keyPart2, 16);

      // 3. Preparar IV y Payload
      const iv = base64ToBytes(playback.iv);
      const encryptedData = base64ToBytes(playback.payload);

      // 4. Importar la clave para la Web Crypto API
      const cryptoKey = await window.crypto.subtle.importKey(
        "raw",
        finalKeyBytes,
        { name: "AES-GCM" },
        false,
        ["decrypt"],
      );

      // 5. Desencriptar
      // Nota: En AES-GCM, el auth tag suele venir al final del payload (16 bytes)
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
          tagLength: 128, // Longitud estándar del tag de autenticación
        },
        cryptoKey,
        encryptedData,
      );

      // 6. Convertir resultado a texto/JSON
      const decodedText = new TextDecoder().decode(decryptedBuffer);
      return JSON.parse(decodedText);
    } catch (error) {
      console.error("Error en la desencriptación:", error);
      throw new Error(
        "No se pudo desencriptar el payload. Verifica las claves o el algoritmo.",
      );
    }
  }
}
