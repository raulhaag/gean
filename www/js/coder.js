import { getName } from "./vservers/vserver.js";

export function generateCategories(options) {
  let result = "";
  let titles = Object.keys(options);
  for (var i = 0; i < titles.length; i++) {
    result += generateCategory(titles[i], options[titles[i]]);
  }
  return result;
}

export function generateCategory(title, items) {
  let result =
    '<div class="items"><h2 class="items__title">' +
    title +
    '</h2><div class="items__list">';
  for (let i = 0; i < items.length; i++) {
    result +=
      '<div class="item focusable" onclick="{mediaClick(self, \'' +
      items[i]["path"] +
      '\')}"><img class="item__image" src="' +
      items[i]["image"] +
      '" alt="" referrerpolicy="no-referrer"> <h2 class="item__title">' +
      items[i]["name"] +
      "</h2></div>";
  }
  return result + "</div></div>";
}

export function generateDescription(options) {
  let vieweds = [];
  try {
    vieweds = JSON.parse(localStorage.getItem(options.path));
    if (vieweds == null) {
      vieweds = [];
    }
  } catch (e) {
    vieweds = [];
  }
  let result =
    '<div class="main-content"><div class="details"><div class="details__container">';
  result +=
    '<img class="details__image" src="' +
    options["image"] +
    '" alt="" class=><div class="details__items"><div class="details__item"><h2 class="focusable">' +
    options["name"] +
    "</div>";
  for (let i = 0; i < options["items"].length; i++) {
    result += '<div class="details__item">' + options["items"][i] + "</div>";
  }
  let idx = indexOfProperty(favorites, "path", options.path);
  if (idx > -1) {
    result +=
      '<div class="details__add focusable favorite" onclick="{switch_fab(this, \'' +
      options["name"] +
      "', '" +
      options["image"] +
      "','" +
      options["path"] +
      "')}\">Quitar de favoritos</div>";
  } else {
    result +=
      '<div class="details__add focusable" onclick="{switch_fab(this, \'' +
      options["name"] +
      "', '" +
      options["image"] +
      "','" +
      options["path"] +
      "')}\">Agregar a favoritos</div>";
  }
  result += '</div></div><div class="details__chapters">';
  for (let i = 0; i < options["chapters"].length; i++) {
    if (vieweds.indexOf(options["chapters"][i]["path"]) == -1) {
      result +=
        '<div class="button focusable" onclick="{markViewed(this,\'' +
        options["path"] +
        "', '" +
        options["chapters"][i]["path"] +
        "') ;mediaClick(self, '" +
        options["chapters"][i]["path"] +
        "')}\">" +
        options["chapters"][i]["name"] +
        "</div>";
    } else {
      result +=
        '<div class="button viewed focusable" onclick="{mediaClick(this, \'' +
        options["chapters"][i]["path"] +
        "')}\">" +
        options["chapters"][i]["name"] +
        "</div>";
    }
  }
  result += "</div></div>";
  return result;
}

export function getPlayer(options, items = [], videoSrc, subtitles = "") {
  let rv = '<div class="source_list">';
  let extra = " selected";
  items.forEach(function (item) {
    let osar = [item];
    for (let i = 0; i < items.length; i++) {
      if (osar.indexOf(items[i]) == -1) {
        osar.push(items[i]);
      }
    }
    rv +=
      '<div class="source_item focusable ' +
      extra +
      "\" data-src='" +
      JSON.stringify(osar) +
      '\' onclick="{changeSrc(this)}">' +
      getName(item) +
      "</div>";
    extra = "";
  });
  rv += `</div><div class="source_list">`;
  Object.keys(options).forEach(function (item) {
    if (item != "video") {
      if (options["video"] == options[item]) {
        extra = " selected";
      } else {
        extra = "";
      }
      rv +=
        '<div class="source_item focusable' +
        extra +
        '" data-src="' +
        options[item] +
        '" onclick="{changeSrcRes(this)}">' +
        item +
        "</div>";
    }
  });
  rv += `</div><div class="video_container"><video id="player" class="videoview focusable" controls autoplay>`;
  /*Object.keys(options).forEach(function(option){
            rv +=  `<source src="` + options[option]+ `" label="` + option + `">`
        });*/
  rv += `<source src="` + videoSrc + `" label="` + "video" + `">`;
  if(subtitles.length > 1){
    rv += `<track
    label="Español"
    kind="subtitles"
    srclang="en"
    src="${subtitles}"
    default />`
  }
  rv += `</video>
                </div>`;
  return rv;
}

export function getSearch(server) {
  return (
    `<div id="search">
    <div id="search__box">
    <input autoComplete='none' class="search__text focusable" type="text" onkeypress="{}"></input>
    <div class="button focusable" onclick="{mediaClick(self, '` +
    server +
    `/search')}"><div>Buscar</div></div>
    </div>
    <div id="results_container"></div>
    </div>
   `
  );
}

export function getSettings() {
  let options = {
    lockfronpage: " Bloquear pagina principal",
    fullscreen: " Iniciar video en pantalla completa",
    autoplay: " Autoplay de video",
    vserSelect: "Seleccionar servidor antes de reproducir.",
    resSelect: "Selección de resolución manual",
    external_player: "Usar reproductor externo(Solo Android)",
    internal_player:
      "Usar reproductor integrado (Solo Android/ recomendado, bloquea opcion externo)",
    cache:
      "Usar cache de video en disco (solo pc/firefx o última version de la app), necesita espacio disponible en disco)",
    modo_2: "Usar modo de vista 2(necesita recargar la pagina)",
    modotv:
      "Modo pensado para tv (usa cursores para navegar y enter/ no tactil)",
  };
  const defv = [
    "false",
    "true",
    "true",
    "true",
    "false",
    "false",
    "false",
    "false",
    "false",
    "false",
  ];
  let result =
    '<div class="container"><div class="settings_group main-content">';
  let aval = false;
  var i = 0;
  let extra = "";
  for (var key in options) {
    aval = localStorage.getItem(key);
    if (aval == null) {
      aval = defv[i];
    }
    if (aval == "true") {
      extra = "✓";
    } else {
      extra = "✗";
    }
    result +=
      '<div class="setting_option focusable" onclick="{toggleOption(this)}"><div class="setting_label">' +
      options[key] +
      '</div><div class="setting_state" id="' +
      key +
      '">' +
      extra +
      "</div></div>";
    i++;
  }
  return (
    result +
    '</div></div><div><p style="position: absolute;bottom: 10px;text-align: center; width:100%">' +
    window.navigator.userAgent +
    "</p></div>"
  );
}
