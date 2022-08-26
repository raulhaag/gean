import {getResponse, getSource} from '../js/sources/sources.js';
import {getDDL, getPreferer} from '../js/vservers/vserver.js';


let settings = {
    "lockfronpage": [false, "Bloquear pagina principal"],
    "fullscreen": [true,"Iniciar video en pantalla completa"],
    "autoplay": [false,"Autoplay de video"]
}

let info = {title: null, resume:null, play:null, image:null};
let up = 38, right = 39, down = 40, left = 37, enter = 13;
let container, searchtext;
let last = {chapter: null, setting: null, media: null, key: null, video:null};
let placeholders = {chapter: null, setting: null, media: null, key: null, video:null};
let tempSerieCache = {};
let items_gap = 80, inigap = 0;
let sid, sn;
let favorites = [];
let recent = [];

let servers = null;
let serverSelectedIdx = 0;

document.addEventListener("DOMContentLoaded",function(){
window.serverHost = "http://" + window.location.hostname + ":8080/"
try{
    favorites = JSON.parse(localStorage.getItem('favorites'));
}catch(e){}
try{
    recent = JSON.parse(localStorage.getItem('recent'));
}catch(e){}
let lastServer = localStorage.getItem('lastServer');
let lastServerName = localStorage.getItem('lastServerName');
    if(lastServer != null && lastServerName != null){
        sid = lastServer;
        sn = lastServerName;
    }else{
        sid = "jkanime";
        sn = "JkAnime";
    }
    placeholders.chapter = document.getElementById('chapters');
    placeholders.home = document.getElementById("home"); 
    placeholders.video = document.getElementById("videos");
    placeholders.search = document.getElementById("search");
    placeholders.change = document.getElementById("change");
    initHome();
});


//menu
let teaseMenu = null, menu = null;
let lastNoMenu = null;
let optionsId = ["menu-home", "menu-search", "menu-change", "menu-settings"];
let optionsDivs = [];
let selectedMenuIdx = 0, lastMenuOpened = 0;

let menu_nav = (event) =>{
    if(event == null){
        tease_menu(true);
        return;
    }
    event.preventDefault()
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
            document.onkeydown = lastNoMenu;
            lastNoMenu(null);
            menu.classList.add("menu-closed");
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
            last.video.classList.add("focus");
            break;
        case enter:
            if(selectedMenuIdx != lastMenuOpened){
                optionsDivs.forEach(a=> a.classList.add("hide"));
                optionsDivs[selectedMenuIdx].classList.remove("hide");
                switch(selectedMenuIdx){
                    case 0:
                        initHome();
                        break
                    case 1:
                        initSearch();
                        break;
                    case 2:
                        initChange();
                        break;
                    case 3:
                        initSettings();
                        break;
                }
                lastMenuOpened = selectedMenuIdx;
                menu.classList.add("menu-closed");
            }
    }
}

// home
let initHome = () => {
    inigap = document.getElementsByClassName("initial-gap")[0].offsetHeight;
    document.onkeydown = videos_nav;
    info.title = document.getElementsByClassName("info-title")[0];
    info.resume = document.getElementsByClassName("info-data")[0];
    //info.play = document.getElementsByClassName("info-play")[0];
    info.image = document.getElementsByClassName("info-image")[0];
    teaseMenu = document.getElementsByClassName("menu-tease")[0];
    menu = document.getElementsByClassName("menu")[0];
    optionsDivs.push(document.getElementById("home"));
    optionsDivs.push(document.getElementById("search"));
    optionsDivs.push(document.getElementById("change"));
    optionsDivs.push(document.getElementById("settings"));
    getResponse(sid, fillVideos, error);
}

let fillVideos = (videos)=>{
    let videoContent = "<" 
    videoContent += generateCategory("Favoritos", favorites)
    videoContent += generateCategory("Recientes", recent)
    let titles = Object.keys(videos);
    for (var i = 0; i < titles.length; i++) {
        videoContent += generateCategory(titles[i], videos[titles[i]]);
    }
    document.getElementsByClassName("videos")[0].innerHTML= "<div class='initial-gap'></div>" + videoContent + "<div class='initial-gap'></div>";
    updatePositions("videos");
}

