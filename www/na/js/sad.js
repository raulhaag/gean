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
      lockfronpage: {type: "bool",currentValue: true, title: "Bloquear pagina principal."},
      fullscreen: {type: "bool",currentValue: true, title: "Iniciar video en pantalla completa. (si el navegador no lo bloquea)."},   
      autoplay: {type: "bool",currentValue: true, title: "Reproducir automaticamente al abrir video."},
      res_select: {type: "bool",currentValue: true, title: "Dejarme elegir la resolución antes de abrir el video."},
      vsource_select: {type: "bool",currentValue: true, title: "Dejarme elegir el servidor de video antes de abrir el video."},
      cache: {type: "bool", currentValue: true, title: "Usar cache de video en disco (solo pc/firefx, necesita espacio disponible en disco)"},
      "--tint-color": {type: "multi",currentValue: null, title: 'Color de resaltador', values: {"Red Orange<div class='color-square' style='background-color: #FF3F34;'></div>":"#FF3F34","Razzmatazz<div class='color-square' style='background-color: #E3256B;'></div>":"#E3256B","Dark Orchid<div class='color-square' style='background-color: #9932CC;'></div>":"#9932CC","Purple Heart<div class='color-square' style='background-color: #652DC1;'></div>":"#652DC1","Cerulean Blue<div class='color-square' style='background-color: #2A52BE;'></div>":"#2A52BE","Dodger Blue<div class='color-square' style='background-color: #1E90FF;'></div>":"#1E90FF","Cyan<div class='color-square' style='background-color: #00B7EB;'></div>":"#00B7EB","Gossamer<div class='color-square' style='background-color: #069B81;'></div>":"#069B81","Apple<div class='color-square' style='background-color: #4FA83D;'></div>":"#4FA83D","Dollar Bill<div class='color-square' style='background-color: #85BB65;'></div>":"#85BB65","Pear<div class='color-square' style='background-color: #D1E231;'></div>":"#D1E231","Mikado Yellow<div class='color-square' style='background-color: #FFC40C;'></div>":"#FFC40C","Orange<div class='color-square' style='background-color: #FB9902;'></div>":"#FB9902","Flamingo<div class='color-square' style='background-color: #F2552A;'></div>":"#F2552A","Roman Coffee<div class='color-square' style='background-color: #795D4C;'></div>":"#795D4C","Star Dust<div class='color-square' style='background-color: #9F9F9C;'></div>":"#9F9F9C","Smalt Blue<div class='color-square' style='background-color: #51808F;'></div>":"#51808F","Smoky Black<div class='color-square' style='background-color: #100C08;'></div>":"#100C08","Black Cat<div class='color-square' style='background-color: #413839;'></div>":"#413839","Midnight Blue<div class='color-square' style='background-color: #151B54;'></div>":"#151B54","Dark Slate Blue<div class='color-square' style='background-color: #483D8B;'></div>":"#483D8B","Antique Fuchsia<div class='color-square' style='background-color: #915c83;'></div>":"#915c83","Dark Slate Gray<div class='color-square' style='background-color: #336666;'></div>":"#336666"}},
      //modo_tv: {type: "bool", currentValue: false, title: "Modo TV (no activar en celular)."},
      selected_player:  {type: "multi", currentValue: "html", title: "Reproducto de video preferido", values:  {"html": "html", "videoJs": "videojs", "Plyr player": "plyr", "Integrado (solo android)": "internal", "Externo (solo android)": "external"}}
    };
    let storedSettings = null;
    try {
      storedSettings = JSON.parse(localStorage.getItem("settings_na"));
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
    let color = storedSettings["--tint-color"];
    if (color) {
      document.documentElement.style.setProperty("--tint-color", color.currentValue);
    }
  }

  let saveSetting = (newSettings) => {
    localStorage.setItem("settings_na", JSON.stringify(newSettings));
    let color = newSettings["--tint-color"];
    if (color) {
      document.documentElement.style.setProperty("--tint-color", color.currentValue);
    }
  }

  window.onBooleanSettingClick = (cont) => {
    window.appSettings[cont.id].currentValue = !window.appSettings[cont.id].currentValue;
    let setting = window.appSettings[cont.id];
    cont.innerHTML = '<div class="boolean_setting">' + setting.title + '</div><div class="state_preview ' + setting.currentValue + '"></div>'
    saveSetting(window.appSettings);
  }

  window.onMultiSettingClick = (cont) => {
    let setting = window.appSettings[cont.id];
    let keys = Object.keys(setting.values);
    let options = Object.values(setting.values);
    window.showOptionsDialog(
      setting.title,
      keys,      
      options,
      (value)=>{ 
        cont.childNodes[1].innerHTML = value;
        window.appSettings[cont.id].currentValue = value;
        saveSetting(window.appSettings);
      },
      console.log, 
      keys.indexOf(setting.currentValue));
  }


  window.generateSettings = () => {
    let settingsToShow = ["selected_player", "--tint-color", "lockfronpage", "fullscreen", "res_select", "vsource_select", "cache"]
    let innerHTML = "<ul>";
    for(let i = 0; i < settingsToShow.length; i++){
      //<li><div class="boolean_setting">Boolean settings </div><div class="state_preview false"></div></li>
      //<li><div class="multi_setting">Boolean settings </div><div class="value_preview">value 1</div></li>
      let setting = window.appSettings[settingsToShow[i]];
      if(setting.type === "bool"){
        innerHTML += '<li id="' + settingsToShow[i] + '" onClick="{onBooleanSettingClick(this)}"><div class="boolean_setting">' + setting.title + '</div><div class="state_preview ' + setting.currentValue + '"></div></li>'
      }else{
        innerHTML += '<li id="' + settingsToShow[i] + '" onClick="{onMultiSettingClick(this)}"><div class="multi_setting">' + setting.title + '</div><div class="value_preview">' + setting.currentValue + '</div></li>'
      }

    }
    innerHTML += "</ul>"
    window.settingsPanel.innerHTML = innerHTML;
  }
  
  window.saveFavorites = () => {
    if (window.favorites != null) {
      localStorage.setItem("favorites", JSON.stringify(window.favorites));
    } else {
      window.favorites = [];
    }
  };
  
  window.getSettingsDefault = (key, defaultValue) => {
    if (window.appSettings.hasOwnProperty(key)) {
      return window.appSettings[key].currentValue;
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
