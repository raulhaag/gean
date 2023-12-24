import {Scene} from "./scene.js";
import {getName, getDDL} from '../js/vservers/vserver.js';


export class ScenePlayer extends Scene{
    increments = [5, 10, 15, 30, 30, 60, 300, 600]
    doublepress = false;
    timeoutdoublepress = 500;
    lastPressedKeyCode = -1;
    lastPressedTime = -1;
    doubleAccumulator = 0;
    player = null;
    last = null;
    maxDoubleAccumulator = 7;
    constructor(options, items, parent){
        super(false);
        this.parent = parent;
        this.lastKeyManager = this.playerNav;
        this.options = options;
        this.cache = appSettings["cache"][0];
        this.items = items;
    }
    initBody(){
           
            let innerHtml = `<div class="player" id="player"><div class="player-container"><div class="player-options" tabindex="-1">`;
            let cc = 0;
            let sItems = {};
            if(Object.keys(this.options).length > 1){
                let csl = "video";
                let keys = Object.keys(this.options);
                for (let i = 0; i < keys.length; i++){
                     if(this.options["video"] == this.options[keys[i]]){
                        csl = keys[i];
                        break;
                    };
                }
                innerHtml += `<div class="player-option-title">Resolución</div>
                <div id="player-container_0_0" class="player-option-list"  data-options='` + JSON.stringify(this.options) + `'>` + csl + `</div>`;
                cc = 1;
            }
            for(let i = 0; i < this.items.length; i++){
                sItems[getName(this.items[i])] = this.items[i];
            }
            innerHtml += `<div  class="player-option-title">Video Server</div>
            <div id="player-container_0_` + cc +`" class="player-option-list" data-options='`+ JSON.stringify(sItems) + `'>` + getName(this.items[0]) + `</div>
            </div><div class="player-video-container">
            <div id="player-container_1_0" class="jwplayer" autoplay="true" controls ></div>
                </div>
            </div></div></div>`;
            this._body = innerHtml;
    }

    initBindings(){
        /*if(Object.keys(this.options).length > 1 && res) {
            if(localStorage.getItem("resSelect") == "true"){
                generateSelectorDialog((selection, label) => {
                    options.video = selection;
                    openPlayer(options, items, false);
                },"Elige una resolución apropiada", options);
                return;
            }
        }/*/
        if(getStorageDefault("external_player", false)){
            fetch(window.serverHost + "view/" + window.enc(options["video"]))
            .then((response) => response.text())
            .then((result) => {
                if(result.trim() != "ok"){
                    error("Error al abrir reproductor externo: \n" + result);
                }
          })
          return;
        }
        let vdata = this.options["video"].split("|||");
        let vtype = "video/mp4";
        let videoSrc = vdata[0];
        if (vdata.length > 1) {
        vtype = vdata[1];
        } else if (this.cache) {
            if (videoSrc.indexOf("file/") !== -1) {
                videoSrc = videoSrc.replace("file/", "cache/");
            } else {
                videoSrc = window.serverHost + "cache/" + enc(videoSrc);
            }
        }
        let setup = {
            primary: 'html5',
            autostart: true,
            preload: 'none',
            cast: {},
            floating: {},
        };
        this.player = jwplayer('player-container_1_0').setup({
            autostart: true,
            file : videoSrc + "/" + enc({}) +"/v.mp4",
        })
        this.last = this.player;
        if(appSettings["fullscreen"][0])this.player.setFullscreen(true);
        changeKeyManager();
    }

