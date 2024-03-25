import { Scene } from "./scene.js";

export class SceneSettings extends Scene{
    settings = null;
    lastSetting = null;
    settingsList = null;
    color =  {"Red Orange<div class='color-square' style='background-color: #FF3F34;'></div>":"#FF3F34","Razzmatazz<div class='color-square' style='background-color: #E3256B;'></div>":"#E3256B","Dark Orchid<div class='color-square' style='background-color: #9932CC;'></div>":"#9932CC","Purple Heart<div class='color-square' style='background-color: #652DC1;'></div>":"#652DC1","Cerulean Blue<div class='color-square' style='background-color: #2A52BE;'></div>":"#2A52BE","Dodger Blue<div class='color-square' style='background-color: #1E90FF;'></div>":"#1E90FF","Cyan<div class='color-square' style='background-color: #00B7EB;'></div>":"#00B7EB","Gossamer<div class='color-square' style='background-color: #069B81;'></div>":"#069B81","Apple<div class='color-square' style='background-color: #4FA83D;'></div>":"#4FA83D","Dollar Bill<div class='color-square' style='background-color: #85BB65;'></div>":"#85BB65","Pear<div class='color-square' style='background-color: #D1E231;'></div>":"#D1E231","Mikado Yellow<div class='color-square' style='background-color: #FFC40C;'></div>":"#FFC40C","Orange<div class='color-square' style='background-color: #FB9902;'></div>":"#FB9902","Flamingo<div class='color-square' style='background-color: #F2552A;'></div>":"#F2552A","Roman Coffee<div class='color-square' style='background-color: #795D4C;'></div>":"#795D4C","Star Dust<div class='color-square' style='background-color: #9F9F9C;'></div>":"#9F9F9C","Smalt Blue<div class='color-square' style='background-color: #51808F;'></div>":"#51808F","Smoky Black<div class='color-square' style='background-color: #100C08;'></div>":"#100C08","Black Cat<div class='color-square' style='background-color: #413839;'></div>":"#413839","Midnight Blue<div class='color-square' style='background-color: #151B54;'></div>":"#151B54","Dark Slate Blue<div class='color-square' style='background-color: #483D8B;'></div>":"#483D8B","Antique Fuchsia<div class='color-square' style='background-color: #915c83;'></div>":"#915c83","Dark Slate Gray<div class='color-square' style='background-color: #336666;'></div>":"#336666"};
    player = {"html": "html", "videoJs": "videojs", "Plyr player": "plyr", "Integrado (solo android)": "internal", "Externo (solo android)": "external"}
    root = document.documentElement;

    constructor(settings){
        super(true);
        this.lastKeyManager = this.navSettings;
        this.settings = settings;
    }
    navSettings(event){
        if(event == null){
            this.lastSetting.classList.add("selected");
            return;
        }
        let settingsList = null;
        let cindx = 0;
        switch(event.key) {
            case 'ArrowUp':
                settingsList = document.getElementsByClassName("setting");
                cindx = Array.prototype.indexOf.call(settingsList, this.lastSetting);
                if (cindx > 0){
                    this.lastSetting.classList.remove("selected");
                    this.lastSetting = settingsList[cindx - 1];
                    this.lastSetting.classList.add("selected");
                    this.settingsList.scrollTop = this.lastSetting.offsetTop;
                }
                break;
            case 'ArrowDown':
                settingsList = document.getElementsByClassName("setting");
                cindx = Array.prototype.indexOf.call(settingsList, this.lastSetting);
                if (cindx < settingsList.length - 1){
                    this.lastSetting.classList.remove("selected");
                    this.lastSetting = settingsList[cindx + 1];
                    this.lastSetting.classList.add("selected");
                    this.settingsList.scrollTop = this.lastSetting.offsetTop;
                }
                break;
            case 'ArrowLeft':
                this.lastSetting.classList.remove("selected");
                menuManager();
                break;
            case "Enter":
            case "NumpadEnter":
            case "Space":
            case " ":
                if(this.lastSetting.classList.contains("colorselect")){
                    generateSelectorDialog((ncolor)=>{
                        this.settings[this.lastSetting.id] = ncolor;
                        this.root.style.setProperty("--tint-color", ncolor);
                        this.saveSetting(this.settings);
                    }, "Elige un color", this.color);
                    return;
                }else if(this.lastSetting.id === "player_select"){
                    generateSelectorDialog((nPlayer)=>{
                        this.settings["selected_player"] = nPlayer;
                        document.getElementById("player_selected").innerHTML = nPlayer;
                        this.saveSetting(this.settings);
                    }, "Elige un reproductor apropiado", this.player);
                    return;
                }else if(this.lastSetting.classList.contains("modoselect")){
                    if(this.lastSetting.classList.contains("active")){
                        this.lastSetting.classList.remove("active");
                    }else{
                        this.lastSetting.classList.add("active");
                    };
                    localStorage.setItem("modo_tv", this.lastSetting.classList.contains("active"));
                    return;
                }
                this.settings[this.lastSetting.id][0] = !this.settings[this.lastSetting.id][0];
                if(this.lastSetting.classList.contains("active")){
                    this.lastSetting.classList.remove("active");
                }else{
                    this.lastSetting.classList.add("active");
                }
                this.saveSetting(this.settings);
                break;
        }
    }

    initBindings(){
        this.lastSetting = document.getElementsByClassName("setting")[0];
        this.lastSetting.classList.add("selected");
        this.settingsList = document.getElementsByClassName("settings-list")[0];
        hideLoading();
    }

    saveSetting(newSettings) {
        localStorage.setItem("settings", JSON.stringify(newSettings));
    }

    initBody(){
        let result = '<div class="settings-title">Configurar</div><div class="settings-list">';
        let mtvactive = "";
        if(this.settings["modo_tv"]){
            mtvactive = " active";
        }
        result += '<div class="setting colorselect" id="--tint-color"><div class="setting-text">Color de resaltador</div></div>';
        result += '<div class="setting modoselect'+ mtvactive +'" id="modo_tv"><div class="setting-text">Modo TV</div></div>';
        result += '<div class="setting multi_value_option" id="player_select"><div class="setting-text">Reproductor de video</div> <div id="player_selected" class="setting-info">' + this.settings["selected_player"] +'</div></div>';
        let extra = "";
        for(var key in this.settings){
            if(!Array.isArray(this.settings[key])){
                continue;
            }
            if(this.settings[key][0] == true){
                extra = " active";
            }else{
                extra = "";
            }
            result += '<div class="setting' + extra + '" id ="'+ key +'"><div class="setting-text">'+ this.settings[key][1] +'</div></div>';
        }
        this._body = result + '</div></div>';
    }

    dispose(){
        window.selectPlayerHome()
    }
}