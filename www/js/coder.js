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
    let out =`
          <h5 class="mt-3">${title}</h5>
          <div class="row text-center  g-3" id="anime-list">
      `;
      for (let i = 0; i < items.length; i++) {
        if(items[i]['image']){
          out += `
              <div class="col-6 col-md-4 col-lg-3 col-xl-2" onclick="{mediaClick(self, \'${items[i]["path"] + "/" + items[i]["name"]}')}">
                <div class="card text-bg-dark" style="width:100%; aspect-ratio:0.65;">
                  <img src="${items[i]["image"]}" alt="Image 1" class="card-img" style="width:100%; aspect-ratio:0.65; object-fit: cover;">
                  <div class="card-img-overlay" style="display:flex; align-items:flex-end; backgroud-color='#FFF9'">
                    <p class="card-text" style="text-shadow: 0px 0px 5px black, 0px 0px 2px black ;">${items[i]["name"]}</p>
                  </div>
                </div>
              </div>
          `
        }else{
           out +=    `<div class="col-6 col-md-4 col-lg-3 col-xl-2" onclick="{mediaClick(self, \'${items[i]["path"]}')}">
                <div class="card text-bg-dark chapter-button" style="width:100%">
                  <h4 class="card-title text-truncate pt-3 pb-2 px-1">${items[i]["name"]}</h4>
                </div>
              </div>`;
        }
      }
      return out + "</div>";
  };

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
  let result = `
      <div class="container text-centered">
      <div class="row g-3 rounded-2">
          <div class="col-12 col-md-3 col-xl-2">
            <img class="img-fluid" style="width:100%"
            src="${options["image"]}" alt="${options["name"]}" />
          </div>
            <div class="col-12 col-md-9 col-xl-10 ps-md-3">
              <div class=""><h2 class="focusable">${options["name"]}</h2></div>`
  for (let i = 0; i < options["items"].length; i++) {
    result += `<div class="mt-3">${options["items"][i]}</div>`;
  }
  let idx = indexOfProperty(favorites, "path", options.path);
  if (idx > -1) {
    result +=
      '<Button class="container-fluid mt-3 p-2" onclick="{switch_fab(this, \'' +
      options["name"] +
      "', '" +
      options["image"] +
      "','" +
      options["path"] +
      "')}\">Quitar de favoritos</Button>";
  } else {
    result +=
      '<Button class="container-fluid mt-3 p-2" onclick="{switch_fab(this, \'' +
      options["name"] +
      "', '" +
      options["image"] +
      "','" +
      options["path"] +
      "')}\">Agregar a favoritos</Button>";
  }

  result +=   `
            </div>
          </div>
          
    <div id="chapters" class="row text-center g-3 gx-2 my-3">`
    for (let i = 0; i < options["chapters"].length; i++) {
    if (vieweds.indexOf(options["chapters"][i]["path"]) == -1) {
      result +=
        '<div class="col-6 col-md-4 col-xl-3 "><div class="p-3 card chapter-button" onclick="{markViewed(this,\'' +
        options["path"] +
        "', '" +
        options["chapters"][i]["path"] +
        "') ;mediaClick(self, '" +
        options["chapters"][i]["path"] + "/" + options["chapters"][i]["name"] +
        "')}\">" +
        options["chapters"][i]["name"] +
        "</div></div>";
    } else {
      result +=
        '<div class=" col-6 col-md-4 col-xl-3 "><div class="p-3 card chapter-button viewed" onclick="{mediaClick(this, \'' +
        options["chapters"][i]["path"] +
        "')}\">" +
        options["chapters"][i]["name"] +
        "</div></div>";
    }
  }
  result +=  `</div></div>`;
  return result;
}

export function getPlayer(options, items = [], videoSrc, subtitles = "", title='', selected_server= 'Servidor') {
  window.last_players_options = {options: options, items:items, videoSrc: videoSrc, subtitles:subtitles, title:title};
  
  let rv = `<div class="row">
        <h5 class="align-content-center col-12 col-md-7">${title}</h5>
        <div class="dropdown-group d-flex align-content-end align-items-end col-12 col-md-5" >
          <div class="dropdown ms-auto me-3"> 
          <a class="btn btn-secondary dropdown-toggle" style="width: 120px;" href="#" id="dropdown-server-select" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              ${selected_server}
          </a>          
          <ul class="dropdown-menu">`;
  items.forEach((item) => {
    rv += `<li><a class="dropdown-item" href="#">${getName(item)}</a></li>`;
  });

  let quality_list = '', selected_quality;
  Object.keys(options).forEach((item) => {
    quality_list += `<li><a class="dropdown-item" href="#" data-src="${options[item]}" data-name="${item}" onclick="{changeSrcRes(this)}">${item}</a></li>`;
    if(options[item].indexOf(videoSrc) != -1){
      selected_quality = item
    }
  });
  rv += `
            </ul>
          </div>
          <div class="dropdown">
            <a class="btn btn-secondary dropdown-toggle" style="width: 120px;" href="#" id="dropdown-quality-select" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                ${selected_quality}  
            </a>
            <ul class="dropdown-menu">
                ${quality_list}
            </ul>
          </div>
        </div>
      </div>
    </div>
      <div class="mt-3 h-auto">
        <video
          id="video_placeholder_2_0 m-3"
          style="max-height: calc(100vh - 130px);"
          class="w-100 videoview"
          controls="controls"
          autoplay="autoplay"
        >
          <source
            type="video/mp4"
            src="${videoSrc}"
          />`;
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
  rv += `        </video>
      </div>
    </div>`;
  return rv;
}

export function getSettings() {
  /*
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="switchCheckChecked" checked>
          <label class="form-check-label" for="switchCheckChecked">Checked switch checkbox input</label>
        </div>
  */


  let options = {
    lockfronpage: "Bloquear pagina principal",
    fullscreen: "Iniciar video en pantalla completa",
    autoplay: "Autoplay de video",
    vserSelect: "Seleccionar servidor antes de reproducir.",
    resSelect: "Selección de resolución manual",
    external_player: "Usar reproductor externo(Solo Android)",
    internal_player: "Usar reproductor integrado (Solo Android/ recomendado, bloquea opcion externo)",
    cache: "Usar cache de video en disco (solo pc/firefx o última version de la app), necesita espacio disponible en disco)",
    modotv: "Modo pensado para tv (usa cursores para navegar y enter/ no tactil)",
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
  ];
  let result = '';
  let aval = false;
  var i = 0;
  let extra = "";
  for (var key in options) {
    aval = localStorage.getItem(key);
    if (aval == null) {
      aval = defv[i];
    }
    if (aval == "true") {
      extra = " checked";
    } else {
      extra = "";
    }
    result += `
        <div class="form-check form-switch mb-3">
          <input class="form-check-input" type="checkbox" role="switch" id="${key}"${extra} onclick="{toggleOption(this)}">
          <label class="form-check-label" for="${key}">${options[key]}</label>
        </div>
    `;
    i++;
  }
  return result;
}
