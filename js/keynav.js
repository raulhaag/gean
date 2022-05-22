
let lastPos = {};
let currentLastPos = "content";
let firstInit = false;
let container = null;


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