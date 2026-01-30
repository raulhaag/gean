import{Scene} from "./scene.js";
import {getResponse, getSource} from '../js/sources/sources.js';

export class SceneHome extends Scene{
    info = {title: null, resume:null, play:null, image:null};
    container = null;
    inigap = 0
    items_gap = 80
    last = {video:null, chapter:null};
    chapter = null;
    home = null;
    more = null;
    constructor(more = null){
        super(true);
        this.more = more;
        //this.lastKeyManager = this.video_nav;
    }
    initBody(){
        this._body = `<div class="home" id="home">
        <div class="info">
            <div class="info-collum">
                <div class="info-title"></div>
                <div class="info-data"></div>
            </div>
            <div class="info-image-ph">
                <img class="info-image" onerror="this.src='images/black.jpg'" src="images/black.jpg">
                <div class="info-image-overlap"></div>
            </div>
        </div>
            <div class="videos" id="videos">
                <div class="initial-gap"></div>
            </div>
        </div>`
    };

    initBindings(){
        this.chapter = document.getElementById('chapters');
        this.home = document.getElementById("home");
        this.info.title = document.getElementsByClassName("info-title")[0];
        this.info.resume = document.getElementsByClassName("info-data")[0];
        this.info.image = document.getElementsByClassName("info-image")[0];
        this.inigap = document.getElementsByClassName("initial-gap")[0].offsetHeight;
        this.initHome();
    };

    body(){
        if(this._body == null){this.initBody();}
        return this._body;
    }

    lastKeyManager(){return this.lastKeyManager;}

    clear(){
        lastSelection = null;
    }

    initHome = (reload = true) => {
        this.lastKeyManager = this.videos_nav
        changeKeyManager();
        if(this.more){
            this.fillVideos(this.more);
            return
        }
        if(!window.appSettings["lockfronpage"][0]){
            if(reload) getResponse(sid, this.fillVideos, error);
        }else{
            this.fillVideos({});
        }
    }

    fillVideos = (videos)=>{
        let videoContent = "";
        let titles = Object.keys(videos);
        for (var i = 0; i < titles.length; i++) {
            videoContent += this.generateCategory(titles[i], videos[titles[i]]);
        }
        if(favorites.length > 0){
            videoContent += ("<div id='favlist'>" + this.generateCategory("Favoritos", favorites) + "</div>")
        }else{
            videoContent += "<div id='favlist'></div>";
        }
        if((recent.length > 0) && (!window.appSettings["srecent"][0])) {videoContent += ("<div id='reclist'>" + this.generateCategory("Recientes", recent) + "</div>")
        }else{
            videoContent += "<div id='reclist'></div>";
        };
        document.getElementsByClassName("videos")[0].innerHTML= "<div class='initial-gap'></div>" + videoContent + "<div class='initial-gap'></div>";
        this.updatePositions("videos");
        hideLoading();
        changeKeyManager();
    };

    setNewVideoSelected = (newselection) => {
        this.last.video.classList.remove("focus");
        this.last.video = newselection;
        this.last.video.classList.add("focus");
        this.loadData();
    }

