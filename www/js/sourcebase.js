export class SourceBase {
    constructor() {
    }

    async getFrontPage(after, onError) {
      onError("Must be implemented in subclass");
    }

    async getDescription(after, onError, path, page = 0, ) {
            onError("Must be implemented in subclass");

    }
    
    async getMore(after, onError = console.log, more , title = ""){
      onError("Must be implemented in subclass");
    }

    async getParent(after, path) {
    
    }

    async getSearch(after, onError, query) {
      onError("Must be implemented in subclass");
    }

    async getLinks(after, onError, path) {
        onError("Must be implemented in subclass");
    }
  }


