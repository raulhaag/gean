export class ZPlayer {
  constructor() {}
  getDDL(after, onError, web, customReferer = "") {
    try{
      let id = web.split("\?")[0].split("/").pop();
      fetch(window.serverHost + "get/"+ window.enc("https://v2.zplayer.live/video/" + id))
      .then(res => res.text())
      .then(response => {
        var rdata = [...response.matchAll(/download_video\('([^']+)','([^']+)','([^']+)'\)/gm)][0];
        var nw = "https://v2.zplayer.live/dl?op=download_orig&id=" + rdata[1] + "&mode=" + rdata[2] + "&hash=" + rdata[3];
        fetch(window.serverHost + "get/"+ window.enc(nw)).then(res => res.text())
        .then(response => {
          after({"video": [...response.matchAll(/href="([^"]+)" class="uk-button/gm)][0][1]});
        })
        .catch(err => {onError(err);});
      }).catch(err => {onError(err)})
    }catch(e){
      onError(e);
    }
  }
}
