import {JKAPI, JKXtreme, Desu} from "./jkapi.js";
import {ReSololatino, SololatinoXYZ, OwodeuwuXYZ, MamazonPlayer} from "./re_sololatino.js";
import {ZPlayer} from "./zplayer.js";
import {YourUpload}from "./yourupload.js";
import {OkRu}from "./okru.js";
import {ZippyShare} from "./zippy.js";
import {Mediafire} from "./mfire.js"
import { Plusvip } from "./plusvip.js";
import { Streamlare } from "./streamlare.js";
import { Streamtape } from "./streamtape.js";
import { Mixdrop } from "./mixdropCo.js";
import { Voe } from "./voe.js";
import { StreamWish } from "./streamwish.js";
import { FileMoon } from "./filemoon.js";
import { FileLions } from "./filelions.js";
import {Plustr} from "./plustr.js";
import { VK } from "./vk.js";
import { DailyMotion } from "./dailymot.js";
import { VidHidepro } from "./vidhidepro.js";
import { DoodStream } from "./doodstream.js";
import { BurstCloud } from "./burst.js";
import { Mp4Upload } from "./mp4upload.js";
import { MaRu } from "./maru.js";
import { Hglink } from "./hglink.js";
import { Uqload } from "./uqload.js";
import { Hexload } from "./hexload.js";
import { Vimeos } from "./vimeos.js";

let servers = [ new JKAPI(), new JKXtreme(), new Desu(),
                new ReSololatino(), new SololatinoXYZ(),
                new ZPlayer(), new YourUpload(), new OkRu(),
                new OwodeuwuXYZ(), new ZippyShare(), new Mediafire(), 
                new Plusvip(), new Streamlare(), new MamazonPlayer(),
                new Mixdrop(), new Streamtape(), new Voe(), 
                new FileMoon(), new FileLions(), new Plustr(),
                new VK(), new DailyMotion(), new VidHidepro(),
                new DoodStream(), new BurstCloud(), new Mp4Upload(),
                new MaRu(), new Hglink(), new Uqload(),
                new Hexload(), new Vimeos(), new StreamWish(),
            ];
let prefered = loadPreferenced();
orderServersByPrefered();

let interceptors = [];

export function registerInterceptor(contains, callback){
    interceptors.push({"contains": contains, "callback": callback});
}

export async function getDDL(after, onError, web) {
    for(let a in interceptors){
            if(web.indexOf(interceptors[a].contains) != -1){
                web = await interceptors[a].callback(cleanInfo(web));
            }
    }
    web = web.replace(/\|\|info.+/gm, "");
  /*   if(web.startsWith("https://jkanime.net/c3.php?u=")){
        let sname = getFirstMatch(/s\=(.+)/gm, web);
        let nw = web.replace("https://jkanime.net/c3.php?u=", "https://c4.jkdesu.com/e/").replace(/&[\s\S]+/gm,"");
        web = await fGet(nw);
        web = getFirstMatch(/<iframe width="100%" height="100%" src="(.+)"/gm, web);
        web = web + "||info_server_" + sname + ".";
    } */
    /*if(web.startsWith("{")){
        after({"video": JSON.parse(web)["path"]});
    }else*/ 
    if(web.indexOf("server_name_EnlaceDirecto") != -1) {
        after({video: cleanInfo(web)}); 
        return;
    }
    for(let i = 0; i < servers.length; i++){
        if(servers[i].can(cleanInfo(web))){
            servers[i].getDDL(after, onError, cleanInfo(web));
            return;
        }
    }
    onError("Not supported server");
}

function cleanInfo(data){
    return data.replace(/\|\|server_name_.+/gm, "");
}

export function getName(web) {
    let info = " " + window.getFirstMatch(/\|\|info_(.+)/gm, web);
    let name = "";
    /*if(web.startsWith("{")){
        return JSON.parse(web)["name"];
    }else*/ 
    if(web.indexOf("server_name_EnlaceDirecto") != -1) {
        name = "Directo";
    }
    name = "";
    for(let i = 0; i < servers.length; i++){
        if(servers[i].can(cleanInfo(web))){
            name = servers[i].name();
            break;
        }
    }

    return name + info;
}

export function getPreferer(list){
    let ordered = [];
    for(let i = 0; i < servers.length; i++){
        for(let j = 0; j < list.length; j++){
            if(servers[i].can(list[j])){
                ordered.push(list[j]);
                break;
            }
        }
    }
    return ordered;
}

function orderServersByPrefered(){
    //ordena los servidores segun la lista de prefered
    let ordered = [];
    for(let i = 0; i < prefered.length; i++){
        for(let j = 0; j < servers.length; j++){
            if(servers[j].name() == prefered[i]){
                ordered.push(servers[j]);
                break;
            }
        }
    }
    //agrega al final los que no estan en prefered
    for(let i = 0; i < servers.length; i++){
        if(ordered.indexOf(servers[i]) == -1){
            ordered.push(servers[i]);
        }
    }
    servers = ordered;
}


export function setServerAsLast(url){
    let name = "";
    for(let i = 0; i < servers.length; i++){
        if(servers[i].can(cleanInfo(url))){
            name = servers[i].name();
            break;
        }
    }
    if(name == ""){
        return;
    }
    if(prefered.indexOf(name) == 0){
        return;
    }else if(prefered.indexOf(name) == -1){
        prefered.unshift(name);
    }else{
        prefered.splice(prefered.indexOf(name), 1);
        prefered.unshift(name);
    }
    savePrefered();
    orderServersByPrefered();
}

function savePrefered(){
    localStorage.setItem("prefered", JSON.stringify(prefered));
}

function loadPreferenced(){
    if(localStorage.getItem("prefered") != null){
        return JSON.parse(localStorage.getItem("prefered"));
    }
    return [];
}