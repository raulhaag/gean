import { Scene } from "./scene.js";
import { getName, getDDL } from "../js/vservers/vserver.js";

export class ScenePlayer extends Scene {
  increments = [5, 10, 15, 30, 30, 60, 300, 600];
  doublepress = false;
  timeoutdoublepress = 500;
  lastPressedKeyCode = -1;
  lastPressedTime = -1;
  doubleAccumulator = 0;
  maxDoubleAccumulator = 7;
  player = null;
  last = null;
  constructor(options, items, parent) {
    super(false);
    this.parent = parent;
    this.lastKeyManager = this.playerNav;
    this.options = options;
    this.items = items;
    this.videojs = appSettings["selected_player"] === "videojs";
    this.cache = appSettings["cache"][0];
    //this.useBlob = appSettings["useBlob"][0];
  }
  initBody() {
    let innerHtml = `<div class="player" id="player"><div class="player-container"><div class="player-options" tabindex="-1">`;
    let cc = 0;
    let sItems = {};
    let vdata = this.options["video"].split("|||");
    let vtype = "video/mp4";
    let videoSrc = vdata[0];
    if (vdata.length > 1) {
      vtype = vdata[1];
    } else if (this.cache) {
      if (videoSrc.indexOf("file/") !== -1) {
        videoSrc = videoSrc.replace("file/", "cache/");
      } else {
        videoSrc = window.serverHost + "cache/" + enc(videoSrc);
      }
    }
    if(this.useBlob){
        this.options["video"] = videoSrc;
        videoSrc = "";
    }
    if (Object.keys(this.options).length > 1) {
      let csl = "video";
      let keys = Object.keys(this.options);
      for (let i = 0; i < keys.length; i++) {
        if (this.options["video"] == this.options[keys[i]]) {
          csl = keys[i];
          break;
        }
      }
      innerHtml +=
        `<div class="player-option-title">Resolución</div>
                <div id="player-container_0_0" class="player-option-list"  data-options='` +
        JSON.stringify(this.options) +
        `'>` +
        csl +
        `</div>`;
      cc = 1;
    }
    for (let i = 0; i < this.items.length; i++) {
      sItems[getName(this.items[i])] = this.items[i];
    }
    innerHtml +=
      `<div  class="player-option-title">Video Server</div>
            <div id="player-container_0_` +
      cc +
      `" class="player-option-list" data-options='` +
      JSON.stringify(sItems) +
      `'>` +
      getName(this.items[0]) +
      `</div>
            </div><div class="player-video-container">
                    <video id="player-container_1_0" class="video-js" controls>
                    <source src="` +
      videoSrc +
      `" />
                    </video>
                </div>
            </div></div></div>`; //`"  type="` + vtype + `" />
    this._body = innerHtml;
  }
  initBindings() {
    /*if(Object.keys(this.options).length > 1 && res) {
            if(localStorage.getItem("resSelect") == "true"){
                generateSelectorDialog((selection, label) => {
                    options.video = selection;
                    openPlayer(options, items, false);
                },"Elige una resolución apropiada", options);
                return;
            }
        }/*/
    if (getStorageDefault("external_player", false)) {
      fetch(window.serverHost + "view/" + window.enc(options["video"]))
        .then((response) => response.text())
        .then((result) => {
          if (result.trim() != "ok") {
            error("Error al abrir reproductor externo: \n" + result);
          }
        });
      return;
    }
    if (this.videojs) {
      this.player = videojs("player-container_1_0", {
        autoplay: appSettings["autoplay"][0],
      });
    } else {
      this.player = document.getElementsByTagName("video")[0];
    }
    this.last = document.getElementsByTagName("video")[0];
    if (appSettings["fullscreen"][0]) this.goFullScreen();
    if (appSettings["autoplay"][0] && !this.videojs) {
      this.player.play();
    }
    /*if(this.useBlob){
        this.loadBlob();
    };*/
    changeKeyManager();
  }

  loadBlob() {
    const videoElement = document.getElementsByTagName("video")[0];

    // Crea una nueva instancia de XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open("GET", this.options["video"].split("|||")[0], true);
    xhr.responseType = 'blob';
    xhr.onload = function() {
        if (xhr.status === 200) {
          const videoBlob = xhr.response;
  
          // Crea una URL del objeto
          const videoUrl = URL.createObjectURL(videoBlob);
  
          // Asigna la URL del objeto como fuente del video
          videoElement.src = videoUrl;
        }
      };
  
      xhr.send();
  
  }

