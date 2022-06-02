window.enc = function(e){
    return  btoa(e).replaceAll('/', '_');
}

window.dec = function(e){
    return atob(decodeURIComponent(e));
}

window.fGet = async function (url, header = {}) {
    var response = await fetch(window.serverHost + "get/" + enc(url) + "/" + enc(JSON.stringify(header)));
    if (response.status === 200) {
        return await response.text();
    }else{
        return "error " + response.status;
    }
}

window.fPost = async function (url, header, data) {

    var request = new XMLHttpRequest();
    request.open('GET', window.serverHost + "get/" + enc(url) + "/" + enc(JSON.stringify(header)) + "/" + enc(JSON.stringify(data)), false);  // `false` makes the request synchronous
    request.send(null);
    if (request.status === 200) {
        return request.responseText;
    }else{
        return "error " + request.status;
    }
}

window.fetchRedirectPost = async function (url, header) {

}

window.fetchRedirectGet = async function (url, header, data) {
    
}