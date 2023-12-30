import { getSource } from "../js/sources/sources.js";
import { getDDL, getName, getPreferer } from "../js/vservers/vserver.js";
import { SceneHome } from "./scene_home.js";
import { SceneDetails } from "./scene_details.js";
import { SceneSearch } from "./scene_search.js";
import { ScenePlayer } from "./scene_player.js";
import { SceneChange } from "./scene_change.js";
import { SceneSettings } from "./scene_settings.js";

//server id / name
window.sid, window.sn;
window.tease_menu = null;
window.menu = null;
window.lockMenu = true;
window.lockKeys = true;
let scene_container = null;
window.backScenePoll = [];
let backScenePH = [];
let loadingCounter = 0;

window.favorites = {};
window.recent = [];
window.resumes = {};

let stopPropagationForKeys = (event) => {
  if (event != null) {
    event.stopPropagation();
    event.preventDefault();
  }
};

document.addEventListener("DOMContentLoaded", function () {
  let tvMode = localStorage.getItem("modotv");
  if (tvMode != null && !tvMode) {
    this.location = "http://" + window.location.hostname + ":8080/main.html";
    return;
  }

  window.serverHost = "http://" + window.location.hostname + ":8080/";
  try {
    window.favorites = JSON.parse(window.getStorageDefault("favorites", "[]"));
  } catch (e) {}
  try {
    window.recent = JSON.parse(window.getStorageDefault("recent"), "[]");
  } catch (e) {}
  loadResumes();
  loadSettings();
  let color = window.appSettings["--tint-color"];
  if (color) {
    document.documentElement.style.setProperty("--tint-color", color);
  }
  let lastServer = localStorage.getItem("lastServer");
  let lastServerName = localStorage.getItem("lastServerName");
  if (lastServer != null && lastServerName != null) {
    window.sid = lastServer;
    window.sn = lastServerName;
  } else {
    window.sid = "jkanime";
    window.sn = "JkAnime";
  }
  teaseMenu = document.getElementsByClassName("menu-tease")[0];
  menu = document.getElementsByClassName("menu")[0];
  scene_container = document.getElementById("main_scene");

  window.setScene(new SceneHome());
  //document.onkeydown =
  document.onkeyup = stopPropagationForKeys;
  document.onkeypress = stopPropagationForKeys;
});

//menu management
let teaseMenu = null,
  menu = null;
let optionsId = ["menu-home", "menu-search", "menu-change", "menu-settings"];
let selectedMenuIdx = 0,
  lastMenuOpened = 0;
let menuLock = false;
let currentScene = null;
let dialog = false;

window.menuManager = () => {
  menuLock = true;
  menu.classList.remove("menu-closed");
  teaseMenu.classList.add("menu-tease-only-icons");
  document.onkeydown = menu_nav;
};

window.lockKeyboard = () => {
  document.onkeydown = stopPropagationForKeys;
};

window.unlockKeyboard = () => {
  if (menuLock) {
    window.menuManager();
  } else if (dialog) {
    return;
  } else {
    window.changeKeyManager();
  }
};

let keyManager = (key) => {
  if (key != null && key.hasOwnProperty("preventDefault")) {
    key.preventDefault();
    key.stopPropagation();  
    //console.error(key.key);
  };
  currentScene.lastKeyManager(key);
};

window.changeKeyManager = () => {
  menuLock = false;
  menu.classList.add("menu-closed");
  teaseMenu.classList.remove("menu-tease-only-icons");
  if (backScenePoll.length > 0) {
    currentScene = backScenePoll[backScenePoll.length - 1];
  }
  document.onkeydown = keyManager;
  try {
    document.onkeydown(null);
  } catch (e) {}
};

let loadingDiv = null;
let timeOutLoadingId = null;
window.setLoading = () => {
  loadingCounter += 1;
  if (window.lockKeys) {
    window.lockKeyboard();
  } else {
    window.lockKeys = true;
    return;
  }
  if (loadingDiv == null) {
    loadingDiv = document.createElement("div");
    loadingDiv.innerHTML =
      '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
    loadingDiv.classList.add("loading_container");
    document.body.append(loadingDiv);
  } else {
    clearTimeout(timeOutLoadingId);
  }
};

window.unsetLoading = () => {
  loadingCounter -= 1;
  if (loadingCounter != 0) {
    return;
  }
  timeOutLoadingId = setTimeout(() => {
    window.unlockKeyboard();
    try {
      if (document.body.hasChildNodes(loadingDiv) && loadingDiv != null)
        document.body.removeChild(loadingDiv);
    } catch (e) {}
    loadingDiv = null;
  }, 250);
};

