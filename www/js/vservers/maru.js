export class MaRu {
    constructor() {}
    async getDDL(after, onError, web){
        try{
            let content = await fGet(web);
            let jsonData = JSON.parse(getFirstMatch(/main">\s*<sc.+?>([\s\S]+?)<\/sc/gm, content));
            const meta = 'https:' + jsonData['flashVars']['metadataUrl'] + "?xemail=&ajax_call=1&func_name=&mna=&mnb=&ext=1&_=" + Date.now();
            jsonData = JSON.parse(await fGet(meta, {Referer:web}));
            let video = {};
            jsonData['videos'].forEach(vid => {
                video[vid['key']] = vid['url'];
            });
            video["video"] = jsonData['videos'][0]['url'];
            after(video);
        }catch(e){
            onError(e);
        }
    }
}

//let web = "https://my.mail.ru/video/embed/7512958666216056115#aylaz9ymde#9523";
