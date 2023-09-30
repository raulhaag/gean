export class NOAwsomeIPTV {
    constructor() {
      this.name = "awsomeiptv";
    }
    async getFrontPage(after, error) {
      let out = [];
      //thanks to awsomeiptv and the flags proyects
      //<tr><td>.... (.+?)<\/td><td.+?<code>(.+?(.{2}).m3u)
      //{"name":"$1", "image":"https://raw.githubusercontent.com/hampusborgos/country-flags/main/png250px/$3.png", "path": this.name + "/getDescription/" + window.enc("$2")},
      let result = await fGet("https://raw.githubusercontent.com/iptv-org/iptv/master/README.md");
      const regex = /<tr><td>.... (.+?)<\/td><td.+?<code>(.+?(.{2}).m3u)/gm;
      let m;
      let channels = []
      while ((m = regex.exec(result)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (m.index === regex.lastIndex) {
              regex.lastIndex++;
          }
          out.push({"name":m[1], "image":"https://raw.githubusercontent.com/hampusborgos/country-flags/main/png250px/"+ m[3]+".png", "path": this.name + "/getLinks/" + window.enc(m[2])},)
      }
      after({
        "Por pais": out
      });
    }
  
    async getDescription(after, onError, path, page = 0, ) {
     /* try{
        let result = await fGet(window.dec(path));
        const regex = /tvg-id=\"(.+?)\".+?tvg-logo=\"(.+?)\".+?\n(.+?)\n/gm;
        let m;
        let channels = []
        while ((m = regex.exec(result)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            channels.push({"name":m[1], "path": this.name + "/getLinks/" + enc(m[3])});
        }
        after({"name": "TvCannels", "path": this.name + "/getDescription/" + path, "image": "image", "items":["Tv from"], "chapters": channels});
      } catch (error) {
        onError(error);
      }/*/
    }
  
    async getParent(after, path) {
    }
  
  
    async getSearch(after, onError, query) {
        onError("not Implemented");
    }
  
    async getLinks(after, onError, path) {
      let links = [];
      try{
        let result = await fGet(window.dec(path));
        const regex = /tvg-id="([^"]+)"[\s\S]+?\n(h.+?)\n/gm;
        let m;
        let channels = []
        while ((m = regex.exec(result)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            links.push(JSON.stringify({"name":m[1], "path" : m[2] + "|||" + "application/x-mpegURL"}))
        }
        after(links);
      } catch (error) {
        onError(error);
      }
    }
  }
  
  