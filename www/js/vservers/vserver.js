import {Fembed} from "./fembed.js";
import {JKAPI, JKXtreme, Desu} from "./jkapi.js";
import {ReSololatino, SololatinoXYZ, OwodeuwuXYZ, EmbedsitoNet, MamazonPlayer} from "./re_sololatino.js";
import {ZPlayer} from "./zplayer.js";
import {YourUpload}from "./yourupload.js";
import {OkRu}from "./okru.js";
import {ZippyShare} from "./zippy.js";
import {Mediafire} from "./mfire.js"
import { Plusvip } from "./plusvip.js";
import { Streamlare } from "./streamlare.js";
import { Streamtape } from "./streamtape.js";
import { StreamSB } from "./streamsb.js";
import { Mixdrop } from "./mixdropCo.js";
import { Voe } from "./voe.js";
import { StreamWish } from "./streamwish.js";
import { FileMoon } from "./filemoon.js";
import { FileLions } from "./filelions.js";

let servers = {"fembed": new Fembed(),
                "jkapi": new JKAPI(),
                "jkxtreme": new JKXtreme(),
                "desu": new Desu(),
                "re_sololatino": new ReSololatino(),
                "sololatinoxyz": new SololatinoXYZ(),
                "zplayer.live": new ZPlayer(),
                "yourupload": new YourUpload(),
                "okru": new OkRu(),
                "owodeuwu.xyz" : new OwodeuwuXYZ(),
                "zippy": new ZippyShare(),
                "mediafire.com": new Mediafire(),
                "plusvip.net": new Plusvip(),
                "streamlare.com": new Streamlare(),
                "embedsito.net/reproamz": new EmbedsitoNet(),
                "/reproamz/": new MamazonPlayer(),
                "mixdrop": new Mixdrop(),
                "streamsb": new StreamSB(),
                "streamtape.com": new Streamtape(),
                "voe": new Voe(),
                "streamwish": new StreamWish(),
                "filemoon": new FileMoon(),
                "filelions": new FileLions(),
            };

export async function getDDL(after, onError, web) {
    web = web.replace(/\|\|info.+/gm, "");
    if(web.startsWith("https://jkanime.net/c3.php?u=")){
        let nw = web.replace("https://jkanime.net/c3.php?u=", "https://c3.jkdesu.com/e/").replace(/&[\s\S]+/gm,"")
        web = await fRGet(nw)
    }
    /*if(web.startsWith("{")){
        after({"video": JSON.parse(web)["path"]});
    }else*/ if(web.indexOf("jk.php?u=stream") != -1) {
        servers["jkxtreme"].getDDL(after, onError, web);
    }else if(web.indexOf("plusvip.net") != -1) {
        servers["plusvip.net"].getDDL(after, onError, web);
    }else if(web.indexOf("um.php?e=") != -1) {
        servers["desu"].getDDL(after, onError, web);
    }else if(web.indexOf("/um2.php?e=") != -1) {
        servers["jkapi"].getDDL(after, onError, web);
    }else if(web.startsWith("https://re.sololatino.net/p/embed.php")){
        servers["re_sololatino"].getDDL(after, onError, web);
    }else if(web.startsWith("https://sololatino.xyz/v/")){
        servers["sololatinoxyz"].getDDL(after, onError, web);
    }else if(web.indexOf("zplayer.live") != -1) {
        servers["zplayer.live"].getDDL(after, onError, web);
    }else if(web.indexOf("yourupload") != -1) {
        servers["yourupload"].getDDL(after, onError, web);
    }else if(web.indexOf("ok.ru") != -1) {
        servers["okru"].getDDL(after, onError, web);
    }else if(web.indexOf("owodeuwu.xyz") != -1) {
        servers["owodeuwu.xyz"].getDDL(after, onError, web);
    }else if(web.indexOf("/reproamz/") != -1) {
        servers["/reproamz/"].getDDL(after, onError, web);
    }else if(web.indexOf("zippishare") != -1){
        servers["zippishare"].getDDL(after, onError, web);
    }else if(web.indexOf("mediafire.com") != -1) {
        servers["mediafire.com"].getDDL(after, onError, web);
    /*}else if(web.indexOf("streamlare.com") != -1 || web.indexOf("slmaxed.com") != -1) {
        return servers["streamlare.com"].getDDL(after, onError, web);*/
    }else if(web.indexOf("embedsito.net/reproamz") != -1){
        return servers["embedsito.net/reproamz"].getDDL (after, onError, web);
    }else if((web.indexOf("mixdrop") != -1)  || ((web.indexOf("mdbekjwqa") != -1))){
            return servers["mixdrop"].getDDL (after, onError, web);
    }else if(web.indexOf("streamtape.com") != -1){
        return servers["streamtape.com"].getDDL(after,onError, web);
    }else if (/sbfull\.|sbfast\.|sbembed\.com|sbembed1\.com|sbplay\.org|sbvideo\.net|streamsb\.net|sbplay\.one|cloudemb\.com|playersb\.com|tubesb\.com|sbplay\d\.|embedsb\.com/.test(web)) {
        return servers["streamsb"].getDDL (after, onError, web);
    }else if ((web.indexOf("voe") != -1) || (web.indexOf("lukecomparetwo.") != -1)) {
        return servers["voe"].getDDL (after, onError, web);
    }else if ((web.indexOf("wish.") != -1)) {
        return servers["streamwish"].getDDL (after, onError, web);
    }else if ((web.indexOf("filemoon.") != -1)) {
        return servers["filemoon"].getDDL (after, onError, web);
    }else if ((web.indexOf("filelions.") != -1)) {
        return servers["filelions"].getDDL (after, onError, web);
    }else{
        onError("Not supported server");
    }
}

