export function generateCategories(options) {
    let result = "";
    let titles = Object.keys(options);
    for (var i = 0; i < titles.length; i++) {
        result += generateCategory(titles[i], options[titles[i]]);
    }
    return result;
}

function generateCategory(title, items) {
    let result = '<div class="items"><h1 class="items__title">' + title + '</h1><div class="items__list">';
    for (let i = 0; i < items.length; i++) {
        result += '<div class="item"><img class="item__image" src="' + items[i]['image'] + '" alt=""> <h2 class="item__title">' + items[i]['name'] + '</h2></div>';
    }
    return result + '</div></div>';
}