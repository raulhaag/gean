export class Streamlare {
  constructor() {}
  async getDDL(after, onError, web) {
    try{
      let id = web.split("?")[0].split("/").pop();
      let postData = { id: id };
      let headers = { Referer: web, "X-Requested-With": "XMLHttpRequest" };
      let x = JSON.parse(
        await fPost("https://slmaxed.com/api/video/stream/get", headers, postData)
      );
      let link = "";
      if (x.result.playlist) {
        link = x.result.playlist;
      } else if (x.result.Original && x.result.Original.src) {
        link = x.result.Original.src;
      } else if (x.result.Original && x.result.Original.file) {
        link = x.result.Original.file;
      } else if (x.result.file) {
        link = x.result.file;
      } else if (x.result["1080p"] && x.result["1080p"].file) {
        link = x.result["1080p"].file;
      } else if (x.result["720p"] && x.result["720p"].file) {
        link = x.result["720p"].file;
      } else if (x.result["480p"] && x.result["480p"].file) {
        link = x.result["480p"].file;
      } else if (x.result["360p"] && x.result["360p"].file) {
        link = x.result["360p"].file;
      }
      let rlink = await fRGet(link,headers)
      after({ video: window.serverHost + "file/" + enc(rlink) + "/" + enc(JSON.stringify({ Referer: web}))});
    }catch(e){
      onError(e)
    }
  }
}
