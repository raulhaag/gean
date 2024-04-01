import {getSource} from '../../js/sources/sources.js'
import {getDDL, getName, getPreferer} from '../../js/vservers/vserver.js'

export function playVideo (title, path) {
    let vServers = [];
    let vServersName = [];
    let vServerSelectedOptions = {};
    let links = [];
    let linksIds = [];

    let showPlayer = (src) => {
        alert("mira tu video....")
        /*
             <div id="vSelect"><div id="vServers"><div>Servidor 1</div></div><div id="vOptions"><div>Opcion 1</div></div></div>
            <video id="vPlayer" src="db.mp4" controls></video>
        */
    }

    let afterGetDDL = (linkDict) => {       
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
        getDDL(afterGetDDL, console.log, selected);
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
    
    getSource(path.split("/")[0]).getLinks(afterGetLinks, console.log, path);
}