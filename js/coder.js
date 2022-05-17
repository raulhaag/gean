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
        result += '<div class="item" onclick="{mediaClick(self, \'' + items[i]["path"] + '\')}"><img class="item__image" src="' + items[i]['image'] + '" alt=""> <h2 class="item__title">' + items[i]['name'] + '</h2></div>';
    }
    return result + '</div></div>';
}

export function generateDescription(options) {
    let result = '<div class="links_container center_message_container"><div class="links_bar"> <div class="links_title">Detalles</div><b class="links_close" onclick="{hideDetails()}">x</b></div><div class="details"><div class="details__container">';
    result += '<img class="details__image" src="'+ options['image'] + '" alt="" class=><div class="details__items"><div class="details__item"><h2>'+ options['name'] +'</div>';
    for(let i = 0; i < options['items'].length; i++){
        result += '<div class="details__item">'+ options['items'][i] +'</div>';
    }
    result += '<div class="details__add" onclick="{add_fab(\'' + options['name'] + '\', \'' + options['image'] + '\',\'' + options['path'] + '\')}">Agregar a favoritos</div>';
    result += '</div></div><div class="details__chapters">';
    for(let i = 0; i < options['chapters'].length; i++){
        result += '<div class="button" onclick="{mediaClick(self, \'' + options['chapters'][i]["path"] + '\')}">' + options['chapters'][i]['name'] + "</div>";
    }
    result += '</div></div></div>';
    return result;
}

export function getPlayer(options){
    return '<div id="player" class="links_container center_message_container"><div class="links_bar" id="player_bar"> <div class="links_title">Reproduciendo...</div><b class="links_close" onclick="{hideVideo()}">x</b></div><video class="videoview" controls autoplay><source src="' + options["video"]+ '"></video></div>';
}

export function getSearch(server){
    return `<div class="search">
    <input id="search__text" type="text"></input>
    <div class="button"><div>Buscar</div></div>
    </div>
    <div class="results_container"></div>`;
}


