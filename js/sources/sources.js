import { JKAnime } from "./jkanime.js";
import{SoloLatino} from "./sololatino.js";
export function openInNewTab(url) {
    window.open(url, '_blank').focus();
}

let servers = {"jkanime": new JKAnime(), "sololatino": new SoloLatino()};

export function getSource(name) {   return servers[name]; }

export function getResponse(name, callback, error_callback) {
    return servers[name].getFrontPage(callback, error_callback);
}

export function getLinks(path, callback, error_callback) {
}