let videos_nav = function(event){
    if(event == null){
        last.video.classList.add("focus");
        return;
    }
    let key = event.keyCode;
    let itempos = last.video.id.split("_");
    let cc = parseInt(itempos.at(-1));
    let cr = parseInt(itempos.at(-2));
    let newselection;
    switch(key){
        case up:
            newselection = document.getElementById("videos_" + (cr - 1) + "_0");
            if(newselection){
                newselection = document.getElementById("videos_" + (cr - 1) + "_"  + newselection.parentElement.getAttribute("value"));
                last.video.classList.remove("focus");
                last.video.parentElement.parentElement.classList.add("demitransparent");
                last.video = newselection;
                last.video.classList.add("focus");
                last.video.parentNode.scrollLeft = newselection.offsetLeft - items_gap;
                document.getElementsByClassName("videos")[0].scrollTop = last.video.parentElement.offsetTop - inigap - 32;
                last.video.parentElement.parentElement.classList.remove("transparent");
            }
            event.preventDefault();
            break;

        case down:
            newselection = document.getElementById("videos_" + (cr + 1) + "_0");
            if(newselection){
                newselection = document.getElementById("videos_" + (cr + 1) + "_"  + newselection.parentElement.getAttribute("value"));
                last.video.classList.remove("focus");
                last.video.parentElement.parentElement.classList.add("transparent");
                last.video = newselection;
                last.video.classList.add("focus");
                document.getElementsByClassName("videos")[0].scrollTop = last.video.parentElement.offsetTop - inigap - 32;
                last.video.parentNode.scrollLeft = newselection.offsetLeft - items_gap;
                last.video.parentElement.parentElement.classList.remove("demitransparent");
            }
            event.preventDefault();
            break;

        case right:
            newselection = document.getElementById("videos_" + cr + "_" + (cc + 1));
            if(newselection){
                last.video.parentNode.scrollLeft = newselection.offsetLeft - items_gap;
                last.video.classList.remove("focus");
                last.video = newselection;
                last.video.classList.add("focus");
                newselection.parentElement.setAttribute("value", cc + 1);
            }
            if(cc === 0){
                tease_menu(false);
            }
            break;

        case left:
            newselection = document.getElementById("videos_" + cr + "_" + (cc - 1));
            if(newselection){
                last.video.parentNode.scrollLeft = newselection.offsetLeft - items_gap;
                last.video.classList.remove("focus");
                last.video = newselection;
                last.video.classList.add("focus");
                newselection.parentElement.setAttribute("value",  cc - 1);
            }
            if(cc === 1){
                tease_menu(true);
            }else if(cc === 0){
                lastNoMenu = document.onkeydown;
                document.onkeydown = menu_nav;
                menu.classList.remove("menu-closed");
                teaseMenu.classList.add("menu-tease-only-icons");
                last.video.classList.remove("focus");
            }
            break;
        case enter:
            loadChapters(last.video.dataset.path);
            last.video.classList.remove("focus");
            route(last.video.dataset.path)
            break;
        default:
            return;
    }
    
    if(last.video.id.endsWith("_0")){
        tease_menu(true);
    }else{
        tease_menu(false);
    }
    loadData();
}

