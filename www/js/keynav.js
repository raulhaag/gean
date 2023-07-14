const left = 37; const up = 38; const right = 39; const down = 40; const enter = 13;
let nav_keys = [left, right, down, enter, up];
let lastPos = {};
let currentLastPos = "content";
let firstInit = false;
let container = null;
let menucapture = false;
let lastMenu = null;
let menubuttons = [
    "back_button",
    "select_server",
    "search_button",
    "more_button",
    "settings_button",
    "shutdown_button"
];
let ssmenucapture = false;
let lastServerSelected = null;
let serverList = [];
let contPool = [];

const increments = [5, 10, 15, 30, 30, 60, 300, 600]
let doublepress = false;
const timeoutdoublepress = 500;
let lastPressedKeyCode = -1;
let lastPressedTime = -1;
let doubleAccumulator = 0;
let player = null;
const maxDoubleAccumulator = 7;


function manageMenu(keyCode){
    if(ssmenucapture){
        serverSelectMenu(keyCode);
        return;
    }
    if(keyCode == null){
        menucapture = true;
        if(lastPos[currentLastPos] != null){
            lastPos[currentLastPos].classList.remove("focus");
        }
        if(document.getElementById("back_button").style.display != "block"){
           lastMenu = document.getElementById("select_server");
        }else{
            lastMenu = document.getElementById("back_button");
        }
        lastMenu.classList.add("mfocus");
    }else if(keyCode == down){
        menucapture = false;
        lastMenu.classList.remove("mfocus");
        arrowNav(null);
    }else if(keyCode == left){
        let aindex = menubuttons.indexOf(lastMenu.id);
        if(document.getElementById("back_button").style.display != "block"){
            if(aindex > 1){
                lastMenu.classList.remove("mfocus");
                lastMenu = document.getElementById(menubuttons[aindex - 1]);
                lastMenu.classList.add("mfocus");
            }
        }else{
            if(aindex != 0){
                lastMenu.classList.remove("mfocus");
                lastMenu = document.getElementById("back_button");
                lastMenu.classList.add("mfocus");
            }
        }
    }else if(keyCode == right){
        let aindex = menubuttons.indexOf(lastMenu.id);
        if(document.getElementById("back_button").style.display != "block"){
            if(aindex < menubuttons.length - 1){
                lastMenu.classList.remove("mfocus");
                lastMenu = document.getElementById(menubuttons[aindex + 1]);
                lastMenu.classList.add("mfocus");
            }
        }else{
            if(aindex != menubuttons.length - 1){
                lastMenu.classList.remove("mfocus");
                lastMenu = document.getElementById("shutdown_button");
                lastMenu.classList.add("mfocus");
            }
        }
    }else if (keyCode == enter) {
        clickOn(lastMenu);
        if(lastMenu.id == "select_server"){
            ssmenucapture = true;
            serverSelectMenu(null);
        }else{
            lastMenu.classList.remove("mfocus");
            menucapture = false;
            lastMenu = null;
        }
    }
}

function serverSelectMenu(keyCode){
    if(keyCode == null){
        if(serverList.length == 0){
            let server = document.getElementsByClassName("menu__server__item");
            for(let i = 0; i < server.length; i++){
                serverList.push(server[i]);
            }
            lastServerSelected = server[0];
        }
        lastServerSelected.classList.add("mfocus");
    }else if(keyCode == down){
        let aindex = serverList.indexOf(lastServerSelected);
        if(aindex < serverList.length - 1){
            lastServerSelected.classList.remove("mfocus");
            lastServerSelected = serverList[aindex + 1];
            lastServerSelected.classList.add("mfocus");
        }
    }else if(keyCode == up){
        let aindex = serverList.indexOf(lastServerSelected);
        if(aindex == 0){
            lastServerSelected.classList.remove("mfocus");
            document.getElementById("server__select__menu").style.display = "none";
            ssmenucapture = false;
        }else if(aindex >= 1){
            lastServerSelected.classList.remove("mfocus");
            lastServerSelected = serverList[aindex - 1];
            lastServerSelected.classList.add("mfocus");
        }
    }else if (keyCode == enter) {
        lastServerSelected.classList.remove("mfocus");
            clickOn(lastServerSelected);
            ssmenucapture = false;
    }
}

