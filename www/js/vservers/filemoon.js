export class FileMoon {
  constructor() {}
  async getDDL(after, onError, web) {
    try {
      let content = await fGet(web);
      var match = getFirstMatch(/iframe src="(.+?)"/gm, content);
      if (match) {
        //var newWeb = URL.parse(match)
        let content2 = await fGet(match, {
          "User-Agent": window.navigator.userAgent,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
          "Sec-Fetch-Dest": "iframe",
        });
        let data = window.__unpack(content2);
        if (data) {
          var dlink = getFirstMatch(/file:"(.+?)"/gm, data);
          after({ video: dlink }); //No funciona con localhost !!!!
          /*after({video:  window.serverHost + "m3u8/" + enc(dlink) + "/" + enc(JSON.stringify(
                        {   "Referer": newWeb.protocol + "//" + newWeb.host + "/",
                            "Origin": newWeb.protocol + "//" + newWeb.host + "/",
                            "User-Agent": window.navigator.userAgent,
                            "Accept": "* /*",
                            "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
                            "Sec-Fetch-Dest": "empty",
                            "Sec-Fetch-Mode": "cors",
                            "Sec-Fetch-Site": "same-origin"})) + "/maskfile.m3u8"})*/
          return;
        }
      } //from here if rollback
      let data2 = window.__unpack(content);
      if (data2) {
        var dlink = getFirstMatch(/file:"(.+?)"/gm, data2);
        after({ video: dlink });
        return;
      } else {
        let dlink = getFirstMatch(/file:"(.+?)"/gm, content);
        if (dlink != "") {
          after({ video: dlink });
          return;
        } else {
          onError("No se encontro el enlace");
          return;
        }
      }
    } catch (error) {
      onError(error);
    }
  }
}
