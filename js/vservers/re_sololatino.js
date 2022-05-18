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

export class SololatinoXYZ {
  constructor() {}
  getDDL(after, onError, web) {
    let headers = { Referer: web };
    let data = {'r':'https%3A%2F%2Fre.sololatino.net%2F','d':'sololatino.xyz'}
    let path = web.split("#")[0].split("/");
    let id = path[path.indexOf("v") + 1];
    let rqs =
      window.enc("https://sololatino.xyz/api/source/" + id) +
      "/" +
      window.enc(JSON.stringify(headers)) + //headers
      "/" +
      window.enc(JSON.stringify(data)); //post data
    fetch(window.serverHost + "post/" + rqs)
      .then((response) => response.json())
      .then((result) => {
        let response = {"video": result.data[result.data.length-1].file}
        after(response);
      })
      .catch((error) => {
        onError(error);
      });
  }
}