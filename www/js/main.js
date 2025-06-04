import { getResponse, getSource, getSourceList } from "./sources/sources.js";
import {
  generateCategory,
  generateCategories,
  generateDescription,
  getPlayer,
  getSettings,
} from "./coder.js";
import { getDDL, getPreferer, getName } from "./vservers/vserver.js";

let loading;
let content_root;
let sid; // server selection
let sn; // server name
window.favorites = [];
let recent = [];
window.backStack = [];
window.serverHost = "http://127.0.0.1:8080/";
let reload = false;

document.addEventListener("DOMContentLoaded", function () {
  let tvMode = localStorage.getItem("modotv");
  if (tvMode != null && tvMode) {
    this.location = "http://" + window.location.hostname + ":8080/main_2.html";
    return;
  }
  window.serverHost = "http://" + window.location.hostname + ":8080/";

  loading = new bootstrap.Modal(document.getElementById("loading"), {
    backdrop: false,
    keyboard: false,
    focus: true
  });

  content_root = document.getElementById("content-root");

  try {
    favorites = JSON.parse(localStorage.getItem("favorites"));
    updateFavorites();
  } catch (e) {}
  try {
    recent = JSON.parse(localStorage.getItem("recent"));
    updateRecents();
  } catch (e) {}
  let lastServer = localStorage.getItem("lastServer");
  let lastServerName = localStorage.getItem("lastServerName");
  if (lastServer != null && lastServerName != null) {
    sid = lastServer;
    sn = lastServerName;
  } else {
    sid = "jkanime";
    sn = "JkAnime";
  }
  server_selected(sid, sn);
  loadSourcesList(document.getElementById("server_list_dropdown"));
  loadSettings();
});

const loadSettings = () => {
  const settings_container = document.getElementById("opciones-body");
  settings_container.innerHTML = getSettings();
}

let loadSourcesList = (container) => {
  let sl = getSourceList();
  let ac = "";
  sl.forEach((key) => {
    //<li><a class="dropdown-item" href="#">JKAnime</a></li>

    ac +=
      ' <li><a class="dropdown-item" id="' +
      key +
      '" onclick="{server_selected_click(this)}">' +
      key +
      "</a></li>";
  });
  container.innerHTML = ac;
};

window.mediaClick = function (e, path) {
  loading.show();
  const fpath = path.split("/");
  const server = fpath[0] == "sid"? getSource(sid): getSource(fpath[0]);
  const action = fpath[1];
  let params;
  if (fpath.length == 3) {
    params = atob(fpath[2]);
  }
  if (action == "getFrontPage") {
    server.getFrontPage(posServerClick, error);
  } else if (action == "getCategory") {
    //server.getCategory(params, posServerClick, error);
  } else if (action == "getDescription") {
    window.lastDescription = path;
    server.getDescription(posDescription, error, fpath[2]);
  } else if (action == "getLinks") {
    server.getLinks(posLinks, error, fpath[2]);
    let ppf = function (item) {
      add_recent(item);
      markViewed(null, item["path"], path);
    };
    server.getParent(ppf, fpath[2]);
  } else if (action == "search") {
    const term = document.getElementById("search-text").value;
    server.getSearch(posSearch, error, term);
  } else if(action == "getMore"){
      server.getMore(
      posServerClick, window.showError, fpath[2])
  } else {
    loading.hide();
  }
};

window.shutdown = function () {
  if (confirm("¿Desea apagar el servidor?")) {
    fetch(serverHost + "shutdown")
      .then((response) => response.text())
      .then((text) => {
        document.body.innerHTML = "Ya puede cerrar esta ventana";
      });
  }
};

window.backClick = function (e) {
  if (reload) {
    window.location.reload();
  }
  if (window.backStack.length > 0) {
    let video = document.getElementsByTagName("VIDEO")[0];
    if (video) {
      video.pause();
      video.src = "";
      video.load();
    }    
    const last = window.backStack.pop();
    loadState(last, content_root);
    if (window.backStack.length == 0) {
      document.getElementById("back_button").style.display = "none";
      updateFavorites();
      updateRecents();
    }
  }
};

let addBackStack = function () {
  if (window.backStack.length == 0) {
    document.getElementById("back_button").style.display = "block";
  }
  window.backStack.push(saveState(content_root));
};


window.switch_fab = function (e, name, image, path) {
  let idx = indexOfProperty(favorites, "path", path);
  if (idx > -1) {
    favorites.splice(idx, 1);
    e.classList.remove("favorite");
    e.innerHTML = "Agregar a favoritos";
  } else {
    favorites.unshift({ name: name, image: image, path: path });
    e.classList.add("favorite");
    e.innerHTML = "Quitar de favoritos";
  }
};

let add_recent = function (item) {
  let idx = indexOfProperty(recent, "path", item.path);
  if (idx > -1) {
    recent.splice(idx, 1);
  }
  recent.unshift(item);
};

let updateFavorites = function () {
  if (favorites != null) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    if (favorites.length > 0) {
      document.getElementsByClassName("fav_placeholder")[0].innerHTML = generateCategory("Favoritos", favorites);
    }
  } else {
    favorites = [];
  }
};