window.setScene = (nScene) => {
  window.setLoading();
  try {
    if (nScene.full_menu) {
      //replace main escene
      for (let i in backScenePoll) {
        i.dispose();
      }
      backScenePoll = [];
      for (let i in backScenePH) {
        document.body.removeChild(i);
      }
      backScenePH = [];
      if (currentScene != null) {
        currentScene.dispose();
      }
      scene_container.innerHTML = nScene.body();
      currentScene = nScene;
      nScene.initBindings();
    } else {
      //add child to the back pool
      if (
        backScenePoll.length > 0 && //now allow pool 2 equals
        nScene.constructor.name ===
          backScenePoll[backScenePoll.length - 1].constructor.name
      ) {
        popScene();
      }
      showBack(true);
      let ph = document.createElement("div");
      ph.classList.add("backable_placeholder");
      ph.classList.add("over-search");
      ph.innerHTML = nScene.body();
      document.body.appendChild(ph);
      nScene.initBindings();
      backScenePH.push(ph);
      backScenePoll.push(nScene);
    }
  } catch (e) {}
  window.changeKeyManager();
  window.unsetLoading();
};

let popScene = () => {
  if (backScenePoll.length > 1) {
    currentScene = backScenePoll[backScenePoll.length - 1];
  } else {
    currentScene = currentScene.parent;
    backMenuSwitch();
  }
  backScenePoll.pop().dispose();
  document.body.removeChild(backScenePH.pop());
  window.changeKeyManager();
};

let menu_nav = (event) => {
  if (event == null) {
    stopPropagationForKeys(event);
    window.tease_menu(true);
    return;
  }
  switch (event.key) {
    case 'ArrowUp':
      if (selectedMenuIdx > 0) {
        document
          .getElementById(optionsId[selectedMenuIdx - 1])
          .classList.add("menu-selected-from-up");
        document
          .getElementById(optionsId[selectedMenuIdx])
          .classList.remove("menu-selected-from-up");
        document
          .getElementById(optionsId[selectedMenuIdx])
          .classList.remove("menu-selected-from-down");
        selectedMenuIdx -= 1;
      }
      break;
    case 'ArrowDown':
      if (selectedMenuIdx < optionsId.length - 1) {
        document
          .getElementById(optionsId[selectedMenuIdx + 1])
          .classList.add("menu-selected-from-down");
        document
          .getElementById(optionsId[selectedMenuIdx])
          .classList.remove("menu-selected-from-up");
        document
          .getElementById(optionsId[selectedMenuIdx])
          .classList.remove("menu-selected-from-down");
        selectedMenuIdx += 1;
      }
      break;
    case "ArrowRight":
      window.changeKeyManager();
      teaseMenu.classList.remove("menu-tease-only-icons");
      menu.classList.add("menu-closed");
      keyManager(null);
      if (selectedMenuIdx > lastMenuOpened) {
        document
          .getElementById(optionsId[lastMenuOpened])
          .classList.add("menu-selected-from-up");
        document
          .getElementById(optionsId[selectedMenuIdx])
          .classList.remove("menu-selected-from-up");
        document
          .getElementById(optionsId[selectedMenuIdx])
          .classList.remove("menu-selected-from-down");
      } else if (selectedMenuIdx < lastMenuOpened) {
        document
          .getElementById(optionsId[lastMenuOpened])
          .classList.add("menu-selected-from-down");
        document
          .getElementById(optionsId[selectedMenuIdx])
          .classList.remove("menu-selected-from-up");
        document
          .getElementById(optionsId[selectedMenuIdx])
          .classList.remove("menu-selected-from-down");
      }
      selectedMenuIdx = lastMenuOpened;
      teaseMenu.classList.remove("menu-tease-only-icons");
      break;
      case "Enter":
      case "NumpadEnter":
      case "Space":
      case " ":
      if (!currentScene.full_menu) {
        popScene();
        return;
      }
      if (selectedMenuIdx != lastMenuOpened) {
        switch (selectedMenuIdx) {
          case 0:
            window.setScene(new SceneHome());
            break;
          case 1:
            window.setScene(new SceneSearch());
            break;
          case 2:
            window.setScene(new SceneChange());
            break;
          case 3:
            window.setScene(new SceneSettings(window.appSettings));
            break;
        }
        lastMenuOpened = selectedMenuIdx;
        menu.classList.add("menu-closed");
      }
  }
};

window.tease_menu = (show = true) => {
  if (show) {
    teaseMenu.classList.remove("menu-tease-disapear");
  } else {
    teaseMenu.classList.add("menu-tease-disapear");
  }
};

