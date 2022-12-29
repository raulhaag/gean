import {getSource} from '../js/sources/sources.js';
import {getDDL, getName, getPreferer} from '../js/vservers/vserver.js';
import {SceneHome} from "./scene_home.js";
import {SceneDetails} from './scene_details.js';
import {SceneSearch} from './scene_search.js';
import {ScenePlayer} from './scene_player.js';
import {SceneChange} from './scene_change.js';
import {SceneSettings} from './scene_settings.js';

//keys used
window.up = 38, window.right = 39, window.down = 40, window.left = 37, window.enter = 13, window.backspace = 8, window.space = 32;
//server id / name
window.sid, window.sn;
window.tease_menu = null;
window.menu = null;
window.lockMenu = true;
window.lockKeys = true;
let scene_container = null;
let backScenePoll = [], backScenePH = [];

window.favorites = {}; window.recent = []; window.resumes = {};

document.addEventListener("DOMContentLoaded",function(){
    window.serverHost = "http://" + window.location.hostname + ":8080/"
    try{
        favorites = JSON.parse(getStorageDefault('favorites', "[]"));
    }catch(e){}
    try{
        recent = JSON.parse(getStorageDefault('recent'), "[]");
    }catch(e){}
    loadResumes();
    loadSettings();
    let lastServer = localStorage.getItem('lastServer');
    let lastServerName = localStorage.getItem('lastServerName');
    if(lastServer != null && lastServerName != null){
        window.sid = lastServer;
        window.sn = lastServerName;
    }else{
        window.sid = "jkanime";
        window.sn = "JkAnime";
    }
    teaseMenu = document.getElementsByClassName("menu-tease")[0];
    menu = document.getElementsByClassName("menu")[0];
    scene_container = document.getElementById("main_scene");
    setScene(new SceneHome());
});

//menu management
let teaseMenu = null, menu = null;
let optionsId = ["menu-home", "menu-search", "menu-change", "menu-settings"];
let selectedMenuIdx = 0, lastMenuOpened = 0;
let menuLock = false;
let currentScene = null;
let dialog = false;

window.menuManager = () => {
    menuLock = true;
    menu.classList.remove("menu-closed");
    teaseMenu.classList.add("menu-tease-only-icons");
    document.onkeydown = menu_nav;
};

window.lockKeyboard = () => {
    document.onkeydown = null;
};

window.unlockKeyboard = () => {
    if(menuLock){
        menuManager();
    }else if(dialog){
        return;
    }else{
        changeKeyManager();
    }
};

let keyManager = (key) =>{
    if(key != null){key.preventDefault();}
    currentScene.lastKeyManager(key);
};

window.changeKeyManager = () => {
    menuLock = false;
    menu.classList.add("menu-closed");
    teaseMenu.classList.remove("menu-tease-only-icons");
    if(backScenePoll.length > 0){
        currentScene = backScenePoll[backScenePoll.length - 1];
    }
    document.onkeydown = keyManager;
    try{
        document.onkeydown(null);
    }catch(e){};
};

let loadingDiv = null;
let timeOutLoadingId = null;
window.setLoading = () => {
    if(window.lockKeys) {window.lockKeyboard()}else{window.lockKeys = true; return};
    if(loadingDiv == null) {
        loadingDiv = document.createElement("div");
        loadingDiv.innerHTML = '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
        loadingDiv.classList.add("loading_container");
        document.body.append(loadingDiv);
    }else{
        clearTimeout(timeOutLoadingId);
    }
};

window.unsetLoading = () => {
   timeOutLoadingId = setTimeout(() => {
        unlockKeyboard();
        try {
            if(document.body.hasChildNodes(loadingDiv) && loadingDiv != null)document.body.removeChild(loadingDiv);}catch(e){};
        loadingDiv = null;
    }, 500);
};