  playerNav(event) {
    if (event == null) {
      this.last.classList.add("selected");
      return;
    }
    this.doublepress =
      this.lastPressedKeyCode == event.keyCode &&
      new Date().getTime() - this.lastPressedTime - this.timeoutdoublepress < 0;
    this.lastPressedKeyCode = event.keyCode;
    this.lastPressedTime = new Date().getTime();
    if (this.doublepress) {
      this.doubleAccumulator += 1;
      this.doubleAccumulator = Math.min(
        this.maxDoubleAccumulator,
        this.doubleAccumulator
      );
    } else {
      this.doubleAccumulator = 0;
    }
    if (this.last.id.indexOf("1_0") !== -1) {
      switch (
        event.key //control player
      ) {
        case 'ArrowUp':
          if (this.isFullscreen()) {
            exitFullScreen();
          } else {
            if (this.itemExists(0, 0)) {
              this.last = this.getItem(0, 0);
              this.last.classList.add("selected");
            }
            tease_menu(true);
          }
          break;
        case 'ArrowDown':
          if (this.isFullscreen()) {
            this.switchPlayer();
          } else {
            this.switchPlayer();
            this.goFullScreen();
            this.switchPlayer();
          }
          break;
        case 'ArrowLeft':
          this.last.currentTime -= this.increments[this.doubleAccumulator];
          break;
        case 'ArrowRight':
          this.last.currentTime += this.increments[this.doubleAccumulator];
          break;
        case "Enter":
        case "NumpadEnter":
        case "Space":
        case " ":
          if (this.doublepress) {
            this.switchPlayer();
            this.goFullScreen();
            this.switchPlayer();
            return;
          }
          this.switchPlayer();
          break;
        default:
          break;
      }
    } else {
      let itempos = this.last.id.split("_");
      let cc = parseInt(itempos[itempos.length - 1]);
      let cr = parseInt(itempos[itempos.length - 2]);
      switch (
        event.key //control nav options
      ) {
        case 'ArrowUp':
          if (cr == 0) {
            //manageMenu(null);
            return;
          }
          let desph = cc;
          while (desph >= 0) {
            if (itemExists(cr - 1, desph)) {
              this.last.classList.remove("selected");
              this.last = getItem(cr - 1, desph);
              this.last.classList.add("selected");
              break;
            }
            desph--;
          }
          break;
        case 'ArrowDown':
          this.last.classList.remove("selected");
          this.last = document.getElementsByTagName("VIDEO")[0];
          break;
        case 'ArrowLeft':
          if (cc == 1) {
            tease_menu(true);
          }
          if (cc == 0) {
            this.last.classList.remove("selected");
            menuManager();
          } else {
            this.last.classList.remove("selected");
            this.last = this.getItem(cr, cc - 1);
            this.last.classList.add("selected");
          }
          break;
        case 'ArrowRight':
          if (this.itemExists(cr, cc + 1)) {
            this.last.classList.remove("selected");
            this.last = this.getItem(cr, cc + 1);
            this.last.classList.add("selected");
          }
          if (cc == 0) {
            tease_menu(false);
          }
          break;
        case "Enter":
        case "NumpadEnter":
        case "Space":
        case " ":
          let options = JSON.parse(this.last.dataset["options"]);
          if (options.hasOwnProperty("video")) {
            delete options.video;
            generateSelectorDialog(
              (value, tagName) => {
                this.last.innerHTML = tagName;
                document.getElementsByTagName("video")[0].src = value;
              },
              "Elige una resolución",
              options
            );
            return;
          }
          generateSelectorDialog(
            (selected) => {
              let best = [selected];
              var keys = Object.keys(options);
              keys.forEach(function (key) {
                if (options[key] != selected) {
                  best.push(options[key]);
                }
              });
              let mask = (value) => {
                setScene(new ScenePlayer(value, best, this.parent));
              };
              let tryOtherOnError = (errorMessage) => {
                if (best.length > 1) {
                  best.shift();
                  getDDL(mask, tryOtherOnError, best[0]);
                } else {
                  error(errorMessage);
                }
              };
              if (best.length > 0) {
                getDDL(mask, tryOtherOnError, best[0]);
              } else {
                error("No supported servers");
              }
            },
            "Aquí están tus opciones",
            options
          );
        default:
          break;
      }
    }
  }

  goFullScreen() {
    if (this.videojs) {
      this.player.requestFullscreen();
    } else {
      requestFullScreen(this.last);
    }
  }

  dispose() {
    let video = document.getElementsByTagName("VIDEO")[0];
    if (video) {
      video.pause();
      video.src = "";
      video.load();
    }
    if (this.videojs) this.player.dispose();
  }

  /* functions */
  getItem(row, column, prefix = "player-container") {
    let item = document.getElementById(prefix + "_" + row + "_" + column);
    return item;
  }

  itemExists(row, column, prefix = "player-container") {
    let item = document.getElementById(prefix + "_" + row + "_" + column);
    if (item != null) {
      return true;
    }
    return false;
  }

  switchPlayer() {
    if (this.videojs) {
      if (this.player.paused()) {
        this.player.play(true);
      } else {
        this.player.pause(true);
      }
    } else {
      if (this.player.paused) {
        this.player.play();
      } else {
        this.player.pause();
      }
    }
  }
  isFullscreen() {
    return !!document.fullscreenElement;
  }
}