let backMenuSwitch = () => {
  let menues = document.getElementsByClassName("menu-item");
  let tease = document.getElementsByClassName("menu-item-tease");
  for (let i = 0; i < menues.length; i++) {
    if (menues[i].classList.contains("hide")) {
      menues[i].classList.remove("hide");
    } else {
      menues[i].classList.add("hide");
    }
  }
  for (let i = 0; i < tease.length; i++) {
    if (tease[i].classList.contains("hide")) {
      tease[i].classList.remove("hide");
    } else {
      tease[i].classList.add("hide");
    }
  }
};

let showBack = (status) => {
  let back = document.getElementById("menu-back");
  if (back.classList.contains("hide") != status) {
    return;
  }
  backMenuSwitch();
};

//globals functions
window.route = function (path, ppath = null) {
  let fpath = path.split("/");
  let server = getSource(fpath[0]);
  let action = fpath[1];
  let params;
  if (fpath.length == 3) {
    params = atob(fpath[2]);
  }
  if (action == "getFrontPage") {
    server.getFrontPage(window.posServerClick, window.error);
  } else if (action == "getCategory") {
    //server.getCategory(params, posServerClick, error);
  } else if (action == "getDescription") {
    server.getDescription(
      (resp) => {
        window.setScene(new SceneDetails(resp, currentScene));
      },
      window.error,
      fpath[2]
    );
  } else if (action == "getLinks") {
    server.getLinks(
      (linkList) => {
        let best = getPreferer(linkList);
        let mask = (value) => {
          let secondMask = (value) => {
            if (window.appSettings["selected_player"] === "external" || window.appSettings["selected_player"] === "internal"){
                let vdata = value["video"].split("|||");
                let videoSrc = vdata[0];
                let isHls = vdata[0].indexOf(".m3u") != -1; 

                
                if (window.appSettings["cache"][0] && !isHls) {
                  if (videoSrc.indexOf("file/") !== -1) {
                    videoSrc = videoSrc.replace("file/", "cache/");
                  } else {
                    videoSrc = window.serverHost + "cache/" + enc(videoSrc);
                  }
                }
              let op = "view/";
              if(window.appSettings["selected_player"] === "internal"){
                op = "play/"
              }
              fetch(window.serverHost + op + window.enc(videoSrc))
                .then((response) => response.text())
                .then((result) => {
                  if (result.trim() != "ok") {
                    window.error(
                      "Error al abrir reproductor externo: \n" + result
                    );
                  }
                });
              return;
            }
            window.setScene(new ScenePlayer(value, best, currentScene));
          };
          if (window.appSettings["res_select"][0]) {
            window.generateSelectorDialog(
              (key, data) => {
                value["video"] = key;
                secondMask(value);
              },
              "Selecciona la resolución preferida",
              value
            );
          } else {
            secondMask(value);
          }
        };
        let tryOtherOnError = (errorMessage) => {
          if (best.length > 1) {
            best.shift();
            getDDL(mask, tryOtherOnError, best[0]);
          } else {
            window.error(errorMessage);
          }
        };
        if (best.length > 0) {
          if (window.appSettings["vsource_select"][0]) {
            let names = {};
            best.forEach((link) => (names[getName(link)] = link));
            window.generateSelectorDialog(
              (key, data) => {
                best.splice(best.indexOf(key), 1);
                best.unshift(key);
                getDDL(mask, tryOtherOnError, best[0]);
              },
              "Elige el servidor de video preferido",
              names
            );
            return;
          }
          getDDL(mask, tryOtherOnError, best[0]);
        } else {
          window.error("No supported servers");
        }
      },
      window.error,
      fpath[2]
    );
  } else if (action == "search") {
    let term = document.getElementsByClassName("search__text")[0].value;
    server.getSearch(window.posSearch, window.error, term);
  }
};

