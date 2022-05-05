import { JKAnime } from "./jkanime.js";
export function openInNewTab(url) {
    window.open(url, '_blank').focus();
}

let servers = {"jkanime": new JKAnime()};

export function getResponse(path, callback) {
    return servers["jkanime"].getFrontPage(callback);
}