function openInNewTab(url) {
    window.open(url, '_blank').focus();
   }

   class JKAnime{
    constructor(){}
    getFrontPage(){
        return new Promise((resolve, reject) => {
            fetch('http://127.0.0.1:8080/get/' + btoa("https://jkanime.net/"))
            .then((response) => response.text())
            .then((result) => {
                var parser = new DOMParser();
                var doc = parser.parseFromString(result, "text/html");
                flis = doc.getElementsByTagName(".bloqq");
                console.log(flis);
            })
    })}
}