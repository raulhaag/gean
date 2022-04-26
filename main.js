console.log("javascript");

document.addEventListener("DOMContentLoaded", function(){
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
    vinetas = document.getElementsByClassName("servers_container__item");
    for (var i = 0; i < vinetas.length; i++) {
        vinetas[i].className = 'servers_container__item'
    }
    e.className = 'servers_container__item server_selected'
    fetch('http://127.0.0.1:8080/action/' + sname + '/getFrontPage')
    .then((response) => response.text())
    .then((result) => {
        ss = document.getElementsByClassName("servers_container__section");
        ss[0].innerHTML = result;
    })
    .catch((error) => {
        console.log(error)
    })
}

