import {Fembed} from "./fembed.js";
import {JKAPI, JKXtreme} from "./jkapi.js";
import {ReSololatino, SololatinoXYZ, OwodeuwuXYZ, EmbedsitoNet, MamazonPlayer} from "./re_sololatino.js";
import {ZPlayer} from "./zplayer.js";
import {YourUpload}from "./yourupload.js";
import {OkRu}from "./okru.js";
import {ZippyShare} from "./zippy.js";
import {Mediafire} from "./mfire.js"
import { Plusvip } from "./plusvip.js";
import { Streamlare } from "./streamlare.js";
import { MailRu } from "./mailru.js";
import { StreamSB } from "./streamsb.js";
let servers = {"fembed": new Fembed(),
                "jkapi": new JKAPI(),
                "jkxtreme": new JKXtreme(),
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
                "mail.ru": new MailRu(),
                "/reproamz/": new MamazonPlayer(),
                "streamsb": new StreamSB()
            };

export function getDDL(after, onError, web) {
    /*if(web.startsWith("{")){
        after({"video": JSON.parse(web)["path"]});
    }else*/ if(web.indexOf("jk.php?u=stream") != -1) {
        servers["jkxtreme"].getDDL(after, onError, web);
    }/*else if(web.indexOf("fembed") != -1) {
        servers["fembed"].getDDL(after, onError, web);
    }*/else if(web.indexOf("plusvip.net") != -1) {
        servers["plusvip.net"].getDDL(after, onError, web);
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
    }else if(web.indexOf("mail.ru") != -1){
        return servers["mail.ru"].getDDL (after, onError, web);
    }else if (/sbfull\.|sbfast\.|sbembed\.com|sbembed1\.com|sbplay\.org|sbvideo\.net|streamsb\.net|sbplay\.one|cloudemb\.com|playersb\.com|tubesb\.com|sbplay\d\.|embedsb\.com/.test(web)) {
        return servers["streamsb"].getDDL (after, onError, web);
    }else{
        onError("Not supported server");
    }
}

export function getName(web) {
    /*if(web.startsWith("{")){
        return JSON.parse(web)["name"];
    }else*/ if(web.indexOf("jk.php?u=stream") != -1) {
        return "jkxtreme";
    }else if(web.indexOf("fembed") != -1) {
        return "Fembed";
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
    }else if(web.indexOf("mail.ru") != -1) {
        return "Mail.ru(on test)"
    }else if (/sbfull\.|sbfast\.|sbembed\.com|sbembed1\.com|sbplay\.org|sbvideo\.net|streamsb\.net|sbplay\.one|cloudemb\.com|playersb\.com|tubesb\.com|sbplay\d\.|embedsb\.com/.test(web)) {
        return "StreamSB";
    }else {
        return "";
    }
}

export function getPreferer(list){
    let preferer = ["/um2.php?e=",
                    "jk.php?u=stream",
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
                    "mail.ru"
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