export function updatePositions(containerCN = "content"){
    if(containerCN == null){
        if(contPool.length > 1){
            contPool.pop();
            containerCN = contPool[contPool.length-1];
        }else{
            containerCN = "content";
        }
    }else{
        if(contPool.indexOf(containerCN) != -1){
            contPool.splice(contPool.indexOf(containerCN), 1);
        }
        contPool.push(containerCN);
    }
    currentLastPos = containerCN;
    container = document.getElementsByClassName(containerCN)[0];
    let items = container.getElementsByClassName("focusable");//focusable next??
    if(items[0]){
        let ctop = items[0].offsetTop;
        let rc = 0, cc = 0;
        for(let i = 0; i < items.length; i++){
            if(items[i].offsetTop != ctop){
                ctop = items[i].offsetTop;
                rc++;
                cc = 0;
            }
            items[i].id = currentLastPos + "_" + rc + "_" + cc;
            cc++;
        }
    }
}

export function arrowNav(e){
    if (e == null){
        container.scrollTop = lastPos[currentLastPos].offsetTop - 70;
        lastPos[currentLastPos].classList.add("focus");
        return;
    }
    e.preventDefault();
    if(menucapture && e != null){
        manageMenu((e || window.event).keyCode);
        return;
    }
    if(!(nav_keys.includes(e.keyCode))){
        return;
    }
    if(window.backStack.length > 0){
        if(currentLastPos != window.backStack[backStack.length - 1].classList[0]){
            updatePositions(window.backStack[backStack.length - 1].classList[0]);
        }
    }else{
        if(!firstInit || e == null){
            updatePositions();
            firstInit = true;
        }
        currentLastPos = "content";
    }

    e = e || window.event;
    if(currentLastPos === "video_placeholder"){
       videoNav(e);
       return;
    }else if(lastPos[currentLastPos] != null){
        let itempos = lastPos[currentLastPos].id.split("_");
        let cc = parseInt(itempos[itempos.length-1]);
        let cr = parseInt(itempos[itempos.length-2]);
        let newpos = null;
        if (e.keyCode == up) {
            if(cr >= 1){
                let desph = cc;
                while(desph >= 0){
                    if(itemExists((cr - 1), desph)){
                        newpos = currentLastPos + "_" + (cr - 1) + "_" + desph;
                        break;
                    }
                    desph--;
                }
            }else{
                e.preventDefault();
                manageMenu(null);
            }
        }
        else if (e.keyCode == down) {
            let desph = cc;
            while(desph >= 0){
                if(itemExists((cr + 1), desph)){
                    newpos = currentLastPos + "_" + (cr + 1) + "_" + desph;
                    break;
                }
                desph--;
            }
        }
        else if (e.keyCode == left) {
            if(cc >= 1){
                newpos = currentLastPos + "_" + cr + "_" + (cc - 1);
            }else{
                if(currentLastPos != "video_placeholder"){
                    manageMenu(null);
                }
            }
        }
        else if (e.keyCode == right) {
            if(itemExists(cr, (cc + 1))){
                newpos = currentLastPos + "_" + cr + "_" + (cc + 1);
            }
        }
        else if (e.keyCode == enter) {
            clickOn(lastPos[currentLastPos]);
        }
        try{
            if(newpos != null){
                let nselect = document.getElementById(newpos);
                lastPos[currentLastPos].classList.remove("focus");
                lastPos[currentLastPos] = nselect;
                container.scrollTop = nselect.offsetTop - 70;
                nselect.parentElement.scrollLeft = nselect.offsetLeft - nselect.parentElement.offsetLeft- nselect.parentElement.offsetWidth  / 3 + nselect.offsetWidth;
                nselect.classList.add("focus");
                e.preventDefault();
            }
        }catch{
            //position not found
        }
    }else{
        lastPos[currentLastPos] = document.getElementById(currentLastPos + "_0_0");
        if(currentLastPos == "video_placeholder"){
            try{lastPos[currentLastPos].classList.remove("focus");}catch(e){}
            lastPos[currentLastPos] = document.getElementsByTagName("video")[0];
            videoId = lastPos[currentLastPos].id; 
        }else{
            if(lastPos[currentLastPos]){
                lastPos[currentLastPos].classList.add("focus");
                container.scrollTop = lastPos[currentLastPos].offsetTop - 70;
            }
        }
    }
}

