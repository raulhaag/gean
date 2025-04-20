export class Voe {
  constructor() {}
  async getDDL(after, onError, web) {
    try {
      let data = await fGet(web, { "User-Agent": navigator.userAgent });
      let dlink = getFirstMatch(/sources [^\{]+{([^}]+)/gm, data);
      if (dlink == "") {
        const nlink = getFirstMatch(/href = '(ht.+?)'/gm, data);
        data = await fGet(nlink, {
          "User-Agent": navigator.userAgent,
          Referer: web,
        });
        const jsonData = this.decryptString(getFirstMatch(/="([^"]+?)";func/gm, data));
        dlink = jsonData['source'];
        if('direct_access_url' in jsonData){
          after({video: dlink, mp4: jsonData['direct_access_url'], hls: dlink});
          return
        }
        after({video: dlink})
        return
      }
    } catch (e) {
      onError(e);
    }
  }

  rot13 = (str) => {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      let charCode = str.charCodeAt(i);
      if (charCode >= 65 && charCode <= 90) {
        charCode = ((charCode - 65 + 13) % 26) + 65;
      } else if (charCode >= 97 && charCode <= 122) {
        charCode = ((charCode - 97 + 13) % 26) + 97;
      }
      result += String.fromCharCode(charCode);
    }
    return result;
  };

  sanitizeString = (str) => {
    const specialChars = ["@$", "^^", "~@", "%?", "*~", "!!", "#&"];
    let sanitizedString = str;
    for (let i = 0; i < specialChars.length; i++) {
      const regex = new RegExp(
        specialChars[i].replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "g"
      );
      sanitizedString = sanitizedString.replace(regex, "_");
    }
    return sanitizedString;
  };

  shiftCharacters = (str, shift) => {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      let charCode = str.charCodeAt(i);
      charCode -= shift;
      result += String.fromCharCode(charCode);
    }
    return result;
  };

  reverseString = (str) => {
    return str.split("").reverse().join("");
  };

  decryptString = (encryptedString) => {
    // 1. ROT13 encode
    const rot13Encoded = this.rot13(encryptedString);
    // 2. Sanitize (replace special chars with underscores)
    const sanitizedString = this.sanitizeString(rot13Encoded);
    // 3. Remove underscores
    const noUnderscores = sanitizedString.replace(/_/g, "");
    // 4. Base64 decode
    const base64Decoded = atob(noUnderscores);
    // 5. Shift characters by 3
    const shiftedString = this.shiftCharacters(base64Decoded, 3);
    // 6. Reverse the string
    const reversedString = this.reverseString(shiftedString);
    // 7. Base64 decode the reversed string
    const finalDecoded = atob(reversedString);
    // 8. Parse as JSON (with error handling)
    let jsonData;
    try {
      jsonData = JSON.parse(finalDecoded);
    } catch (error) {
      console.error("JSON parse error:", error);
      jsonData = {};
    }
    return jsonData;
  };
}
