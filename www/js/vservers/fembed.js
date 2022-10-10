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
      .then((response) => response.text())
      .then((result) => {
        after(parseVideoFe(result));
      })
      .catch((error) => {
        onError(error);
      });
  }
}
function parseVideoFe(rtext){
  let response = JSON.parse(rtext);
  if(response["success"] == false) {
    return null;
  }
  let vdata = response["data"];
  let vlist = {};
  for (let i = 0; i < vdata.length; i++) {
    vlist[vdata[i].label] = vdata[i].file;
  }
  vlist.video = response.data[response["data"].length-1].file;
  return vlist;
}
