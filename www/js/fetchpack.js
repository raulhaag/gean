
window.serverHost = "http://127.0.0.1:8080/";
window.petition_controllers = [];

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

const removeController = (controller) => {
    try{
        window.petition_controllers.splice(window.petition_controllers.indexOf(controller), 1)
    }catch(e){}//pass
}

const addController = (controller) => {
    window.petition_controllers.push(controller);
}

mFetch = async (path, returnHeaders = false) => {
    new URL(path) 
    try{window.setLoading();}catch(e){};
    let data  = "", response = null;        
    const control = new AbortController();
    try{
        addController(control);
        response = await fetch(path,{signal:control.signal});
        if (response.status === 200) {
            data =  await response.text();
        }else{
            data = "error " + response.status;
        }
    }catch(e){
        removeController(control);
        try{window.unsetLoading();}catch(e2){}; 
        if (e.name === 'AbortError') {
            throw new Error( 'Consulta interrumpida');
        } 
        throw e;
    }finally{
        removeController(control);    
        try{window.unsetLoading();}catch(e){};
    }
    if(returnHeaders){
        let rHeaders =  {};
        response.headers.forEach(function(val, key) {rHeaders[key] =val});
        return {body:data, headers : rHeaders};
    }
    return data;
}

window.fGet = async function (url, header = {}, returnHeaders = false) {
    return await mFetch(window.serverHost + "get/" + enc(url) + "/" + enc(JSON.stringify(header)), returnHeaders);
}

window.fPost = async function (url, header, post) {
    return await mFetch(window.serverHost + "post/" + enc(url) + "/" + enc(JSON.stringify(header)) + "/" + enc(JSON.stringify(post)));  
}

window.fetchRedirectPost = async function (url, header) {
    return await mFetch(window.serverHost + "rget/" + enc(url) + "/" + enc(JSON.stringify(header)));
}

window.fRGet = async function (url, header = {}) {
    return await mFetch(window.serverHost + "rget/" + enc(url) + "/" + enc(JSON.stringify(header)));  
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

window.cancelAllPetitions = () => {
    const rv = window.petition_controllers.length > 0;
    window.petition_controllers.forEach(ac => ac.abort());
    window.petition_controllers = [];
    try{window.unsetLoading();}catch(e2){};
    return rv;
}


// Función segura para desofuscar el "packer" de JavaScript.
// Reimplementa la lógica de `eval(function(p,a,c,k,e,d){...})` de forma segura.
window.__unpack = (data) => {
    // Extraer los argumentos del packer.
    const packerRegex = /eval\(function\(p,a,c,k,e,d\)\{while\(c--\).*?\}\('(.+?)',(\d+),(\d+),'(.+?)'\.split\('\|'\)/;
    const match = data.match(packerRegex);

    if (!match) {
        return null;
    }

    // Asignar los argumentos capturados.
    let p = match[1];
    const a = parseInt(match[2]);
    let c = parseInt(match[3]);
    const k = match[4].split('|');
    const e = 0; // No se usa en esta variante del packer
    const d = {}; // No se usa en esta variante del packer

    while (c--) {
        if (k[c]) {
            p = p.replace(new RegExp('\\b' + c.toString(a) + '\\b', 'g'), k[c]);
        }
    }
    return p;
}