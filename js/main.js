import {getResponse, getSource} from './sources/sources.js';
import {generateCategory, generateCategories, generateDescription, getPlayer, getSearch} from './coder.js';
import {getDDL, getPreferer} from './vservers/vserver.js';
import{arrowNav, updatePositions} from './keynav.js';

let loading;
let dp, vp, pp, sp, content;
let ss; // server selection
let favorites = [];
let recent = [];
window.backStack = [];
let cfocus = null;
window.serverHost = "http://127.0.0.1:8080/";

document.addEventListener("DOMContentLoaded", function(){
    window.serverHost = "http://" + window.location.hostname + ":8080/"
    vp = document.getElementsByClassName("video_placeholder")[0];
    dp = document.getElementsByClassName("details_placeholder")[0];
    pp = document.getElementsByClassName("pages_placeholder")[0];
    sp = document.getElementsByClassName("search_placeholder")[0];
    ss = document.getElementById("server_select");
    content = document.getElementsByClassName("content")[0];

    loading = document.getElementsByClassName("lds-group")[0];
    try{
        favorites = JSON.parse(localStorage.getItem('favorites'));
        updateFavorites();
    }catch(e){}
    try{
        recent = JSON.parse(localStorage.getItem('recent'));
        updateRecents();
    }catch(e){}
    let lastServer = localStorage.getItem('lastServer');
    if(lastServer != null){
        ss.value = lastServer;
    }
    server_selected();
    document.onkeydown = arrowNav;
});

window.mediaClick = function(e, path){
    loading.style.visibility = 'visible';
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

window.shutdown = function(){
    if (confirm("¿Desea apagar el servidor?")) {
        fetch(serverHost + "shutdown")
        .then(response => response.text())
        .then(text => {
            document.body.innerHTML = "Ya puede cerrar esta ventana";
        });
    }
}

window.backClick = function(e){
    if(window.backStack.length > 0){
        let last = window.backStack.pop();
        last.style.display = 'none';
        last.innerHTML = '';
        if(window.backStack.length == 0){
            document.getElementById("back_button").style.display = 'none';
        }
        arrowNav(null);
    }
}

let addBackStack = function(e){
    if(window.backStack.length == 0){
        document.getElementById("back_button").style.display = 'block';
    }
    window.backStack.push(e);
}

window.enc = function(e){
    return  btoa(e).replaceAll('/', '_');
}

window.dec = function(e){
    return atob(decodeURIComponent(e));
}

window.indexOfProperty = function(array, property, value){
    return array.map(function(x){return x[property]}).indexOf(value);
}

window.add_fab = function(name, image, path) {
    let idx = indexOfProperty(recent, 'path', path);
    if(idx > -1){
        recent.splice(idx, 1);
    }
    favorites.unshift({'name': name, 'image': image, 'path': path});
    updateFavorites();
}

let add_recent = function(item) {
    let idx = indexOfProperty(recent, 'path', item.path);
    if(idx > -1){
        recent.splice(idx, 1);
    }
    recent.unshift(item);
    updateRecents();
}

let updateFavorites = function(){
    if (favorites != null){
        localStorage.setItem('favorites', JSON.stringify(favorites));
        if(favorites.length > 0){
            document.getElementsByClassName("fav_placeholder")[0].innerHTML = generateCategory("Favoritos", favorites);
        }
    }else{
        favorites = [];
    }
}

let updateRecents = function(){
    if (recent != null){
        if(recent.length > 20){
            recent.slice(0, 20);
        }
        localStorage.setItem('recent', JSON.stringify(recent));
        if(recent.length > 0){
            document.getElementsByClassName("recent_placeholder")[0].innerHTML = generateCategory("Recientes", recent);
        }
    }else{
        recent = [];
    }
}

let posServerClick = function(response){
    let ss = document.getElementsByClassName("servers_container__section");
    ss[0].innerHTML = generateCategories(response);
    loading.style.visibility = 'hidden';
}

let error = function(error_message){
    alert(error_message);
    loading.style.visibility = 'hidden';
}

window.server_selected = function (){
    let sname = ss.value;
    loading.style.visibility = 'visible';
    localStorage.setItem('lastServer', sname)
    getResponse(sname, posServerClick, error);
}

let posDescription = function(response){
    dp.innerHTML = generateDescription(response);
    dp.style.display =  'block';
    loading.style.visibility = 'hidden';
    addBackStack(dp);
}

let linkError = function(error_message){
    if (window.lastLink.length > 1){
        window.lastLink.shift();
        postLink(window.lastLink);
    }else{
        error(error_message);
    }
}

let posLinks = function(linkList){
    let best = getPreferer(linkList);
    window.lastLink = best;
    if (best.length > 0){
        getDDL(openPlayer, linkError, best[0]);
    } else {
        error("No supported servers");
    }
}

let openPlayer = function(options){
    vp.innerHTML = getPlayer(options);
    vp.style.display =  'block';
    loading.style.visibility = 'hidden';
    var elem = document.getElementsByClassName("videoview")[0];
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
     } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    }
    elem.focus();
    addBackStack(vp);
}


let posSearch = function(response){
    let search = document.getElementById("search");
    search.style.marginTop = 50 + 'px';
    let rc = document.getElementById("results_container");
    rc.innerHTML = generateCategory("Resultados", response);
    loading.style.visibility = 'hidden';
    updatePositions();
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

window.search = function(){
    let sname = document.getElementById("server_select").value;
    sp.innerHTML = getSearch(sname)
    sp.style.display =  'block';
    addBackStack(sp);
    var si = document.getElementsByClassName("search__text")[0];
    si.focus();
    si.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            mediaClick(self, ss.value + '/search')
        }
    });
}