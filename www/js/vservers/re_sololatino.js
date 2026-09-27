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
    return !(
      www.indexOf("https://re.sololatino.net/p/embed.php") == -1 &&
      www.indexOf("https://sololatino.xyz/v/") == -1);
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
    return(www.indexOf("https://sololatino.xyz/v/") != -1);
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
    return (www.indexOf("owodeuwu.xyz") != -1)
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
    return www.indexOf("/reproamz/") != -1
  }
}
export class SL2_Direct extends VideoServer {
  constructor() {
    super();
  }
  name() {
    return "SL2_Direct";
  }
  async getDDL(after, onError, web) {
    try {
      const dwvaluse = window.dec(web.replace("sl_direct", "")).split("||");
      const oWeb = dwvaluse[1];
      const id = dwvaluse[0];
      const origin = new URL(oWeb).origin;
      const ck_p = 
        await window.fPost(
          origin + "/s.php",
          { "User-Agent": navigator.userAgent,
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Origin: origin },
          `a=click&tok=${dwvaluse[2]}&ts=1&rt=${dwvaluse[3]}&tk=${dwvaluse[4]}`,
        );
      console.log(ck_p);
      const link_p = JSON.parse(
        await window.fPost(
          origin + "/s.php",
          { "User-Agent": navigator.userAgent,
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Origin: origin },
          `a=2&v=${id}&tok=${dwvaluse[2]}&rt=${dwvaluse[3]}&tk=${dwvaluse[4]}`,
        ),
      );
      let link = encodeURIComponent(link_p["u"]) + "&sig=" + link_p["sig"];// + "&src=" + link_p["src"];
      if(!window.startsWith(link_p["u"],"http")){
        link = await window.fRGet("https://player.pelisserieshoy.com" + link_p["u"],
          {
            "Accept": "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5",
            "Referer": oWeb
          }
        );
        after({video: link})
        return;
      }
      after({video: window._m3u8("https://player.pelisserieshoy.com/p.php?url=" + link, {"User-Agent": navigator.userAgent, origin: origin, Referer: origin}), direct:link});
    } catch (error) {
      onError(error);
    }
  }
  can(web) {
    return web.indexOf("sl_direct") != -1;
  }
}
