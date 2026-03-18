import { SourceBase } from "../sourcebase.js";
export class SoloLatino2 extends SourceBase {
  constructor() {
    super();
    this.name = "sololatino2";
    this.baseUrl = "https://sololatino.net/";
  }

  parseCards(posts) {
    const seccion = [];
    for (let j = 0; j < posts.length; j++) {
      const path = posts[j].getElementsByTagName("a")[0].getAttribute("href");
      const image = posts[j].getElementsByTagName("img")[0];
      const name = posts[j].getElementsByClassName("card__title")[0].innerText;
      seccion.push({
        name: name,
        image: image.getAttribute("src"),
        path: this.name + "/getDescription/" + window.enc(path),
      });
    }
    return seccion;
  }

  parseEp_card(posts) {
    const seccion = [];
    for (let j = 0; j < posts.length; j++) {
      const name = posts[j]
        .getElementsByClassName("ep-card__info")[0]
        .innerText.replace(/\s+/g, " ")
        .trim();
      const path = posts[j].getAttribute("href");
      const image = posts[0].getElementsByTagName("img")[0].getAttribute("src");
      seccion.push({
        name: name,
        image: image,
        path: this.name + "/getLinks/" + window.enc(path),
      });
    }
    return seccion;
  }

  async getFrontPage(after, onError) {
    const sourceBase = await window.fGet(this.baseUrl, {});
    const doc = new DOMParser().parseFromString(sourceBase, "text/html");
    const secciones = doc.getElementsByTagName("section");
    const out = {};
    if (!secciones || secciones.length == 0) {
      onError("No se encontraron secciones");
      return;
    }
    for (let i = 0; i < secciones.length; i++) {
      const cname = secciones[i].getElementsByClassName("section-title")[0];
      if (!cname) continue;
      const post = secciones[i].getElementsByClassName("card");
      if (!post) continue;
      if (post.length == 0) {
        const post2 = secciones[i].getElementsByClassName("ep-card");
        if (!post2) continue;
        out[cname.innerText] = this.parseEp_card(post2);
      } else {
        out[cname.innerText] = this.parseCards(post);
      }
    }
    after(out);
  }

