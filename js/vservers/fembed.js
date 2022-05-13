export class Fembed {
  constructor() {}
  getDDL(after, onError, web) {
    let headers = { Referer: web };
    let path = web.split("/");
    let id = path[path.indexOf("v") + 1];
    let rqs =
      btoa("https://www.fembed.com/api/source/" + id) +
      "/" +
      btoa(JSON.stringify(headers)) + //headers
      "/" +
      btoa("{}"); //post params
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
