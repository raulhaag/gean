
window.serverHost = "http://127.0.0.1:8080/";

window.atobo = window.atob;

window.enc = function(e){
    return  btoa(e).replace(/\//g, '_');
}

window.fchain = (str1, str2) => {
    const length = Math.min(str1.length, str2.length);
    const result = [...Array(length)].map((_, i) => String.fromCharCode(str1.charCodeAt(i) ^ str2.charCodeAt(i))).join('');
    return result + (str1.length > str2.length ? str1.substring(length) : str2.substring(length));
}

window.dec = function(e){
    return atobo(e.replace(/_/g, '/'));
}

window.fGet = async function (url, header = {}, returnHeaders = false) {
    new URL(url) //just to throw exeption if not valid
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
    new URL(url) //just to throw exeption if not valid
    try{window.setLoading();}catch(e){};
    var out = "";
    try{
        var response = await fetch(window.serverHost + "post/" + enc(url) + "/" + enc(JSON.stringify(header)) + "/" + enc(JSON.stringify(data)));  // `false` makes the request synchronous
        let out = "";
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
    new URL(url) //just to throw exeption if not valid
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
    new URL(url) //just to throw exeption if not valid
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

window.atob = function(e, p = null){
    if(p != null){
        return fchain(atobo(e), p);
    }
    return atobo(e.replace(/_/g, '/'));
}

window.decodeHtml = (html) => {
    var el = document.createElement("div");
    el.innerHTML = html;
    return el.textContent;
}

window.getFirstMatch = function (regex, str) {
    var m = regex.exec(str);
    if (m == null) {
      return "";
    }
    return m[1];
  };
  
window.getAllMatches = function (regex, str) {
    return [...str.matchAll(regex)];
  };
  
window.indexOfProperty = function (array, property, value) {
    return array
      .map(function (x) {
        return x[property];
      })
      .indexOf(value);
  };

window.http2file = function (url, headers = {}, path = "file/"){
    return window.serverHost + path + window.enc(url) + "/" + window.enc(JSON.stringify(headers));
}