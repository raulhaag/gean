console.log("javascript");
let loading;
let jk;

document.addEventListener("DOMContentLoaded", function(){
    loading = document.getElementsByClassName("lds-group")[0];
    jk = new JKAnime();
    fetch('http://127.0.0.1:8080/json/a.json')
    .then((response) => response.json())
    .then((jsonresult) => {
        flis = document.getElementById("favorites_list");
        favs = jsonresult["favorites"];
        for (var i = 0; i < favs.length; i++) {
            flis.innerHTML += '<div class="cat_container__media" stylesheet="background-image: url("'+ favs[i].img +'");"><div class="cat_container__media_title">' + favs[i].name + '</div></div>'
        }
    })
    .catch((error) => {
        console.log(error)
    })
});



serverClick = function(e, sname){
    loading.style.visibility = 'visible';

    vinetas = document.getElementsByClassName("servers_container__item");
    for (var i = 0; i < vinetas.length; i++) {
        vinetas[i].className = 'servers_container__item'
    }
    e.className = 'servers_container__item server_selected'
    fetch('http://127.0.0.1:8080/action/' + sname + '/getFrontPage')
    .then((response) => response.text())
    .then((result) => {
        loading.style.visibility = 'hidden';
        ss = document.getElementsByClassName("servers_container__section");
        ss[0].innerHTML = result;
    })
    .catch((error) => {
        loading.style.visibility = 'hidden';
        console.log(error)
    })/*
    jk.getFrontPage();
    loading.style.visibility = 'hidden';*/
}

mediaClick = function(e, path){
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