let videoNav = (event) => {
    event.preventDefault();
    event.stopPropagation();
    doublepress = (lastPressedKeyCode == event.keyCode && 
                  (new Date().getTime() - lastPressedTime - timeoutdoublepress) < 0);
    lastPressedKeyCode = event.keyCode;
    lastPressedTime = new Date().getTime();
    if (doublepress) {
        doubleAccumulator += 1;
        doubleAccumulator = Math.min(maxDoubleAccumulator, doubleAccumulator);
    }else{
        doubleAccumulator = 0;
    }

    if(lastPos[currentLastPos] == player){
        switch (event.keyCode) { //control player
            case up:
                if(isFullscreen()){
                    exitFullScreen();
                }else{
                    let itempos = lastPos[currentLastPos].id.split("_");
                    let cc = parseInt(itempos[itempos.length-1]);
                    let cr = parseInt(itempos[itempos.length-2]);
                    let newpos = null;
                    if(itemExists((cr-1),cc)){
                        lastPos[currentLastPos] = getItem(cr-1,cc);
                        lastPos[currentLastPos].classList.add("focus");
                    }
                }
                break;
            case down:
                if(isFullscreen()){
                    switchPlayer(player);
                }else{
                    switchPlayer(player)
                    requestFullScreen(player);
                    switchPlayer(player)
                }
                event.preventDefault();
                break;
            case left:
                player.currentTime -= increments[doubleAccumulator];
                break;
            case right:
                player.currentTime += increments[doubleAccumulator];
                break;
            case enter:
                if(doublepress){
                    switchPlayer(player);
                    requestFullScreen(player);
                    switchPlayer(player);
                    return;
                }
                switchPlayer(player)
                event.preventDefault();
                break;
            default:
                break;
        }
    }else{
        let itempos = lastPos[currentLastPos].id.split("_");
        let cc = parseInt(itempos[itempos.length-1]);
        let cr = parseInt(itempos[itempos.length-2]);
        switch (event.keyCode) { //control nav options
            case up:
                if(cr == 0){
                    manageMenu(null);
                    return;
                }
                let desph = cc;
                while(desph >= 0){
                    if(itemExists((cr - 1), desph)){
                        lastPos[currentLastPos].classList.remove("focus");
                        lastPos[currentLastPos] = getItem(cr-1, desph);
                        lastPos[currentLastPos].classList.add("focus");
                        break;
                    }
                    desph--;
                }
                break;
            case down:
                let desphd = cc;
                while(desphd >= 0){
                    if(itemExists((cr + 1), desphd)){
                        lastPos[currentLastPos].classList.remove("focus");
                        lastPos[currentLastPos] = getItem(cr + 1, desphd);
                        lastPos[currentLastPos].classList.add("focus");
                        break;
                    }
                    desphd--;
                }
                break;
            case left:
                if(cc == 0){
                    manageMenu(null);
                }else{
                    lastPos[currentLastPos].classList.remove("focus");
                    lastPos[currentLastPos] = getItem(cr, cc - 1);
                    lastPos[currentLastPos].classList.add("focus");
                }
                break;
            case right:
                if(itemExists(cr, cc + 1)){
                    lastPos[currentLastPos].classList.remove("focus");
                    lastPos[currentLastPos] = getItem(cr, cc + 1);
                    lastPos[currentLastPos].classList.add("focus");
                }
                break;
            case enter:
                clickOn(lastPos[currentLastPos]);  
            default:
                break;
        }
    }
};

export function initVideoNav() {
    updatePositions("video_placeholder");
    player = document.getElementsByTagName("video")[0];
    lastPos[currentLastPos] = player;
 //   document.onkeydown = videoNav;
};

let getItem = function(row, column){
    let item = document.getElementById(currentLastPos + "_" + row + "_" + column);
    return item;
}

let itemExists = function(row, column){
    let item = document.getElementById(currentLastPos + "_" + row + "_" + column);
    if(item != null){
        return true;
    }
    return false;
}

let clickOn = function(e) {
    var clickEvent = new MouseEvent("click", {
        "view": window,
        "bubbles": true,
        "cancelable": false
    });
    e.dispatchEvent(clickEvent);
}

let isFullscreen = () => !! document.fullscreenElement;

let switchPlayer = (vplayer) => {
    if(vplayer.paused){
        vplayer.play();
    }else{
        vplayer.pause();
    }
}

let showControls = function(e){
    var clickEvent = new MouseEvent("mousemove", {
        "view": window,
        "bubbles": true,
        "cancelable": false
    });
    e.dispatchEvent(clickEvent);
    var clickEvent = new MouseEvent("mouseover", {
        "view": window,
        "bubbles": true,
        "cancelable": false
    });
    e.dispatchEvent(clickEvent);
}
