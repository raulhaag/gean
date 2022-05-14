export class ReSololatino {
    constructor() {}
    getDDL(after, onError, web) {
      let headers = { Referer: web };
      let rqs = window.enc(web) + "/" + window.enc(JSON.stringify(headers));
      fetch(window.serverHost + "get/" + rqs)
        .then((response) => response.text())
        .then((result) => {
          let data = [...result.matchAll(/file: '(.+?)'/gm)][0][1];
          after({"video": data});
        })
        .catch((error) => {
          onError(error);
        });
    }
  }