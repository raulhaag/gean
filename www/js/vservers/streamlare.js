export class Streamlare {
    constructor() {}
    async getDDL(after, onError, web){
            let id = web.split("?")[0].split("/").pop();
            let postData = {"id": id};
            let headers = {"Referer": web,
                            "X-Requested-With": "XMLHttpRequest"}
            let post = await fPost("https://slmaxed.com/api/video/stream/get", headers, postData);
            after({video: JSON.parse(post)["result"]["Original"]["file"]});
        }
    }