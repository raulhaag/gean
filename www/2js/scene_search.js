import{Scene} from "./scene.js"
import {getSource} from '../js/sources/sources.js';

export class SceneSearch extends Scene{
    lastkey = null;
    lastMedia = null;
    searchtext = null;
    constructor(){
        super(true);
        this.lastKeyManager = this.keys_nav;
    }

    keys_nav(event){
        if(event == null){
            this.lastkey.classList.add("focus");
            return;
        }
        let itempos = this.lastkey.id.split("_").reverse();
        let cc = parseInt(itempos[0]);
        let cr = parseInt(itempos[1]);
        let newselection;
        switch(event.key){
            case 'ArrowUp':
                if(cr == 1){
                    cc = Math.floor(cc/2);
                }
                newselection = document.getElementById("search-box_" + (cr-1) + "_" + cc);
                if(newselection){
                    this.lastkey.classList.remove("focus");
                    this.lastkey = newselection;
                    this.lastkey.classList.add("focus");
                }
                break;
            case 'ArrowDown':
                if(cr == 0){
                    cc = cc * 2;
                }
                newselection = document.getElementById("search-box_" + (cr+1) + "_" + cc);
                if(newselection){
                    this.lastkey.classList.remove("focus");
                    this.lastkey = newselection;
                    this.lastkey.classList.add("focus");
                }
                break;

            case 'ArrowLeft':
                    newselection = document.getElementById("search-box_" + cr + "_" + (cc - 1));
                    if(newselection){
                        this.lastkey.classList.remove("focus");
                        this.lastkey = newselection;
                        this.lastkey.classList.add("focus");
                    }
                    if(cc === 1){
                        tease_menu(true);
                    }else if(cc === 0){
                        this.lastkey.classList.remove("focus");
                        menuManager();
                    }
                break;

            case 'ArrowRight':
                newselection = document.getElementById("search-box_" + cr + "_" + (cc + 1));
                if(newselection){
                    this.lastkey.classList.remove("focus");
                    this.lastkey = newselection;
                    this.lastkey.classList.add("focus");
                }else{
                    if(this.lastMedia != null){
                        this.lastKeyManager = this.search_result_nav;
                        this.lastkey.classList.remove("focus");
                        this.lastMedia.classList.add("focus");
                    }
                }
                if(cc === 0){
                    tease_menu(false);
                }
                break;

            case "Enter":
            case "NumpadEnter":
                let c = this.lastkey.innerHTML;
                switch(c){
                    case '←':
                        this.searchtext.innerHTML = this.searchtext.innerHTML.slice(0, -1);
                        break;
                    case ' ':
                    case '':
                        this.searchtext.innerHTML = this.searchtext.innerHTML + " ";
                        break;
                    case '✓':
                        let server = getSource(sid);
                        server.getSearch((items) =>{this.searchDone(items, this)}, error, this.searchtext.innerHTML.replace(' ', '+'))
                        break;
                    default:
                        this.searchtext.innerHTML = this.searchtext.innerHTML + this.lastkey.innerHTML;
                }
                break;

            case 'Backspace':
                this.searchtext.innerHTML = this.searchtext.innerHTML.slice(0, -1);
                break;

            case 'Space':
            case ' ':
                this.searchtext.innerHTML = this.searchtext.innerHTML + " ";
                break;

            default:
                if(event.code != null && event.code.length == 4 && event.code.startsWith("Key")){
                    this.searchtext.innerHTML = this.searchtext.innerHTML + event.key;
                }             
        }
    }

