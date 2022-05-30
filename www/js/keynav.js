
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

function manageMenu(keyCode){
    if(ssmenucapture){
        serverSelectMenu(keyCode);
        return;
    }
    if(keyCode == null){
        menucapture = true;
        lastPos[currentLastPos].classList.remove("focus");
        if(document.getElementById("back_button").style.display != "block"){
           lastMenu = document.getElementById("select_server");
        }else{
            lastMenu = document.getElementById("back_button");
        }
        lastMenu.classList.add("mfocus");
    }else if(keyCode == 40){
        //down
        menucapture = false;
        lastMenu.classList.remove("mfocus");
        arrowNav(null);
    }else if(keyCode == 37){
        //left
        let aindex = menubuttons.indexOf(lastMenu.id);
        if(aindex > 0){
            if(aindex == 1 && document.getElementById("back_button").style.display != "block"){
                return;
            }
            let desp = 1;
            if(aindex == 4 && document.getElementById("more_button").style.display != "block"){
                desp = 3;
            }
            lastMenu.classList.remove("mfocus");
            lastMenu = document.getElementById(menubuttons[aindex - desp]);
            lastMenu.classList.add("mfocus");
        }
    }else if(keyCode == 39){
        //right
        let aindex = menubuttons.indexOf(lastMenu.id);
        if(aindex < menubuttons.length - 1){
            let desp = 1;
            if(aindex == 1 && document.getElementById("more_button").style.display != "block"){
                desp = 3;
            }
            lastMenu.classList.remove("mfocus");
            lastMenu = document.getElementById(menubuttons[aindex + desp]);
            lastMenu.classList.add("mfocus");
        }
    }else if (keyCode == '13') {
        // enter
        var clickEvent = new MouseEvent("click", {
            "view": window,
            "bubbles": true,
            "cancelable": false
        });
        lastMenu.dispatchEvent(clickEvent);
        let aindex = menubuttons.indexOf(lastMenu.id);
        if(aindex == 1){
            ssmenucapture = true;
            serverSelectMenu(null);
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
    }else if(keyCode == 40){
        //down
        let aindex = serverList.indexOf(lastServerSelected);
        if(aindex < serverList.length - 1){
            lastServerSelected.classList.remove("mfocus");
            lastServerSelected = serverList[aindex + 1];
            lastServerSelected.classList.add("mfocus");
        }
    }else if(keyCode == 38){
        //up
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
    }else if (keyCode == '13') {
        // enter
        lastServerSelected.classList.remove("mfocus");
            var clickEvent = new MouseEvent("click", {
                "view": window,
                "bubbles": true,
                "cancelable": false
            });
            lastServerSelected.dispatchEvent(clickEvent);
            ssmenucapture = false;
    }
}


export function updatePositions(containerCN = "content"){
    currentLastPos = containerCN;
    container = document.getElementsByClassName(containerCN)[0];
    let items = container.getElementsByClassName("focusable");//focusable next??
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

export function arrowNav(e){
    if(menucapture && e != null){
        e.preventDefault();
        manageMenu((e || window.event).keyCode);
        return;
    }
    if(window.backStack.length > 0){
        if(currentLastPos != window.backStack.at(-1).classList[0]){
            updatePositions(window.backStack.at(-1).classList[0]);
        }
    }else{
        if(!firstInit || e == null){
            updatePositions();
            firstInit = true;
        }
        currentLastPos = "content";
    }
    if (e == null){
        container.scrollTop = lastPos[currentLastPos].offsetTop - 70;
        lastPos[currentLastPos].classList.add("focus");
        return;
    }
    e = e || window.event;
    if(lastPos[currentLastPos] != null){
        let itempos = lastPos[currentLastPos].id.split("_");
        let cc = parseInt(itempos.at(-1));
        let cr = parseInt(itempos.at(-2));
        let newpos = null;
        if (e.keyCode == '38') {
            // up arrow
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
                manageMenu(null);
            }
        }
        else if (e.keyCode == '40') {
            // down arrow
            let desph = cc;
            while(desph >= 0){
                if(itemExists((cr + 1), desph)){
                    newpos = currentLastPos + "_" + (cr + 1) + "_" + desph;
                    break;
                }
                desph--;
            }
        }
        else if (e.keyCode == '37') {
        // left arrow
            if(cc >= 1){
                newpos = currentLastPos + "_" + cr + "_" + (cc - 1);
            }else{
                if(currentLastPos != "video_placeholder"){
                    manageMenu(null);
                }
            }
        }
        else if (e.keyCode == '39') {
        // right arrow
            if(itemExists(cr, (cc + 1))){
                newpos = currentLastPos + "_" + cr + "_" + (cc + 1);
            }
        }
        else if (e.keyCode == '13') {
        // enter
            var clickEvent = new MouseEvent("click", {
                "view": window,
                "bubbles": true,
                "cancelable": false
            });
            lastPos[currentLastPos].dispatchEvent(clickEvent);
        }
        try{
            if(newpos != null){
                let nselect = document.getElementById(newpos);
                lastPos[currentLastPos].classList.remove("focus");
                nselect.classList.add("focus");
                lastPos[currentLastPos] = nselect;
                container.scrollTop = nselect.offsetTop - 70;
            }
        }catch{
            //position not found
        }
    }else{
        lastPos[currentLastPos] = document.getElementById(currentLastPos + "_0_0");
        lastPos[currentLastPos].classList.add("focus");
        container.scrollTop = lastPos[currentLastPos].offsetTop - 70;
    }
}

let itemExists = function(row, column){
    let item = document.getElementById(currentLastPos + "_" + row + "_" + column);
    if(item != null){
        return true;
    }
    return false;
}