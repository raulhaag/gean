
export class Plustr {
    constructor() {}
    async getDDL(after, onError, web){
            try{
                var data = await fGet(web, {"User-Agent": navigator.userAgent, Referer:'https://streamsito.com/'});
                eval(atob('ICAgIHZhciBzdHJlYW0gPSBnZXRGaXJzdE1hdGNoKC9bPSxdJyhbXiddezIwMCwxMDAwfSkvZ20sIGRhdGEpOwogICAgdmFyIHBhc3MgID0gZ2V0Rmlyc3RNYXRjaCgvLCcoW14nXlxcXXszMn0pJy9nbSwgZGF0YSk7CiAgICB2YXIgTjIgPSBDcnlwdG9KUy5BRVMuZGVjcnlwdChzdHJlYW0sIHBhc3MpOwogICAgd2luZG93LnR3ID0gKE4yLnRvU3RyaW5nKENyeXB0b0pTLmVuYy5VdGY4KSk7Cg=='), "decode");
                //after({video: tw + "|" + web})
                after({video: tw + "|" + web, video_pc: window.serverHost + "m3u8/" + enc(tw) + "/" + enc(JSON.stringify(
                    {   "Referer": web, 
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Site": "same-origin"})) + "/maskfile.m3u8"})
            }catch(error){
                onError(error);
            }
    }
}

/*
                let w2 = await fGet(tw);
                let w3 = getFirstMatch(/(https:[^ ]+)/gm, w2);
                after({video: window.serverHost + "get/" + enc(w3) + "/" + enc(JSON.stringify({Referer:tw}))})
                */