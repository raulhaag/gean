// based in https://github.com/kodiondemand/addon/blob/master/servers/doodstream.py
export class DoodStream {
    constructor() {}
    async getDDL(after, onError, web){
        try{
            let rlink = await window.fRGet(web,{},true);
            let data = await window.fGet(rlink,{Referer: web},true);
            let dlink = (/dsplayer\.hotkeys[^']+'([^']+).+?function\s*makePlay.+?return[^?]+([^"]+)/gm).exec(data.body);
            let host = new URL(rlink).origin;
            let headers = {"Referer": host,
                           "User-Agent": window.navigator.userAgent};
            let data2 = await fGet(host + dlink[1], headers);
            let dlink2 = this.randomize(data2) + dlink[1] + dlink[2] + (new Date()).getTime();
            after({video:  window.serverHost + "file/" + enc(dlink2) + "/" + enc(JSON.stringify(headers))})
        }catch(e){
            onError(e);
        }
    }

    randomize(data) {
        const t = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < 10; i++) {
            randomString += t.charAt(Math.floor(Math.random() * t.length));
        }
        return data + randomString;
    }
}