    search_result_nav(event){
        if(event == null){
            this.lastMedia.classList.add("focus");
            return;
        }
        let itempos = this.lastMedia.id.split("_").reverse();
        let cc = parseInt(itempos[0]);
        let cr = parseInt(itempos[1]);
        let newselection;
        switch(event.key){
            case 'ArrowUp':
                newselection = document.getElementById("search-results-ph_" + (cr-1) + "_" + cc);
                if(newselection){
                    this.lastMedia.classList.remove("focus");
                    this.lastMedia = newselection;
                    this.lastMedia.classList.add("focus");
                    this.lastMedia.parentElement.scrollTop = this.lastMedia.offsetTop - 65;
                }
                break;
            case 'ArrowDown':
                newselection = document.getElementById("search-results-ph_" + (cr+1) + "_" + cc);
                if(newselection){
                    this.lastMedia.classList.remove("focus");
                    this.lastMedia = newselection;
                    this.lastMedia.classList.add("focus");
                    this.lastMedia.parentElement.scrollTop = this.lastMedia.offsetTop - 65;
                }
                break;
            case 'ArrowLeft':
                    newselection = document.getElementById("search-results-ph_" + cr + "_" + (cc - 1));
                    if(newselection){
                        this.lastMedia.classList.remove("focus");
                        this.lastMedia = newselection;
                        this.lastMedia.classList.add("focus");
                    }
                    if(cc === 0){
                        this.lastKeyManager = this.keys_nav;
                        this.lastMedia.classList.remove("focus");
                        this.lastkey.classList.add("focus");
                    }
                break;
            case 'ArrowRight':
                newselection = document.getElementById("search-results-ph_" + cr + "_" + (cc + 1));
                if(newselection){
                    this.lastMedia.classList.remove("focus");
                    this.lastMedia = newselection;
                    this.lastMedia.classList.add("focus");
                }
                break;
            case "Enter":
            case "NumpadEnter":
            case "Space":                    
            case " ":                    
                route(this.lastMedia.dataset.path)
                break;
        }
    }

    initBindings(){
        this.lastkey = this.updatePositionsSr("search-box", this.lastkey);
        this.searchtext = document.getElementsByClassName("search-text")[0];
    }

    initBody(){
      this._body = `<div class="search-box">
                    <div class="search-keypad">
                        <div class="search-key focusable search-double-key"> </div>
                        <div class="search-key focusable search-double-key">←</div>
                        <div class="search-key focusable search-double-key">✓</div>
                        <div class="search-key focusable">a</div>
                        <div class="search-key focusable">b</div>
                        <div class="search-key focusable">c</div>
                        <div class="search-key focusable">d</div>
                        <div class="search-key focusable">e</div>
                        <div class="search-key focusable">f</div>
                        <div class="search-key focusable">g</div>
                        <div class="search-key focusable">h</div>
                        <div class="search-key focusable">i</div>
                        <div class="search-key focusable">j</div>
                        <div class="search-key focusable">k</div>
                        <div class="search-key focusable">l</div>
                        <div class="search-key focusable">m</div>
                        <div class="search-key focusable">n</div>
                        <div class="search-key focusable">o</div>
                        <div class="search-key focusable">p</div>
                        <div class="search-key focusable">q</div>
                        <div class="search-key focusable">r</div>
                        <div class="search-key focusable">s</div>
                        <div class="search-key focusable">t</div>
                        <div class="search-key focusable">u</div>
                        <div class="search-key focusable">v</div>
                        <div class="search-key focusable">w</div>
                        <div class="search-key focusable">x</div>
                        <div class="search-key focusable">y</div>
                        <div class="search-key focusable">z</div>
                        <div class="search-key focusable">1</div>
                        <div class="search-key focusable">2</div>
                        <div class="search-key focusable">3</div>
                        <div class="search-key focusable">4</div>
                        <div class="search-key focusable">5</div>
                        <div class="search-key focusable">6</div>
                        <div class="search-key focusable">7</div>
                        <div class="search-key focusable">8</div>
                        <div class="search-key focusable">9</div>
                        <div class="search-key focusable">0</div>
                    </div>
                </div>
            <div class="search-results">
                <div type="text" class="search-text"></div>
                <div class="search-results-ph" id="search-results-ph"></div>
            </div>`;
    }

    searchDone(items, instance){
        let innerHTML = '<div class="search_items"><div class="search_items__list">';
        for (let i = 0; i < items.length; i++) {
            innerHTML += '<div class="search_item focusable" data-path="' + items[i]["path"] + '"><img class="search_item__image" src="' + items[i]['image'] + '" alt=""> <h2 class="search_item__title">' + items[i]['name'] + '</h2></div>';
        }
        document.getElementById("search-results-ph").innerHTML = innerHTML + '</div></div>'
        instance.lastMedia = instance.updatePositionsSr("search-results-ph", this.lastMedia);
        instance.lastKeyManager = instance.search_result_nav;
        instance.lastkey.classList.remove("focus");
    }
    updatePositionsSr(containerCN = "content", lastsel){
        let container = document.getElementsByClassName(containerCN)[0];
        let items = container.getElementsByClassName("focusable");//focusable next??
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
        lastsel = document.getElementById(containerCN + "_" + 0 + "_" + 0);
        lastsel.classList.add("focus");
        return lastsel;
    }
}
