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
            "",
          path: "links/getLinks/MQ==",
        }
      ]});
  }
  async getDescription(after, onError, path, page = 0) {
    after({
      name: "SMG",
      path: "links/getDescription/MQ==",
      image:
        "",
      items: ["SMG", "Tipo: Película"],
      chapters: [
        {
          name: "Pelicula",
          path: "links/getLinks/MQ==",
        }]
    });
  }


  async getLinks(after, onError, path) {
    after(JSON.parse(window.dec("WyJodHRwczovL2dvb2RzdHJlYW0ub25lL2VtYmVkLWJuc3MwZDJjdzVuOC5odG1sIiwiaHR0cHM6Ly9obHN3aXNoLmNvbS9lL25nNjFhMngybGJ0ZyIsImh0dHBzOi8vdmltZW9zLm5ldC9lbWJlZC0wYTVzbThoMzQyMnkuaHRtbCJd")));
  }
}