export function getName(web) {
    let info = " " + getFirstMatch(/\|\|info_(.+)/gm, web);
    let name = "";
    /*if(web.startsWith("{")){
        return JSON.parse(web)["name"];
    }else*/ if(web.indexOf("jk.php?u=stream") != -1) {
        name = "jkxtreme";
    }else if(web.indexOf("um.php?e=") != -1) {
        name = "Desu";
    }else if(web.indexOf("/um2.php?e=") != -1) {
        name = "Gdrive_JKAPI";
    }else if(web.startsWith("https://sololatino.xyz/v/")){
        name = "ReSololatino";
    }else if(web.startsWith("https://re.sololatino.net/p/embed.php")){
        name = "ReSololatino";
    }else if(web.indexOf("yourupload") != -1) {
        name = "YourUpload";
    }else if(web.indexOf("ok.ru") != -1) {
        name = "OkRu";
    }else if(web.indexOf("/reproamz/") != -1){
        name = "AMZ ReSololatino" ;
    }else if(web.indexOf("owodeuwu.xyz") != -1) {
        name = "owodeuwu.xyz (fembed)";
    }else if(web.indexOf("zippishare") != -1) {
        name = "Zippishare";
    }else if(web.indexOf("zplayer.live") != -1) {
        name = "ZPlayer live"
    }else if(web.indexOf("mediafire.com") != -1) {
        name = "MediaFire";
    }else if(web.indexOf("plusvip.net") != -1) {
        name = "Plusvip";
    }else if((web.indexOf("streamlare.com") != -1) || (web.indexOf("slmaxed.com") != -1) || (web.indexOf("slwatch.c") != -1)) {
        name = "StreamLare";
    }else if(web.indexOf("embedsito.net/reproamz") != -1) {
        name = "Embedsito(Amz)";
    }else if (/sbfull\.|sbfast\.|sbembed\.com|sbembed1\.com|sbplay\.org|sbvideo\.net|streamsb\.net|sbplay\.one|cloudemb\.com|playersb\.com|tubesb\.com|sbplay\d\.|embedsb\.com/.test(web)) {
        name = "StreamSB";
    }else if(web.indexOf("mixdrop") != -1){
        name = "Mixdrop";
    }else if(web.indexOf("streamtape.com") != -1){
        name = "Streamtape";
    }else if(web.indexOf("voe") != -1){
        name = "VOE";
    }else if(web.indexOf("filemoon") != -1){
        name = "FileMoon";
    }else if(web.indexOf("filelions") != -1){
        name = "FileLions";
    }else if (web.indexOf("wish") != -1) {
        name = "StreamWish";
    }else {
        name = "";
    }

    return name + info;
}

export function getPreferer(list){
    let preferer = ["/um2.php?e=",
                    "jk.php?u=stream",
                    "um.php?e=",
                    "mediafire.com",
                    "plusvip.net",
                    "embedsito.net/reproamz",
                    //"fembed",
                    "https://re.sololatino.net/p/embed.php",
                    "https://sololatino.xyz/v/",
                    "owodeuwu.xyz" ,
                    "ok.ru" ,
                    "zippishare",
                    "/reproamz/",
                    "zplayer.live",
                    "streamtape.com",
                    "voe",
                    "wish",
                    "filemoon",
                    "filelions",
                    "yourupload",
                    "mixdrop",
                ];
    let ordered = [];
    for(let i = 0; i < list.length; i++){
         /* if(list[i].startsWith("{")){
            ordered.push(list[i]);
        }else{
          if (/sbfull\.|sbfast\.|sbembed\.com|sbembed1\.com|sbplay\.org|sbvideo\.net|streamsb\.net|sbplay\.one|cloudemb\.com|playersb\.com|tubesb\.com|sbplay\d\.|embedsb\.com/.test(list[j])) {
                ordered.push(list[j]);
            }else if((list[j].indexOf("streamlare.com") != -1) || (list[j].indexOf("slmaxed.com") != -1) || (list[j].indexOf("slwatch.c") != -1)) {
                ordered.push(list[j]);
            }*/
        for(let j = 0; j < preferer.length; j++){
            if(list[i].indexOf(preferer[j]) != -1){
                ordered.push(list[i]);
            }
          }
        }
        
   // }

    return ordered;
}