let chapter_nav = function(event){
    let key = event.keyCode;
    let itempos = last.chapter.id.split("_");
    let cc = parseInt(itempos.at(-1));
    let cr = parseInt(itempos.at(-2));
    let newselection;

    switch(key){
        case up:
            newselection = document.getElementById("info-capitulos_" + (cr-1) + "_" + cc);
            if(newselection){
                last.chapter.classList.remove("focus");
                last.chapter = newselection;
                last.chapter.classList.add("focus");
                document.getElementsByClassName("info-capitulos")[0].scrollTop =  last.chapter.offsetTop - inigap - 32;
            }
            event.preventDefault();
            break;
        case right:
            newselection = document.getElementById("info-capitulos_" + cr + "_" + (cc + 1));
            if(newselection){
                last.chapter.classList.remove("focus");
                last.chapter = newselection;
                last.chapter.classList.add("focus");
            }
            break;
        case down:
            newselection = document.getElementById("info-capitulos_" + (cr + 1) + "_" + cc);
            if(newselection){
                last.chapter.classList.remove("focus");
                last.chapter = newselection;
                last.chapter.classList.add("focus");
                document.getElementsByClassName("info-capitulos")[0].scrollTop = last.chapter.offsetTop - inigap - 32;
            }
            event.preventDefault();
            break;

        case left:
            newselection = document.getElementById("info-capitulos_" + cr + "_" + (cc - 1));
            if(newselection){
                last.chapter.classList.remove("focus");
                last.chapter = newselection;
                last.chapter.classList.add("focus");
            }
            if(cc === 0){
                //TODO back home
                document.getElementsByClassName('info-capitulos')[0].classList.add("info-capitulos-hide");
                document.getElementsByClassName('videos')[0].classList.remove("videos-hide");
                document.onkeydown = videos_nav;
                document.getElementsByClassName("videos")[0].scrollTop = last.video.parentElement.offsetTop - inigap - 32;
                last.video.parentNode.scrollLeft = last.video.offsetLeft - items_gap;
                last.video.classList.add("focus");
                last.chapter.classList.remove("focus");
                if (last.video.id.endsWith('_0')){
                    tease_menu(true)
                }
            }
            break;
        case enter:
            //TODO (last.chapter.dataset.path);
            break;
        default:
            return
    }
}

let updatePositions = function (containerCN = "content", className = "focusable"){
    container = document.getElementsByClassName(containerCN)[0];
    let items = container.getElementsByClassName(className);//focusable next??
    let ctop = items[0].parentNode.offsetTop;
    let rc = 0, cc = 0;
    for(let i = 0; i < items.length; i++){
        if(items[i].parentNode.offsetTop != ctop){
            ctop = items[i].parentNode.offsetTop;
            rc++;
            cc = 0;
        }
        items[i].id = containerCN + "_" + rc + "_" + cc;
        cc++;
    }
    if(last.video == null){
        last.video = document.getElementById(containerCN + "_" + 0 + "_" + 0);
    }        
    last.video.classList.add("focus");
    last.video.parentNode.parentNode.classList.remove("demitransparent");
    loadData();
}

let updatePositionsLV0 = function (containerCN = "content", className = "focusable"){
    container = document.getElementsByClassName(containerCN)[0];
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
}


let setLoadingInfo = ()=>{
    info.title.classList.add("loading_background");
    info.resume.classList.add("loading_background");
    //info.play.classList.add("loading_background")
    info.image.classList.add("transparent");
}

let unsetLoadingInfo = ()=>{
    info.title.classList.remove("loading_background");
    info.resume.classList.remove("loading_background");
    //info.play.classList.remove("loading_background")
    info.image.classList.remove("transparent");
}

let loadData = () => {
    info.title.innerHTML = last.video.dataset.name;
    info.image.src = last.video.dataset.image;
    info.resume.innerHTML = "";
    if(last.video.dataset.path in tempSerieCache){
        
    }
    setLoadingInfo();
    console.log(last.video.dataset.path);
    unsetLoadingInfo();
}

let setSerieInfo = (info) => {
    info.title.innerHTML = info.name;
    info.image.src = info.image;
}

let loadChapters = (path) =>{

}

export function generateCategories(options) {
    let result = "";
    let titles = Object.keys(options);
    for (var i = 0; i < titles.length; i++) {
        result += generateCategory(titles[i], options[titles[i]]);
    }
    return result;
}

export function generateCategory(title, items) {
    if(items == null) return "";
    let result = '<div class="items demitransparent"><h2 class="items__title">' + title + '</h2><div class="items__list" value="0"><div class="item_gap"></div>';
    for (let i = 0; i < items.length; i++) {
        result += '<div class="item focusable" data-name="' + items[i]["name"] + '" data-image="' + items[i]["image"] + '" data-path="' + items[i]["path"] + '"><img class="item__image" src="' + items[i]['image'] + '" alt=""> <h2 class="item__title">' + items[i]['name'] + '</h2></div>';
    }
    return result + '</div></div>';
}

