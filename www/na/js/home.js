import { getSource } from "../../../js/sources/sources.js";
import { playVideo } from "./video.js";



async function fillVideosWithNews(onFinnish = null){
    try {
        const endFunction = (videos) => {fillVideos(videos); if(onFinnish) onFinnish();};
        getSource(window.sid).getFrontPage(endFunction, window.showError);
    } catch (error) {
        window.showError(error);
    } 

}

window.updateFavorites = async() => {
    if (window.favorites != null) {
        localStorage.setItem("favorites", JSON.stringify(window.favorites));
    } else {
        window.favorites = [];
    }
    if(favorites.length > 0){
        let favlist = document.getElementById("favorites");
        favlist.innerHTML = generateCategory("Favoritos", window.favorites);
    }
}

window.switch_fab = function(fav, item) {
    let path = fav["path"];
    let name = fav["name"];
    let image = fav["image"];
    let idx = indexOfProperty(favorites, 'path', path);
    if(idx > -1){
        favorites.splice(idx, 1);
        item.src = "./na/icons/no_fav.svg";
    }else{
        favorites.unshift({'name': name, 'image': image, 'path': path});
        item.src = "./na/icons/fav.svg";
    }
    updateFavorites();
  }

async function updateRecents(){
    if (window.recent != null){
        if(window.recent > 30){
            recent =  recent.slice(0, 30);
        }
        localStorage.setItem('recent', JSON.stringify(window.recent));
        if(recent.length > 0){
            let recCont = document.getElementById("recent");
            if(recCont){
                recCont.innerHTML = generateCategory("Recientes", window.recent);
        
            }
        }
    }else{
        recent = [];
    }
    
}

window.loadHome = (onFinnish = null) => {
    window.showLoading();
    if(!window.getSettingsDefault("lockfronpage", true)){
        fillVideosWithNews(onFinnish)
    }else{
        fillVideos({});
        if(onFinnish){
            onFinnish();
        }
    }
}

let generateCategory = (title, items) =>{
    let icon =   document.getElementById("main_content").classList.contains("list")? "./na/icons/show_as_grid.svg":"./na/icons/show_as_list.svg"

    if(items == null) return "";
    let result = '<div class="content_group"><div class="content_group_title">' + title + `<img class= "sicon" src="${icon}" onClick="{switchListToGrid();}"></div> <div class="content_group_items">`;
    let ppath = "";
    for (let i = 0; i < items.length; i++) {
        if(items[i]["parentPath"]){
            ppath = '" data-ppath="' + items[i]["parentPath"];
        }else{
            ppath = '';
        }
        result += '<div class="content_item" onClick="{window.onHomeItemClick(this);}" data-name="' + items[i]["name"] + '" data-image="' + items[i]["image"] + '" data-path="' + items[i]["path"] + ppath +'"><img class="item__image" src="' + items[i]['image'] + '" alt="">  <div class="content_item_title">' + items[i]['name'] + '</div></div>';
    }
    return result + '</div>';
};


async function getDescription(path){
    try{
        await getSource(path[0]).getDescription((data) => {
                    window.stateDetails(data);
                }, window.showError, path[2]);
        window.hideLoading();
    }catch(e){
        window.showError(e);
    }
}

async function getLinks(item){
    try{
        await playVideo(item.innerText, item.dataset.path);
    }catch(e){
        window.showError(e);
    }

}

window.markViewed = function (e, spath, path) {
    let vc = [];
    try {
      vc = JSON.parse(localStorage.getItem(spath));
      if (vc == null) {
        vc = [];
      }
    } catch (error) {}
    if (vc.indexOf(path) == -1) {
      if (e != null) {
        e.classList.add("viewed");
      }
      vc.push(path);
      localStorage.setItem(spath, JSON.stringify(vc));
    }
  };
  
let add_recent = function(item) {
    let idx = indexOfProperty(recent, 'path', item.path);
    let update = true;
    if(idx > -1){
        recent.splice(idx, 1);
        update = false;
    }
    recent.unshift(item);
    if(update){
        updateRecents();
    }
}


window.onHomeItemClick = (item) => {   
    window.showLoading();
    let path = item.dataset.path.split("/");
    if(path[1].includes("getDescription")){
        getDescription(path)
    }else if(path[1].includes("getLinks")){
        getLinks(item);

        let fpath = item.dataset.path.split('/');
        let ppf = function(item){
            add_recent(item);
            updateRecents();
        };
        let idx = indexOfProperty(recent, 'path', item.dataset.path);
        if("ppath" in item.dataset)
            idx = indexOfProperty(recent, 'path', item.dataset.ppath);
        if(idx == -1){
                setTimeout(() => {
                    getSource(fpath[0]).getParent(ppf, fpath[2]);
                }, 5000);
        }else{
            let item2 = recent[idx];
            recent.splice(idx ,1);
            recent.unshift(item2);
            if("ppath" in item.dataset){
                markViewed(null, item.dataset.ppath, item.dataset.path);
                updateRecents();
            }
        }
        
    }
}

let fillVideos = (videos)=>{
    let videoContent = "";
    let titles = Object.keys(videos);
    for (var i = 0; i < titles.length; i++) {
        videoContent += generateCategory(titles[i], videos[titles[i]]);
    }
    if(window.favorites.length > 0){
        videoContent += '<div id="favorites">' + generateCategory("Favoritos", window.favorites) + '</div>';
    }
    if(window.recent.length > 0) {
        videoContent +=   '<div id="recent">' + generateCategory("Recientes", window.recent)  + '</div>';
    };
    document.getElementById("main_content").innerHTML= "<div class=\"content_groups\">" + videoContent + "</div>";
    window.hideLoading();
};

window.searchInServer = (term) => {
    let sRCont = document.getElementsByClassName("search_results")[0];
    sRCont.innerHTML = "";
    window.showLoading()
    getSource(window.sid).getSearch((items) => {
        /*
        <article class="search_result">
          <img src="img/testImg.jpg"/>
          <div class="search_result_title">
            Titulo A
          </div>
        </article>*/
        let sRData = "";
        for(let i = 0; i < items.length; i++){
            sRData += '<article class="search_result"  onClick="{window.onHomeItemClick(this);}" data-name="' + items[i]["name"] +
                '" data-image="' + items[i]["image"] + 
                '" data-path="' + items[i]["path"] + 
                '"><img src="' + items[i]["image"] + 
                '"/><div class="search_result_title">' + items[i]["name"] +"</div></article>"
        }
        sRCont.innerHTML = sRData;
        window.hideLoading()
    }, window.showError, term)
}