    videos_nav = function(event){
        if(event == null){
            if(this.last.video == null){
                tease_menu(true)
                menuManager();
                return;
            }
            this.last.video.classList.add("focus");
            this.last.video.parentElement.parentElement.classList.remove("demitransparent");
            tease_menu(this.last.video.id.endsWith("_0"));
            this.last.video.parentNode.scrollLeft = this.last.video.offsetLeft - this.items_gap - 10;
            document.getElementsByClassName("videos")[0].scrollTop = this.last.video.parentElement.offsetTop - this.inigap - 32;
            return;
        }
        let key = event.key;
        if(this.last.video == null && key === 'ArrowLeft'){
            tease_menu(true);
            manageMenu()
            this.last.video.classList.remove("focus");
            return;
        }
        let itempos = this.last.video.id.split("_").reverse();
        let cc = parseInt(itempos[0]);
        let cr = parseInt(itempos[1]);
        let newselection;
        switch(key){
            case 'ArrowUp':
                newselection = document.getElementById("videos_" + (cr - 1) + "_0");
                if(newselection){
                    newselection = document.getElementById("videos_" + (cr - 1) + "_"  + newselection.parentElement.getAttribute("value"));
                    this.last.video.parentElement.parentElement.classList.add("demitransparent");
                    this.setNewVideoSelected(newselection);
                    this.last.video.parentNode.scrollLeft = newselection.offsetLeft - this.items_gap - 10;
                    document.getElementsByClassName("videos")[0].scrollTop = this.last.video.parentElement.offsetTop - this.inigap - 32;
                    this.last.video.parentElement.parentElement.classList.remove("transparent");
                    this.last.video.parentElement.parentElement.classList.remove("demitransparent");
                }
                break;

            case 'ArrowDown':
                newselection = document.getElementById("videos_" + (cr + 1) + "_0");
                if(newselection){
                    newselection = document.getElementById("videos_" + (cr + 1) + "_"  + newselection.parentElement.getAttribute("value"));
                    this.last.video.parentElement.parentElement.classList.add("transparent");
                    this.setNewVideoSelected(newselection);
                    document.getElementsByClassName("videos")[0].scrollTop = this.last.video.parentElement.offsetTop - this.inigap - 32;
                    this.last.video.parentNode.scrollLeft = newselection.offsetLeft - this.items_gap - 10;
                    this.last.video.parentElement.parentElement.classList.remove("demitransparent");
                }
                break;

            case 'ArrowRight':
                newselection = document.getElementById("videos_" + cr + "_" + (cc + 1));
                if(newselection){
                    this.last.video.parentNode.scrollLeft = newselection.offsetLeft - this.items_gap - 10;
                    this.setNewVideoSelected(newselection);
                    newselection.parentElement.setAttribute("value", cc + 1);
                }
                break;

            case 'ArrowLeft':
                newselection = document.getElementById("videos_" + cr + "_" + (cc - 1));
                if(newselection){
                    this.last.video.parentNode.scrollLeft = newselection.offsetLeft - this.items_gap - 10;
                    this.setNewVideoSelected(newselection);
                    newselection.parentElement.setAttribute("value",  cc - 1);
                }
                if(cc === 0){
                    this.last.video.classList.remove("focus");
                    menuManager();
                }
                break;
            case "Enter":
            case "NumpadEnter":
            case "Space":
            case " ":
                showLoading();
                let node = document.getElementsByClassName('info-capitulos')[0];
                if(node != null){
                    document.getElementById("home").removeChild(node);
                }
                this.last.video.classList.remove("focus");
                window.currentChapter = this.last.video.innerText;
                route(this.last.video.dataset.path, this.last.video.dataset.ppath)
                let fpath = this.last.video.dataset.path.split('/');
                let server = getSource(fpath[0]);
                let instance = this;
                let ppf = function(item){
                    instance.add_recent(item);
                    if("ppath" in instance.last.video.dataset)
                        markViewed(null, instance.last.video.dataset.ppath, instance.last.video.dataset.path);
                };
                let idx = indexOfProperty(recent, 'path', this.last.video.dataset.path);
                if("ppath" in instance.last.video.dataset)
                    idx = indexOfProperty(recent, 'path', this.last.video.dataset.ppath);
                if(idx == -1){
                        setTimeout(() => {
                            lockKeys = false;
                            server.getParent(ppf, fpath[2]);
                        }, 5000);
                }else{
                    let item = recent[idx];
                    instance.add_recent(item);

                    if("ppath" in instance.last.video.dataset)
                        markViewed(null, this.last.video.dataset.ppath, this.last.video.dataset.path);
                    if(this.last.video.parentElement.parentElement.outerText.startsWith("Recientes")){
                        newselection = document.getElementById("videos_" + (cr) + "_0");
                        if(newselection){
                            this.setNewVideoSelected(newselection);
                            document.getElementsByClassName("videos")[0].scrollTop = this.last.video.parentElement.offsetTop - this.inigap - 32;
                            this.last.video.parentNode.scrollLeft = newselection.offsetLeft - this.items_gap - 10;
                            this.last.video.parentElement.parentElement.classList.remove("demitransparent");
                        }
                    }
                }
                break;
            default:
                return;
        }
        if(this.last.video.id.endsWith("_0")){
            tease_menu(true);
        }else{
            tease_menu(false);
        }
    };

    setNewVideoSelected(newselection){
        this.last.video.classList.remove("focus");
        this.last.video = newselection;
        this.last.video.classList.add("focus");
        this.loadData();
    };

    updatePositions = function (containerCN = "content", className = "focusable"){
        this.container = document.getElementsByClassName(containerCN)[0];
        let items = this.container.getElementsByClassName(className);//focusable next??
        if (items.length == 0) return
        let ctop = items[0].parentNode.offsetTop;
        let rc = 0, cc = 0;
        for(let i = 0; i < items.length; i++){
            if(items[i].parentNode.offsetTop != ctop){
                ctop = items[i].parentNode.offsetTop;
                rc++;
                cc = 0;
            }
            items[i].id = containerCN + "_" + rc + "_" + cc;
            cc++;
        }
        if(this.last.video == null){
            this.last.video = document.getElementById(containerCN + "_" + 0 + "_" + 0);
        }
        this.last.video.classList.add("focus");
        this.last.video.parentNode.parentNode.classList.remove("demitransparent");
        this.setNewVideoSelected(this.last.video);
    };

