import { SourceBase } from "../sourcebase.js";
export class NoLinks extends SourceBase{
  constructor() {
    super();
    this.name = "links";
  }

  async getFrontPage(after, onError) {
    after({
      "Peliculas": [
        {
          name: "Name",
          image:
            "",
          path: "links/getLinks/MQ==",
        }
      ]});
  }
  async getDescription(after, onError, path, page = 0) {
    after({
      name: "Name",
      path: "links/getDescription/MQ==",
      image:
        "",
      items: ["Name", "Tipo: Película"],
      chapters: [
        {
          name: "Pelicula",
          path: "links/getLinks/MQ==",
        }]
    });
  }


  async getLinks(after, onError, path) {
    after(JSON.parse(window.dec("")));
  }
}
