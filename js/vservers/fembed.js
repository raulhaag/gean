export class Fembed {
  constructor() {}
  getDDL(after, onError, web, customReferer = "") {
    let headers = { Referer: web };
    if (customReferer.length > 0) {
      headers["Referer"] = customReferer;
    }
    let path = web.split("/");
    let id = path[path.indexOf("v") + 1];
    let rqs =
      window.enc("https://www.fembed.com/api/source/" + id) +
      "/" +
      window.enc(JSON.stringify(headers)) + //headers
      "/" +
      window.enc("{}"); //post params
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
