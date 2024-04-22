import { getSourceList } from "../../js/sources/sources.js";
import { testPlayer } from "./video.js";

window.drawerState = true;
window.searchState = true;

let homeButton = null;
let searchButton = null;
let sourceButton = null;
let settingsButton = null;
let drawerButton = null;
let backButton = null;

let drawer = null;
let header = null;

let mainPanel = null;
let sourcePanel = null;
let detailsPanel = null;
window.settingsPanel = null;
let playerPanel = null;
let optionsDialog = null;
let loadPanel = null;
let searchInput = null;

let lastSelectedButton = null;
let backActionsPile = [];

document.addEventListener("DOMContentLoaded", () => {
  homeButton = document.getElementById("homeButton");
  searchButton = document.getElementById("search_menu");
  sourceButton = document.getElementById("sourceButton");
  settingsButton = document.getElementById("settingsButton");
  drawerButton = document.getElementById("drawer_menu");
  backButton = document.getElementById("back_button");

  drawer = document.getElementById("drawer");
  header = document.getElementsByClassName("site_name")[0];

  mainPanel = document.getElementById("main_content");
  sourcePanel = document.getElementById("select_source");
  detailsPanel = document.getElementById("details");
  settingsPanel = document.getElementById("settings");
  playerPanel = document.getElementById("player");
  loadPanel = document.getElementById("load_animation");

  optionsDialog = document.getElementById("options_menu");

  searchInput = document.getElementById("search_input");

  drawerButton.addEventListener("click", drawerSwitch);
  document.getElementById("drawer_icon_open").addEventListener("click", drawerSwitch);
  searchButton.addEventListener("click", searchSwitch);
  sourceButton.addEventListener("click", () => {
    drawerSwitch();
    let slist = getSourceList();
    showOptionsDialog("Selecciona un origen", slist, slist, (nValue) => {
      localStorage.setItem("lastServer", nValue);
      localStorage.setItem("lastServerName", nValue);
      location.reload();
    }, ()=>{} ,window.sid);
  });
  homeButton.addEventListener("click", stateHome);
  settingsButton.addEventListener("click", stateSettings);
  backButton.addEventListener("click", window.onBackClick);

  searchInput.addEventListener("keypress", (evt) =>{
    switch(evt.key){
      case "Enter":
      case "NumpadEnter":
      case "Go":
        if(searchInput.value.length > 2) window.searchInServer(searchInput.value);
      break;
    }
  });
  
  lastSelectedButton = homeButton;    
  window.loadHome(() => {hideLoading()});
});

window.showLoading = ()=>{
  loadPanel.classList.remove("hide");
}

window.hideLoading = ()=>{
  loadPanel.classList.add("hide");
}

window.onBackClick = () => {
  let action = backActionsPile.pop();
  if (action) action();
  if(backActionsPile.length == 0){
    hide(backButton);
    show(drawerButton);
    show(searchButton);
  }
}

window.setHeader = (title) => {
  header.innerText = title;
};

window.getHeader = () =>{
  return header.innerText;
}

window.hide = (el, disapear = true) => {
  el.classList.add("hide");
  if(disapear){
    setTimeout(() => {
      el.classList.add("undysplay");
    }, 1000);
  }
};

window.show = (el) => {
  el.classList.remove("undysplay");
  el.classList.remove("hide");
};

let changeSelected = (newSelected) => {
  lastSelectedButton.classList.remove("selected");
  lastSelectedButton = newSelected;
  lastSelectedButton.classList.add("selected");
};

window.drawerSwitch = () => {
  if (window.drawerState) {
    drawer.classList.remove("drawer_hide");
    document
      .getElementById("drawer_back_filler")
      .classList.remove("drawer_hide");
  } else {
    drawer.classList.add("drawer_hide");
    document.getElementById("drawer_back_filler").classList.add("drawer_hide");
  }
  window.drawerState = !window.drawerState;
};

