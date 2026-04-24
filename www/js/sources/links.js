import { SourceBase } from "../sourcebase.js";
export class Links extends SourceBase{
  constructor() {
    super();
    this.name = "links";
  }

  async getFrontPage(after, onError) {
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
    after(JSON.parse(window.dec("WyJodHRwczovL2dvb2RzdHJlYW0ub25lL2VtYmVkLWJuc3MwZDJjdzVuOC5odG1sIiwiaHR0cHM6Ly9obHN3aXNoLmNvbS9lL25nNjFhMngybGJ0ZyIsImh0dHBzOi8vdmltZW9zLm5ldC9lbWJlZC0wYTVzbThoMzQyMnkuaHRtbCJd")));
  }
}
