// settings and data
import {getSource} from '../../js/sources/sources.js'

window.getSource = getSource;

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


// init sad 
loadSettings();
let lastServer = localStorage.getItem("lastServer");
let lastServerName = localStorage.getItem("lastServerName");
if (lastServer != null && lastServerName != null) {
  window.sid = lastServer;
  window.sn = lastServerName;
} else {
  window.sid = "jkanime";
  window.sn = "JkAnime";
}

try {
    window.favorites = JSON.parse(window.getStorageDefault("favorites", "[]"));
} catch (e) {
  window.favorites = []
}
try {
    window.recent = JSON.parse(window.getStorageDefault("recent"), "[]");
} catch (e) {
  window.recent = [];
}
