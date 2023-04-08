window.enc = function(e){
    return  btoa(e).replace(/\//g, '_');
}

window.dec = function(e){
    return atob(e.replace(/_/g, '/'));
}

window.fGet = async function (url, header = {}, returnHeaders = false) {
    try{window.setLoading();}catch(e){};
    let data  = "", response = null;
    try{
        response = await fetch(window.serverHost + "get/" + enc(url) + "/" + enc(JSON.stringify(header)));
        if (response.status === 200) {
            data =  await response.text();
        }else{
            data = "error " + response.status;
        }
    }catch(e){
        try{window.unsetLoading();}catch(e2){};
        throw e;
    }
    try{window.unsetLoading();}catch(e){};
    if(returnHeaders){
        let rHeaders =  {};
        response.headers.forEach(function(val, key) {rHeaders[key] =val});
        return {body:data, headers : rHeaders};
    }
    return data;
}

window.fPost = async function (url, header, data) {
    try{window.setLoading();}catch(e){};
    var out = "";
    try{
        var response = await fetch(window.serverHost + "post/" + enc(url) + "/" + enc(JSON.stringify(header)) + "/" + enc(JSON.stringify(data)));  // `false` makes the request synchronous
        let   = "";
        if (response.status === 200) {
            out =  await response.text();
        }else{
            out = "error " + response.status;
        }
    }catch(e){
        try{window.unsetLoading();}catch(e2){}; 
        throw e;
    }
    try{window.unsetLoading();}catch(e){};
    return out;
}

window.fetchRedirectPost = async function (url, header) {
    try{window.setLoading();}catch(e){};
    let data  = "";
    try{
        var response = await fetch(window.serverHost + "rget/" + enc(url) + "/" + enc(JSON.stringify(header)));
        if (response.status === 200) {
            data =  await response.text();
        }else{
            data = "error " + response.status;
        }
    }catch(e){
        try{window.unsetLoading();}catch(e2){}; 
        throw e;
    }
    try{window.unsetLoading();}catch(e){};
    return data;
}

window.fRGet = async function (url, header = {}) {
    let data  = "";
    try{window.setLoading();}catch(e){};
    try{
        var response = await fetch(window.serverHost + "rget/" + enc(url) + "/" + enc(JSON.stringify(header)));  // `false` makes the request synchronous
        if (response.status === 200) {
            data =  await response.text();
        }else{
            data = "error " + response.status;
        }
    }catch(e){
        try{window.unsetLoading();}catch(e2){}; 
        throw e;
    }
    try{window.unsetLoading();}catch(e){};
    return data;
}

window.singleMatch = function (regex, string) {
    var match = regex.exec(string);
    return match ? match[1] : null;
}

window.decodeHtml = (html) => {
    var el = document.createElement("div");
    el.innerHTML = html;
    return el.textContent;
}
