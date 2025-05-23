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
import {Plustr} from "./plustr.js";
import { VK } from "./vk.js";
import { DailyMotion } from "./dailymot.js";
import { VidHidepro } from "./vidhidepro.js";
import { DoodStream } from "./doodstream.js";
import { BurstCloud } from "./burst.js";
import { Mp4Upload } from "./mp4upload.js";
import { MaRu } from "./maru.js";

let interceptors = []

export function registerInterceptor(contains, callback){
    interceptors.push({"contains": contains, "callback": callback});
}

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
                "plustr": new Plustr(),
                "vk.com/": new VK(),
                "dailymotion.com": new DailyMotion(),
                "vidhide": new VidHidepro(),
                "doodstream": new DoodStream(),
                "burstcloud.co": new BurstCloud(),
                "mp4upload.com": new Mp4Upload(),
                'mail.ru': new MaRu(),
            };

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
    }else if(web.indexOf("jk.php?u=stream") != -1) {
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
    }else if(web.indexOf("mixdrop") != -1){
            return servers["mixdrop"].getDDL (after, onError, cleanInfo(web));
    }else if(web.indexOf("streamtape.com") != -1){
        return servers["streamtape.com"].getDDL(after,onError, web);
    }else if (/sbfull\.|sbfast\.|sbembed\.com|sbembed1\.com|sbplay\.org|sbvideo\.net|streamsb\.net|sbplay\.one|cloudemb\.com|playersb\.com|tubesb\.com|sbplay\d\.|embedsb\.com/.test(web)) {
        return servers["streamsb"].getDDL (after, onError, web);
    }else if ((web.indexOf("voe") != -1)) {
        return servers["voe"].getDDL (after, onError, cleanInfo(web));
    }else if((web.indexOf("vidhide") != -1)|| (web.indexOf('ryderjet.com') != -1)) {
        return servers["vidhide"].getDDL (after, onError, cleanInfo(web));
    }else if (((web.indexOf("wish") != -1) || web.indexOf("ghbrisk.com") != -1) ) {
        return servers["streamwish"].getDDL (after, onError, cleanInfo(web));
    }else if ((web.indexOf("filemoon.") != -1)) {
        return servers["filemoon"].getDDL (after, onError, cleanInfo(web));
    }else if ((web.indexOf("filelions.") != -1)) {
        return servers["filelions"].getDDL(after, onError, cleanInfo(web));
    }else if ((web.indexOf("plustr") != -1)) {
        return servers["plustr"].getDDL(after, onError, cleanInfo(web));
    }else if ((web.indexOf("vk.com/") != -1)){
        return servers["vk.com/"].getDDL(after, onError, cleanInfo(web))
    }else if(web.indexOf("dailymotion.com") != -1){
        return servers["dailymotion.com"].getDDL(after, onError, cleanInfo(web));
    }else if(web.indexOf("doodstream") != -1){
        return servers["doodstream"].getDDL(after, onError, cleanInfo(web));
    }else if(web.indexOf("burstcloud.co") != -1){
        return servers["burstcloud.co"].getDDL(after, onError, cleanInfo(web));
    }else if(web.indexOf("mp4upload.com") != -1){
        return servers["mp4upload.com"].getDDL(after, onError, cleanInfo(web));
    }else if(web.indexOf("mail.ru") != -1){
            return servers["mail.ru"].getDDL(after, onError, cleanInfo(web));
    }else{
        onError("Not supported server");
    }
}

function cleanInfo(data){
    return data.replace(/\|\|server_name_.+/gm, "");
}

export function getName(web) {
    let info = " " + getFirstMatch(/\|\|info_(.+)/gm, web);
    let name = "";
    /*if(web.startsWith("{")){
        return JSON.parse(web)["name"];
    }else*/ 
    if(web.indexOf("server_name_EnlaceDirecto") != -1) {
        name = "Directo";
    }else if(web.indexOf("jk.php?u=stream") != -1) {
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
    }else if(web.indexOf("mp4upload.com") != -1) {
            name = "Mp4Upload.com";
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
    }else if(web.indexOf("filemoon") != -1){
        name = "FileMoon";
    }else if(web.indexOf("filelions") != -1){
        name = "FileLions";
    }else if((web.indexOf("voe") != -1)){
        name = "VOE";
    }else if ((web.indexOf("wish") != -1) || web.indexOf("ghbrisk.com") != -1) {
        name = "StreamWish";
    }else if (web.indexOf("plustr") != -1) {
        name = "Plustream (Solo reproductor interno android)";
    }else if ((web.indexOf("vk.com/") != -1)){
        name =  "VK";
    }else if(web.indexOf("dailymotion.com") != -1){
        name =  "DailyMotion";
    }else if((web.indexOf("vidhide") != -1) || (web.indexOf('ryderjet.com') != -1)){
        name =  "vidhide";
    }else if(web.indexOf("doodstream") != -1){
        name =  "doodstream";
    }else if(web.indexOf("burstcloud.co") != -1){
        name =  "BurstCloud";    
    }else if(web.indexOf("mail.ru") != -1){
            name =  "mail.ru";
    }else {
        name = "";
    }
    return name + info;
}

export function getPreferer(list){
    let preferer = ["/um2.php?e=",
                    "server_name_EnlaceDirecto",
                    "jk.php?u=stream",
                    "mediafire.com",
                    "plusvip.net",
                    "streamtape.com",
                    "ghbrisk.com",
                    "voe",
                    'ryderjet.com',
                    "embedsito.net/reproamz",
                    "https://re.sololatino.net/p/embed.php",
                    "https://sololatino.xyz/v/",
                    "owodeuwu.xyz" ,
                    "ok.ru" ,
                    "zippishare",
                    "/reproamz/",
                    "zplayer.live",
                    "wish",
                    "filemoon",
                    "filelions",
                    "mp4upload.com",
                    "burstcloud.co",
                    "yourupload",
                    "mixdrop",
                    "um.php?e=",
                    //"plustr",
                    "vk.com/",
                    "dailymotion.com",
                    "vidhide",
                    "doodstream",
                    "mail.ru"
                ];
    
    let ordered = [];
    for(let i = 0; i < preferer.length; i++){
        for(let j = 0; j < list.length; j++){
            if(list[j].indexOf(preferer[i]) != -1){
                ordered.push(list[j]);
            }
          }
        }

/*
    for(let i = 0; i < list.length; i++){
         /* if(list[i].startsWith("{")){
            ordered.push(list[i]);
        }else{
          if (/sbfull\.|sbfast\.|sbembed\.com|sbembed1\.com|sbplay\.org|sbvideo\.net|streamsb\.net|sbplay\.one|cloudemb\.com|playersb\.com|tubesb\.com|sbplay\d\.|embedsb\.com/.test(list[j])) {
                ordered.push(list[j]);
            }else if((list[j].indexOf("streamlare.com") != -1) || (list[j].indexOf("slmaxed.com") != -1) || (list[j].indexOf("slwatch.c") != -1)) {
                ordered.push(list[j]);
            }
        for(let j = 0; j < preferer.length; j++){
            if(list[i].indexOf(preferer[j]) != -1){
                ordered[ordered.length] = list[i];
            }
          }
        }
        */
   // }

    return ordered;
}