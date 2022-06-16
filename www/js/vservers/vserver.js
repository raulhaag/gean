import {Fembed} from "./fembed.js";
import {JKAPI, JKXtreme} from "./jkapi.js";
import {ReSololatino, SololatinoXYZ} from "./re_sololatino.js";
import {ZPlayer} from "./zplayer.js";
import{YourUpload}from "./yourupload.js";
let servers = {"fembed": new Fembed(),
               "jkapi": new JKAPI(),
                "jkxtreme": new JKXtreme(),
               "re_sololatino": new ReSololatino(),
               "sololatinoxyz": new SololatinoXYZ(),
                "zplayer.live": new ZPlayer(),
                "yourupload": new YourUpload()};

export function getDDL(after, onError, web) {
    if(web.indexOf("jk.php?u=stream") != -1) {
        servers["jkxtreme"].getDDL(after, onError, web);
    }else if(web.indexOf("fembed") != -1) {
        servers["fembed"].getDDL(after, onError, web);
    }
    else if(web.indexOf("/um2.php?e=") != -1) {
        servers["jkapi"].getDDL(after, onError, web);
    }else if(web.startsWith("https://re.sololatino.net/p/embed.php")){
        servers["re_sololatino"].getDDL(after, onError, web);
    }else if(web.startsWith("https://sololatino.xyz/v/")){
        return servers["sololatinoxyz"].getDDL(after, onError, web);
    }else if(web.indexOf("zplayer.live") != -1) {
        return servers["zplayer.live"].getDDL(after, onError, web);
    }else if(web.indexOf("yourupload") != -1) {
        return servers["yourupload"].getDDL(after, onError, web);
    }else{
        onError("Not supported server");
    }
}

export function getName(web) {
    if(web.indexOf("jk.php?u=stream") != -1) {
        return "jkxtreme";
    }else if(web.indexOf("fembed") != -1) {
        return "Fembed";
    }
    else if(web.indexOf("/um2.php?e=") != -1) {
        return "Gdrive_JKAPI";
    }else if(web.startsWith("https://sololatino.xyz/v/")){
        return "ReSololatino";
    }else if(web.startsWith("https://re.sololatino.net/p/embed.php")){
        return "ReSololatino";
    }else if(web.indexOf("yourupload") != -1) {
        return "yourupload";
    }else {
        return "";
    }
}

export function getPreferer(list){
    let preferer = ["/um2.php?e=", "jk.php?u=stream",  "fembed", "zplayer.live", "https://sololatino.xyz/v/", "https://re.sololatino.net/p/embed.php", "yourupload"];
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