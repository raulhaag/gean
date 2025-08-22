export class Hexload {
    constructor() {}
    async getDDL(after, onError, web){
        try{
            let vid = getFirstMatch(/embed-(.+?)\//gm, web);
            let data = "";
            if(vid){
                 data = JSON.parse(await fPost("https://hexload.com/download",
                    {
                        referer: web,
                        Accept:"*/*",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    {
                        op:	"download3",
                        id:	vid,
                        ajax:	"1",
                        method_free:	"1",
                        dataType:	"json"
                    }
                ));
            }
            
            after({video: data['result']['url']});
        }catch(e){
            onError(e);
        }
    }
}