    playerNav(event){
        if(event == null){
            this.last.classList.add("selected");
            return;
        }
        this.doublepress = (this.lastPressedKeyCode == event.keyCode && 
                      (new Date().getTime() - this.lastPressedTime -this.timeoutdoublepress) < 0);
        this.lastPressedKeyCode = event.keyCode;
        this.lastPressedTime = new Date().getTime();
        if (this.doublepress) {
            this.doubleAccumulator += 1;
            this.doubleAccumulator = Math.min(this.maxDoubleAccumulator, this.doubleAccumulator);
        }else{
            this.doubleAccumulator = 0;
        }
        if(this.last == this.player){
            switch (event.key) { //control player
                case 'ArrowUp':
                    if(this.player.getFullscreen()){
                        this.player.setFullscreen(false);
                    }else{
                        if(this.itemExists(0,0)){
                            this.last = this.getItem(0, 0);
                            this.last.classList.add("selected");
                        }
                        tease_menu(true);
                    }
                    break;
                case 'ArrowDown':
                    if(this.player.getFullscreen()){
                        this.switchPlayer();
                    }else{
                        this.switchPlayer();
                        this.player.setFullscreen(true);
                        this.switchPlayer();
                    }
                    break;
                case 'ArrowLeft':
                    this.player.seek(this.player.getCurrentTime() - this.increments[this.doubleAccumulator]);;
                    break;
                case 'ArrowRight':
                    this.player.seek(this.player.getCurrentTime() + this.increments[this.doubleAccumulator]);;
                    break;
                case "Enter":
                case "NumpadEnter":
                case "Space":
                case " ":                    
                    if(this.doublepress){
                        this.switchPlayer();
                        this.player.setFullscreen(true);
                        this.switchPlayer();
                        return;
                    }
                    this.switchPlayer()
                    break;
                default:
                    break;
            }
        }else{
            let itempos = this.last.id.split("_");
            let cc = parseInt(itempos[itempos.length-1]);
            let cr = parseInt(itempos[itempos.length-2]);
            switch (event.key) { //control nav options
                case 'ArrowUp':
                    if(cr == 0){
                        //manageMenu(null);
                        return;
                    }
                    let desph = cc;
                    while(desph >= 0){
                        if(this.itemExists((cr - 1), desph)){
                            this.last.classList.remove("selected");
                            this.last = getItem(cr-1, desph);
                            this.last.classList.add("selected");
                            break;
                        }
                        desph--;
                    }
                    break;
                case 'ArrowDown':
                            this.last.classList.remove("selected");
                            this.last = this.player;
                    break;
                case 'ArrowLeft':
                    if(cc == 1){
                        tease_menu(true);
                    }
                    if(cc == 0){
                        this.last.classList.remove("selected");
                        menuManager();
                   }else{
                        this.last.classList.remove("selected");
                        this.last = this.getItem(cr, cc - 1);
                        this.last.classList.add("selected");
                    }
                    break;
                case 'ArrowRight':
                    if(this.itemExists(cr, cc + 1)){
                        this.last.classList.remove("selected");
                        this.last = this.getItem(cr, cc + 1);
                        this.last.classList.add("selected");
                    }
                    if(cc == 0){
                        tease_menu(false);
                    }
                    break;
                case "Enter":
                case "NumpadEnter":
                case "Space":
                case " ":
                    let options = JSON.parse(this.last.dataset["options"]);
                    if(options.hasOwnProperty("video")){
                        delete options.video;
                        generateSelectorDialog((value, tagName)=>{
                            this.last.innerHTML = tagName;
                            this.player.remove();
                            this.player = jwplayer('player-container_1_0').setup([{file: value, autostart: true},]);
                        }, "Elige una resolución", options);
                        return;
                    }
                    generateSelectorDialog((selected)=>{
                            let best = [selected]
                            var keys = Object.keys(options);
                            keys.forEach(function(key){
                                if(options[key] != selected){
                                    best.push(options[key]);
                                }
                            });
                            let mask = (value) => {
                                setScene(new ScenePlayer(value, best, this.parent));
                            }
                            let tryOtherOnError = (errorMessage) => {
                                if (best.length > 1){
                                    best.shift();
                                    getDDL(mask, tryOtherOnError, best[0]);
                                }else{
                                    error(errorMessage);
                                }
                            }
                            if (best.length > 0){
                                getDDL(mask,tryOtherOnError, best[0]);
                            } else {
                                error("No supported servers");
                            }
                    },
                     "Aquí están tus opciones", options);
                default:
                    break;
            }
        }
    };

    dispose(){
        this.player.remove();
    }

    /* functions */
    getItem(row, column, prefix = "player-container"){
        let item = document.getElementById(prefix + "_" + row + "_" + column);
        return item;
    }

    itemExists(row, column, prefix = "player-container"){
        let item = document.getElementById(prefix + "_" + row + "_" + column);
        if(item != null){
            return true;
        }
        return false;
    }

    switchPlayer(){
        if(this.player.getState() != "playing"){
            this.player.play();
        }else{
            this.player.pause();
        };
    
    }
    isFullscreen (){return !! document.fullscreenElement};
}