window.setScene = (nScene) => {
    if(nScene.full_menu){//replace main escene
        for(let i in backScenePoll){
            i.dispose();
        }
        backScenePoll = [];
        for(let i in backScenePH){
            document.body.removeChild(i);
        }
        backScenePH = [];
        if(currentScene != null){
            currentScene.dispose();
        }
        scene_container.innerHTML = nScene.body();
        currentScene = nScene;
        nScene.initBindings();
    }else{//add child to the back pool
        if(backScenePoll.length > 0 && //now allow pool 2 equals
            nScene.constructor.name === backScenePoll[backScenePoll.length - 1].constructor.name){
                popScene();
        }
        showBack(true);
        let ph = document.createElement("div");
        ph.classList.add("backable_placeholder")
        ph.classList.add("over-search");
        ph.innerHTML = nScene.body();
        document.body.appendChild(ph);
        nScene.initBindings();
        backScenePH.push(ph);
        backScenePoll.push(nScene);
    }
    changeKeyManager();
};

let popScene = () => {
    if(backScenePoll.length > 1){
        currentScene = backScenePoll[backScenePoll.length - 1];
    }else{
        currentScene = currentScene.parent;
        backMenuSwitch();
    }
    backScenePoll.pop().dispose();
    document.body.removeChild(backScenePH.pop());
    changeKeyManager()
};

let menu_nav = (event) =>{
    if(event == null){
        tease_menu(true);
        return;
    }
    switch(event.keyCode){
        case up:
            if(selectedMenuIdx > 0){
                document.getElementById(optionsId[selectedMenuIdx - 1]).classList.add("menu-selected-from-up");
                document.getElementById(optionsId[selectedMenuIdx]).classList.remove("menu-selected-from-up");
                document.getElementById(optionsId[selectedMenuIdx]).classList.remove("menu-selected-from-down");
                selectedMenuIdx -= 1;
            }
            break;
        case down:
            if(selectedMenuIdx < optionsId.length - 1){
                document.getElementById(optionsId[selectedMenuIdx + 1]).classList.add("menu-selected-from-down");
                document.getElementById(optionsId[selectedMenuIdx]).classList.remove("menu-selected-from-up");
                document.getElementById(optionsId[selectedMenuIdx]).classList.remove("menu-selected-from-down");
                selectedMenuIdx += 1;
            }
            break;
        case right:
            changeKeyManager();
            teaseMenu.classList.remove("menu-tease-only-icons");
            menu.classList.add("menu-closed");
            keyManager(null);
            if(selectedMenuIdx > lastMenuOpened){
                document.getElementById(optionsId[lastMenuOpened]).classList.add("menu-selected-from-up");
                document.getElementById(optionsId[selectedMenuIdx]).classList.remove("menu-selected-from-up");
                document.getElementById(optionsId[selectedMenuIdx]).classList.remove("menu-selected-from-down");
            }else if(selectedMenuIdx < lastMenuOpened){
                document.getElementById(optionsId[lastMenuOpened]).classList.add("menu-selected-from-down");
                document.getElementById(optionsId[selectedMenuIdx]).classList.remove("menu-selected-from-up");
                document.getElementById(optionsId[selectedMenuIdx]).classList.remove("menu-selected-from-down");
            }
            selectedMenuIdx = lastMenuOpened;
            teaseMenu.classList.remove("menu-tease-only-icons");
            break;
        case enter:
            if(!currentScene.full_menu){
                popScene();
                return;
            }
            if(selectedMenuIdx != lastMenuOpened){
                switch(selectedMenuIdx){
                    case 0:
                        setScene(new SceneHome());
                        break;
                    case 1:
                        setScene(new SceneSearch());
                        break;
                    case 2:
                        setScene(new SceneChange());
                        break;
                    case 3:
                        setScene(new SceneSettings());
                        break;
                }
                lastMenuOpened = selectedMenuIdx;
                menu.classList.add("menu-closed");
            }
    }
};

window.tease_menu = (show = true)=>{
    if(show){
        teaseMenu.classList.remove("menu-tease-disapear")
    }else{
        teaseMenu.classList.add("menu-tease-disapear");
    }
};

