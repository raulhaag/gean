import { JKAnime } from "./jkanime.js";
export function openInNewTab(url) {
    window.open(url, '_blank').focus();
}

let servers = {"jkanime": new JKAnime()};

export function getServer(name) {   return servers[name]; }

export function getResponse(path, callback, error_callback) {
    return servers["jkanime"].getFrontPage(callback, error_callback);
}

export function getLinks(path, callback, error_callback) {
}