import {getSource} from '../../js/sources/sources.js'
import {getDDL, getName, getPreferer} from '../../js/vservers/vserver.js'

function reveseSearch(sObject, value){
    return Object.keys(sObject).filter(e => sObject[e] == value)
}

export function playVideo (title, path, servers = [], noBack = false) {
    let paths = path.split("/");
    let vServers = servers;
    let vServersName = [];
    let vServerSelectedOptions = {};
    let links = [];
    let linksIds = [];
    let lastSelectedLink = '';
    let subtitles = '';

    let showPlayer = (src) => {
        let vdata = src.split("|||");
        window.isHls = vdata[0].indexOf(".m3u8") != -1;
        let videoSrc = vdata[0].replace('\\|format:.m3u8', "");

        if (window.appSettings["selected_player"].currentValue === "external" 
        || window.appSettings["selected_player"].currentValue === "internal"){
            if (window.appSettings["cache"][0] && !isHls) {
              if (videoSrc.indexOf("file/") !== -1) {
                videoSrc = videoSrc.replace("file/", "cache/");
              } else {
                videoSrc = window.serverHost + "cache/" + enc(videoSrc);
              }
            }
          let op = "view/";
          if(window.appSettings["selected_player"].currentValue === "internal"){
            op = "play/"
          }
          fetch(window.serverHost + op + window.enc(videoSrc))
            .then((response) => response.text())
            .then((result) => {
              if (result.trim() != "ok") {
                window.error(
                  "Error al abrir reproductor externo: \n" + result
                );
              }
            });
          window.hideLoading();
          return;
        }else{
            let extraSub = "";
            if(subtitles.length > 1){
              extraSub = `<track
              label="Español"
              kind="subtitles"
              srclang="en"
              src="${subtitles}"
              default />`;
            }
            let elPl = document.getElementById("player");
            let cServerName = vServersName[vServers.indexOf(lastSelectedLink)];
            let cQuality = reveseSearch(vServerSelectedOptions, src)[0];
            let innerHTML = `<div id="vSelect"><div id="vServers" onClick='{disposeVideo(); playVideo("${title.replace(/\"/g, "\\\"")}", "${path}", ${JSON.stringify(vServers)}, true);}'><div>${cServerName}</div></div><div id="vOptions"><div>${cQuality}</div></div></div>`;
            innerHTML += `<video id="vPlayer" src="${videoSrc}" controls autoplay>${extraSub}</video>`;
            elPl.innerHTML = innerHTML;

            if(window.isHls){
              var hls_config = {
                autoStartLoad: true,
                maxMaxBufferLength: 10*60,
                maxBufferSize: 50*1000*1000,
              };
              if (!Hls.isSupported()) {
                alert("Hls no soportado por el navegador");
              } else {
                let player = document.getElementById("vPlayer");
                window.hlsObj = new Hls(hls_config);
                window.hlsObj.loadSource(videoSrc);
                window.hlsObj.attachMedia(player);
              }
            }
            window.show(elPl);
            if(noBack){
                return;
            }
            let preHead = window.getHeader();
            window.setHeader(title);
            window.hideLoading();
            window.addBackAction(() => {
                hide(elPl);
                disposeVideo();
                elPl.innerHTML = '';
                setHeader(preHead);
            })
        }

        //alert("mira tu video....")
        /*
             <div id="vSelect"><div id="vServers"><div>Servidor 1</div></div><div id="vOptions"><div>Opcion 1</div></div></div>
            <video id="vPlayer" src="db.mp4" controls></video>
        */
    }

    let onVideoFail = (errorMessage) => {
        window.showError(errorMessage)
        let idx = vServers.indexOf(lastSelectedLink);
        if(idx >= 0){
            vServers.splice(idx, 1);
            vServersName.splice(idx, 1);
        }
        afterGetLinks(vServers, subtitles);
    }

    let afterGetDDL = (linkDict) => {
        vServerSelectedOptions = linkDict;  
        for (const [key, value] of Object.entries(linkDict)) {
            links.push(value);
            linksIds.push(key);
        }
        if(Object.keys(linkDict).length > 1 && window.appSettings["res_select"].currentValue){
            window.hideLoading();
            window.showOptionsDialog(
                "Selecciona una resolucion",
                linksIds,
                links,
                showPlayer,
                console.log,
                0
            )  

        }else{
            showPlayer(linkDict["video"]);
        }
    };

    let afterSelectServer = (selected) => {
        lastSelectedLink = selected;
        window.showLoading();
        getDDL(afterGetDDL, onVideoFail, selected);
    };

    let afterGetLinks = (links, subtitles_ = '') => {
        subtitles = subtitles_;
        vServers = getPreferer(links);
        if(vServers.length == 0){
            window.showError("No se encotraron links");
            return;
        }
        for(let i = 0; i < vServers.length; i++){
            vServersName[i] = getName(vServers[i]);
        }
        if(window.appSettings["vsource_select"].currentValue){
            window.hideLoading();
            window.showOptionsDialog(
                "Selecciona un servidor",
                vServersName,
                vServers,
                afterSelectServer,
                console.log,
                0
            )
        }else{
            afterSelectServer(vServers[0])
        }
    };
    if(vServers.length > 0){
        afterGetLinks(vServers);
        return;
    }
    window.showLoading();
    getSource(paths[0]).getLinks(afterGetLinks, console.log, paths[2]);
}

window.disposeVideo = () => {
    let video = document.getElementsByTagName("VIDEO")[0];
    if (video) {
        video.pause();
        video.src = "";
        video.load();
    }
    if(window.isHls) window.hlsObj.destroy();
}

window.playVideo = playVideo


export function testPlayer(url, isHLS = false){
  let elPl = document.getElementById("player");
  let innerHTML = `<div id="vSelect"><div id="vServers" onClick=''><div>Test</div></div><div id="vOptions"><div>Test</div></div></div>`;
  innerHTML += `<video id="vPlayer" src="${url}" controls autoplay></video>`;
  elPl.innerHTML = innerHTML;
  if(window.isHls){
    var hls_config = {
      autoStartLoad: true,
      maxMaxBufferLength: 10*60,
      maxBufferSize: 50*1000*1000,
    };
    if (!Hls.isSupported()) {
      alert("Hls no soportado por el navegador");
    } else {
      let player = document.getElementById("vPlayer");
      window.hlsObj = new Hls(hls_config);
      window.hlsObj.loadSource(videoSrc);
      window.hlsObj.attachMedia(player);
    }
  }
  //window.hideLoading(); 
  show(elPl);
} 

