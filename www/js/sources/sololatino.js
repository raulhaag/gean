export class SoloLatino {
  constructor() {
    this.name = "sololatino";
    this.baseUrl = "https://sololatino.net/animes/";
  }
  async getFrontPage(after, onError) {
    try {
      var out = {};
      let result = await window.fGet("https://sololatino.net/animes/novedades/");
      try{
        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "text/html");
        let flis = doc.getElementsByClassName("item se episodes"); //doc.querySelectorAll("html body.error404 div#dt_contenedor div#contenedor div.module div.content.full_width_layout div#archive-content.animation-2.items div.items article");
        out["Nuevos capítulos"] = this.parseList(flis, "/getLinks/");
      }catch(e){}
      result = await window.fGet("https://sololatino.net/animes/");
      try{
        var parser = new DOMParser();
        var doc = parser.parseFromString(result, "text/html");
        let flis = doc.getElementsByClassName("item animes"); //doc.querySelectorAll("html body.error404 div#dt_contenedor div#contenedor div.module div.content.full_width_layout div#archive-content.animation-2.items div.items article");
        out["Nuevos animes"] = this.parseList(flis);
      }catch(e){}
      out["Por genero"] = [
        {
          "name": "Acción",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + 'filtro/?genre=accion/')
        },
        {
          "name": "Acción y Aventura",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + 'filtro/?genre=action-adventure/')
        },
        {
          "name": "Anime",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + 'filtro/?genre=anime/')
        },
        {
          "name": "Aventura",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + 'filtro/?genre=aventura/')
        },
        {
          "name": "Comedia",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + 'filtro/?genre=comedia/')
        },
        {
          "name": "Crimen",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + 'filtro/?genre=crimen/')
        },
        {
          "name": "Drama",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + 'filtro/?genre=drama/')
        },
        {
          "name": "Familia",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + 'filtro/?genre=familia/')
        },
        {
          "name": "Fantasía",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + 'filtro/?genre=fantasia/')
        },
        {
          "name": "Kids",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + 'filtro/?genre=kids/')
        },
        {
          "name": "Misterio",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + 'filtro/?genre=misterio/')
        },
        {
          "name": "Romance",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + 'filtro/?genre=romance/')
        },
        {
          "name": "SCI-FI & Fantasia",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + 'filtro/?genre=sci-fi-fantasy/')
        },
        {
          "name": "Terror",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + 'filtro/?genre=terror/')
        },
        {
          "name": "Belica",
          "path": this.name + '/getMore/' + window.enc(this.baseUrl + 'filtro/?genre=war-politics/')
        }
      ]
      after(out);
    } catch (error) {
      onError(error.name);
    }
  }

  async getMore(after, onError = console.log, more , title = ""){
    let web = window.dec(more);
    if(web === "Homepage"){
      this.getFrontPage(after, onError);
      return;
    }
    let preLinks = [
      {
        "name": "Home",
        "image": "./images/home_nav.png",
        "path": this.name + "/getMore/" + window.enc("Homepage"),
      }
    ];
    let posLinks = [];
    try{
      let result = await window.fGet(window.dec(more));
      var parser = new DOMParser();
      var doc = parser.parseFromString(result, "text/html");
      let pages = doc.getElementsByClassName("pagMovidy")[0].getElementsByTagName("a");
      if(pages.length == 2){
        preLinks.push({"name": "Pagina Anterior", "image": "./images/prev_nav.png", "path": this.name + "/getMore/" + window.enc(pages[0].getAttribute("href"))}); 
        posLinks.push({"name": "Pagina siguiente", "image": "./images/next_nav.png", "path": this.name + "/getMore/" + window.enc(pages[1].getAttribute("href"))});
      }else{
        posLinks.push({"name": "Pagina siguiente", "image": "./images/next_nav.png", "path": this.name + "/getMore/" + window.enc(pages[0].getAttribute("href"))});
      }
      let allPages = doc.getElementsByClassName("item");;
      let pd = this.parseList(allPages);
      after({
        [title]: preLinks.concat(pd, posLinks),
      });
    }catch(e){
      onError(e);
    }
  }

  parseList(flis, mode = "/getDescription/") {
    let nc = [];
    for (var i = 0; i < flis.length; i++) {
      nc.push({
        "name": flis[i].getElementsByTagName("h3")[0].innerText,
        "path": this.name + mode + window.enc(flis[i].getElementsByTagName("a")[0].getAttribute("href")),
        "image": flis[i].getElementsByTagName("img")[0].getAttribute("data-srcset")
      });
    }
    return nc;
  }

  async getDescription(after, onError, path, page = 0) {
    try{
      let result = await fGet(dec(path));
      var parser = new DOMParser();
      var doc = parser.parseFromString(result, "text/html");
      let sname =  doc.getElementsByTagName("h1")[1].innerText;
      let description =  doc.getElementsByTagName("p")[0].innerText.trim();
      let image = doc.querySelectorAll('meta[property~="og:image"]')[0].content.trim();
      let chapters = [];
      let ch = [];
      let sh = doc.querySelectorAll("ul.episodios");
      for (var i = 0; i < sh.length; i++) {//for multiple seasons
        ch = [...ch, ...sh[i].getElementsByTagName("li")];
      }
      for(var i = 0; i < ch.length; i++){
        chapters.push({"name":ch[i].querySelector(".numerando").innerText  + " - " + ch[i].querySelector(".epst").innerText,
                       "path": this.name + "/getLinks/" + window.enc(ch[i].firstChild.getAttribute("href"))});
      }

      if(chapters.length == 0){
        chapters.push({"name":"Película", "path": this.name + "/getLinks/" + path});
      }
      after({"name": sname, "path": this.name + "/getDescription/" + path, "image": image, "items":[description], "chapters": chapters});
    }catch(nerror){
      onError(nerror);
    };
  }

  async getParent(after, path) {
    let dpath = (window.dec(path)).replace("episodios", "animes").replace(/-[^-]+?\d\/$/gm, "/");
    
    let reduce = function(v){after({"name": v.name, "image": v.image, "path": v.path}, path)};
    this.getDescription(reduce, console.log, window.enc(dpath));
  }

  async getList(page, filter = "") {}

  async getSearch(after, onError, query) {
    try{
      let ra = [];
      let result = await fGet("https://sololatino.net/?s=" + encodeURIComponent(query));
      var parser = new DOMParser();
      var doc = parser.parseFromString(result, "text/html");
      let flis = doc.getElementsByClassName("item"); //doc.querySelectorAll("html body.error404 div#dt_contenedor div#contenedor div.module div.content.full_width_layout div#archive-content.animation-2.items div.items article");
      for (var i = 0; i < flis.length; i++) {
        ra.push({
          "name": flis[i].getElementsByTagName("h3")[0].innerText,
          "path": this.name + "/getDescription/" + window.enc(flis[i].getElementsByTagName("a")[0].getAttribute("href")),
          "image": flis[i].getElementsByTagName("img")[0].getAttribute("data-srcset")
        });
      }
      after(ra);
      }catch(error){
        onError(error);
      }
  }

  async getLinks(after, onError, path) {
    try{
      let result = await fGet(dec(path));
      let links = [];
      let linkpages = [...result.matchAll(/data-type=["'](.+?)["'] data-post=["'](.+?)["'] data-nume=["'](.+?)["']/gm)];
      for(let i = 0; i < linkpages.length; i++){
        try{
          let presp = await fPost("https://sololatino.net/wp-admin/admin-ajax.php",
          { "Referer": window.dec(path),
            "User-Agent": navigator.userAgent,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "Accept-Encoding": "deflate"
          },
          {"action":"doo_player_ajax", "post": linkpages[i][2], "nume": linkpages[i][3],"type":	linkpages[i][1]}
          );
          let bData = await fGet(getFirstMatch(/<iframe class='[^']+' src='([^']+)/gm, presp), {"User-Agent": navigator.userAgent, "Referer": dec(path)});
          links = links.concat(this.parseLinks(bData));
        }catch(ignoreAndContinue){}
      }
      if (links.length === 0) {// if no links
        let web = [...result.matchAll(/"pframe"><iframe class="[^"]+" src="([^"]+)/gm)][0][1];
        result = await fGet(web, {"User-Agent": navigator.userAgent, Referer: this.baseUrl});
        links = links.concat(this.parseLinks(result));
        if(links.length == 0 && web.includes("xyz")){
          links.push(web)
        }
      }
      after(links);
    }catch(error){
        onError(error);
    };
  }

  getLangInfo(ca){
    switch(ca){
      case '0': return "Lat";
      case '1': return "Esp";
      case '2': return "Sub";
      default: return "Otro"
    }
  }

  parseLinks(htmlContent){
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlContent, "text/html");
    var lis = doc.getElementsByTagName("li");
    let links = [];
    for (const link of lis) {
      try{
        if(link.hasAttribute("data-r")){
          let linkd = atob(link.getAttribute("data-r"));
          if(linkd.indexOf("sypl.xyz")){
            linkd = linkd.replace("sypl.xyz", "owodeuwu.xyz");
          }
          links.push(linkd);
        }else{
          var decoded =  getFirstMatch(/\.php\?link=(.+?)&servidor=/gm,link.getAttribute("onclick"))
          if(decoded){
            links.push(atob(decoded) + 
            "||info_" + this.getLangInfo(link.dataset.lang));
          }
          try{
            links.push([...link.getAttribute("onclick").matchAll(/go_to_playerVast\('(.+?)'/gm)][0][1] + 
            "||info_" + this.getLangInfo(link.dataset.lang));
            links.push(atob([...link.getAttribute("onclick").matchAll(/go_to_playerVast\('(.+?)'/gm)][0][1]) + 
            "||info_" + this.getLangInfo(link.dataset.lang));
          }catch(e){
          links.push([...link.getAttribute("onclick").matchAll(/go_to_player\('(.+?)'/gm)][0][1] + 
          "||info_" + this.getLangInfo(link.dataset.lang));
            links.push(atob([...link.getAttribute("onclick").matchAll(/go_to_player\('(.+?)'/gm)][0][1]) + 
            "||info_" + this.getLangInfo(link.dataset.lang));
          }
        }
      }catch(e){}//continue
    }
    let jslinks = getFirstMatch(/dataLink = (\[.+?\]);/gm, htmlContent)
    if(jslinks){
      let items = JSON.parse(jslinks);
      for(let i = 0; i < items.length; i++){
        let lang = items[i]["video_language"]
        for(let j = 0; j < items[i]['sortedEmbeds'].length; j++){
          if(items[i]['sortedEmbeds'][j]['link'].indexOf('http') == -1)
            links.push(dcl(items[i]['sortedEmbeds'][j]['link']) + "||info_" + lang);
          else
            links.push((items[i]['sortedEmbeds'][j]['link']) + "||info_" + lang);
        }
      }

    }
    return links;
  }
}
function dcl_old(el){

  const bytes = CryptoJS.AES.decrypt(el, 'Ak7qrvvH4WKYxV2OgaeHAEg2a5eh16vE');
  const dclk = bytes.toString(CryptoJS.enc.Utf8);
  return dclk;
}

function dcl(encryptedLinkBase64, secretKey = 'Ak7qrvvH4WKYxV2OgaeHAEg2a5eh16vE'){
  const encryptedData = CryptoJS.enc.Base64.parse(encryptedLinkBase64);
  const encryptedStr = CryptoJS.enc.Base64.stringify(encryptedData);

  const iv = encryptedData.words.slice(0, 4); // 
  const encryptedBytes = encryptedData.words.slice(4); // 

  
  const ivWordArray = CryptoJS.lib.WordArray.create(iv);
  const encryptedWordArray = CryptoJS.lib.WordArray.create(encryptedBytes);

 
  const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedWordArray },
      CryptoJS.enc.Utf8.parse(secretKey),
      { iv: ivWordArray, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );

  
  const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);

  return decryptedStr;
}