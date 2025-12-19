import{Scene} from "./scene.js"
import {getSource} from '../js/sources/sources.js';

export class SceneSearch extends Scene{
    lastkey = null;
    lastMedia = null;
    searchtext = null;
    lastSH = null;
    constructor(){
        super(true);
        this.lastKeyManager = this.keys_nav;
    }

    moveFocus(oldElement, newElement) {
        if(newElement) {
            if(oldElement) oldElement.classList.remove("focus");
            newElement.classList.add("focus");
            return newElement;
        }
        return null;
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
                    this.lastkey = this.moveFocus(this.lastkey, newselection);
                }
                break;
            case 'ArrowDown':
                if(cr == 0){
                    cc = cc * 2;
                }
                newselection = document.getElementById("search-box_" + (cr+1) + "_" + cc);
                if(newselection){
                    this.lastkey = this.moveFocus(this.lastkey, newselection);
                }else{
                    if (this.lastSH){
                        this.lastKeyManager = this.search_history_nav;
                        this.lastkey.classList.remove("focus");
                        this.lastKeyManager(null);
                    }
                }
                break;

            case 'ArrowLeft':
                    newselection = document.getElementById("search-box_" + cr + "_" + (cc - 1));
                    if(newselection){
                        this.lastkey = this.moveFocus(this.lastkey, newselection);
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
                    this.lastkey = this.moveFocus(this.lastkey, newselection);
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
                        let st = this.searchtext.innerHTML.replace(' ', '+');
                        if (st.length > 0){
                            showLoading();
                            this.updateSearchHistory(st);
                            this.renderSearchHistory();
                            let server = getSource(sid);
                            server.getSearch((items) =>{this.searchDone(items, this)}, error, st)
                        }
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

    search_history_nav(event){
        if(event == null){
            this.lastSH.classList.add("focus");
            tease_menu(true);
            return;
        }
        let itempos = this.lastSH.id.split("_").reverse();
        let cc = parseInt(itempos[0]);
        let cr = parseInt(itempos[1]);
        let newselection;
        switch(event.key){
            case 'ArrowUp':
                newselection = document.getElementById("search-history-ph_" + (cr-1) + "_" + cc);
                if(newselection){
                    this.lastSH = this.moveFocus(this.lastSH, newselection);
                    break;
                }else if(cc != 0){
                    newselection = document.getElementById("search-history-ph_" + (cr-1) + "_0");
                    if(newselection) {
                        this.lastSH = this.moveFocus(this.lastSH, newselection);
                        break;
                    }
                }
                this.lastKeyManager = this.keys_nav;
                this.lastSH.classList.remove("focus");
                this.lastkey.classList.add("focus");
                break;
            case 'ArrowDown':
                newselection = document.getElementById("search-history-ph_" + (cr+1) + "_" + cc);
                if(newselection){
                    this.lastSH = this.moveFocus(this.lastSH, newselection);
                }else if(cc != 0){
                    newselection = document.getElementById("search-history-ph_" + (cr+1) + "_0");
                    if(newselection) this.lastSH = this.moveFocus(this.lastSH, newselection);
                }
                break;
            case 'ArrowLeft':
                newselection = document.getElementById("search-history-ph_" + cr + "_" + (cc - 1));
                if(newselection){
                    this.lastSH = this.moveFocus(this.lastSH, newselection);
                }
                if(cc === 1){
                    tease_menu(true);
                }else if(cc === 0){
                    this.lastSH.classList.remove("focus");
                    menuManager();
                }
                break;
            case 'ArrowRight':
                newselection = document.getElementById("search-history-ph_" + cr + "_" + (cc + 1));
                if(newselection){
                    this.lastSH = this.moveFocus(this.lastSH, newselection);
                    if(cc === 0) tease_menu(false);
                }else{
                    if(this.lastMedia != null){
                        this.lastKeyManager = this.search_result_nav;
                        this.lastSH.classList.remove("focus");
                        this.lastMedia.classList.add("focus");
                        tease_menu(false);
                    }
                }
                break;
            case "Enter":
            case "NumpadEnter":
            case 'Space':
            case ' ':
                let query = this.lastSH.dataset.query;
                if (query){
                    showLoading();
                    this.searchtext.innerHTML = query;
                    let server = getSource(sid);
                    server.getSearch((items) =>{this.searchDone(items, this)}, error, query)
                    this.lastSH.classList.remove("focus");
                    this.lastSH = document.getElementById("search-history-ph_0_0");
                    this.lastkey.classList.remove("focus");
                    this.lastkey = document.getElementById("search-box_0_2");
                    tease_menu(false);
                }
                break;
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
                    this.lastMedia = this.moveFocus(this.lastMedia, newselection);
                    this.lastMedia.parentElement.scrollTop = this.lastMedia.offsetTop - 65;
                }
                break;
            case 'ArrowDown':
                newselection = document.getElementById("search-results-ph_" + (cr+1) + "_" + cc);
                if(newselection){
                    this.lastMedia = this.moveFocus(this.lastMedia, newselection);
                    this.lastMedia.parentElement.scrollTop = this.lastMedia.offsetTop - 65;
                }
                break;
            case 'ArrowLeft':
                    newselection = document.getElementById("search-results-ph_" + cr + "_" + (cc - 1));
                    if(newselection){
                        this.lastMedia = this.moveFocus(this.lastMedia, newselection);
                    }
                    if(cc === 0){
                        this.lastKeyManager = this.keys_nav;
                        this.lastMedia.classList.remove("focus");
                        this.lastKeyManager(null);
                    }
                break;
            case 'ArrowRight':
                newselection = document.getElementById("search-results-ph_" + cr + "_" + (cc + 1));
                if(newselection){
                    this.lastMedia = this.moveFocus(this.lastMedia, newselection);
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
        let searchBox = document.getElementsByClassName("search-box")[0];
        this.lastkey = this.updatePositions(searchBox, "search-box");
        this.renderSearchHistory();
        this.searchtext = document.getElementsByClassName("search-text")[0];
        hideLoading();
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
                    <div class="search-history-ph" id="search-history-ph"></div>
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
        let resultsPh = document.getElementById("search-results-ph");
        instance.lastMedia = instance.updatePositions(resultsPh, "search-results-ph");
        if (items.length > 0){
            instance.lastKeyManager = instance.search_result_nav;
            instance.lastkey.classList.remove("focus");
        }
        hideLoading();
    }

    renderSearchHistory(){
        let history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
        if(history.length > 0){
            let innerHTML = '';
            for (let i = 0; i < history.length; i++) {
                innerHTML += `<div class="search-history-item focusable" data-query="${history[i]}">${history[i]}</div>`;
            }
            let historyPh = document.getElementById("search-history-ph");
            historyPh.innerHTML = innerHTML;
            this.lastSH = this.updatePositions(historyPh, "search-history-ph");
        }
    }

    updateSearchHistory(newTerm){
        if(!newTerm || newTerm.length === 0) return;
        let history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
        history = history.filter(item => item !== newTerm);
        history.unshift(newTerm);
        if(history.length > 15) {
            history.pop();
        }
        localStorage.setItem("searchHistory", JSON.stringify(history));
    }

    updatePositions(container, prefix){
        let items = container.getElementsByClassName("focusable");
        if (items.length == 0){
            return null;
        }
        let ctop = items[0].offsetTop;
        let rc = 0, cc = 0;
        for(let i = 0; i < items.length; i++){
            if(items[i].offsetTop != ctop){
                ctop = items[i].offsetTop;
                rc++;
                cc = 0;
            }
            items[i].id = prefix + "_" + rc + "_" + cc;
            cc++;
        }
        return document.getElementById(prefix + "_" + 0 + "_" + 0);
    }
}