let backMenuSwitch = ()=>{
    let menues = document.getElementsByClassName("menu-item");
    let tease = document.getElementsByClassName("menu-item-tease");
    for(let i=0; i<menues.length; i++) {
        if(menues[i].classList.contains("hide")){
            menues[i].classList.remove("hide");
        }else{
            menues[i].classList.add("hide");
        }
    }
    for(let i=0; i<tease.length; i++) {
        if(tease[i].classList.contains("hide")){
            tease[i].classList.remove("hide");
        }else{
            tease[i].classList.add("hide");
        }
    }
};

let showBack = (status) => {
    let back = document.getElementById("menu-back");
    if(back.classList.contains("hide") != status){
        return;
    }
    backMenuSwitch();
};

//globals functions
window.route = function(path, ppath = null){
    let fpath = path.split('/');
    let server = getSource(fpath[0]);
    let action = fpath[1];
    let params;
    if (fpath.length == 3){
        params = atob(fpath[2]);
    }
    if(action == 'getFrontPage'){
        server.getFrontPage(posServerClick, error);
    }else if(action == 'getCategory'){
        //server.getCategory(params, posServerClick, error);
    }else if(action == 'getDescription'){
        server.getDescription((resp)=>{
            setScene(new SceneDetails(resp, currentScene));
        }, error, fpath[2]);
    }else if(action == 'getLinks'){
        server.getLinks((linkList)=>{
            let best = getPreferer(linkList);
            let mask = (value) => {
                let secondMask = (value) => {
                    if(window.appSettings['external_player_android'][0]){
                        fetch(window.serverHost + "view/" + window.enc(value["video"]))
                        .then((response) => response.text())
                        .then((result) => {
                            if(result.trim() != "ok"){
                                error("Error al abrir reproductor externo: \n" + result);
                            }
                        })
                        return;
                    }
                    setScene(new ScenePlayer(value, best, currentScene));
                }
                if(window.appSettings['res_select'][0]){
                    generateSelectorDialog((key, data) => {
                        value['video'] = key;
                        secondMask(value);
                    }, "Selecciona la resolución preferida", value)

                }else{
                    secondMask(value);
                }
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
                if(window.appSettings['vsource_select'][0]){
                    let names = {};
                    best.forEach(link => names[getName(link)] = link);
                    generateSelectorDialog((key, data) => {
                        best.splice(best.indexOf(key), 1);
                        best.unshift(key);
                        getDDL(mask,tryOtherOnError, best[0]);
                    },"Elige el servidor de video preferido", names);
                    return;
                }
                getDDL(mask,tryOtherOnError, best[0]);
            } else {
                error("No supported servers");
            }
        }, error, fpath[2]);
    }else if(action == 'search'){
        let term = document.getElementsByClassName("search__text")[0].value;
        server.getSearch(posSearch, error, term);
    }
};

window.generateSelectorDialog = (postAction, title = "Elige una opcion", options = {}) => {
    dialog = true;
    document.__selectPrekeydown = document.onkeydown;
    var div = document.createElement("div");
    let content =`<div class="option-selector">
                    <div class="option-selector-title">` + title +`</div>
                    <div class="option-selector-list">`;
    let id = 0;
    for(var key in options){
        content += '<div class="option-selector-list-item" id="os_' + id +'" data-info="'+ options[key] +'">' + key + '</div>';
        id++;
    }
    content += '</div><div class="option-selector-cancel" id="os_'+ id +'"> Cancelar</div></div>';
    div.innerHTML = content;
    let lOSelected = div.getElementsByClassName("option-selector-list-item")[0];
    lOSelected.classList.add("selected");
    document.body.appendChild(div);
    document.__optionsDiv = div;
    document.onkeydown = (event) => {
        let cidx = parseInt(lOSelected.id.split("_")[1]);
        if (event.keyCode === 38){ //up arrow
            if(cidx > 0){
                cidx--;
                lOSelected.classList.remove("selected");
                lOSelected = document.getElementById("os_" + cidx);
                lOSelected.classList.add("selected");
            }
        }else if (event.keyCode === 40){//down arrow
            if (!lOSelected.classList.contains("option-selector-cancel")){
                cidx++;
                lOSelected.classList.remove("selected");
                lOSelected = document.getElementById("os_" + cidx);
                lOSelected.classList.add("selected");
            }
        }else if (event.keyCode === 13){
            document.body.removeChild(document.__optionsDiv);
            document.onkeydown = document.__selectPrekeydown;
            document.__selectPrekeydown = null;
            dialog = false;
            unlockKeyboard();
            if (!lOSelected.classList.contains("option-selector-cancel")){
                postAction(lOSelected.dataset["info"], lOSelected.innerHTML);
            }
        }
    }
};

