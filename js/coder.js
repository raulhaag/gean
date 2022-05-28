export function generateCategories(options) {
    let result = "";
    let titles = Object.keys(options);
    for (var i = 0; i < titles.length; i++) {
        result += generateCategory(titles[i], options[titles[i]]);
    }
    return result;
}

export function generateCategory(title, items) {
    let result = '<div class="items"><h2 class="items__title">' + title + '</h2><div class="items__list">';
    for (let i = 0; i < items.length; i++) {
        result += '<div class="item focusable" onclick="{mediaClick(self, \'' + items[i]["path"] + '\')}"><img class="item__image" src="' + items[i]['image'] + '" alt=""> <h2 class="item__title">' + items[i]['name'] + '</h2></div>';
    }
    return result + '</div></div>';
}

export function generateDescription(options) {
    let vieweds = [];
    try {
        vieweds = JSON.parse(localStorage.getItem(options.path));
        if(vieweds == null){
            vieweds = [];
        }
    }catch (e) {
        vieweds = [];
    }
    let result = '<div class="main-content"><div class="details"><div class="details__container">';
    result += '<img class="details__image" src="'+ options['image'] + '" alt="" class=><div class="details__items"><div class="details__item"><h2>'+ options['name'] +'</div>';
    for(let i = 0; i < options['items'].length; i++){
        result += '<div class="details__item">'+ options['items'][i] +'</div>';
    }
    result += '<div class="details__add focusable" onclick="{add_fab(\'' + options['name'] + '\', \'' + options['image'] + '\',\'' + options['path'] + '\')}">Agregar a favoritos</div>';
    result += '</div></div><div class="details__chapters">';
    for(let i = 0; i < options['chapters'].length; i++){
        if(vieweds.indexOf(options['chapters'][i]['path']) == -1){
            result += '<div class="button focusable" onclick="{markViewed(this,\'' + options['path'] + '\', \'' + options['chapters'][i]["path"] + '\') ;mediaClick(self, \'' + options['chapters'][i]["path"] + '\')}">' + options['chapters'][i]['name'] + "</div>";
        }else{
            result += '<div class="button viewed focusable" onclick="{mediaClick(this, \'' + options['chapters'][i]["path"] + '\')}">' + options['chapters'][i]['name'] + "</div>";
        }
    }
    result += '</div></div>';
    return result;
}

export function getPlayer(options){
    return '<div class="video_container"><video class="videoview focusable" controls autoplay><source src="' + options["video"]+ '"></video></div>';
}

export function getSearch(server){
    return `<div id="search">
    <div id="search__box">
    <input class="search__text focusable" type="text" onkeypress="{}"></input>
    <div class="button focusable" onclick="{mediaClick(self, '`+ server + `/search')}"><div>Buscar</div></div>
    </div>
    <div id="results_container"></div>
    </div>
   `;
}

export function getSettings(){
    let options = {"lockfronpage":" Bloquear pagina principal", "fullscreen": " Iniciar video en pantalla completa", "autoplay": " Autoplay de video"};
    const defv = ["false", "true", "true"];
    let result = '<div class="container"><div class="settings_group main-content">';
    let aval = false;
    var i = 0;
    let extra = "";
    for(var key in options){
        aval = localStorage.getItem(key);
        if(aval == null){
            aval = defv[i];
        }
        if(aval == "true"){
            extra = "checked";
        }else{
            extra = "";
        }
        result += '<div class="setting_option"><label><input type="checkbox" id="'+ key + '" value="'+ key + '" ' + extra + ' onclick=\'{optionClicked(this)}\'>' + options[key] + '</label></div>';
        i++;
    }
    return result + '</div></div>';
}