let updateRecents = function () {
  if (recent != null) {
    if (recent.length > 30) {
      recent = recent.slice(0, 30);
    }
    localStorage.setItem("recent", JSON.stringify(recent));
    if (recent.length > 0) {
      document.getElementsByClassName("recent_placeholder")[0].innerHTML =
        generateCategory("Recientes", recent);
    }
  } else {
    recent = [];
  }
};

let posServerClick = function (response) {
  let ss = document.getElementsByClassName("servers_container__section");
  ss[0].innerHTML = generateCategories(response);
  loading.hide();
};

let error = function (error_message) {
  alert(error_message);
  loading.hide();
};

window.server_selected_click = function (e) {
  sid = e.id;
  sn = e.innerHTML;
  server_selected(sid, sn);
};

let server_selected = function (sid, sn) {
  document.getElementById("selected_dropdown").innerHTML = sn;
  loading.show();
  localStorage.setItem("lastServer", sid);
  localStorage.setItem("lastServerName", sn);
  if (!window.getStorageDefault("lockfronpage", true)) {
    getResponse(sid, posServerClick, error);
  } else {
    loading.hide();
  }
};

let posDescription = function (response) {
  addBackStack();
  content_root.scrollTop = 0;
  content_root.innerHTML = generateDescription(response);
  loading.hide();
  let vc = JSON.parse(localStorage.getItem(window.lastDescription));
  if (vc != null) {
    let lastOpenedChapter = vc.pop();
    vc.push(lastOpenedChapter);
    let vchapters = document.getElementsByClassName("viewed");
    for (var i = vchapters.length - 1; i >= 0; i--) {
      if (vchapters[i].outerHTML.indexOf(lastOpenedChapter) >= 0) {
        let nsc = vchapters[i];
        document.getElementsByClassName("details_placeholder")[0].scrollTop =
          nsc.offsetTop - 70;
          nsc.classList.add("focus");
      }
    }
  }
};

let linkError = function (error_message) {
  if (window.lastLink.length > 1) {
    window.lastLink.shift();
    posLinks(window.lastLink);
  } else {
    error(error_message);
  }
};

window.posLinks = function (linkList, subtitle, order = true, select = true) {
  let best = null;
  if (order) {
    best = getPreferer(linkList);
  } else {
    best = linkList;
  }
  let mask = (value) => {
    openPlayer(value, best, subtitle);
  };
  window.lastLink = best;
  if (
    getStorageDefault("vserSelect", true) == true &&
    best.length > 1 &&
    select
  ) {
    let opt = {};
    for (var key in best) {
      opt[getName(best[key])] = key;
    }
    optionSelection("Selecciona tu servidor preferido", opt, (key) => {
      let aux = best[0];
      best[0] = best[parseInt(key, 10)];
      best[parseInt(key, 10)] = aux;
      getDDL(mask, linkError, best[0]);
    });
    return;
  }
  if (best.length > 0) {
    getDDL(mask, linkError, best[0]);
  } else {
    error("No supported servers");
  }
};

window.openPlayer = (options,  items = [], subtitle = "",res = true) => {
  let video = document.getElementsByTagName("VIDEO")[0];
  if (video) {
    video.pause();
    video.src = "";
    video.load();
  }
  if (Object.keys(options).length > 1 && res) {
    if (localStorage.getItem("resSelect") == "true") {
      optionSelection(
        "Elige una resolución apropiada",
        options,
        (selection, options) => {
          options.video = selection;
          openPlayer(options, items, subtitle, false);
        }
      );
      return;
    }
  }
  let videoSrc = options["video"];
  let useCache =
    localStorage.getItem("cache") == "true" &&
    !(videoSrc.indexOf(".m3u") != -1);

  if (useCache) {
    if (videoSrc.indexOf("file/") !== -1) {
      videoSrc = videoSrc.replace("file/", "cache/");
    } else {
      videoSrc = window.serverHost + "cache/" + enc(videoSrc);
    }
  }
  if (
    getStorageDefault("external_player", false) ||
    getStorageDefault("internal_player", false)
  ) {
    let action = "view/";
    if (getStorageDefault("internal_player", false)) {
      action = "play/";
    }
    if(subtitle.length > 1){
      videoSrc = videoSrc + "||subtitle:" + subtitle;
    }
    fetch(window.serverHost + action + window.enc(videoSrc))
      .then((response) => response.text())
      .then((result) => {
        if (result.trim() != "ok") {
          error("Error al abrir reproductor externo/interno: \n" + result);
        }
      });
    loading.hide();
    return;
  }
  addBackStack();
  content_root.innerHTML = getPlayer(options, items, videoSrc, subtitle);
  var elem = document.getElementsByClassName("videoview")[0];
  if (videoSrc.indexOf(".m3u") != -1) {
    var hls_config = {
      autoStartLoad: true,
      maxMaxBufferLength: 10 * 60,
      maxBufferSize: 50 * 1000 * 1000,
    };
    if (!Hls.isSupported()) {
      alert("Hls no soportado por el navegador");
    } else {
      window.hls = new Hls(hls_config);
      window.hls.loadSource(videoSrc);
      window.hls.attachMedia(elem);
    }
  }
  if (window.getStorageDefault("fullscreen")) {
    window.requestFullScreen(document.getElementsByTagName('video')[0]);
  }
  elem.focus();
};

