export class DeadServer {
    constructor() {
      this.name = "DeadServer";
    }
    wait(ms) {
      const start = performance.now();
      while (performance.now() - start < ms);
    }
  
    waitOrFail() {
      this.wait(Math.floor(Math.random() * 3000));
      return Math.random() > 0.95;
    }
  
    async getFrontPage(after, onError) {
      after({
        "Servidor Muerto": [
          {
            name: "Sin Informacion",
            image: "",
            path: "",
            parentPath: "",
          },
        ],
      });
    }
    async getDescription(after, onError, path, page = 0) {
      after({
        name: "Servidor muerto",
        path: path,
        image: "",
        items: ["Nada que mostrar", "Tipo: Error"],
        chapters: [
        ],
      });
    }
    async getParent(after, path) {
        after({
            name: "Servidor muerto",
            path: "",
            image: "",
            items: ["Nada que mostrar", "Tipo: Error"],
          });
    }
    async getSearch(after, onError, query) {
        after({
            "Servidor Muerto": [
              {
                name: "Sin Informacion",
                image: "",
                path: "",
                parentPath:
                  "",
              },
            ],
          });
    }
    async getLinks(after, onError, path) {

    }
  }
  