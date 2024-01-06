import { AnimeFlvNet } from "./animeflv.js";
import { AnimeOnlineNinja } from "./aoninja.js";
import { JKAnime } from "./jkanime.js";
import { SoloLatino } from "./sololatino.js";
import { SoloLatinoSyP } from "./sololatinosyp.js";
import { TioAnime } from "./tioanime.js";

export function openInNewTab(url) {
        window.open(url, '_blank').focus();
}
let servers = {"animeflv.net": new AnimeFlvNet,
"jkanime": new JKAnime,
"sololatino": new SoloLatino,
"sololatinosyp": new SoloLatinoSyP,
"tioanime": new TioAnime,
};
export function getSource(name) {return servers[name];}

export function getResponse(name, callback, error_callback) {
    if(servers[name]){
        return servers[name].getFrontPage(callback, error_callback);
    }
    return servers["jkanime"].getFrontPage(callback, error_callback);
}

export function getLinks(path, callback, error_callback) {
}

export function getSourceList(){
    return Object.keys(servers);
}