let tease_menu = (show = true)=>{
    if(show){
        teaseMenu.classList.remove("menu-tease-disapear")
    }else{
        teaseMenu.classList.add("menu-tease-disapear");
    }
}

// search
let keys_nav = (event) => {
    if(event == null){
        last.key.classList.add("focus");
        return;
    }
    let itempos = last.key.id.split("_");
    let cc = parseInt(itempos.at(-1));
    let cr = parseInt(itempos.at(-2));
    let newselection;
    event.preventDefault();
    switch(event.keyCode){
        case up:
            if(cr == 1){
                cc = Math.floor(cc/2);
            }
            newselection = document.getElementById("search-box_" + (cr-1) + "_" + cc);
            if(newselection){
                last.key.classList.remove("focus");
                last.key = newselection;
                last.key.classList.add("focus");
            }
            break;
        case down:
            if(cr == 0){
                cc = cc * 2;
            }
            newselection = document.getElementById("search-box_" + (cr+1) + "_" + cc);
            if(newselection){
                last.key.classList.remove("focus");
                last.key = newselection;
                last.key.classList.add("focus");
            }
            break;

        case left:
                newselection = document.getElementById("search-box_" + cr + "_" + (cc - 1));
                if(newselection){
                    last.key.classList.remove("focus");
                    last.key = newselection;
                    last.key.classList.add("focus");
                }
                if(cc === 1){
                    tease_menu(true);
                }else if(cc === 0){
                    document.onkeydown = menu_nav;
                    menu.classList.remove("menu-closed");
                    teaseMenu.classList.add("menu-tease-only-icons");
                    last.key.classList.remove("focus");
                }
            break;
    
        case right:
            newselection = document.getElementById("search-box_" + cr + "_" + (cc + 1));
            if(newselection){
                last.key.classList.remove("focus");
                last.key = newselection;
                last.key.classList.add("focus");
            }else{
                if(last.media != null){
                    document.onkeydown = search_result_nav;
                    last.key.classList.remove("focus");
                    last.media.classList.add("focus");
                }
            }
            if(cc === 0){
                tease_menu(false);
            }
            break;

        case enter:
            let c = last.key.innerHTML;
            switch(c){
                case '🠔':
                    searchtext.innerHTML = searchtext.innerHTML.slice(0, -1);
                    break;
                case ' ':
                case '':
                    searchtext.innerHTML = searchtext.innerHTML + " ";
                    break;
                case '✓':
                    console.log("search " + searchtext.innerHTML);
                    searchDone(testdata);
                    break;
                default:
                    searchtext.innerHTML = searchtext.innerHTML + last.key.innerHTML;
            }
            break;
        
        case backspace:
            searchtext.innerHTML = searchtext.innerHTML.slice(0, -1);
            break;

        case space:
            searchtext.innerHTML = searchtext.innerHTML + " ";
            break;
        
        default:0
            if((event.keyCode >= 65 && event.keyCode <= 90)||(event.keyCode >= 96 && event.keyCode <= 105)){
                searchtext.innerHTML = searchtext.innerHTML + event.key;
            }
    }

};

