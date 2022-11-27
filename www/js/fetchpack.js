window.enc = function(e){
    return  btoa(e).replace(/\//g, '_');
}

window.dec = function(e){
    return atob(e.replace(/_/g, '/'));
}

window.fGet = async function (url, header = {}) {
    try{window.setLoading();}catch(e){};
    let data  = "";
    try{
        var response = await fetch(window.serverHost + "get/" + enc(url) + "/" + enc(JSON.stringify(header)));
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

window.fPost = async function (url, header, data) {
    try{window.setLoading();}catch(e){};
    try{
        var response = await fetch(window.serverHost + "post/" + enc(url) + "/" + enc(JSON.stringify(header)) + "/" + enc(JSON.stringify(data)));  // `false` makes the request synchronous
        let data  = "";
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

window.fetchRedirectPost = async function (url, header) {
    try{window.setLoading();}catch(e){};
    try{
        var response = await fetch(window.serverHost + "rget/" + enc(url) + "/" + enc(JSON.stringify(header)));
        let data  = "";
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
    try{window.setLoading();}catch(e){};
    try{
        var response = await fetch(window.serverHost + "rget/" + enc(url) + "/" + enc(JSON.stringify(header)));  // `false` makes the request synchronous
        let data  = "";
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