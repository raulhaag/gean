import {openInNewTab, getResponse, getServer} from './servers.js';
import {generateCategory, generateCategories, generateDescription, getPlayer} from './coder.js';
import {getDDL, getPreferer} from './vservers/vserver.js';

let loading;
let ph;
let favorites = [];
let recent = [];

document.addEventListener("DOMContentLoaded", function(){
    ph = document.getElementsByClassName("windows_placeholder")[0];
    loading = document.getElementsByClassName("lds-group")[0];
    try{
        favorites = JSON.parse(localStorage.getItem('favorites'));
        updateFavorites();
    }catch(e){}
    try{
        recent = JSON.parse(localStorage.getItem('recent'));
        updateRecents();
    }catch(e){}

    try{
        serverClick(null, localStorage.getItem('lastServer'));
    }catch(e){
        serverClick(null, "jkanime");
    }
   hidePlaceholder();
});

window.add_fab = function(name, image, path) {
    favorites.unshift({'name': name, 'image': image, 'path': path});
    updateFavorites();
}

let add_recent = function(item) {
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

window.serverClick = function (e, sname){
    loading.style.visibility = 'visible';
    localStorage.setItem('lastServer', sname)
    if(e != null){
        let vinetas = document.getElementsByClassName("servers_container__item");
        for (var i = 0; i < vinetas.length; i++) {
            vinetas[i].className = 'servers_container__item'
        }
        e.className = 'servers_container__item server_selected';
    }
    getResponse(sname, posServerClick, error);
}

let posDescription = function(response){
    ph.innerHTML = generateDescription(response);
    ph.style.display =  'block';
    loading.style.visibility = 'hidden';
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
        alert("No supported servers");
    }
}

let openPlayer = function(options){
    ph.innerHTML = getPlayer(options);
    ph.style.display =  'block';
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
}

window.mediaClick = function(e, path){
    let fpath = path.split('/');
    let server = getServer(fpath[0]);
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
        server.getInfo(posDescription, error, fpath[2]);
    }else if(action == 'getLinks'){
        server.getLinks(posLinks, error, fpath[2]);
        server.getParent(add_recent, fpath[2]);
    }

    /*
    fetch('http://127.0.0.1:8080/action/' + path)
    .then((response) => response.text())
    .then((result) => {
        loading.style.visibility = 'hidden';
        openInNewTab(result);
    })
    .catch((error) => {
        loading.style.visibility = 'hidden';
        console.log(error)
    })*/
}



window.hidePlaceholder = function(){
    ph.style.display = 'none';
    ph.innerHTML = '';
}
