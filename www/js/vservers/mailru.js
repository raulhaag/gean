export class MailRu {
    constructor() {}
    async getDDL(after, onError, web){
            let parts = web.split("#")[0].split("/");
            let id = parts[parts.length -1];
            let data = await fGet("https://my.mail.ru/+/video/meta/" + id, {}, true);
            let cookie = "";
            let jdata = JSON.parse(data.body);
            Object.keys(data.headers).forEach((key)=>{
                if(data.headers[key].indexOf("video_key") != -1){
                    cookie = data.headers[key].split(";")[0];
                }
            })
            let outdata = {};
            let headers = {"Referer": "https://my1.imgsmail.ru/r/video2/uvpv3.swf?75&Cookie=" + cookie};
            outdata["video"] = window.serverHost + "file/" + enc("https:" + jdata.videos[0].url) + "/" + enc(JSON.stringify(headers));

            jdata.videos.forEach((video)=>{
                outdata[video.key] = window.serverHost + "file/" + enc("https:" + video.url) + "/" + enc(JSON.stringify(headers));
            })
            after(outdata)
        }
    }