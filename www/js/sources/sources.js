import { AnimeFlvNet } from "./animeflv.js";
import {  AnimeFenix } from "./animefenix.js";
import { JKAnime } from "./jkanime.js";
import { SoloLatino } from "./sololatino.js";
import { SoloLatinoSyP } from "./sololatinosyp.js";
import { TioAnime } from "./tioanime.js";
import { NOTestServer } from "./test.js";
import { PanDramaTV } from "./pandrama.js";
import { DeadServer } from "./deadserver.js";
import { CuevaRun } from "./cuevarun.js";

export function openInNewTab(url) {
        window.open(url, '_blank').focus();
}
let servers = {"animeflv.net": new AnimeFlvNet(),
"AnimeFenix": new AnimeFenix(),
"jkanime": new JKAnime(),
"sololatino": new SoloLatino(),
"sololatinosyp": new SoloLatinoSyP(),
"tioanime": new TioAnime(),
"PanDrama": new PanDramaTV(),
"testserver": new NOTestServer(),
"DeadServer": new DeadServer(),
"CuevaRun": new CuevaRun(),
};
export function getSource(name) {
    return (servers[name])? servers[name]:servers["DeadServer"]
}

export function getResponse(name, callback, error_callback) {
    getSource(name).getFrontPage(callback, error_callback);
}

export function getLinks(path, callback, error_callback) {

}

export function getSourceList(){
    return Object.keys(servers);
}