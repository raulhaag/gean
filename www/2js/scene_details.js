import {Scene} from './scene.js';

export class SceneDetails extends Scene {
    lastChapter = null;
    info = {title: null, resume:null, image:null, fav: null};
    constructor(serie, parent){
        super(false);
        this.serie = serie;
        this.parent = parent;
        this.lastKeyManager = this.chapter_nav;
    }

    dispose(){
        //TODO if needed
    }

    initBody(){
        let chapters = this.serie.chapters;
        let vc = [];
        try{
            vc = JSON.parse(localStorage.getItem(this.serie.path));
            if(vc == null){
                vc = [];
            }
        }catch(error){}
        let ach = `
        <div class="info over-search black_background">
                <div class="info-collum over-search">
                    <div class="info-title">`+ this.serie.name + `</div>
                    <div class="info-data">` + this.serie.items[0] + `</div>
                </div>
                <div class="info-image-ph">
                    <img class="info-image" src="`+ this.serie.image +`">
                    <div class="info-image-overlap"></div>
                </div>
            </div>
            <div class="info-favorites over-search" id="favorites">Agregar a favoritos</div>
            <div class="info-capitulos over-search">
        `;
        let extra = "";
        chapters.forEach(c => {
            if(vc.indexOf(c.path) != -1){
                extra = " info-capitulo-viewed";
            }else{
                extra = "";
            }
            ach +=  '<div class="info-capitulo' + extra +'" data-path="' + c.path+ '" data-ppath="' + this.serie.path + '">'+ c.name +'</div>';
        });
        ach += '</div>';
        this._body = '<div class="over-search">' + ach + '</div>';
        return ach;
    }

    initBindings(){
        this.info.fav = document.getElementsByClassName("info-favorites")[0];
        this.info.fav.classList.remove("hide");
        let idx = indexOfProperty(favorites, 'path', this.serie.path);
        if(idx > -1){
            this.info.fav.classList.add("info-favorites-added");
            this.info.fav.innerHTML = "Quitar de favoritos"
        }
        this.info.fav.dataset["name"] = this.serie.name;
        this.info.fav.dataset["image"] = this.serie.image;
        this.info.fav.dataset["path"] = this.serie.path;
        if (this.serie.chapters.length > 0){
            this.lastChapter = this.updatePositionsLV0("info-capitulos", "info-capitulo");
        }else{
            this.lastChapter = this.info.fav;
            this.lastChapter.classList.add("focus")
        }
    }

    updatePositionsLV0 = function (containerCN = "content", className = "focusable"){
        let container = document.getElementsByClassName(containerCN)[0];
        let firstItem;
        let items = container.getElementsByClassName(className);//focusable next??
        let ctop = items[0].offsetTop;
        let rc = 0, cc = 0;
        for(let i = 0; i < items.length; i++){
            if(items[i].offsetTop != ctop){
                ctop = items[i].offsetTop;
                rc++;
                cc = 0;
            }
            items[i].id = containerCN + "_" + rc + "_" + cc;
            cc++;
        }
        firstItem = document.getElementById(containerCN + "_" + 0 + "_" + 0);
        firstItem.classList.add("focus");
        return firstItem;
    };

    chapter_nav = function(event){
        let itempos = this.lastChapter.id.split("_").reverse();
        let cc = parseInt(itempos[0]);
        let cr = parseInt(itempos[1]);
        let newselection;
        if(event == null){
            this.lastChapter.classList.add("focus");
            tease_menu(this.lastChapter == this.info.fav ||this.lastChapter.id.endsWith("_0"));
            return;
        }
        let key = event.keyCode;
        if(this.lastChapter == this.info.fav){
            switch(key){
                case left:
                    menuManager();
                    this.lastChapter.classList.remove("focus");
                    return;
                case down:
                    let fc = document.getElementById("info-capitulos_0_0");
                    if(fc){
                        this.lastChapter.classList.remove("focus");
                        this.lastChapter = fc;
                        this.lastChapter.classList.add("focus");
                    }
                    return;
                case enter:
                    this.switch_fab(this.info.fav);
                    return;
            }
        }
        switch(key){
            case up:
                newselection = document.getElementById("info-capitulos_" + (cr-1) + "_" + cc);
                if(newselection){
                    this.lastChapter.classList.remove("focus");
                    this.lastChapter = newselection;
                    this.lastChapter.classList.add("focus");
                    document.getElementsByClassName("info-capitulos")[0].scrollTop =  this.lastChapter.offsetTop ;
                }else{
                    this.lastChapter.classList.remove("focus");
                    this.lastChapter = this.info.fav;
                    this.lastChapter.classList.add("focus");
                }
                break;
            case right:
                newselection = document.getElementById("info-capitulos_" + cr + "_" + (cc + 1));
                if(newselection){
                    this.lastChapter.classList.remove("focus");
                    this.lastChapter = newselection;
                    this.lastChapter.classList.add("focus");
                }
                break;
            case down:
                newselection = document.getElementById("info-capitulos_" + (cr + 1) + "_" + cc);
                if(newselection){
                    this.lastChapter.classList.remove("focus");
                    this.lastChapter = newselection;
                    this.lastChapter.classList.add("focus");
                    document.getElementsByClassName("info-capitulos")[0].scrollTop = this.lastChapter.offsetTop;
                }
                event.preventDefault();
                break;

            case left:
                newselection = document.getElementById("info-capitulos_" + cr + "_" + (cc - 1));
                if(newselection){
                    this.lastChapter.classList.remove("focus");
                    this.lastChapter = newselection;
                    this.lastChapter.classList.add("focus");
                }
                if(cc === 0){
                    menuManager();
                    this.lastChapter.classList.remove("focus");
                }
                break;
            case enter:
                this.lastChapter.classList.add("info-capitulo-viewed");
                markViewed(null, this.lastChapter.dataset.ppath, this.lastChapter.dataset.path);
                route(this.lastChapter.dataset.path, this.lastChapter.dataset.ppath);
                break;
            default:
                return
        }
        tease_menu(this.lastChapter == this.info.fav ||this.lastChapter.id.endsWith("_0"));

    }

    switch_fab = function(fav) {
        let path = fav.dataset["path"];
        let name = fav.dataset["name"];
        let image = fav.dataset["image"];
        let idx = indexOfProperty(favorites, 'path', path);
        if(idx > -1){
            favorites.splice(idx, 1);
            fav.classList.remove('info-favorites-added');
            fav.innerHTML = "Agregar a favoritos";
        }else{
            favorites.unshift({'name': name, 'image': image, 'path': path});
            fav.classList.add('info-favorites-added');
            fav.innerHTML = "Quitar de favoritos";
        }
        if("updateFavorites" in Object.keys(this.parent))
            this.parent.updateFavorites();

    }

}


