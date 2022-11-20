import {getResponse, getSource, getSourceList} from '../js/sources/sources.js';
import {getDDL, getPreferer, getName} from '../js/vservers/vserver.js';

let settings = {
    "lockfronpage": [false, "Bloquear pagina principal"],
    "fullscreen": [true,"Iniciar video en pantalla completa"],
    "autoplay": [false,"Autoplay de video"]
}

let info = {title: null, resume:null, play:null, image:null};
let up = 38, right = 39, down = 40, left = 37, enter = 13, backspace = 8, space = 32;
let container, searchtext;
let last = {chapter: null, setting: null, media: null, key: null, video:null, player:null};
let placeholders = {chapter: null, setting: null, media: null, key: null, video:null, player:null, favorites:null};
let items_gap = 80, inigap = 0;
let sid, sn;
let favorites = [];
let recent = [];
let resumes = {};
let servers = null;
let serverSelectedIdx = 0;

document.addEventListener("DOMContentLoaded",function(){
window.serverHost = "http://" + window.location.hostname + ":8080/"
    try{
        favorites = JSON.parse(getStorageDefault('favorites', "[]"));
    }catch(e){}
    try{
        recent = JSON.parse(getStorageDefault('recent'), "[]");
    }catch(e){}
    try{
        loadResumes();
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

    mainInit();
    initHome();
});


//menu
let teaseMenu = null, menu = null;
let backMenu = null
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
                        initHome(false);
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

function mainInit(){
    placeholders.chapter = document.getElementById('chapters');
    placeholders.home = document.getElementById("home"); 
    placeholders.video = document.getElementById("videos");
    placeholders.search = document.getElementById("search");
    placeholders.change = document.getElementById("change");
    placeholders.player = document.getElementById("player");
    info.title = document.getElementsByClassName("info-title")[0];
    info.resume = document.getElementsByClassName("info-data")[0];
    info.image = document.getElementsByClassName("info-image")[0];
    teaseMenu = document.getElementsByClassName("menu-tease")[0];
    menu = document.getElementsByClassName("menu")[0];
    optionsDivs.push(document.getElementById("home"));
    optionsDivs.push(document.getElementById("search"));
    optionsDivs.push(document.getElementById("change"));
    optionsDivs.push(document.getElementById("settings"));
    inigap = document.getElementsByClassName("initial-gap")[0].offsetHeight;
}

// home
let initHome = (reload = true) => {
    document.onkeydown = videos_nav;
    if(reload) getResponse(sid, fillVideos, error);
}

let fillVideos = (videos)=>{
    let videoContent = "<";
    let titles = Object.keys(videos);
    for (var i = 0; i < titles.length; i++) {
        videoContent += generateCategory(titles[i], videos[titles[i]]);
    }
    if(favorites.length > 0){
        videoContent += ("<div id='favlist'>" + generateCategory("Favoritos", favorites) + "></div>")
    }else{
        videoContent += "<div id='favlist'></div>";
    }
    if(recent.length > 0) {videoContent += ("<div id='reclist'>" + generateCategory("Recientes", recent) + "></div>")
    }else{
        videoContent += "<div id='reclist'></div>";
    };
    document.getElementsByClassName("videos")[0].innerHTML= "<div class='initial-gap'></div>" + videoContent + "<div class='initial-gap'></div>";
    updatePositions("videos");
}

let setNewVideoSelected = (newselection) => {
    last.video.classList.remove("focus");
    last.video = newselection;
    last.video.classList.add("focus");
    loadData();
}

let videos_nav = function(event){
    if(event == null){
        last.video.classList.add("focus");
        last.video.parentElement.parentElement.classList.remove("demitransparent");
        showBack(false);
        menu.classList.add("menu-closed");
        teaseMenu.classList.remove("menu-tease-only-icons");
        tease_menu(last.video.id.endsWith("_0"));
        last.video.parentNode.scrollLeft = last.video.offsetLeft - items_gap - 10;
        document.getElementsByClassName("videos")[0].scrollTop = last.video.parentElement.offsetTop - inigap - 32;
        return;
    }
    let key = event.keyCode;
    if(last.video == null && key == left){
        tease_menu(true);
        lastNoMenu = document.onkeydown;
        document.onkeydown = menu_nav;
        menu.classList.remove("menu-closed");
        teaseMenu.classList.add("menu-tease-only-icons");
        last.video.classList.remove("focus");
        return;
    }
    let itempos = last.video.id.split("_").reverse();
    let cc = parseInt(itempos[0]);
    let cr = parseInt(itempos[1]);
    let newselection;
    event.preventDefault();
    switch(key){
        case up:
            newselection = document.getElementById("videos_" + (cr - 1) + "_0");
            if(newselection){
                newselection = document.getElementById("videos_" + (cr - 1) + "_"  + newselection.parentElement.getAttribute("value"));
                last.video.parentElement.parentElement.classList.add("demitransparent");
                setNewVideoSelected(newselection);
                last.video.parentNode.scrollLeft = newselection.offsetLeft - items_gap - 10;
                document.getElementsByClassName("videos")[0].scrollTop = last.video.parentElement.offsetTop - inigap - 32;
                last.video.parentElement.parentElement.classList.remove("transparent");
                last.video.parentElement.parentElement.classList.remove("demitransparent");
            }
            break;

        case down:
            newselection = document.getElementById("videos_" + (cr + 1) + "_0");
            if(newselection){
                newselection = document.getElementById("videos_" + (cr + 1) + "_"  + newselection.parentElement.getAttribute("value"));
                last.video.parentElement.parentElement.classList.add("transparent");
                setNewVideoSelected(newselection);
                document.getElementsByClassName("videos")[0].scrollTop = last.video.parentElement.offsetTop - inigap - 32;
                last.video.parentNode.scrollLeft = newselection.offsetLeft - items_gap - 10;
                last.video.parentElement.parentElement.classList.remove("demitransparent");
            }
            break;

        case right:
            newselection = document.getElementById("videos_" + cr + "_" + (cc + 1));
            if(newselection){
                last.video.parentNode.scrollLeft = newselection.offsetLeft - items_gap - 10;
                setNewVideoSelected(newselection);
                newselection.parentElement.setAttribute("value", cc + 1);
            }
            if(cc === 0){
                tease_menu(false);
            }
            break;

        case left:
            newselection = document.getElementById("videos_" + cr + "_" + (cc - 1));
            if(newselection){
                last.video.parentNode.scrollLeft = newselection.offsetLeft - items_gap - 10;
                setNewVideoSelected(newselection);
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
            let node = document.getElementsByClassName('info-capitulos')[0];
            if(node != null){
                document.getElementById("home").removeChild(node);
            }
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
}

let chapter_nav = function(event){
    let itempos = last.chapter.id.split("_").reverse();
    let cc = parseInt(itempos[0]);
    let cr = parseInt(itempos[1]);
    let newselection;
    if(event == null){
        last.chapter.classList.add("focus");
        menu.classList.add("menu-closed");
        teaseMenu.classList.remove("menu-tease-only-icons");
        return;
    }else if(teaseMenu.classList.contains("menu-tease-only-icons")){
        if(event.keyCode == right){
            menu.classList.add("menu-closed");
            teaseMenu.classList.remove("menu-tease-only-icons");
            last.chapter.classList.add("focus");
        }else if(event.keyCode == enter){
            if(last.chapter.parentNode.classList.contains("over-search")){ //pos search
                let remi = document.getElementsByClassName("over-search")[0]; //
                document.body.removeChild(remi);
                document.onkeydown = search_result_nav;
                menu.classList.add("menu-closed");
                teaseMenu.classList.remove("menu-tease-only-icons");
                tease_menu(false);
                backMenuSwitch();
                return;
            }
            document.getElementsByClassName('info-capitulos')[0].classList.add("info-capitulos-hide");
            document.getElementsByClassName('videos')[0].classList.remove("videos-hide");
            document.onkeydown = videos_nav;
            document.getElementsByClassName("videos")[0].scrollTop = last.video.parentElement.offsetTop - inigap - 32;
            last.video.parentNode.scrollLeft = last.video.offsetLeft - items_gap;
            last.video.classList.add("focus");
            last.chapter.classList.remove("focus");
            menu.classList.add("menu-closed");
            teaseMenu.classList.remove("menu-tease-only-icons");
            tease_menu(last.video.id.endsWith('_0'));
            backMenuSwitch();
            last.chapter = null;
            placeholders.favorites.classList.add("hide");
            setTimeout(() => {
                let node = document.getElementsByClassName('info-capitulos')[0];
                if(node != null){
                    document.getElementById("home").removeChild(node);
                }
            },800);
        }
        return;
    }
    if(last.chapter == placeholders.favorites){
        switch(event.keyCode){
            case left:
                menu.classList.remove("menu-closed");
                teaseMenu.classList.add("menu-tease-only-icons");
                last.chapter.classList.remove("focus");
                return;
            case down:
                let fc = document.getElementById("info-capitulos_0_0");
                if(fc){
                    last.chapter.classList.remove("focus");
                    last.chapter = fc;
                    last.chapter.classList.add("focus");
                }
                return;
            case enter:
                switch_fab();
                return;
        }
    }
    let key = event.keyCode;
    switch(key){
        case up:
            newselection = document.getElementById("info-capitulos_" + (cr-1) + "_" + cc);
            if(newselection){
                last.chapter.classList.remove("focus");
                last.chapter = newselection;
                last.chapter.classList.add("focus");
                document.getElementsByClassName("info-capitulos")[0].scrollTop =  last.chapter.offsetTop ;
            }else{
                last.chapter.classList.remove("focus");
                last.chapter = placeholders.favorites;
                last.chapter.classList.add("focus");
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
                document.getElementsByClassName("info-capitulos")[0].scrollTop = last.chapter.offsetTop;
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
                menu.classList.remove("menu-closed");
                teaseMenu.classList.add("menu-tease-only-icons");
                last.chapter.classList.remove("focus");
            }
            break;
        case enter:
            last.chapter.classList.add("info-capitulo-viewed");
            route(last.chapter.dataset.path);
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
    setNewVideoSelected(last.video);
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
    setLoadingInfo();
    if(last.video.dataset.path.indexOf("getLinks") == -1) {
        setResume(last.video.dataset.path);
    }else if("ppath" in last.video.dataset){
        setResume(last.video.dataset.ppath);
    }
    unsetLoadingInfo();
}

let setSerieInfo = (info) => {
    info.title.innerHTML = info.name;
    info.image.src = info.image;
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
    let ppath = "";
    for (let i = 0; i < items.length; i++) {
        if(items[i]["parentPath"]){
            ppath = '" data-ppath="' + items[i]["parentPath"];
        }else{
            ppath = '';
        }
        result += '<div class="item focusable" data-name="' + items[i]["name"] + '" data-image="' + items[i]["image"] + '" data-path="' + items[i]["path"] + ppath +'"><img class="item__image" src="' + items[i]['image'] + '" alt=""> <h2 class="item__title">' + items[i]['name'] + '</h2></div>';
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
}

// search
let keys_nav = (event) => {
    if(event == null){
        last.key.classList.add("focus");
        return;
    }
    let itempos = last.key.id.split("_").reverse();
    let cc = parseInt(itempos[0]);
    let cr = parseInt(itempos[1]);
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
                    let server = getSource(sid);
                    server.getSearch(searchDone, error, searchtext.innerHTML)
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
    let itempos = last.media.id.split("_").reverse();
    let cc = parseInt(itempos[0]);
    let cr = parseInt(itempos[1]);
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
            route(last.media.dataset.path)
            break;
    }
};

let initSearch = () => {
    loadSearch();
    last.key = updatePositionsSr("search-box", last.key);
    searchtext = document.getElementsByClassName("search-text")[0];
    document.onkeydown = keys_nav;
    lastNoMenu = keys_nav;
};

let loadSearch = (clear = false) => {
    if(clear) {
        setTimeout(() => {
            document.getElementById("search").innerHTML = "";
        }, 800);
    }else{
        document.getElementById("search").innerHTML = `<div class="search-box">
        <div class="search-keypad">
            <div class="search-key focusable search-double-key"> </div>
            <div class="search-key focusable search-double-key">🠔</div>
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
}

let code_search_result = (items) => {
    let result = '<div class="search_items"><div class="search_items__list">';
    for (let i = 0; i < items.length; i++) {
        result += '<div class="search_item focusable" data-path="' + items[i]["path"].replace("getDescription", "getDescriptionSearch") + '"><img class="search_item__image" src="' + items[i]['image'] + '" alt=""> <h2 class="search_item__title">' + items[i]['name'] + '</h2></div>';
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
//end search

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
                document.getElementById(servers[serverSelectedIdx]).parentNode.scrollLeft = document.getElementById(servers[serverSelectedIdx]).offsetLeft - 80;;
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
                document.getElementById(servers[serverSelectedIdx]).parentNode.scrollLeft = document.getElementById(servers[serverSelectedIdx]).offsetLeft - 80;;

            }else{
                lastNoMenu = change_nav;
                document.onkeydown = menu_nav;
                menu.classList.remove("menu-closed");
                teaseMenu.classList.add("menu-tease-only-icons");
                document.getElementById(servers[serverSelectedIdx]).classList.remove("change-item-focus");
            }
            break;
        case enter:
            let sid = document.getElementById(servers[serverSelectedIdx]).id;
            let sn = document.getElementById(servers[serverSelectedIdx]).textContent;
            localStorage.setItem('lastServer', sid);
            localStorage.setItem('lastServerName', sn);
            location.reload();
    }
}

function initChange(){
    let scont = document.getElementsByClassName("change-list")[0];
    servers = getSourceList();
    let inner = "";
    servers.forEach(key => {
       inner += '<div class="change-item" id="' + key + '">'+ key + '</div>';
    });
    scont.innerHTML = inner;
    let cs = document.getElementsByClassName("change-item")[servers.indexOf(sid)];
    cs.classList.add("change-item-focus");
    cs.classList.add("change-item-selected");
    cs.parentNode.scrollLeft = cs.offsetLeft;
    serverSelectedIdx = servers.indexOf(sid);
    document.onkeydown = change_nav;
    lastNoMenu = change_nav;
    needCenter()
}
let needCenter = () => {
    let cl = document.getElementsByClassName("change-list")[0];
    if(cl.clientWidth < cl.scrollWidth ) {
        cl.classList.remove("center");
    }else{
        cl.classList.add("center");
    }
}

//end change

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
//loading.style.visibility = 'hidden';
}

function posDescription(resp){
    last.chapter = null;
    let chapters = resp.chapters;
    let ach = "";
    let ic = document.createElement("div");
    ic.classList.add("info-capitulos");
    ic.classList.add("info-capitulos-hide");
    ic.id = "chapters";
    document.getElementById("home").appendChild(ic);
    placeholders.chapter = ic;
    let vieweds = [];
    try {
        vieweds = JSON.parse(localStorage.getItem(resp.path));
        if(vieweds == null){
            vieweds = [];
        }
    }catch (e) {
        vieweds = [];
    }
    let extra = "";
    chapters.forEach((c) => {
        (vieweds.indexOf(c['path']) != -1) ? extra = " info-capitulo-viewed": extra = "";
        ach +=  '<div class="info-capitulo' + extra + '" data-path="' + c.path+ '">'+ c.name +'</div>';
    });
    placeholders.chapter.scrollTop = 0;
    placeholders.chapter.innerHTML = ach;
    placeholders.chapter.classList.remove("info-capitulos-hide");
    placeholders.video.classList.add("videos-hide");
    tease_menu(true);
    backMenuSwitch();
    document.onkeydown = chapter_nav;
    info.resume.innerHTML = resp.items[0]
    //after load sucess
    placeholders.favorites = document.getElementsByClassName("info-favorites")[0];
    let idx = indexOfProperty(favorites, 'path', resp.path);
    if(idx > -1){
        placeholders.favorites.classList.add("info-favorites-added");
        placeholders.favorites.innerHTML = "Quitar de favoritos"
    }else{
        placeholders.favorites.classList.remove("info-favorites-added");
        placeholders.favorites.innerHTML = "Agregar a favoritos";

    }
    teaseMenu.classList.remove("menu-tease-only-icons")
    placeholders.favorites.classList.remove("hide");
    placeholders.favorites.dataset["name"] = resp.name;
    placeholders.favorites.dataset["image"] = resp.image;
    placeholders.favorites.dataset["path"] = resp.path;
    if (chapters.length > 0){
        last.chapter = updatePositionsLV0("info-capitulos", "info-capitulo");
    }else{
        last.chapter = placeholders.favorites;
        last.chapter.classList.add("focus")
    }
}
function posDescriptionSearch(resp){
    try{
        placeholders.chapter.innerHTML = "";
    }catch(e){//ignore
    }
    last.chapter = null;
    let chapters = resp.chapters;
    let ach = `
    <div class="info over-search black_background">
            <div class="info-collum over-search">
                <div class="info-title">`+ resp.name + `</div>
                <div class="info-data">` + resp.items[0] + `</div>
                <div class="info-favorites" id="favorites">Agregar a favoritos</div>
            </div>
            <div class="info-image-ph">
                <img class="info-image" src="`+ resp.image +`">
                <div class="info-image-overlap"></div>
            </div>
        </div>
        <div class="info-capitulos over-search">
    `;
    chapters.forEach(c =>
        ach +=  '<div class="info-capitulo" data-path="' + c.path+ '">'+ c.name +'</div>'
    );
    ach += '</div>';
    tease_menu(true);
    backMenuSwitch();
    document.onkeydown = chapter_nav;
    let sr = document.createElement("div");
    sr.classList.add("over-search");
    sr.innerHTML = ach;
    document.body.appendChild(sr);
    placeholders.favorites = document.getElementsByClassName("info-favorites")[1];
    placeholders.favorites.classList.remove("hide");
    teaseMenu.classList.remove("menu-tease-only-icons")
    let idx = indexOfProperty(favorites, 'path', resp.path);
    if(idx > -1){
        placeholders.favorites.classList.add("info-favorites-added");
        placeholders.favorites.innerHTML = "Quitar de favoritos"
    }
    placeholders.favorites.dataset["name"] = resp.name;
    placeholders.favorites.dataset["image"] = resp.image;
    placeholders.favorites.dataset["path"] = resp.path;
    if (chapters.length > 0){
        last.chapter = updatePositionsLV0("info-capitulos", "info-capitulo");
    }else{
        last.chapter = placeholders.favorites;
        last.chapter.classList.add("focus")
    }
}

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
    }else if(action == 'getDescriptionSearch'){
            server.getDescription(posDescriptionSearch, error, fpath[2]);
    }else if(action == 'getLinks'){
        server.getLinks(posLinks, error, fpath[2]);
        let ppf = function(item){
            add_recent(item);
            markViewed(null, item['path'], path);
        };
        setTimeout(() => {server.getParent(ppf, fpath[2]);}, 5000);
    }else if(action == 'search'){
        let term = document.getElementsByClassName("search__text")[0].value;
        server.getSearch(posSearch, error, term);
    }else{
        //loading.style.visibility = 'hidden';
    }
}

let generateSelectorDialog = (postAction, title = "Elige una opcion", options = {}) => {
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
        event.preventDefault();
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
            if (!lOSelected.classList.contains("option-selector-cancel")){
                postAction(lOSelected.dataset["info"], lOSelected.innerHTML);
            }
        }
    }
}

/* player section */
let contPool = [];
const increments = [5, 10, 15, 30, 30, 60, 300, 600]
let doublepress = false;
const timeoutdoublepress = 500;
let lastPressedKeyCode = -1;
let lastPressedTime = -1;
let doubleAccumulator = 0;
let player = null;
const maxDoubleAccumulator = 7;

window.posLinks = function(linkList){
    let best = getPreferer(linkList);
    let mask = (value) => {
        openPlayer(value, best);
    }
    window.lastLink = best;
    if (best.length > 0){
        getDDL(mask, linkError, best[0]);
    } else {
        error("No supported servers");

    }
}

let linkError = function(error_message){
    if (window.lastLink.length > 1){
        window.lastLink.shift();
        posLinks(window.lastLink);
    }else{
        error(error_message);
    }
}

function initPlayerNav() {
  last.player = document.getElementsByTagName("video")[0];
    document.prePlayerKeyManager = document.onkeydown;
    document.onkeydown = playerNav;
    showBack(true);
};

window.openPlayer = function(options, items = [], res = true){
    if(Object.keys(options).length > 1 && res) {
        if(localStorage.getItem("resSelect") == "true"){
            generateSelectorDialog((selection, label)=>{
                options.video = selection;
                openPlayer(options, items, false);
            },"Elige una resolución apropiada", options);
            return;
        }
    }

    if(getStorageDefault("external_player", false)){
        fetch(window.serverHost + "view/" + window.enc(options["video"]))
        .then((response) => response.text())
        .then((result) => {
            if(result.trim() != "ok"){
                error("Error al abrir reproductor externo: \n" + result);
            }
      })
      loading.style.visibility = 'hidden';
      return;
    }
    placeholders.player = document.createElement("div");
    placeholders.player.innerHTML = getPlayer(options, items);
    document.body.appendChild(placeholders.player);
    initPlayerNav();
    requestFullScreen(last.player);
}

let getPlayer = (options, items) => {
    let innerHtml = `<div class="player" id="player"><div class="player-container"><div class="player-options">`;
    let cc = 0;
    let sItems = {};
    if(Object.keys(options).length > 1){
        let csl = "video";
        let keys = Object.keys(options);
        for (let i = 0; i < keys.length; i++){
             if(options["video"] == options[keys[i]]){
                csl = keys[i];
                break;
            };
        }

        innerHtml += `<div class="player-option-title">Resolución</div>
        <div id="player-container_0_0" class="player-option-list"  data-options='` + JSON.stringify(options) + `'>` + csl + `</div>`;
        cc = 1;
    }
    for(let i = 0; i < items.length; i++){
        sItems[getName(items[i])] = items[i];
    }
    innerHtml += `<div  class="player-option-title">Video Server</div>
    <div id="player-container_0_` + cc +`" class="player-option-list" data-options='`+ JSON.stringify(sItems) + `'>` + getName(items[0]) + `</div>
    </div><div class="player-video-container">
            <video id="player-container_1_0" src="` + options["video"] + `" autoplay="true" controls></video>
        </div>
    </div></div></div>`;
    return innerHtml;
}

let playerNav = (event) => {
    event.preventDefault();
    event.stopPropagation();
    doublepress = (lastPressedKeyCode == event.keyCode && 
                  (new Date().getTime() - lastPressedTime - timeoutdoublepress) < 0);
    lastPressedKeyCode = event.keyCode;
    lastPressedTime = new Date().getTime();
    if (doublepress) {
        doubleAccumulator += 1;
        doubleAccumulator = Math.min(maxDoubleAccumulator, doubleAccumulator);
    }else{
        doubleAccumulator = 0;
    }

    if(last.player.tagName == 'VIDEO'){
        let player = last.player;
        switch (event.keyCode) { //control player
            case up:
                if(isFullscreen()){
                    exitFullScreen();
                }else{
                    let itempos = last.player.id.split("_");
                    let cc = parseInt(itempos[itempos.length-1]);
                    let cr = parseInt(itempos[itempos.length-2]);
                    let newpos = null;
                    if(itemExists((cr-1),cc)){
                        last.player = getItem(cr-1, cc);
                        last.player.classList.add("selected");
                    }
                    tease_menu(true);
                }
                break;
            case down:
                if(isFullscreen()){
                    switchPlayer(player);
                }else{
                    switchPlayer(player)
                    requestFullScreen(player);
                    switchPlayer(player)
                }
                event.preventDefault();
                break;
            case left:
                player.currentTime -= increments[doubleAccumulator];
                break;
            case right:
                player.currentTime += increments[doubleAccumulator];
                break;
            case enter:
                if(doublepress){
                    switchPlayer(player);
                    requestFullScreen(player);
                    switchPlayer(player);
                    return;
                }
                switchPlayer(player)
                event.preventDefault();
                break;
            default:
                break;
        }
    }else if(teaseMenu.classList.contains("menu-tease-only-icons")){
        if(event.keyCode == right){
            menu.classList.add("menu-closed");
            teaseMenu.classList.remove("menu-tease-only-icons");
            last.player.classList.add("selected");
        }else if(event.keyCode == enter){
            document.onkeydown = document.prePlayerKeyManager;
            document.body.removeChild(placeholders.player);
            document.onkeydown(null);
        }
    }else{
        let itempos = last.player.id.split("_");
        let cc = parseInt(itempos[itempos.length-1]);
        let cr = parseInt(itempos[itempos.length-2]);
        switch (event.keyCode) { //control nav options
            case up:
                if(cr == 0){
                    //manageMenu(null);
                    return;
                }
                let desph = cc;
                while(desph >= 0){
                    if(itemExists((cr - 1), desph)){
                        last.player.classList.remove("selected");
                        last.player = getItem(cr-1, desph);
                        last.player.classList.add("selected");
                        break;
                    }
                    desph--;
                }
                break;
            case down:
                let desphd = cc;
                while(desphd >= 0){
                    if(itemExists((cr + 1), desphd)){
                        last.player.classList.remove("selected");
                        last.player = getItem(cr + 1, desphd);
                        last.player.classList.add("selected");
                        break;
                    }
                    desphd--;
                }
                break;
            case left:
                if(cc == 1){
                    tease_menu(true);
                }
                if(cc == 0){
                    menu.classList.remove("menu-closed");
                    teaseMenu.classList.add("menu-tease-only-icons");
                    last.player.classList.remove("selected");
               }else{
                    last.player.classList.remove("selected");
                    last.player = getItem(cr, cc - 1);
                    last.player.classList.add("selected");
                }
                break;
            case right:
                if(itemExists(cr, cc + 1)){
                    last.player.classList.remove("selected");
                    last.player = getItem(cr, cc + 1);
                    last.player.classList.add("selected");
                }
                if(cc == 0){
                    tease_menu(false);
                }
                break;
            case enter:
                let options = JSON.parse(last.player.dataset["options"]);
                if(options.hasOwnProperty("video")){
                    delete options.video;
                    generateSelectorDialog((value, tagName)=>{
                        last.player.innerHTML = tagName;
                        document.getElementsByTagName("video")[0].src = value;
                    }, "Elige una resolución", options);
                    return;
                }
                generateSelectorDialog(alert, "Aquí están tus opciones", options);
            default:
                break;
        }
    }
};

/* functions */
let getItem = function(row, column, prefix = "player-container"){
    let item = document.getElementById(prefix + "_" + row + "_" + column);
    return item;
}

let itemExists = function(row, column, prefix = "player-container"){
    let item = document.getElementById(prefix + "_" + row + "_" + column);
    if(item != null){
        return true;
    }
    return false;
}
let switchPlayer = (vplayer) => {
    if(vplayer.paused){
        vplayer.play();
    }else{
        vplayer.pause();
    }
}

window.switch_fab = function() {
    let path = placeholders.favorites.dataset["path"];
    let name = placeholders.favorites.dataset["name"];
    let image = placeholders.favorites.dataset["image"];
    let idx = indexOfProperty(favorites, 'path', path);
    if(idx > -1){
        favorites.splice(idx, 1);
        placeholders.favorites.classList.remove('info-favorites-added');
        placeholders.favorites.innerHTML = "Agregar a favoritos";
    }else{
        favorites.unshift({'name': name, 'image': image, 'path': path});
        placeholders.favorites.classList.add('info-favorites-added');
        placeholders.favorites.innerHTML = "Quitar de favoritos";
    }
    updateFavorites();
}


let add_recent = function(item) {
    let idx = indexOfProperty(recent, 'path', item.path);
    let update = true;
    if(idx > -1){
        recent.splice(idx, 1);
        update = false;
    }
    recent.unshift(item);
    if(update){
        updateRecents();
    }
}

let updateAndTryToKeepPos = () =>{
    let itempos = last.video.id.split('_').reverse();
    let cc = parseInt(itempos[0]);//column
    let cr = parseInt(itempos[1]);//line
    updatePositions("videos");
    let selection = document.getElementById("video_" + cr + "_" + cc);
    if(selection == null){
        if(cc == 0){
            selection = document.getElementById("video_" + cr - 1 + "_" + cc);
        }else{
            selection = document.getElementById("video_" + cr - 1 + "_" + cc);
        }
    }
    if(selection){
        last.video.classList.remove("focus");
        last.video = selection;
        last.video.classList.add("focus");
    }
    last.video.parentNode.scrollLeft = last.video.offsetLeft - items_gap - 10;
    document.getElementsByClassName("videos")[0].scrollTop = last.video.parentElement.offsetTop - inigap - 32;
}

let updateFavorites = function(){
    if (favorites != null){
        localStorage.setItem('favorites', JSON.stringify(favorites));
        if(favorites.length > 0){
            let favlist = document.getElementById("favlist");
            favlist.innerHTML = generateCategory("Favoritos", favorites);
        }
    }else{
        favorites = [];
    }
    updateAndTryToKeepPos();
}

let updateRecents = function(){
    if (recent != null){
        if(recent.length > 30){
            recent =  recent.slice(0, 30);
        }
        localStorage.setItem('recent', JSON.stringify(recent));
        if(recent.length > 0){
            let reclis = document.getElementById("reclist");
            reclis.innerHTML = generateCategory("Recientes", recent);
        }
    }else{
        recent = [];
    }
    updateAndTryToKeepPos();
}

let setResume = (seriePath, pg = false) => {
    if(resumes[seriePath]){
        if(seriePath == last.video.dataset.path || seriePath == last.video.dataset.ppath){
            info.resume.innerHTML = resumes[seriePath];
        }
    }else{
        if(pg){
            return;
        }
        if(seriePath == last.video.dataset.path){
            info.resume.innerHTML =  "Obteniendo sinopsis.";
        }
        let pgerr = (info) => {
            resumes[seriePath] = "Sin sinopsis por el momento".
            saveResumes();
            setResume(seriePath, true);
        };
        let pgr = (info) => {
            resumes[seriePath] = info.items[0];
            saveResumes();
            setResume(seriePath, true);
        };
        let fpath = seriePath.split('/');
        let server = getSource(fpath[0]);
        server.getDescription(pgr, console.log, fpath[2]);
    }
}

let saveResumes = () => {
    localStorage.setItem('resumes', JSON.stringify(resumes));
}

let loadResumes = () => {
    resumes = JSON.parse(getStorageDefault('resumes', "{}"));
    Object.keys(resumes).forEach(key => {
        if(resumes[key] == "Sin sinopsis por el momento"){
            delete resume[key];
        }
    });
}

let isFullscreen = () => !! document.fullscreenElement;

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
  }

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
  }


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
}

window.indexOfProperty = function(array, property, value){
    return array.map(function(x){return x[property]}).indexOf(value);
}

window.getFirstMatch = function(regex, str){
    var m = regex.exec(str);
    if(m == null){
        return "";
    }
    return m[1];
}

window.getAllMatches = function(regex, str){
    return [...str.matchAll(regex)];
}