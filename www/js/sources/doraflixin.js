// player_.+?=({.+?})< player config
// enc 1 unnescaper(atob(src))
export class NODoraFlixIn {
    constructor() {
      this.name = "DoraFlixIn";
      this.host = atob("aHR0cHM6Ly9kb3JhbWFzZmxpeC5pbi8=");//
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
        let sname = doc.querySelector(".hl-dc-title").innerText;
        let description = doc.querySelector(".hl-content-text > em:nth-child(1)").textContent.trim();
        let genres = doc.querySelector(".hl-full-box > ul:nth-child(2) > li:nth-child(5) > a:nth-child(4)").textContent.trim();
        let image = doc.querySelector(".hl-dc-pic > span:nth-child(1)").getAttribute("data-original");
        let chapters = [];
        let chap = doc.querySelectorAll("li.hl-col-sm-2");
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
        let response = await fGet(`${this.host}/vodsearch/-------------/?wd=${encodeURIComponent(query)}&submit=`);
        if (response.indexOf("error") == 0) {
          onError(response);
          return;
        }
        var parser = new DOMParser();
        var doc = parser.parseFromString(response, "text/html");
        let res = [];
        try {
          let flis = doc.querySelectorAll(".hl-item-thumb")
          ;
          for (var i = 0; i < flis.length; i++) {
            res.push({
              "name": flis[i].title,
              "image": flis[i].dataset["original"],
              "path":    this.name + "/getDescription/" + window.enc(this.host + flis[i].getAttribute("href")),
            });
          }
        } catch (nerror) {
          onError(nerror);
        }
        fres = fres.concat(res);
      after(fres);
    }
  
    async getLinks(after, onError, path) {
      try {
        let dpath = window.dec(path);
        let result = await fGet(dpath);
        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "text/html");
        let jsd = JSON.parse(doc.getElementById("__NEXT_DATA__").innerHTML);
        if (result.indexOf("error") == 0) {
          onError(result);
          return;
        }
        let data = JSON.parse(getFirstMatch(/var player_\S+?=({.+?})</gm, result));
        let count = (result.match(/hl-tabs-btn hl-slide-swiper/g) || []).length;
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
  
  