let posSearch = function (response) {
  addBackStack();
  content_root.innerHTML = generateCategory("Resultado de la busqueda", response);
  const searchbox = new bootstrap.Collapse('#searchbox', {});
  searchbox.hide();
  loading.hide();
};

window.markViewed = function (e, spath, path) {
  let vc = [];
  try {
    vc = JSON.parse(localStorage.getItem(spath));
    if (vc == null) {
      vc = [];
    }
  } catch (error) {}
  if (vc.indexOf(path) == -1) {
    if (e != null) {
      e.classList.add("viewed");
    }
    vc.push(path);
    localStorage.setItem(spath, JSON.stringify(vc));
  }
};

window.toggleView = function (name) {
  var mdiv = document.getElementById(name);
  if (mdiv.style.display === "none") {
    mdiv.style.display = "block";
  } else {
    mdiv.style.display = "none";
  }
};

window.toggleOption = (e) => {
  reload = true;
  if (e.checked) {
    localStorage.setItem(e.id, "true");
  } else {
    localStorage.setItem(e.id, "false");
  }
};

window.getStorageDefault = (key, defa) => {
  let val = localStorage.getItem(key);
  if (val == null) {
    val = defa;
    localStorage.setItem(key, val);
  }
  if (val == "true") {
    return true;
  } else if (val == "false") {
    return false;
  }
  return val;
};

window.optionClicked = (e) => {
  let key = e.id;
  let val = e.checked;
  localStorage.setItem(key, val);
};

window.requestFullScreen = (elem) => {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullScreen) {
    elem.webkitRequestFullScreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
};

window.exitFullScreen = () => {
  const document = window.document;
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
};

window.destroyPlayer = () => {
  try {
    window.hls.destroy();
  } catch (e) {
    /* ignore */
  }
  try {
    window.player.destroy();
  } catch (e) {
    /* ignore */
  }
};

window.changeSrcRes = (src) => {
  if (src.classList.contains("selected")) {
    return;
  }
  window.destroyPlayer();
  let options = src.parentNode.getElementsByClassName("source_item");
  for (let i = 0; i < options.length; i++) {
    options[i].classList.remove("selected");
  }
  src.classList.add("selected");
  let player = document.getElementsByTagName("video")[0];
  let currentTime = player.currentTime;
  player.src = src.dataset.src;
  player.currentTime = currentTime;
  if (src.dataset.src.indexOf(".m3u") != -1) {
    var hls_config = {
      autoStartLoad: true,
      maxMaxBufferLength: 10 * 60,
      maxBufferSize: 50 * 1000 * 1000,
    };
    if (!Hls.isSupported()) {
      alert("Hls no soportado por el navegador");
    } else {
      window.hls = new Hls(hls_config);
      window.hls.loadSource(src.dataset.src);
      window.hls.attachMedia(player);
    }
  }
};

window.changeSrc = function (src) {
  window.destroyPlayer();
  posLinks(JSON.parse(src.dataset.src), false, false);
};

function optionSelection(title, options, postSelect) {
  const title_container = document.getElementById("modal-title");
  const list_container = document.getElementById("modal-body");
  let postSelectPP = (value) => {
    postSelect(value, document.__selectpostSelectOptions);
  };
  if (Object.keys(options).length == 1) {
    postSelectPP(options[Object.keys(options)[0]], options);
    return;
  }
  document.__selectpostSelect = postSelectPP;
  document.__selectpostSelectOptions = options;
  document.__selectPrekeydown = document.onkeydown;
  title_container.innerText = title;
  let content = `<div class="list-group">`;
  for (var key in options) {
    content +=
      '<div class="list-group-item list-group-item-action" onclick="{onOptionSelectionSelected(this)}" data-src="' +
      options[key] +
      '">' +
      key +
      "</div>";
  }
  list_container.innerHTML = content + "</div>";
  window.current_modal = new bootstrap.Modal(document.getElementById("modal-list"))
  window.current_modal.show();
}

document.onOptionSelectionSelected = (option) => {
  window.current_modal.hide();
  document.onkeydown = document.__selectPrekeydown;
  if (option.dataset.src === "cancel") {
    loading.hide();
    return;
  }
  document.__selectpostSelect(option.dataset.src);
};
// selection message end

const saveState = (element) => {
  return {
    innerHTML: element.innerHTML,
    scrollTop: element.scrollTop,
    scrollLeft: element.scrollLeft
   }
}

const loadState = (from, to) => {
  to.innerHTML = from.innerHTML;
  to.scrollTop = from.scrollTop;
  to.scrollLeft = from.scrollLeft;
}