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
    /*if(web.startsWith("{")){
        return JSON.parse(web)["name"];
    }else*/ if(web.indexOf("jk.php?u=stream") != -1) {
        return "jkxtreme";
    }else if(web.indexOf("um.php?e=") != -1) {
        return "Desu";
    }else if(web.indexOf("/um2.php?e=") != -1) {
        return "Gdrive_JKAPI";
    }else if(web.startsWith("https://sololatino.xyz/v/")){
        return "ReSololatino";
    }else if(web.startsWith("https://re.sololatino.net/p/embed.php")){
        return "ReSololatino";
    }else if(web.indexOf("yourupload") != -1) {
        return "YourUpload";
    }else if(web.indexOf("ok.ru") != -1) {
        return "OkRu";
    }else if(web.indexOf("/reproamz/") != -1){
        return "AMZ ReSololatino" ;
    }else if(web.indexOf("owodeuwu.xyz") != -1) {
        return "owodeuwu.xyz (fembed)";
    }else if(web.indexOf("zippishare") != -1) {
        return "Zippishare";
    }else if(web.indexOf("zplayer.live") != -1) {
        return "ZPlayer live"
    }else if(web.indexOf("mediafire.com") != -1) {
        return "MediaFire";
    }else if(web.indexOf("plusvip.net") != -1) {
        return "Plusvip";
    }else if((web.indexOf("streamlare.com") != -1) || (web.indexOf("slmaxed.com") != -1) || (web.indexOf("slwatch.c") != -1)) {
        return "StreamLare";
    }else if(web.indexOf("embedsito.net/reproamz") != -1) {
        return "Embedsito(Amz)";
    }else if (/sbfull\.|sbfast\.|sbembed\.com|sbembed1\.com|sbplay\.org|sbvideo\.net|streamsb\.net|sbplay\.one|cloudemb\.com|playersb\.com|tubesb\.com|sbplay\d\.|embedsb\.com/.test(web)) {
        return "StreamSB";
    }else if(web.indexOf("mixdrop") != -1){
        return "Mixdrop";
    }else if(web.indexOf("streamtape.com") != -1){
        return "Streamtape";
    }else if(web.indexOf("voe") != -1){
        return "VOE";
    }else if(web.indexOf("filemoon") != -1){
        return "FileMoon";
    }else if(web.indexOf("filelions") != -1){
        return "FileLions";
    }else if (web.indexOf("wish") != -1) {
        return "StreamWish";
    }else {
        return "";
    }
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
                    "yourupload",
                    "/reproamz/",
                    "zplayer.live",
                    "mixdrop",
                    "streamtape.com",
                    "voe",
                    "wish",
                    "filemoon",
                    "filelions"
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