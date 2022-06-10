window.enc = function(e){
    return  btoa(e).replaceAll('/', '_');
}

window.dec = function(e){
    return atob(e.replaceAll('_', '/'));
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
    var response = await fetch(window.serverHost + "post/" + enc(url) + "/" + enc(JSON.stringify(header)) + "/" + enc(JSON.stringify(data)));  // `false` makes the request synchronous
    if (response.status === 200) {
        return await response.text();
    }else{
        return "error " + response.status;
    }
}

window.fetchRedirectPost = async function (url, header) {
    var response = await fetch(window.serverHost + "rget/" + enc(url) + "/" + enc(JSON.stringify(header)));
    if (response.status === 200) {
        return await response.text();
    }else{
        return "error " + response.status;
    }
}

window.fRGet = async function (url, header = {}) {
    var response = await fetch(window.serverHost + "rget/" + enc(url) + "/" + enc(JSON.stringify(header)));  // `false` makes the request synchronous
    if (response.status === 200) {
        return await response.text();
    }else{
        return "error " + response.status;
    }
}

window.singleMatch = function (regex, string) {
    var match = regex.exec(string);
    return match ? match[1] : null;
}