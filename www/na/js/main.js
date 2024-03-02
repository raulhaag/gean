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
let settingsPanel = null;
let playerPanel = null;
let optionsDialog = null;
let loadPanel = null;

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

  drawerButton.addEventListener("click", drawerSwitch);
  document.getElementById("drawer_icon_open").addEventListener("click", drawerSwitch);
  searchButton.addEventListener("click", searchSwitch);
  sourceButton.addEventListener("click", stateChangeSource);
  homeButton.addEventListener("click", stateHome);
  settingsButton.addEventListener("click", stateSettings);
  backButton.addEventListener("click", onBackClick);
  
  lastSelectedButton = homeButton;
  window.loadHome(() => {hide(loadPanel, false)});
});

window.showLoading = ()=>{
  show(loadPanel);
}

window.hideLoading = ()=>{
  hide(loadPanel);
}

let onBackClick = () => {
  let action = backActionsPile.pop();
  if (action) action();
  if(backActionsPile.length == 0){
    hide(backButton);
    show(drawerButton);
    show(searchButton);
  }
}

let setHeader = (title) => {
  header.innerText = title;
};

let hide = (el, disapear = true) => {
  el.classList.add("hide");
  if(disapear){
    setTimeout(() => {
      el.classList.add("undysplay");
    }, 1000);
  }
};

let show = (el) => {
  el.classList.remove("undysplay");
  el.classList.remove("hide");
};

let changeSelected = (newSelected) => {
  lastSelectedButton.classList.remove("selected");
  lastSelectedButton = newSelected;
  lastSelectedButton.classList.add("selected");
};

let drawerSwitch = () => {
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
    document.getElementById("search").classList.remove("hide");
    document.getElementById("header").classList.add("search_state");
    setTimeout(() => {main_content.classList.add('undysplay')}, 500);
  } else {
    main_content.classList.remove('undysplay');
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

let stateChangeSource = () => {
  changeSelected(sourceButton);
  drawerSwitch();
  searchSwitch(true);
  hide(searchButton, false);
  hide(settingsPanel);
  hide(detailsPanel);
  hide(settingsPanel);
  setHeader("Selecciona un origen");
  show(sourcePanel);
};

let stateHome = () => {
  changeSelected(homeButton);
  drawerSwitch();
  show(searchButton);
  hide(settingsPanel);
  hide(detailsPanel);
  hide(settingsPanel);
  hide(sourcePanel);
  setHeader("Serrvidor n");
};

let stateSettings = () => {
  changeSelected(settingsButton);
  drawerSwitch();
  hide(searchButton, false);
  hide(detailsPanel);
  hide(sourcePanel);
  show(settingsPanel);
  setHeader("Configuración");
  /*showOptionsDialog(
    "Elige una opción",
    [
      "opcion 1",
      "opcion 1",
      "opcion 3",
      "opcion 4",
      "opcion 1",
      "opcion 1",
      "opcion 3",
      "opcion 4",
    ],
    ["1", "2", "3", "4", "1", "2", "3", "4"],
    alert
  );*/
};


window.stateDetails = (data, search = false) => {
  hide(searchButton, false);
  hide(drawerButton, false);
  setHeader(data.name);
  let innerHTML = '<article class="details_info">';
  innerHTML += '<img src="' + data.image + '"></img><div class="info">'
  for(let t1 in data.items){
    innerHTML += data.items[t1] + '</br>';
  }
  innerHTML += '</div></article><ul>';
  for(let c in data.chapters){
      innerHTML += '<li><div>' +  data.chapters[c].name + '</div></li>';
  }
  innerHTML += '</ul>';
  detailsPanel.innerHTML = innerHTML;
  backActionsPile.push(()=>{
    hide(detailsPanel);
  });
  show(backButton);
  show(detailsPanel);
};


let showOptionsDialog = (
  title,
  options,
  values,
  onSelect,
  onCancel = console.log
) => {
  /*clean and populate new option*/
  let optionsUl = document.getElementById("options_list");
  window.lastDialogOnSelect = (value) => {
    optionsDialog.classList.add("hide");
    onSelect(value);
  };

  let newLis = "";
  for (let i = 0; i < options.length; i++) {
    newLis +=
      "<li onclick=\"{window.lastDialogOnSelect('" +
      values[i] +
      "')}\"><div>" +
      options[i] +
      "</div></li>";
  }
  optionsUl.innerHTML = newLis;
  optionsDialog.classList.remove("hide");
  let cancelButton = document.getElementsByClassName("options_cancel")[0];
  cancelButton.addEventListener("click", () => {
    optionsDialog.classList.add("hide");
    onCancel("cancel");
  });
};
