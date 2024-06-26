import { getResponse, getSource, getSourceList } from "./sources/sources.js";
import {
  generateCategory,
  generateCategories,
  generateDescription,
  getPlayer,
  getSearch,
  getSettings,
} from "./coder.js";
import { getDDL, getPreferer, getName } from "./vservers/vserver.js";
import { arrowNav, updatePositions, initVideoNav } from "./keynav.js";

let loading;
let dp, vp, pp, sp, setp, content;
let sid; // server selection
let sn; // server name
let isKeyNav = false;
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
  document.getElementById("search_button").style.display = "block";
  document.getElementById("more_button").style.display = "block";
  vp = document.getElementsByClassName("video_placeholder")[0];
  dp = document.getElementsByClassName("details_placeholder")[0];
  pp = document.getElementsByClassName("pages_placeholder")[0];
  sp = document.getElementsByClassName("search_placeholder")[0];
  setp = document.getElementsByClassName("settings_placeholder")[0];
  content = document.getElementsByClassName("content")[0];

  loading = document.getElementsByClassName("lds-group")[0];
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
  loadSourcesList(document.getElementById("server__select__menu"));
  document.onkeydown = lauchKeyNav;
});

let loadSourcesList = (container) => {
  let sl = getSourceList();
  let ac = "";
  sl.forEach((key) => {
    ac +=
      '<div class="menu__server__item" id="' +
      key +
      '" onclick="{server_selected_click(this)}">' +
      key +
      "</div>";
  });
  container.innerHTML = ac;
};

let lauchKeyNav = function (e) {
  let code = e || window.event;
  if (
    code.keyCode >= 37 &&
    code.keyCode <= 40 &&
    !document.activeElement.classList.contains("search__text")
  ) {
    const mc = document.getElementsByTagName("body")[0];
    mc.classList.add("no_mouse");
    mc.addEventListener("mousemove", (e) => {
      const timer = mc.getAttribute("timer");
      if (timer) {
        clearTimeout(timer);
        mc.setAttribute("timer", "");
      }
      const t = setTimeout(() => {
        mc.setAttribute("timer", "");
        mc.classList.add("no_mouse");
      }, 3500);
      mc.setAttribute("timer", t);
      mc.classList.remove("no_mouse");
    });
    document.onkeydown = arrowNav;
    isKeyNav = true;
    arrowNav(e);
  }
};

window.mediaClick = function (e, path) {
  loading.style.visibility = "visible";
  let fpath = path.split("/");
  let server = getSource(fpath[0]);
  let action = fpath[1];
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
    let term = document.getElementsByClassName("search__text")[0].value;
    server.getSearch(posSearch, error, term);
  } else if(action == "getMore"){
      server.getMore(
      posServerClick, window.showError, fpath[2])
  } else {
    loading.style.visibility = "hidden";
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
    let last = window.backStack.pop();
    last.style.display = "none";
    let video = document.getElementsByTagName("VIDEO")[0];
    if (video) {
      video.pause();
      video.src = "";
      video.load();
    }
    last.innerHTML = "";
    if (window.backStack.length == 0) {
      document.getElementById("back_button").style.display = "none";
      document.getElementById("search_button").style.display = "block";
      document.getElementById("more_button").style.display = "block";
      document.getElementById("settings_button").style.display = "block";
      document
        .getElementById("select_server")
        .classList.add("select_server_active");
    }
    if (isKeyNav) {
      updatePositions(null);
    }
  }
};

let addBackStack = function (e) {
  if (window.backStack.length == 0) {
    document.getElementById("server__select__menu").style.display = "none";
    document.getElementById("back_button").style.display = "block";
    document.getElementById("search_button").style.display = "none";
    document.getElementById("more_button").style.display = "none";
    document.getElementById("settings_button").style.display = "none";
    document
      .getElementById("select_server")
      .classList.remove("select_server_active");
  }
  if (window.backStack.indexOf(e) != -1) {
    window.backStack.splice(window.backStack.indexOf(e), 1);
  }
  window.backStack.push(e);
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
  updateFavorites();
};

let add_recent = function (item) {
  let idx = indexOfProperty(recent, "path", item.path);
  if (idx > -1) {
    recent.splice(idx, 1);
  }
  recent.unshift(item);
  updateRecents();
};

