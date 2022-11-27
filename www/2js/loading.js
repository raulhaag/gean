window.loadingDiv = null;
let preloadingKeyManager = null;
let timeOutLoadingId = 0;
let keylock = (event) => {event.preventDefault();};

window.setLoading = () => {
    preloadingKeyManager = document.onkeydown;
    document.onkeydown = keylock;
    if(loadingDiv == null) {
        window.loadingDiv = document.createElement("div");
        loadingDiv.innerHTML = '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
        loadingDiv.classList.add("loading_container");
        document.body.append(loadingDiv);
    }else{
        clearTimeout(timeOutLoadingId);
    }
};

window.unsetLoading = () => {
    timeOutLoadingId = setTimeout(() => {
        if(document.onkeydown == keylock){window.onkeydown = preloadingKeyManager;};
        document.body.removeChild(window.loadingDiv);
        window.loadingDiv = null;
    }, 500);
};

