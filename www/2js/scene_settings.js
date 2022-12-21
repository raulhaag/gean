import { Scene } from "./scene.js";

export class SceneSettings extends Scene{
    settings = {
        "lockfronpage": [false, "Bloquear pagina principal"],
        "fullscreen": [true,"Iniciar video en pantalla completa"],
        "autoplay": [false,"Autoplay de video"]
    }
    lastSetting = null;
    constructor(){
        super(true);
        this.lastKeyManager = this.navSettings;
    }

    navSettings(event){
        if(event == null){
            this.lastSetting.classList.add("selected");
            return;
        }
        let settingsList = null;
        let cindx = 0;
        switch(event.keyCode) {
            case up:
                settingsList = document.getElementsByClassName("setting");
                cindx = Array.prototype.indexOf.call(settingsList, this.lastSetting);
                if (cindx > 0){
                    this.lastSetting.classList.remove("selected");
                    this.lastSetting = settingsList[cindx - 1];
                    this.lastSetting.classList.add("selected");
                }
                break;
            case down:
                settingsList = document.getElementsByClassName("setting");
                cindx = Array.prototype.indexOf.call(settingsList, this.lastSetting);
                if (cindx < settingsList.length - 1){
                    this.lastSetting.classList.remove("selected");
                    this.lastSetting = settingsList[cindx + 1];
                    this.lastSetting.classList.add("selected");
                }
    
                break;
            case left:
                this.lastSetting.classList.remove("selected");
                menuManager();
                break;
            case enter:
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
    }

    saveSetting(newSettings) {
        localStorage.setItem("settings", JSON.stringify(newSettings));
    }

    initBody(){
        let storedSettings = null;
        try {
            storedSettings = JSON.parse(localStorage.getItem("settings"));
        } catch (e) {}
        if(storedSettings == null){
            //first time no changes
            storedSettings = this.settings;
        }else if(storedSettings.length != this.settings.length){
            //need to update settings
            let newSettings = {};
            for(key in this.settings){
                if(key in storedSettings){
                    newSettings[key] = storedSettings[key];
                }else{
                    newSettings[key] = this.settings[key];
                }
            }
            saveSetting(newSettings)
            storedSettings = newSettings
        }
        this.settings = storedSettings;
        let result = '<div class="settings-title">Configurar</div><div class="settings-list">';
        let extra = "";
        for(var key in storedSettings){
            if(storedSettings[key][0] == true){
                extra = " active";
            }else{
                extra = "";
            }
            result +=  '<div class="setting' + extra + '" id ="'+ key +'"><div class="setting-text">'+ storedSettings[key][1] +'</div></div>';
        }
        this._body = result + '</div></div>';
    }

}