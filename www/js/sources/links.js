import { SourceBase } from "../sourcebase.js";
export class Links extends SourceBase{
  constructor() {
    super();
    this.name = "links";
  }
  wait(ms) {
    const start = performance.now();
    while (performance.now() - start < ms);
  }

  waitOrFail() {
	  //return false
    this.wait(Math.floor(Math.random() * 3000));
    return Math.random() > 0.95;
  }

  async getFrontPage(after, onError) {
    if (this.waitOrFail()) {
      onError();
      return;
    }
    after({
      "Peliculas": [
        {
          name: "SMG",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/dosanko-gal-wa-namara-menkoi.jpg",
          path: "links/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9kb3NhbmtvLWdhbC13YS1uYW1hcmEtbWVua29pLzgv",
          parentPath:
            "links/getDescription/1",
        }
      ]});
  }
  async getDescription(after, onError, path, page = 0) {
    if (this.waitOrFail()) {
      onError();
      return;
    }
    after({
      name: "SMG",
      path: "links/getDescription/1",
      image:
        "https://cdn.jkdesu.com/assets/images/animes/image/synduality-noir-part-2.jpg",
      items: ["SMG", "Tipo: Película"],
      chapters: [
        {
          name: "Pelicula",
          path: "links/getLinks/1",
        }]
    });
  }


  async getLinks(after, onError, path) {
    after([
      "https://goodstream.one/embed-bnss0d2cw5n8.html",
      "https://hlswish.com/e/ng61a2x2lbtg",
      "https://vimeos.net/embed-0a5sm8h3422y.html",

    ]);
  }
}
