import {openInNewTab, getResponse} from '/servers.js';
import {generateCategories} from '/coder.js';

let loading;
let jk;

document.addEventListener("DOMContentLoaded", function(){
    loading = document.getElementsByClassName("lds-group")[0];
    fetch('http://127.0.0.1:8080/json/a.json')
    .then((response) => response.json())
    .then((jsonresult) => {
        let flis = document.getElementById("favorites_list");
        let favs = jsonresult["favorites"];
        for (var i = 0; i < favs.length; i++) {
            flis.innerHTML += '<div class="cat_container__media" stylesheet="background-image: url("'+ favs[i].img +'");"><div class="cat_container__media_title">' + favs[i].name + '</div></div>'
        }
    })
    .catch((error) => {
        console.log(error)
    })
});

let posServerClick = function(response){
    let ss = document.getElementsByClassName("servers_container__section");
    ss[0].innerHTML = generateCategories(response);
    loading.style.visibility = 'hidden';
}

window.serverClick = function (e, sname){
    loading.style.visibility = 'visible';
    let vinetas = document.getElementsByClassName("servers_container__item");
    for (var i = 0; i < vinetas.length; i++) {
        vinetas[i].className = 'servers_container__item'
    }
    e.className = 'servers_container__item server_selected';
    getResponse(sname, posServerClick);
}


window.mediaClick = function(e, path){
    fetch('http://127.0.0.1:8080/action/' + path)
    .then((response) => response.text())
    .then((result) => {
        loading.style.visibility = 'hidden';
        openInNewTab(result);
    })
    .catch((error) => {
        loading.style.visibility = 'hidden';
        console.log(error)
    })
}

