import {getSource} from '../../js/sources/sources.js'
import {getDDL, getName, getPreferer} from '../../js/vservers/vserver.js'

function reveseSearch(sObject, value){
    return Object.keys(sObject).filter(e => sObject[e] == value)
}

export function playVideo (title, path, servers = []) {
    let paths = path.split("/");
    let vServers = servers;
    let vServersName = [];
    let vServerSelectedOptions = {};
    let links = [];
    let linksIds = [];
    let lastSelectedLink = '';

    let showPlayer = (src) => {
        if (window.appSettings["selected_player"].currentValue === "external" 
        || window.appSettings["selected_player"].currentValue === "internal"){
            let vdata = src.split("|||");
            let videoSrc = vdata[0];
            let isHls = vdata[0].indexOf(".m3u") != -1; 
            if (window.appSettings["cache"][0] && !isHls) {
              if (videoSrc.indexOf("file/") !== -1) {
                videoSrc = videoSrc.replace("file/", "cache/");
              } else {
                videoSrc = window.serverHost + "cache/" + enc(videoSrc);
              }
            }
          let op = "view/";
          if(window.appSettings["selected_player"] === "internal"){
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
          hideLoading();
          return;
        }else{
            let elPl = document.getElementById("player");
            let cServerName = vServersName[vServers.indexOf(lastSelectedLink)];
            let cQuality = reveseSearch(vServerSelectedOptions, src)[0];
            let innerHTML = `<div id="vSelect"><div id="vServers" onClick='{playVideo("${title.replace(/\"/g, "\\\"")}", "${path}", ${JSON.stringify(vServers)});}'><div>${cServerName}</div></div><div id="vOptions"><div>${cQuality}</div></div></div>`;
            innerHTML += `<video id="vPlayer" src="${src}" controls></video>`;
            elPl.innerHTML = innerHTML;
            show(elPl);
            setHeader(title)
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
        afterGetLinks(vServers);
    }

    let afterGetDDL = (linkDict) => {     
        vServerSelectedOptions = linkDict;  
        for (const [key, value] of Object.entries(linkDict)) {
            links.push(value);
            linksIds.push(key);
        }
        if(linkDict.length > 1 && window.appSettings["res_select"].currentValue){

            window.showOptionsDialog(
                "Selecciona una resolucion",
                links,
                linksIds,
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
        getDDL(afterGetDDL, onVideoFail, selected);
    };

    let afterGetLinks = (links) => {
        vServers = getPreferer(links);
        if(vServers.length == 0){
            //TODO trow error
            return;
        }
        for(let i = 0; i < vServers.length; i++){
            vServersName[i] = getName(vServers[i]);
        }
        if(window.appSettings["vsource_select"].currentValue){
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
    getSource(paths[0]).getLinks(afterGetLinks, console.log, paths[2]);
}

window.playVideo = playVideo