export class JKAPI {
    constructor() {}
    getDDL(after, onError, web, rt = true) {
      if(web.indexOf("https://jkanime.net/") == -1 ){
        web = "https://jkanime.net/" + web;
      }
      let headers = { Referer: web };
      let rqs =
        window.enc(web) +
        "/" +
        window.enc(JSON.stringify(headers)); //headers
      fetch(window.serverHost + "get/" + rqs)
        .then((response) => response.text())
        .then((result) => {
            let data = [...result.matchAll(/"data"\s+value="(.+?)"/gm)][0][1];
            let params = {"data": data};
            headers["Content-Type"]= "application/x-www-form-urlencoded";
            rqs = window.enc("https://jkanime.net/gsplay/redirect_post.php") + "/" + window.enc(JSON.stringify(headers)) + "/" + window.enc(JSON.stringify(params));
            fetch(window.serverHost +"rpost/" + rqs)

            .then((response) => response.text())
            .then((result) => {
                let v = result.split('#')[1];
                let headers = { };
                params = {"v": v};
                rqs = window.enc('https://jkanime.net/gsplay/api.php') + "/" + window.enc(JSON.stringify(headers)) + "/" + window.enc(JSON.stringify(params));
                fetch(window.serverHost + "post/" + rqs)
                .then((response) => response.json())
                .then((result) => {
                    if(result["file"] == null && rt ){
                        this.getDDL(after, onError, web, false);
                    }else if(result["file"] == null){
                      onError("No se pudo obtener el video");
                    }else{
                      let response = {"video": result['file']}
                      after(response);
                    }
                })
            }).catch((error) => {
                onError(error);
            });
        })
        .catch((error) => {
          onError(error);
        });
    }
}

export class JKXtreme{
    constructor() {}
    getDDL(after, onError, web) {
      if(web.indexOf("https://jkanime.net/") == -1 ){
        web = "https://jkanime.net/" + web;
      }
      after({"video": web.replace("jk.php?u=", "")});
    }
}

export class Desu{
  async getDDL(after, onError, web) {
    try{
      let link = "https://jkanime.net/" + web;
      let content = await fGet(link, {"Referer":
                    "https://jkanime.net/"});
      var match = getFirstMatch(/url:\s*'(.+?)'/gm, content);
      if (match) {
        after({"video": match});
        return
      }
    }catch(e){};
    onError("Error al obtener video")
  }
}