  parseMovieDescription(doc, path){
      const name = doc
        .getElementsByClassName("text-3xl")[0]
        .innerText.trim()
        .replace(/"/g, "´´");
      const image = doc.getElementsByClassName("w-44")[0].getAttribute("src");
      const description = doc.querySelector(
        "p.text-sm.leading-relaxed.mb-6",
      ).innerText;
      const genres = document.querySelectorAll("a.text-xs.rounded-full");
      let genText = "";
      for (let i = 0; i < genres.length; i++) {
        genText += genres[i].innerText + ", ";
      }
      genText = genText.slice(0, -2);
      const chapters = [{
          name: "Ver película",
          path: this.name + "/getLinks/" + path,
        }];
    return {
        name: name,
        path: this.name + "/getDescription/" + path,
        image: image,
        items: [description, genText],
        chapters: chapters,
      }
  }

  paresSerieDescription(doc, path){
    const name = doc.getElementsByClassName("w-44")[0].getAttribute("alt");
    const image = doc.getElementsByClassName("w-44")[0].getAttribute("src");
    const sinopsis = doc.querySelector(
        "p.text-sm.leading-relaxed.mb-5",
      ).innerText;
    const chapters = [];
    const chaptersObj = doc.getElementsByClassName("ep-item");
    for (let i = 0; i < chaptersObj.length; i++) {
        if(!chaptersObj[i].getAttribute("href"))continue;
        let pathParts = chaptersObj[i].getAttribute("href").replace(/-/g," ").split("/");
        const episode = window.toTitleCase(pathParts.pop());
        const season = window.toTitleCase(pathParts.pop());
        let title = "";
        if(chaptersObj[i].getElementsByClassName("text-sm").length > 0){
            title = " - " + chaptersObj[i].getElementsByClassName("text-sm")[0].innerText.trim();
        }
        chapters.push({
            name: season + " - " + episode + title,
            path: this.name + "/getLinks/" + window.enc(chaptersObj[i].getAttribute("href")),
        });
    }
    return {
        name: name,
        path: this.name + "/getDescription/" + path,
        image: image,
        items: [sinopsis],
        chapters: chapters,
    }
  }




  async getDescription(after, onError, path) {
    try {
      const sourceBase = await window.fGet(window.dec(path), {});
      const doc = new DOMParser().parseFromString(sourceBase, "text/html");
      if (doc.getElementsByClassName("badge-movie").length > 0) {
        after(this.parseMovieDescription(doc, path));
      } else if(doc.getElementsByClassName("badge-series").length > 0){
        after(this.paresSerieDescription(doc, path));
      }else{
        //todo anime
      }
    } catch (error) {
      onError(error);
    }
  }

  async getLinks(after, onError, path) {
    try {
      let result = await window.fGet(dec(path));
      const linkpage = getFirstMatch(/data-server-url="([^"]+)/gm, result);
      result = await window.fGet(linkpage);
      let links = ([] = this.parseLinks(result));

      after(links);
    } catch (error) {
      onError(error);
    }
  }

  getLangInfo(ca) {
    switch (ca) {
      case "0":
        return "Lat";
      case "1":
        return "Esp";
      case "2":
        return "Sub";
      default:
        return "Otro";
    }
  }

  parseLinks(htmlContent) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlContent, "text/html");
    var lis = doc.getElementsByTagName("li");
    let links = [];
    for (const link of lis) {
      try {
        if (link.hasAttribute("data-r")) {
          let linkd = atob(link.getAttribute("data-r"));
          if (linkd.indexOf("sypl.xyz")) {
            linkd = linkd.replace("sypl.xyz", "owodeuwu.xyz");
          }
          links.push(linkd);
        } else {
          var decoded = getFirstMatch(
            /\.php\?link=(.+?)&servidor=/gm,
            link.getAttribute("onclick"),
          );
          if (decoded) {
            links.push(
              atob(decoded) + "||info_" + this.getLangInfo(link.dataset.lang),
            );
          }
          try {
            links.push(
              [
                ...link
                  .getAttribute("onclick")
                  .matchAll(/go_to_playerVast\('(.+?)'/gm),
              ][0][1] +
                "||info_" +
                this.getLangInfo(link.dataset.lang),
            );
            links.push(
              atob(
                [
                  ...link
                    .getAttribute("onclick")
                    .matchAll(/go_to_playerVast\('(.+?)'/gm),
                ][0][1],
              ) +
                "||info_" +
                this.getLangInfo(link.dataset.lang),
            );
          } catch (e) {
            links.push(
              [
                ...link
                  .getAttribute("onclick")
                  .matchAll(/go_to_player\('(.+?)'/gm),
              ][0][1] +
                "||info_" +
                this.getLangInfo(link.dataset.lang),
            );
            links.push(
              atob(
                [
                  ...link
                    .getAttribute("onclick")
                    .matchAll(/go_to_player\('(.+?)'/gm),
                ][0][1],
              ) +
                "||info_" +
                this.getLangInfo(link.dataset.lang),
            );
          }
        }
      } catch (e) {} //continue
    }
    let jslinks = getFirstMatch(/dataLink = (\[.+?\]);/gm, htmlContent);
    if (jslinks) {
      let items = JSON.parse(jslinks);
      for (let i = 0; i < items.length; i++) {
        let lang = items[i]["video_language"];
        for (let j = 0; j < items[i]["sortedEmbeds"].length; j++) {
          if (items[i]["sortedEmbeds"][j]["link"].indexOf("http") == -1)
            if (items[i]["sortedEmbeds"][j]["link"].indexOf(".") == -1) {
              links.push(
                dcl(items[i]["sortedEmbeds"][j]["link"]) + "||info_" + lang,
              );
            } else {
              links.push(
                dcl3(items[i]["sortedEmbeds"][j]["link"]) + "||info_" + lang,
              );
            }
          else
            links.push(items[i]["sortedEmbeds"][j]["link"] + "||info_" + lang);
        }
      }
    }
    return links;
  }
}
function dcl_old(el) {
  const bytes = CryptoJS.AES.decrypt(el, "Ak7qrvvH4WKYxV2OgaeHAEg2a5eh16vE");
  const dclk = bytes.toString(CryptoJS.enc.Utf8);
  return dclk;
}

function dcl3(edata) {
  const jdata = JSON.parse(window.dec(edata.split(".")[1]));
  return jdata.link;
}

function dcl(
  encryptedLinkBase64,
  secretKey = "Ak7qrvvH4WKYxV2OgaeHAEg2a5eh16vE",
) {
  const encryptedData = CryptoJS.enc.Base64.parse(encryptedLinkBase64);
  const encryptedStr = CryptoJS.enc.Base64.stringify(encryptedData);

  const iv = encryptedData.words.slice(0, 4); //
  const encryptedBytes = encryptedData.words.slice(4); //

  const ivWordArray = CryptoJS.lib.WordArray.create(iv);
  const encryptedWordArray = CryptoJS.lib.WordArray.create(encryptedBytes);

  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: encryptedWordArray },
    CryptoJS.enc.Utf8.parse(secretKey),
    { iv: ivWordArray, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 },
  );

  const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);

  return decryptedStr;
}
