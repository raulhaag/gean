export class Scene{
    #lastSelection = null;
    constructor(full_menu){
        if(this.constructor === Scene){
            throw new Error("Abstract class, use a subclass");
        }
        this.full_menu = full_menu; //full menu = true, only back menu = false
        this.lastId = null;
        this._body = null;
        this.lastKeyManager = null;
    }
    menu_type(){return this.menu_type;}
    initBody(){
        throw new Error("need implementation to save state in subclass");
    };
    initBindings(){
        throw new Error("need implementation to save state in subclass");
    };
    body = () => {
        if(this._body == null){
            this.initBody();
        }
        return this._body;
    }
    lastKeyManager(){return this.lastKeyManager;}
    clear(){
        lastSelection = null;
    }
    saveState(){
        throw new Error("need implementation to save state in subclass");
    }
    dispose(){
        if(!this.full_menu){
            throw new Error("need implementation dispose in subclass");
        }
    }
}