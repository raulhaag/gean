export function generateCategories(options) {
    let result = "";
    let titles = Object.keys(options);
    for (var i = 0; i < titles.length; i++) {
        result += generateCategory(titles[i], options[titles[i]]);
    }
    return result;
}

export function generateCategory(title, items) {
    let result = '<div class="items"><h1 class="items__title">' + title + '</h1><div class="items__list">';
    for (let i = 0; i < items.length; i++) {
        result += '<div class="item" onclick="{mediaClick(self, \'' + items[i]["path"] + '\')}"><img class="item__image" src="' + items[i]['image'] + '" alt=""> <h2 class="item__title">' + items[i]['name'] + '</h2></div>';
    }
    return result + '</div></div>';
}

export function generateDescription(options) {
    let result = '<div class="links_container center_message_container"><div class="links_bar"> <div class="links_title">Detalles</div><b class="links_close" onclick="{hidePlaceholder()}">x</b></div><div class="details"><div class="details__container">';
    result += '<img class="details__image" src="'+ options['image'] + '" alt="" class=><div class="details__items"><div class="details__item"><h2>'+ options['name'] +'</div>';
    for(let i = 0; i < options['items'].length; i++){
        result += '<div class="details__item">'+ options['items'][i] +'</div>';
    }
    result += '<div class="details__add" onclick="{add_fab(\'' + options['name'] + '\', \'' + options['image'] + '\',\'' + options['path'] + '\')}">Agregar a favoritos</div>';
    result += '</div></div><div class="details__chapters">';
    for(let i = 0; i < options['chapters'].length; i++){
        result += '<div class="details__chapter" onclick="{mediaClick(self, \'' + options['chapters'][i]["path"] + '\')}">' + options['chapters'][i]['name'] + "</div>";
    }
    result += '</div></div></div>';
    return result;
}

export function getPlayer(options){
    return '<div class="links_container center_message_container"><div class="links_bar"> <div class="links_title">Reproduciendo...</div><b class="links_close" onclick="{hidePlaceholder()}">x</b></div><video class="videoview" width="800" height="480" controls autoplay><source src="' + options["video"]+ '"></video></div>';
}


