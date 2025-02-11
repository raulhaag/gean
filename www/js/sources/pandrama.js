// player_.+?=({.+?})< player config
// enc 1 unnescaper(atob(src))
export class PanDramaTV {
    constructor() {
      this.name = "PanDrama";
      this.host = atob("aHR0cHM6Ly9wYW5kcmFtYS50di8=")
    }
    async getFrontPage(after, error) {
      after({
        "Solo búsqueda": {},
      });
    }
  
    async getDescription(after, onError, path, page = 0,) {
      try {
        let result = await fGet(window.dec(path));
        if (result.indexOf("error") == 0) {
          onError(result + ": " + window.dec(path));
          return;
        }
        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "text/html");
        let sname = doc.getElementsByClassName("title-detail")[0].innerText;
        let description = doc.getElementsByClassName("content_desc")[0].textContent.trim();
        let genres = doc.querySelector("li.data:nth-child(8)").textContent.trim();
        let image = doc.querySelector(".content_thumb > a:nth-child(1)").getAttribute("data-original");
        let chapters = [];
        let chap = doc.getElementsByClassName("content_playlist")[0].getElementsByTagName("li");
        for (let i = 0; i < chap.length; i++) {
          chapters.push({ "name": chap[i].innerText, "path": this.name + "/getLinks/" + window.enc(this.host + chap[i].childNodes[0].getAttribute("href")) });
        }
        after({ "name": sname, "path": this.name + "/getDescription/" + path, "image": image, "items": [description, genres], "chapters": chapters });
      } catch (error) {
        onError(error);
      }
    }
  
    async getParent(after, path) {
    }
  
    async getList(page, filter = "") {
    }
  
    async getSearch(after, onError, query) {
      let fres = [];
        let response = await fGet(`${this.host}/busqueda/-------------/?wd=${encodeURIComponent(query)}&submit=`);
        if (response.indexOf("error") == 0) {
          onError(response);
          return;
        }
        var parser = new DOMParser();
        var doc = parser.parseFromString(response, "text/html");
        let res = [];
        try {
          let flis = doc.getElementsByClassName("searchlist_item")
          ;
          for (var i = 0; i < flis.length; i++) {
            const aac  = flis[i].getElementsByTagName('a')[0]
            res.push({
              "name": aac.title,
              "image": aac.dataset["original"],
              "path":    this.name + "/getDescription/" + window.enc(this.host + aac.getAttribute("href")),
            });
          }
        } catch (nerror) {
          onError(nerror);
        }
        fres = fres.concat(res);
      after(fres);
    }
  
    trLink = (link) => {
      link = link.replace("/jkokru.php?u=", "https://ok.ru/videoembed/")
        .replace("/jkvmixdrop.php?u=", "https://mixdrop.co/e/")
        .replace("/jksw.php?u=", "https://streamwish.to/e/");
      return link
    }
  
    async getLinks(after, onError, path) {
      try {
        let dpath = window.dec(path);
        let result = await fGet(dpath);
        if (result.indexOf("error") == 0) {
          onError(result);
          return;
        }
        let data = JSON.parse(getFirstMatch(/var player_\S+?=({.+?})</gm, result));
        let count = (result.match(/tab-play/g) || []).length;
        let links = [];
        links.push(decodeURIComponent(atob(data.url)));        
        let subtitles = window.serverHost + "get/" + window.enc('https://pandrama.com/subs/'+ data.vod_en_py + '/6/es/('+ data.nid +').vtt');
        if(count > 1){
          for(var i = 2; i <= count; i++){
            result = await fGet(dpath.replace("-t1-", `-t${i}-`));
            data = JSON.parse(getFirstMatch(/var player_\S+?=({.+?})</gm, result));
            links.push(decodeURIComponent(atob(data.url)));        
          }
        }
        after(links, subtitles);
      } catch (error) {
        onError(error);
      }
    }
  }
  
  