let updateFavorites = function () {
  if (favorites != null) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    if (favorites.length > 0) {
      document.getElementsByClassName("fav_placeholder")[0].innerHTML =
        generateCategory("Favoritos", favorites);
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
  loading.style.visibility = "hidden";
  updatePositions();
};

let error = function (error_message) {
  alert(error_message);
  loading.style.visibility = "hidden";
};

window.server_selected_click = function (e) {
  sid = e.id;
  sn = e.innerHTML;
  server_selected(sid, sn);
};

let server_selected = function (sid, sn) {
  document.getElementById("server__select__menu").style.display = "none";
  document.getElementById("select_server").innerHTML = sn;
  loading.style.visibility = "visible";
  localStorage.setItem("lastServer", sid);
  localStorage.setItem("lastServerName", sn);
  if (!window.getStorageDefault("lockfronpage", true)) {
    getResponse(sid, posServerClick, error);
  } else {
    loading.style.visibility = "hidden";
  }
};

let posDescription = function (response) {
  dp.innerHTML = generateDescription(response);
  dp.style.display = "block";
  loading.style.visibility = "hidden";
  addBackStack(dp);
  let vc = JSON.parse(localStorage.getItem(window.lastDescription));
  if (vc != null) {
    let lastOpenedChapter = vc.pop();
    vc.push(lastOpenedChapter);
    let vchapters = document.getElementsByClassName("viewed");
    for (var i = vchapters.length - 1; i >= 0; i--) {
      if (vchapters[i].outerHTML.indexOf(lastOpenedChapter) >= 0) {
        let nsc = vchapters[i];
        if (lastPos["details_placeholder"] != undefined) {
          lastPos["details_placeholder"].classList.remove("focus");
        }
        lastPos["details_placeholder"] = nsc;
        document.getElementsByClassName("details_placeholder")[0].scrollTop =
          nsc.offsetTop - 70;
        nsc.parentElement.scrollLeft =
          nsc.offsetLeft -
          nsc.parentElement.offsetLeft -
          nsc.parentElement.offsetWidth / 3 +
          nsc.offsetWidth;
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

window.openPlayer = function (options,  items = [], subtitle = "",res = true) {
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
    loading.style.visibility = "hidden";
    return;
  }
  vp.innerHTML = getPlayer(options, items, videoSrc, subtitle);
  vp.style.display = "flex";
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
  loading.style.visibility = "hidden";
  initVideoNav();
  if (window.getStorageDefault("fullscreen")) {
    window.requestFullScreen(window.player);
  }
  elem.focus();
  addBackStack(vp);
};

let posSearch = function (response) {
  let search = document.getElementById("search");
  search.style.marginTop = 50 + "px";
  let rc = document.getElementById("results_container");
  rc.innerHTML = generateCategory("Resultados", response);
  loading.style.visibility = "hidden";
  updatePositions("search_placeholder");
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

window.search = function () {
  sp.innerHTML = getSearch(sid);
  sp.style.display = "block";
  addBackStack(sp);
  var si = document.getElementsByClassName("search__text")[0];
  si.focus();
  si.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      mediaClick(self, sid + "/search");
    }
  });
};

window.toggleView = function (name) {
  var mdiv = document.getElementById(name);
  if (mdiv.style.display === "none") {
    mdiv.style.display = "block";
  } else {
    mdiv.style.display = "none";
  }
};

window.settings = function () {
  setp.innerHTML = getSettings(sid);
  setp.style.display = "block";
  addBackStack(setp);
};

window.toggleOption = function (e) {
  reload = true;
  if (e.children[1].innerText == "✓") {
    e.children[1].innerText = "✗";
    localStorage.setItem(e.children[1].id, "false");
  } else {
    e.children[1].innerText = "✓";
    localStorage.setItem(e.children[1].id, "true");
  }
};

window.getStorageDefault = function (key, defa) {
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

window.optionClicked = function (e) {
  let key = e.id;
  let val = e.checked;
  localStorage.setItem(key, val);
};

window.requestFullScreen = function (elem) {
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

window.exitFullScreen = function () {
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

window.destroyPlayer = function () {
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

window.changeSrcRes = function (src) {
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

function loadm2() {
  let exta = window.getStorageDefault("modo_2", "false") ? "_m2" : "";
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "css/items" + exta + ".css";
  document.getElementsByTagName("head")[0].appendChild(link);
}

loadm2();

// selection message start
let navOptions = (event) => {
  event.preventDefault();
  if (!(event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 13)) {
    return;
  }
  let options = document.getElementsByClassName("optionSelection__option");
  let selected = document.getElementsByClassName("optionSelection__focused")[0];
  let cidx = Array.from(options).indexOf(selected);
  switch (event.keyCode) {
    case 40: // down arrow
      if (cidx + 1 < options.length) {
        selected.classList.remove("optionSelection__focused");
        options[cidx + 1].classList.add("optionSelection__focused");
      }
      break;
    case 38: // up arrow
      if (cidx - 1 >= 0) {
        selected.classList.remove("optionSelection__focused");
        options[cidx - 1].classList.add("optionSelection__focused");
      }
      break;
    case 13:
      document.body.removeChild(document.__optionsDiv);
      document.onkeydown = document.__selectPrekeydown;
      document.__selectpostSelect(selected.dataset.src);
      break;
  }
};

function optionSelection(title, options, postSelect) {
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
  document.onkeydown = navOptions;
  var div = document.createElement("div");
  let content =
    `<div class="optionSelection">
    <div class="optionSelection__title">` +
    title +
    `</div>
    <div class="optionSelection__options">`;
  for (var key in options) {
    content +=
      '<div class="optionSelection__option" onclick="{onOptionSelectionSelected(this)}" data-src="' +
      options[key] +
      '">' +
      key +
      "</div>";
  }
  content +=
    '<div class="optionSelection__option optionSelection__Cancel" onclick="{onOptionSelectionSelected(this)}" data-src="cancel">Cancelar</div></div>';
  div.innerHTML = content;
  div
    .getElementsByClassName("optionSelection__option")[0]
    .classList.add("optionSelection__focused");
  document.body.appendChild(div);
  document.__optionsDiv = div;
}

document.onOptionSelectionSelected = (option) => {
  document.body.removeChild(document.__optionsDiv);
  document.onkeydown = document.__selectPrekeydown;
  if (option.dataset.src === "cancel") {
    loading.style.visibility = "hidden";
    return;
  }
  document.__selectpostSelect(option.dataset.src);
};
// selection message end
