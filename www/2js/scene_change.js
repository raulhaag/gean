import {Scene} from "./scene.js"
import {getResponse, getSource, getSourceList} from '../js/sources/sources.js';

export class SceneChange extends Scene{
    serverSelectedIdx = 0;
    servers = null;
    constructor(){
        super(true);
        this.lastKeyManager = this.change_nav;
    }

    initBody(){
        this._body =`<div class="change-main" id="change">
            <div class="change-list-container">
                <div class="change-title">¿Que servidor deseas usar?</div>
                <div class="change-list"></div>
            </div>
        </div>`;
    }

    change_nav(event){
        if(event == null){
            document.getElementById(this.servers[this.serverSelectedIdx]).classList.add("change-item-focus");
            return;
        }
        switch(event.keyCode){
            case right:
                if(this.serverSelectedIdx < this.servers.length - 1){
                    document.getElementById(this.servers[this.serverSelectedIdx]).classList.remove("change-item-focus");
                    this.serverSelectedIdx += 1;
                    document.getElementById(this.servers[this.serverSelectedIdx]).classList.add("change-item-focus");
                    if(this.serverSelectedIdx >= 1){
                        tease_menu(false);
                    }
                    document.getElementById(this.servers[this.serverSelectedIdx]).parentNode.scrollLeft = document.getElementById(this.servers[this.serverSelectedIdx]).offsetLeft - 80;
                }
                break;
            case left:
                if(this.serverSelectedIdx > 0 ){
                    document.getElementById(this.servers[this.serverSelectedIdx]).classList.remove("change-item-focus");
                    this.serverSelectedIdx -= 1;
                    document.getElementById(this.servers[this.serverSelectedIdx]).classList.add("change-item-focus");
                    if(this.serverSelectedIdx === 0){
                        tease_menu(true);
                    }
                    document.getElementById(this.servers[this.serverSelectedIdx]).parentNode.scrollLeft = document.getElementById(this.servers[this.serverSelectedIdx]).offsetLeft - 80;
                }else{
                    menuManager();
                    document.getElementById(this.servers[this.serverSelectedIdx]).classList.remove("change-item-focus");
                }
                break;
            case enter:
                let sid = document.getElementById(this.servers[this.serverSelectedIdx]).id;
                let sn = document.getElementById(this.servers[this.serverSelectedIdx]).textContent;
                localStorage.setItem('lastServer', sid);
                localStorage.setItem('lastServerName', sn);
                location.reload();
        }
    }

    initBindings(){
        let scont = document.getElementsByClassName("change-list")[0];
        this.servers = getSourceList();
        let inner = "";
        this.servers.forEach(key => {
           inner += '<div class="change-item" id="' + key + '">'+ key + '</div>';
        });
        scont.innerHTML = inner;
        let cs = document.getElementsByClassName("change-item")[this.servers.indexOf(sid)];
        cs.classList.add("change-item-focus");
        cs.classList.add("change-item-selected");
        cs.parentNode.scrollLeft = cs.offsetLeft;
        this.serverSelectedIdx = this.servers.indexOf(sid);
        this.needCenter()
    }

    needCenter = () => {
        let cl = document.getElementsByClassName("change-list")[0];
        if(cl.clientWidth < cl.scrollWidth ) {
            cl.classList.remove("center");
        }else{
            cl.classList.add("center");
        }
    }
}