export class JKAPI {
    constructor() {}
    getDDL(after, onError, web, rt = true) {
      let headers = { Referer: web };
      let rqs =
        btoa(web) +
        "/" +
        btoa(JSON.stringify(headers)); //headers
      fetch(window.serverHost + "get/" + rqs)
        .then((response) => response.text())
        .then((result) => {
            let data = [...result.matchAll(/"data"\s+value="(.+?)"/gm)][0][1];
            let params = {"data": data};
            headers["Content-Type"]= "application/x-www-form-urlencoded";
            rqs = btoa("https://jkanime.net/gsplay/redirect_post.php") + "/" + btoa(JSON.stringify(headers)) + "/" + btoa(JSON.stringify(params));
            fetch(window.serverHost +"rpost/" + rqs)

            .then((response) => response.text())
            .then((result) => {
                let v = result.split('#')[1];
                let headers = { };
                params = {"v": v};
                rqs = btoa('https://jkanime.net/gsplay/api.php') + "/" + btoa(JSON.stringify(headers)) + "/" + btoa(JSON.stringify(params));
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
