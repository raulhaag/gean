export class StreamSB {//based on https://github.com/vb6rocod/utils
  constructor() {}
  async getDDL(after, onError, web) {
    let filelink = web;
    if (
      /sbfull\.|sbfast\.|sbembed\.com|sbembed1\.com|sbplay\.org|sbvideo\.net|streamsb\.net|sbplay\.one|cloudemb\.com|playersb\.com|tubesb\.com|sbplay\d\.|embedsb\.com/.test(
        filelink
      )
    ) {
      const pattern =
        /(?:\/\/|\.)((?:tube|player|cloudemb|stream|sbfast|sbfull)?s?b?(?:embed\d?|embedsb\d?|play\d?|video)?\.(?:com|net|org|one|\w+))\/(?:embed-|e|play|d)?\/?([0-9a-zA-Z]+)/;
      const m = filelink.match(pattern);
      const host = m[1];
      const id = m[2];
      let rw = await fRGet(filelink)

/*
      if (
        /\/\/[\.\d\w\-\.\/\\\:\?\&\#\%\_\,]*(\.(srt|vtt))/.test(
          filelink + " " + h
        )
      ) {
        const s = (filelink + " " + h).match(
          /(\/\/[\.\d\w\-\.\/\\\:\?\&\#\%\_\,]*(\.(srt|vtt)))/
        );
        const srt = "https:" + s[1];
      }
/*/
      const c1 = "375664356a494546326c4b797c7c6e756577776778623171737";
      const c3 = this.enc("91a9MQzmQu7T||" + id + "||HSsvhTZGLdhX||streamsb");
      const l = "https://" + host + "/" + c1 + "/" + c3;

      const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "ro-RO,ro;q=0.8,en-US;q=0.6,en-GB;q=0.4,en;q=0.2",
        "Accept-Encoding": "deflate",
        "watchsb": "sbstream",
        "Connection": "keep-alive",
        "Referer": "https://" + host,
      };

      let data = JSON.parse(await fGet(l, headers));

      const m3u8Headers = {
        "Accept": "*/*",
        "Accept-Language": "es-AR,es;q=0.8,en-US;q=0.5,en;q=0.3",
        "Accept-Encoding": "gzip, deflate, br",
        "Origin":" https://embedsb.com",
        "Connection": "keep-alive",
        "Referer":" https://embedsb.com/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site"
      }
      let pw = window.serverHost + "file/" + enc(data["stream_data"]["file"]) + "/" + enc(JSON.stringify(m3u8Headers));

      after({ video: pw + "|||" + "application/x-mpegURL" });//"https://cdn.flowplayer.com/a30bd6bc-f98b-47bc-abf5-97633d4faea0/hls/de3f6ca7-2db3-4689-8160-0f574a5996ad/playlist.m3u8" + "|||" + "application/x-mpegURL" });//
    }
  }
  enc = (a) => {
    let b = "";
    for (let k = 0; k < a.length; k++) {
      b += a.charCodeAt(k).toString(16);
    }
    return b;
  };

  makeid = (a) => {
    let b = "";
    const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let k = 0; k < a; k++) {
      b += c.charAt(Math.floor(Math.random() * c.length));
    }
    return b;
  };
}
