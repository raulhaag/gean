import { getSource } from "../../../js/sources/sources.js";

window.loadHome = (onFinnish = null) => {
    if(!window.appSettings["lockfronpage"][0]){
       getSource(window.sid).getFrontPage(fillVideos, console.log);
    }else{
        this.fillVideos({});
    }
    if(onFinnish){
        onFinnish();
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



window.onHomeItemClick = (item) => {
    if(item.dataset.path.includes("/getDescription/")){
        window.showLoading();
        getSource(window.sid).getDescription((data) => {
            window.stateDetails(data)
            window.hideLoading();
        }, console.log, item.dataset.path );
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
};