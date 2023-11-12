export class Streamtape {
    //https://streamtape.com/e/okXW0KKrAyuJ2RP
    constructor() {}
    async getDDL(after, onError, web) {
      try{
      let data = await fGet(web, {
        "User-Agent":" Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/116.0","Referer":" https://saidochesto.top/"
      });
      let url = getAllMatches(/innerHTML = ([^;]+)/gm, data);
      let last = "https:" + eval(url[url.length-1][1]);
      let rlink = await fRGet(last, {
        "User-Agent":" Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/116.0","Referer":" https://saidochesto.top/"
      });
      after({video: rlink});
    }catch(ignore){
      onError("Video borrado?")
    }

    }
  }
  