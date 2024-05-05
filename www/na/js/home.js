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
    if(items == null) return "";
    let result = '<div class="content_group"><div class="content_group_title">' + title + '</div> <div class="content_group_items">';
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

window.onHomeItemClick = (item) => {   
    window.showLoading();
    let path = item.dataset.path.split("/");
    if(path[1].includes("getDescription")){
        getDescription(path)
    }else if(path[1].includes("getLinks")){
        getLinks(item);
    }
}

let fillVideos = (videos)=>{
    let videoContent = "";
    let titles = Object.keys(videos);
    for (var i = 0; i < titles.length; i++) {
        videoContent += generateCategory(titles[i], videos[titles[i]]);
    }
    if(window.favorites.length > 0){
        videoContent += generateCategory("Favoritos", window.favorites);
    }
    if(window.recent.length > 0) {
        videoContent +=  generateCategory("Recientes", window.recent);
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