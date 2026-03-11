import { VideoServer } from "./videoserver.js";
export class ReSololatino extends VideoServer {
  constructor() {
    super();
  }
  name() {
    return "ReSololatino";
  }
  getDDL(after, onError, web) {
    onError("Error en servidor");
    let headers = { Referer: web };
    let rqs = window.enc(web) + "/" + window.enc(JSON.stringify(headers));
    fetch(window.serverHost + "get/" + rqs)
      .then((response) => response.text())
      .then((result) => {
        let fl = getFirstMatch(/file:\s*["|'](.+?)["|']/gm, result);
        if (fl) {
          after({ video: fl });
        } else {
          let ar = parseVideoFe(result);
          if (ar != null) {
            after(ar);
          }
        }
      })
      .catch((error) => {
        onError(error);
      });
  }
  can(www) {
    if (
      www.indexOf("https://re.sololatino.net/p/embed.php") == -1 &&
      www.indexOf("https://sololatino.xyz/v/") == -1
    ) {
      return false;
    }
    return true;
  }
}

export class SololatinoXYZ extends VideoServer {
  constructor() {
    super();
  }
  name() {
    return "SololatinoXYZ";
  }
  async getDDL(after, onError, web) {
    onError("Error en servidor");
    let headers = { Referer: web };
    let data = { r: "https%3A%2F%2Fre.sololatino.net%2F", d: "sololatino.xyz" };
    let path = web.split("#")[0].split("/");
    let id = path[path.indexOf("v") + 1];
    let rqs =
      window.enc("https://sololatino.xyz/api/source/" + id) +
      "/" +
      window.enc(JSON.stringify(headers)) + //headers
      "/" +
      window.enc(JSON.stringify(data)); //post data
    fetch(window.serverHost + "post/" + rqs)
      .then((response) => response.text())
      .then((result) => {
        let ar = parseVideoFe(result);
        if (ar != null) {
          after(ar);
        }
      })
      .catch((error) => {
        onError(error);
      });
  }
  can(www) {
    if (www.indexOf("https://sololatino.xyz/v/") == -1) {
      return false;
    }
    return true;
  }
}

export class OwodeuwuXYZ extends VideoServer {
  constructor() {
    super();
  }
  name() {
    return "OwodeuwuXYZ";
  }
  async getDDL(after, onError, web) {
    onError("Error en servidor");
    let path = web.split("#")[0].split("/");
    let data = { r: "", d: "owodeuwu.xyz" };
    let id = path[path.indexOf("v") + 1];
    let headers = { Referer: "https://owodeuwu.xyz/v/" + id };
    let result = await fPost(
      "https://owodeuwu.xyz/api/source/" + id,
      headers,
      data,
    );
    let ar = parseVideoFe(result);
    if (ar != null) {
      after(ar);
    } else {
      onError("Error en servidor");
    }
  }
  can(www) {
    if (www.indexOf("owodeuwu.xyz") == -1) {
      return false;
    }
    return true;
  }
}

function parseVideoFe(rtext) {
  let response = JSON.parse(rtext);
  if (response["success"] == false) {
    return null;
  }
  let vdata = response["data"];
  let vlist = {};
  for (let i = 0; i < vdata.length; i++) {
    vlist[vdata[i].label] = vdata[i].file;
  }
  vlist.video = response.data[response["data"].length - 1].file;
  return vlist;
}

export class MamazonPlayer extends VideoServer {
  constructor() {
    super();
  }
  name() {
    return "MamazonPlayer";
  }
  async getDDL(after, onError, web) {
    let firtStep = await fGet(web);
    let sid = getFirstMatch(/shareId\s*=\s*"(.+?)"/gm, firtStep);
    let secondStep = await fGet(
      "https://www.amazon.com/drive/v1/shares/" +
        sid +
        "?resourceVersion=V2&ContentType=JSON&asset=ALL",
    );
    secondStep = JSON.parse(secondStep);
    let thirdStep = await fGet(
      "https://www.amazon.com/drive/v1/nodes/" +
        secondStep["nodeInfo"]["id"] +
        "/children?resourceVersion=V2&ContentType=JSON&limit=200&sort=%5B%22kind+DESC%22%2C+%22modifiedDate+DESC%22%5D&asset=ALL&tempLink=true&shareId=" +
        sid,
    );
    thirdStep = JSON.parse(thirdStep);
    after({ video: thirdStep["data"][0]["tempLink"] });
  }
  can(www) {
    if (www.indexOf("/reproamz/") == -1) {
      return false;
    }
    return true;
  }
}
