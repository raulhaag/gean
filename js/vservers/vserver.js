import {Fembed} from "./fembed.js";
import {JKAPI} from "./jkapi.js";
let servers = {"fembed": new Fembed(), "jkapi": new JKAPI()};

export function getDDL(after, onError, web) {
    if(web.indexOf("fembed") != -1) {
        servers["fembed"].getDDL(after, onError, web);
    }
    else if(web.indexOf("/um2.php?e=") != -1) {
        servers["jkapi"].getDDL(after, onError, web);
    } else {
        onError("Not supported server");
    }
}

export function getName(web) {
    if(web.indexOf("fembed") != -1) {
        return "Fembed";
    }
    else if(web.indexOf("/um2.php?e=") != -1) {
        return "Gdrive_JKAPI";
    } else {
        return "";
    }
}

export function getPreferer(list){
    let preferer = ["/um2.php?e=","fembed"];
    let ordered = [];
    for(let i = 0; i < preferer.length; i++){
        for(let j = 0; j < list.length; j++){
            if(list[j].indexOf(preferer[i]) != -1){
                ordered.push(list[j]);
            }
        }
    }
    return ordered;
}