let search_result_nav = (event) => {
    let itempos = last.media.id.split("_");
    let cc = parseInt(itempos.at(-1));
    let cr = parseInt(itempos.at(-2));
    let newselection;
    event.preventDefault();
    switch(event.keyCode){
        case up:
            newselection = document.getElementById("search-results-ph_" + (cr-1) + "_" + cc);
            if(newselection){
                last.media.classList.remove("focus");
                last.media = newselection;
                last.media.classList.add("focus");
                last.media.parentElement.scrollTop = last.media.offsetTop - 65;
            }
            break;
        case down:
            newselection = document.getElementById("search-results-ph_" + (cr+1) + "_" + cc);
            if(newselection){
                last.media.classList.remove("focus");
                last.media = newselection;
                last.media.classList.add("focus");
                last.media.parentElement.scrollTop = last.media.offsetTop - 65;
            }
            break;

        case left:
                newselection = document.getElementById("search-results-ph_" + cr + "_" + (cc - 1));
                if(newselection){
                    last.media.classList.remove("focus");
                    last.media = newselection;
                    last.media.classList.add("focus");
                }
                if(cc === 0){
                    document.onkeydown = keys_nav;
                    last.media.classList.remove("focus");
                    last.key.classList.add("focus");
                }
            break;
    
        case right:
            newselection = document.getElementById("search-results-ph_" + cr + "_" + (cc + 1));
            if(newselection){
                last.media.classList.remove("focus");
                last.media = newselection;
                last.media.classList.add("focus");
            }
            break;

        case enter:
            break;
    }
};




let initSearch = () => {
    last.key = updatePositionsSr("search-box", last.key);
    searchtext = document.getElementsByClassName("search-text")[0];
    document.onkeydown = keys_nav;
    lastNoMenu = keys_nav;
};

let code_search_result = (items) => {
    let result = '<div class="search_items"><div class="search_items__list">';
    for (let i = 0; i < items.length; i++) {
        result += '<div class="search_item focusable" onclick="{mediaClick(self, \'' + items[i]["path"] + '\')}"><img class="search_item__image" src="' + items[i]['image'] + '" alt=""> <h2 class="search_item__title">' + items[i]['name'] + '</h2></div>';
    }
    return result + '</div></div>';
}

window.search = (term) => {
    //TODO add action
    searchDone(testdata.concat(testdata));

};

let searchDone = (items) =>{
    document.getElementById("search-results-ph").innerHTML = code_search_result(items);
    last.media = updatePositionsSr("search-results-ph", last.media);
    document.onkeydown = search_result_nav;
    last.key.classList.remove("focus");
};

