class Scene{
    #lastSelection = null;
    constructor(menu_type){
        this.menu_type = menu_type;
        this.lastId = null;
        this.body = null;
        this.lastKeyManager = null;
    }
    get menu_type(){return this.menu_type;}
    get lastId(){return this.lastId;}
    initBody(){};
    get body(){
        if(this.body == null){initBody();}
        return this.body;
    }
    get lastKeyManager(){return this.lastKeyManager;}
    clear(){
        lastSelection = null;
    }
}