    loadData = () => {
        this.info.title.innerHTML = this.last.video.dataset.name;

        this.info.image.src = this.last.video.dataset.image != 'undefined' ? this.last.video.dataset.image : "/images/black.jpg"
        this.info.resume.innerHTML = "";
        //TODO
        //setLoadingInfo();
        if("resume" in this.last.video.dataset){
            this.info.resume.innerHTML = this.last.video.dataset.resume;
            return;
        }

        if(this.last.video.dataset.path.indexOf("getLinks") == -1) {
            this.setResume(this.last.video.dataset.path);
        }else if("ppath" in this.last.video.dataset){
            this.setResume(this.last.video.dataset.ppath);
        }
        //unsetLoadingInfo();
    };
    getMore = async(server, from, title) => {
        window.showLoading();
        server.getMore((more)=>{
            this.fillVideos(more);
            let isPrefered = (id) => {
                let nf = document.getElementById(id);
                if (nf && (nf.dataset.path.indexOf("getMore") == -1)){
                    return nf;
                }
                return undefined;
            }
            let prefered = isPrefered("videos_0_0");
            if(prefered === undefined){
                prefered = isPrefered("videos_0_1");
            }
            if(prefered === undefined){
                prefered = isPrefered("videos_0_2");
            }
            if(prefered === undefined){
                prefered = document.getElementById("videos_0_0");
            }
            if(prefered){
                this.setNewVideoSelected(prefered);
            }
        }, error, from);
    }

    setSerieInfo = (info) => {
        this.info.title.innerHTML = info.name;
        this.info.image.src = info.image != 'undefined' ? info.image : "/images/black.jpg"
    };

    generateCategories(options) {
        let result = "";
        let titles = Object.keys(options);
        for (var i = 0; i < titles.length; i++) {
            result += generateCategory(titles[i], options[titles[i]]);
        }
        return result;
    };

    generateCategory(title, items) {
        if(items == null) return "";
        let result = '<div class="items demitransparent"><h2 class="items__title">' + title + '</h2><div class="items__list" value="0"><div class="item_gap"></div>';
        let extradata = "";
        let extraClass = "";
        for (let i = 0; i < items.length; i++) {
            extradata = (items[i]["parentPath"])? '" data-ppath="' + items[i]["parentPath"]: '';
            extradata += (items[i]["resume"])? '" data-resume="' + (items[i]["resume"].replace(/"/g, "&quot;")): '';
            extraClass =  ((items[i].image == undefined) && (items[i].path.indexOf("/getMore/") != -1))? " more": "";
            result += `<div class="item focusable${extraClass}" data-name="${items[i]["name"]}" data-image="${items[i]["image"]}" data-path="${items[i]["path"] + extradata}"><img class="item__image" loading="lazy" src="${items[i]['image']}" alt=""> <h2 class="item__title">${items[i]['name']}</h2></div>`;
        }
        return result + '</div></div>';
    };

    setResume(seriePath, pg = false){
        if(seriePath.indexOf("/getMore")!= -1){
            return;
        }
        if(resumes[seriePath]){
            if(seriePath == this.last.video.dataset.path || seriePath == this.last.video.dataset.ppath){
                this.info.resume.innerHTML = resumes[seriePath];
            }
        }else{
            if(pg){
                return;
            }
            if(seriePath == this.last.video.dataset.path){
                this.info.resume.innerHTML =  "Obteniendo sinopsis.";
            }
            let pgerr = (info) => {
                resumes[seriePath] = "Sin sinopsis por el momento";
                this.saveResumes();
                this.setResume(seriePath, true);
            };
            let pgr = (info) => {
                resumes[seriePath] = info.items[0];
                this.saveResumes();
                this.setResume(seriePath, true);
            };
            let fpath = seriePath.split('/');
            let server = getSource(fpath[0]);
            window.lockKeys = false;
            server.getDescription(pgr, console.log, fpath[2]);
        }
    };

    saveResumes(){
        localStorage.setItem('resumes', JSON.stringify(resumes));
    };

    add_recent = function(item) {
        let idx = indexOfProperty(recent, 'path', item.path);
        if(idx > -1){
            recent.splice(idx, 1);
        }
        recent.unshift(item);
        this.updateRecents();
    }

    updateAndTryToKeepPos = () =>{
        let itempos = this.last.video.id.split('_').reverse();
        let cc = parseInt(itempos[0]);//column
        let cr = parseInt(itempos[1]);//line
        this.updatePositions("videos");
        let selection = document.getElementById("video_" + cr + "_" + cc);
        if(selection == null){
            if(cc == 0){
                selection = document.getElementById("video_" + cr - 1 + "_" + cc);
            }else{
                selection = document.getElementById("video_" + cr - 1 + "_" + cc);
            }
        }
        if(selection){
            this.last.video.classList.remove("focus");
            this.last.video = selection;
            this.last.video.classList.add("focus");
        }
        this.last.video.parentNode.scrollLeft = this.last.video.offsetLeft - this.items_gap - 10;
        document.getElementsByClassName("videos")[0].scrollTop = this.last.video.parentElement.offsetTop - this.inigap - 32;
    }

    updateFavorites = function(){
        saveFavorites();
        if(favorites.length > 0){
            let favlist = document.getElementById("favlist");
            favlist.innerHTML = this.generateCategory("Favoritos", favorites);
        }
        this.updateAndTryToKeepPos();
    }

    updateRecents = function(){
        if (recent != null){
            if(recent.length > 50){
                recent =  recent.slice(0, 50);
            }
            localStorage.setItem('recent', JSON.stringify(recent));
            if(recent.length > 0){
                let reclis = document.getElementById("reclist");
                reclis.innerHTML = this.generateCategory("Recientes", recent);
            }
        }else{
            recent = [];
        }
        this.updateAndTryToKeepPos();
    }
}