window.error = (error_message) => {
    alert(error_message);
//loading.style.visibility = 'hidden';
};

window.requestFullScreen = function(elem) {
    try{
        if (elem.requestFullscreen) {
        elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
        elem.webkitRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
        }
    }catch(err){};//ignore
};

window.exitFullScreen = function() {
    const document = window.document;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
};


window.getStorageDefault = function(key, defa){
    let val = localStorage.getItem(key);
    if(val == null){
        val = defa;
        localStorage.setItem(key, val);
    }
    if(val == 'true'){
        return true;
    }else if(val == 'false'){
        return false;
    }
    return val;
};

window.indexOfProperty = function(array, property, value){
    return array.map(function(x){return x[property]}).indexOf(value);
};

window.getFirstMatch = function(regex, str){
    var m = regex.exec(str);
    if(m == null){
        return "";
    }
    return m[1];
};

window.getAllMatches = function(regex, str){
    return [...str.matchAll(regex)];
};

window.markViewed = function(e, spath, path){
    let vc = [];
    try{
        vc = JSON.parse(localStorage.getItem(spath));
        if(vc == null){
            vc = [];
        }
    }catch(error){
    }
    if(vc.indexOf(path) == -1){
        if(e != null){
            e.classList.add("viewed");
        }
        vc.push(path);
        localStorage.setItem(spath, JSON.stringify(vc));
    }
}

function loadResumes(){
    resumes = JSON.parse(getStorageDefault('resumes', "{}"));
    Object.keys(resumes).forEach(key => {
        if(resumes[key] == "Sin sinopsis por el momento"){
            delete resume[key];
        }
    });
};

function loadSettings(){
    let settings = {
        "lockfronpage": [false, "Bloquear pagina principal."],
        "videojs": [false, "Usar videoJs como reproductor."],
        "fullscreen": [true,"Iniciar video en pantalla completa. (si el navegador no lo bloquea)."],
        "res_select": [false,"Dejarme elegir la resolución antes de abrir el video."],
        "vsource_select": [false,"Dejarme elegir el servidor de video antes de abrir el video."],
        "external_player_android":[false,"Usar reproductor externo (solo Android)."]
    }
    let storedSettings = null;
    try {
        storedSettings = JSON.parse(localStorage.getItem("settings"));
    } catch (e) {}
    if(storedSettings == null){
        //first time no changes
        storedSettings = settings;
    }else if(Object.keys(storedSettings).length != Object.keys(settings).length){
        //need to update settings
        let newSettings = {};
        Object.keys(settings).forEach(key => {
            if(key in storedSettings){
                newSettings[key] = storedSettings[key];
            }else{
                newSettings[key] = settings[key];
            }
        });
        storedSettings = newSettings
    }
    window.appSettings = storedSettings;
}

window.saveFavorites = () => {
    if (favorites != null){
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }else{
        favorites = [];
    }
}

window.getSettingsDefault = (key, defaultValue) => {
    if(key in Object.keys(window.appSettings)){
        return window.appSettings[key];
    }
    return defaultValue;
}