let updatePositionsSr = function (containerCN = "content", lastsel){
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

//change 
let change_nav = (event) => {
    if(event == null){
        document.getElementById(servers[serverSelectedIdx]).classList.add("change-item-focus");
        return;
    }
    event.preventDefault()
    switch(event.keyCode){
        case right:
            if(serverSelectedIdx < servers.length - 1){
                document.getElementById(servers[serverSelectedIdx]).classList.remove("change-item-focus");
                serverSelectedIdx += 1;
                document.getElementById(servers[serverSelectedIdx]).classList.add("change-item-focus");                
                if(serverSelectedIdx === 1){
                    tease_menu(false);
                }
            }
    
            break;
        case left:
            if(serverSelectedIdx > 0 ){
                document.getElementById(servers[serverSelectedIdx]).classList.remove("change-item-focus");
                serverSelectedIdx -= 1;
                document.getElementById(servers[serverSelectedIdx]).classList.add("change-item-focus");                
                if(serverSelectedIdx === 0){
                    tease_menu(true);
                }
            }else{
                lastNoMenu = change_nav;
                document.onkeydown = menu_nav;
                menu.classList.remove("menu-closed");
                teaseMenu.classList.add("menu-tease-only-icons");
                document.getElementById(servers[serverSelectedIdx]).classList.remove("change-item-focus");
            }
            break;
    }
}

function getServers(){
    return {jkanime:"JKAnime", sololatino:"Solo latino", tioanime:"TioAnime"};
}

function initChange(){
    let scont = document.getElementsByClassName("change-list")[0];
    let servers_ = getServers();
    let inner = "";
    Object.keys(servers_).forEach(key => {
       inner += '<div class="change-item" id="' + key + '">'+ servers_[key] + '</div>';
    });
    scont.innerHTML = inner;
    servers = Object.keys(servers_);
    document.getElementsByClassName("change-item")[0].classList.add("change-item-focus");
    serverSelectedIdx = 0;
    document.onkeydown = change_nav;
    lastNoMenu = change_nav;
}

// Settings
let navSettings = (event) => {
    if(event == null){
        last.setting.classList.add("selected");
        return;
    }
    event.preventDefault();
    let settingsList = null;
    let cindx = 0;
    switch(event.keyCode) {
        case up:
            settingsList = document.getElementsByClassName("setting");
            cindx = Array.prototype.indexOf.call(settingsList, last.setting);
            if (cindx > 0){
                last.setting.classList.remove("selected");
                last.setting = settingsList[cindx - 1];
                last.setting.classList.add("selected");
            }
            break;
        case down:
            settingsList = document.getElementsByClassName("setting");
            cindx = Array.prototype.indexOf.call(settingsList, last.setting);
            if (cindx < settingsList.length - 1){
                last.setting.classList.remove("selected");
                last.setting = settingsList[cindx + 1];
                last.setting.classList.add("selected");
            }

            break;
        case left:
            lastNoMenu = document.onkeydown;
            document.onkeydown = menu_nav;
            menu.classList.remove("menu-closed");
            teaseMenu.classList.add("menu-tease-only-icons");
            last.setting.classList.remove("selected");
            //todo change to menu
            break;
        case enter:
            settings[last.setting.id][0] = !settings[last.setting.id][0];
            if(last.setting.classList.contains("active")){
                last.setting.classList.remove("active");
            }else{
                last.setting.classList.add("active");
            }
            saveSetting(settings);
            break;
    }
}

function initSettings(){
    placeholders.setting = document.getElementById("settings");
    placeholders.setting.innerHTML = getSettings();
    last.setting = document.getElementsByClassName("setting")[0];
    last.setting.classList.add("selected");
    lastNoMenu = navSettings;
    document.onkeydown = navSettings;
}

function saveSetting(newSettings) {
    localStorage.setItem("settings", JSON.stringify(newSettings));
}

function getSettings(){
    let storedSettings = null;
    try {
        storedSettings = JSON.parse(localStorage.getItem("settings"));
    } catch (e) {}
    if(storedSettings == null){
        //first time no changes
        storedSettings = settings;
    }else if(storedSettings.length != settings.length){
        //need to update settings
        let newSettings = {};
        for(key in settings){
            if(key in storedSettings){
                newSettings[key] = storedSettings[key];
            }else{
                newSettings[key] = settings[key];
            }
        }
        saveSetting(newSettings)
        storedSettings = newSettings
    }
    settings = storedSettings;
    let result = '<div class="settings-title">Configurar</div><div class="settings-list">';
    var i = 0;
    let extra = "";
    for(var key in storedSettings){
        if(storedSettings[key][0] == true){
            extra = " active";
        }else{
            extra = "";
        }
        result +=  '<div class="setting' + extra + '" id ="'+ key +'"><div class="setting-text">'+ storedSettings[key][1] +'</div></div>';
        i++;
    }
    return result + '</div></div>';
}

let error = function(error_message){
    alert(error_message);
    loading.style.visibility = 'hidden';
}

function posDescription(resp){
    last.chapter = null;
    let chapters = resp.chapters;
    let ach = "";
    chapters.forEach(c =>
        ach +=  '<div class="info-capitulo" data-path="' + c.path+ '">'+ c.name +'</div>'
    );
    placeholders.chapter.scrollTop = 0;
    placeholders.chapter.innerHTML = ach;
    placeholders.chapter.classList.remove("info-capitulos-hide");
    placeholders.video.classList.add("videos-hide");
    tease_menu(false);
    document.onkeydown = chapter_nav;
    info.resume.innerHTML = resp.items[0]
    //after load sucess
    last.chapter = updatePositionsLV0("info-capitulos", "info-capitulo");
}

window.route = function(path){
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
        server.getDescription(posDescription, error, fpath[2]);
    }else if(action == 'getLinks'){
        server.getLinks(posLinks, error, fpath[2]);
        let ppf = function(item){
            add_recent(item);
            markViewed(null, item['path'], path);
        };
        server.getParent(ppf, fpath[2]);
    }else if(action == 'search'){
        let term = document.getElementsByClassName("search__text")[0].value;
        server.getSearch(posSearch, error, term);
    }else{
        loading.style.visibility = 'hidden';
    }
}