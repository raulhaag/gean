export  class  VideoServer {//abstract
    async getDDL(after, onError, url){onError("Must be implemented in subclass")};
    can(url){throw new Error("Must be implemented in subclass")};
    name(){throw new Error("Must be implemented in subclass")};
    getVideoId(url){
        var id = url
        if(url.endsWith("/")){
            id = url.substring(0, url.length - 1);
        }
        id = id.split("/").pop();
        return id;
    }
}   