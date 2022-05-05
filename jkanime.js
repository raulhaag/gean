
export class JKAnime{

    constructor(){
        self.name = "jkanime";
    }
    getFrontPage(after){
        return new Promise((resolve, reject) => {
            fetch('http://127.0.0.1:8080/get/' + btoa("https://jkanime.net/"))
            .then((response) => response.text())
            .then((result) => {
                var parser = new DOMParser();
                var doc = parser.parseFromString(result, "text/html");
                let ncs = []
                let flis
                try {
                    flis = doc.querySelectorAll("body section.hero div.container div.row div.col-lg-4.pt-3 div.anime__sidebar__comment div.listadoanime-home div.maximoaltura a.bloqq");
                    for (var i = 0; i < flis.length; i++) {
                        let name = flis[i].getElementsByTagName("h5")[0].textContent + " - " + flis[i].getElementsByTagName("h6")[0].textContent.replace(/\s+/mg, " ").trim();
                        ncs.push({"name": name, "image": flis[i].getElementsByTagName("img")[0].getAttribute("src"), "path": flis[i].getAttribute("href")});
                    }
                } catch (error) {
                    console.error(error);
                }
                let nas = []
                try {
                    flis = doc.querySelectorAll("html body section.contenido.spad div.container div.row div.col-lg-8 div.trending__anime div.row div.col-lg-3.col-md-6.col-sm-6 div.anime__item");
                    for (var i = 0; i < flis.length; i++) {
                        let name = flis[i].getElementsByTagName("h5")[0].textContent.trim();
                        nas.push({"name": name, "image": flis[i].getElementsByTagName("div")[0].getAttribute("data-setbg"), "path": flis[i].getAttribute("href")});
                    }
                } catch (error) {
                    console.error(error);
                }
                let etc = []
                try {
                    flis = doc.querySelectorAll("html body section.hero div.container div.row div.col-lg-8 div.solopc div.row div.col-lg-3.col-md-6.col-sm-6.col-6 div.anime__item");
                    for (var i = 0; i < flis.length; i++) {
                        let name = flis[i].getElementsByTagName("h5")[0].textContent.trim() + " - " + flis[i].getElementsByTagName("li")[0].textContent.replace(/\s+/mg, " ").trim();
                        etc.push({"name": name, "image": flis[i].getElementsByTagName("div")[0].getAttribute("data-setbg"), "path": flis[i].getAttribute("href")});
                    }
                } catch (error) {
                    console.error(error);
                }
                after({"Últimos Capítulos": ncs, "Últimos animes": nas, "Ovas, Películas, etc.": etc});
            })
    })}
    getInfo(path, page = 0){
        let name = "";
    }

    getList(page, query= "", filter = ""){
    }

    getLink(path){
        return new Promise((resolve, reject) => {
            fetch(path)
            .then((response) => response.text())
            .then((result) => {
            }
        )})}
}