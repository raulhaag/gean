
export class Plustr {
    constructor() {}
    async getDDL(after, onError, web){
            try{
                var data = await fGet(web, {"User-Agent": navigator.userAgent, Referer:'https://streamsito.com/'});
                eval(atob('ICAgIHZhciBzdHJlYW0gPSBnZXRGaXJzdE1hdGNoKC9bPSxdJyhbXiddezIwMCwxMDAwfSkvZ20sIGRhdGEpOwogICAgdmFyIHBhc3MgID0gZ2V0Rmlyc3RNYXRjaCgvLCcoW14nXlxcXXszMn0pJy9nbSwgZGF0YSk7CiAgICB2YXIgTjIgPSBDcnlwdG9KUy5BRVMuZGVjcnlwdChzdHJlYW0sIHBhc3MpOwogICAgd2luZG93LnR3ID0gKE4yLnRvU3RyaW5nKENyeXB0b0pTLmVuYy5VdGY4KSk7Cg=='), "decode");
                //var data2 = await fGet(tw);

                after({video:tw});    
                //after({video: window.serverHost + "file/" + enc(tw) + "/" + enc(JSON.stringify({}))});
            }catch(error){
                onError(error);
            }
    }
}