let searchSwitch = (newState = !window.searchState) => {
  if (newState == window.searchState) {
    return;
  }
  if (window.searchState) {
    backActionsPile.push(()=>{
      searchSwitch();
    });
    show(backButton);
    document.getElementById("search").classList.remove("hide");
    document.getElementById("header").classList.add("search_state");
    setTimeout(() => {mainPanel.classList.add('undysplay')}, 500);
  } else {
    hide(backButton);
    backActionsPile = [];
    mainPanel.classList.remove('undysplay');
    document.getElementById("search").classList.add("hide");
    document.getElementById("header").classList.remove("search_state");
  }
  window.searchState = !window.searchState;
  if (window.searchState) {
    setTimeout(() => {
      /*TODO clean search*/
    }, 3000);
  } else {
  }
};


let stateHome = () => {
  changeSelected(homeButton);
  drawerSwitch();
  show(searchButton);
  hide(detailsPanel);
  hide(settingsPanel);
  window.setHeader(window.sid);
};

let stateSettings = () => {
  changeSelected(settingsButton);
  drawerSwitch();
  hide(searchButton, false);
  hide(detailsPanel);
  window.generateSettings();
  let lastHeader = window.getHeader();
  show(settingsPanel);
  setHeader("Configuración");
  window.addBackAction(() => {
    hide(settingsPanel);
    setHeader(lastHeader);
  })
};

window.addBackAction = (nBAction) => {
  backActionsPile.push(nBAction);
  show(backButton);
}

window.stateDetails = (data, search = false) => {
  hide(searchButton, false);
  hide(drawerButton, false);
  window.setHeader(data.name);
  let innerHTML = '<article class="details_info">';
  innerHTML += '<img src="' + data.image + '"></img><div class="info">'
  for(let t1 in data.items){
    innerHTML += data.items[t1] + '</br>';
  }
  innerHTML += '</div></article><ul>';
  for(let c in data.chapters){
      innerHTML += `<li><div onClick="{onHomeItemClick(this)}" data-path="${data.chapters[c].path}">` +  data.chapters[c].name + '</div></li>';
  }
  innerHTML += '</ul>';
  detailsPanel.innerHTML = innerHTML;
  let pHeader = window.getHeader();
  window.addBackAction(()=>{
    hide(detailsPanel);
    window.setHeader(pHeader);
  });
  show(detailsPanel);
  window.hideLoading();
};


window.showOptionsDialog = (
  title,
  options,
  values,
  onSelect,
  onCancel = console.log,
  defaultValue = 0
) => {
  /*clean and populate new option*/
  let optionsUl = document.getElementsByClassName("options_box")[0];
  window.lastDialogOnSelect = (value) => {
    optionsDialog.classList.add("hide");
    onSelect(value);
  };

  let innerHTML = '<div class="options_title"><div>' + title + '</div></div><ul id="options_list" class="options_list">';
  let selected = "";
  for (let i = 0; i < options.length; i++) {
    if(values[i] == defaultValue){
      selected = "class='selected'";
    }else{
      selected = "";
    }
    innerHTML +=
      "<li " + selected + " onclick=\"{window.lastDialogOnSelect('" +
      values[i] +
      "')}\"><div>" +
      options[i] +
      "</div></li>";
  }
  optionsUl.innerHTML = innerHTML + '</ul><div class="options_cancel"><div>Cancelar</div></div>';
  optionsDialog.classList.remove("hide");
  let cancelButton = document.getElementsByClassName("options_cancel")[0];
  cancelButton.addEventListener("click", () => {
    optionsDialog.classList.add("hide");
    onCancel("cancel");
  });
};

window.showError = (errorMsg, duration = 1500) => {
  var errorDiv = document.createElement('div');
  errorDiv.classList.add("errorMsg");
  errorDiv.innerHTML = "<div>" + errorMsg + "</div>";
  document.body.appendChild(errorDiv);
  errorDiv.classList.add("show");
  setTimeout(()=>{
    errorDiv.classList.add("hideMsg");
    setTimeout(() => {
      document.body.removeChild(errorDiv);
    }, 1000);
  }, duration);
}