window.generateSelectorDialog = (
  postAction,
  title = "Elige una opcion",
  options = {}
) => {
  if (Object.keys(options).length <= 1) {
    //si hay solo una opcion se ejecuta directamente
    let key = Object.keys(options)[0];
    postAction(options[key], key);
    return;
  }

  dialog = true;
  document.__selectPrekeydown = document.onkeydown;
  var div = document.createElement("div");
  let content =
    `<div class="option-selector">
                    <div class="option-selector-title">` +
    title +
    `</div>
                    <div class="option-selector-list">`;
  let id = 0;
  for (var key in options) {
    content +=
      '<div class="option-selector-list-item" id="os_' +
      id +
      '" data-info="' +
      window.enc(options[key]) +
      '">' +
      key +
      "</div>";
    id++;
  }
  content +=
    '</div><div class="option-selector-cancel" id="os_' +
    id +
    '"> Cancelar</div></div>';
  div.innerHTML = content;
  let lOSelected = div.getElementsByClassName("option-selector-list-item")[0];
  lOSelected.classList.add("selected");
  document.body.appendChild(div);
  let list = document.getElementsByClassName("option-selector-list")[0];
  document.__optionsDiv = div;
  document.onkeydown = (event) => {
    let cidx = parseInt(lOSelected.id.split("_")[1]);
    if (event.key === 'ArrowUp') {
      //up arrow
      if (cidx > 0) {
        cidx--;
        lOSelected.classList.remove("selected");
        lOSelected = document.getElementById("os_" + cidx);
        list.scrollTop = lOSelected.offsetTop - list.offsetTop;
        lOSelected.classList.add("selected");
      }
    } else if (event.key === 'ArrowDown') {
      //down arrow
      if (!lOSelected.classList.contains("option-selector-cancel")) {
        cidx++;
        lOSelected.classList.remove("selected");
        lOSelected = document.getElementById("os_" + cidx);
        list.scrollTop = lOSelected.offsetTop - list.offsetTop;
        lOSelected.classList.add("selected");
      }
    } else if (event.key === "Enter" || event.key === "Space" || event.key === "NumpadEnter" ) {
      document.body.removeChild(document.__optionsDiv);
      document.onkeydown = document.__selectPrekeydown;
      document.__selectPrekeydown = null;
      dialog = false;
      window.unlockKeyboard();
      if (!lOSelected.classList.contains("option-selector-cancel")) {
        postAction(
          window.dec(lOSelected.dataset["info"]),
          lOSelected.innerHTML
        );
      }
    }
  };
};

window.error = (error_message) => {
  alert(error_message);
  window.unsetLoading();
  //TODO: Error
  //loading.style.visibility = 'hidden';
};

window.requestFullScreen = function (elem) {
  try {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullScreen) {
      elem.webkitRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  } catch (err) {} //ignore
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

window.indexOfProperty = function (array, property, value) {
  return array
    .map(function (x) {
      return x[property];
    })
    .indexOf(value);
};

window.getFirstMatch = function (regex, str) {
  var m = regex.exec(str);
  if (m == null) {
    return "";
  }
  return m[1];
};

window.getAllMatches = function (regex, str) {
  return [...str.matchAll(regex)];
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

function loadResumes() {
  window.resumes = JSON.parse(window.getStorageDefault("resumes", "{}"));
  Object.keys(window.resumes).forEach((key) => {
    if (window.resumes[key] == "Sin sinopsis por el momento") {
      delete window.resume[key];
    }
  });
}

function loadSettings() {
  let settings = {
    lockfronpage: [false, "Bloquear pagina principal."],
    fullscreen: [
        true,
        "Iniciar video en pantalla completa. (si el navegador no lo bloquea).",
      ],   
    autoplay: [
        true,
        "Reproducir automaticamente al abrir video.",
      ],
    res_select: [
      false,
      "Dejarme elegir la resolución antes de abrir el video.",
    ],
    vsource_select: [
      false,
      "Dejarme elegir el servidor de video antes de abrir el video.",
    ],
    cache: [
      false,
      "Usar cache de video en disco (solo pc/firefx, necesita espacio disponible en disco)",
    ],
    /*useBlob: [
      false,
      "Usar cache blob (usa mucha memoria y hay que esperar la carga, pero despues no se corta)",
    ],*/
    "--tint-color": null,
    modo_tv: true,
    selected_player: "html"
  };
  let storedSettings = null;
  try {
    storedSettings = JSON.parse(localStorage.getItem("settings"));
  } catch (e) {}
  if (storedSettings == null) {
    //first time no changes
    storedSettings = settings;
  } else if (
    Object.keys(storedSettings).length != Object.keys(settings).length
  ) {
    //need to update settings
    let newSettings = {};
    Object.keys(settings).forEach((key) => {
      if (key in storedSettings) {
        newSettings[key] = storedSettings[key];
      } else {
        newSettings[key] = settings[key];
      }
    });
    storedSettings = newSettings;
  }
  storedSettings["modo_tv"] = window.getStorageDefault("modo_tv", "true");
  window.appSettings = storedSettings;
}

window.saveFavorites = () => {
  if (window.favorites != null) {
    localStorage.setItem("favorites", JSON.stringify(window.favorites));
  } else {
    window.favorites = [];
  }
};

window.getSettingsDefault = (key, defaultValue) => {
  if (key in Object.keys(window.appSettings)) {
    return window.appSettings[key];
  }
  return defaultValue;
};
