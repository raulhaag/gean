from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn
import ssl, urllib, contextlib, base64, os, json, time, shutil
from threading import Thread
from zipfile import ZipFile
from urllib import request, parse
from urllib.request import urlopen
import traceback
import re

thread = None
server = None
window = None
alive = True
web_path = "./www"
defaultUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
favs = []
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
cache = {}
cachedir = "cache/"


class ThreadingSimpleServer(ThreadingMixIn, HTTPServer):
    pass

class handler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        return

    def do_GET(self):
        defaultUserAgent = self.headers.get('User-Agent')
        path = self.path.split('/')
        try:
            if (len(path) >= 2) and not("." in path[-1]):
                dp = path[1] + " -> " + ', '.join([decode(p) for p in path[2:]])
                print(dp)
        except:
            pass
        if(path[1] == "shutdown"):
            self.return_response(200, "Apagando")
            server.server_close()
            if window != None:
                window.destroy()
            exit(0)
        try:
            if path[1] == "get":
                self.return_response_whit_headers(200, getGet(path))
                return

            if path[1] == "post":
                self.return_response(200, getResponsePost(path))
                return

            if path[1] == "rpost":
                self.return_response(200, getRedirectPost(path))
                return

            if path[1] == "rget":
                self.return_response(200, getRedirectGet(path))
                return

            if path[1] == "view":
                self.return_response(200, "Solo soportado por android, quita esta cofiguración de tus opciones.")
                return

            if path[1] == "file":
                getResponseFile(path, self)
                return
            if path[1] == "cache":
                '''if self.headers.get("Range") != None:
                    if self.headers.get("Range") != 'bytes=0-':
                        self.return_response(206, "Partial unsuported")
                        return'''
                try:
                    cacheAndGet(path, self)
                except IOError:
                    traceback.format_exc()
                    return
                return
        except Exception as e:
            print("Error: " + str(e) + "en" + decode(path[2]) + "\n")
            traceback.format_exc()
            return
        if self.path.endswith("sources.js"):
            if(not os.path.exists("temp")):
                os.mkdir("temp")
            generateSourceList()
            self.path = "temp/sources.js"
            return SimpleHTTPRequestHandler.do_GET(self)
        if(os.path.exists(web_path + self.path) and path[-1].split(".")[-1] in["html", "js", "css", "jpg", "png", "gif", "ico","mp4"]):
            self.path = web_path + self.path
            #read file to string
            return SimpleHTTPRequestHandler.do_GET(self)
        else:
            self.return_response(404, "Not Found")

    def end_headers(self):
        if(self.path.endswith(".js")):
            self.send_my_headers()
        SimpleHTTPRequestHandler.end_headers(self)

    def send_my_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        pass

    def return_response(self, code, message):
        self.send_response(code)
        self.send_header('Content-type','text/html')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(bytes(message, "utf8"))

    def return_response_whit_headers(self, code, message):
        content = message.read().decode('utf-8')
        self.send_response(code)
        for header in message.headers._headers:
            if header[0].lower() == 'set-cookie':
                self.send_header("gean_" + header[0], header[1])
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header("Access-Control-Expose-Headers", "*")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.end_headers()
        self.wfile.write(bytes(content, "utf8"))


    def return_response_file(self, code, message):
        self.send_response(code)
        self.send_header('Content-type','text/html')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(message)

def decode(input):
    return base64.b64decode(input.replace("_", "/").encode('utf-8')).decode('utf-8')

def getResponseGet(path = []):
    return getGet(path).read().decode('utf-8')

def getResponseFile(path = [], server = None):
    server.send_response(200)
    headers = {}
    if len(path) == 4:
        headers =  json.loads(decode(path[3]))
    if "User-Agent" not in headers:
        headers["User-Agent"] = defaultUserAgent
    range = server.headers.get("Range")
    if range is not None:
        headers["Range"] = range
    ho = []
    for key in headers:
        ho.append((key, headers[key]))
    web = decode(path[2])
    opener = urllib.request.build_opener()
    opener.addheaders = ho
    urllib.request.install_opener(opener)
    res = urllib.request.urlopen(web, timeout=30, context=ctx) #not secure but the video servers have bad certs
    for header in res.headers._headers:
        server.send_header(header[0], header[1])
    server.send_my_headers()
    server.end_headers()
    errorcount = 0
    while True:
        try:
            chunk = res.read(4096)
            if not chunk:
                break
            server.wfile.write(chunk)
            errorcount = 0
        except Exception as e:
            print("Retry after " + str(e) + "\n")
            traceback.print_exc()
            errorcount = errorcount + 1
            if errorcount > 20:
                raise Exception("to many error")
    urllib.request.urlcleanup()

def getGet(path = []):
    headers = {}
    if len(path) == 4:
        headers =  json.loads(decode(path[3]))
    if "User-Agent" not in headers:
        headers["User-Agent"] = defaultUserAgent
    web = decode(path[2])
    req =  request.Request(web, headers=headers)
    return request.urlopen(req)

def getRedirectGet(path = []):
    resp =  getGet(path)
    return resp.url

def getRedirectPost(path = []):
    resp =  getPost(path)
    return resp.url

def getPost(path = []):
    headers = {}
    data = {}
    if len(path) == 5:
        headers =  json.loads(decode(path[3]))
        data =  json.loads(decode(path[4]))
    if "User-Agent" not in headers:
        headers["User-Agent"] = defaultUserAgent
    web = decode(path[2])
    data = parse.urlencode(data).encode()
    req =  request.Request(web, data=data, headers=headers)
    resp = request.urlopen(req)
    return resp

def getResponsePost(path = []):
    return getPost(path).read().decode('utf-8')

def parseRangeHeader(header, content_len):
    unit, range = header.split('=')
    start, end = range.split("-")
    if end == '':
        end = content_len
    return int(start), int(end), unit

def urlretrievecache(url, filename, cache, data=None):
    with contextlib.closing(urlopen(url, data)) as fp:
        headers = fp.info()
        cache[url]["headers"] = headers
        cache[url]['content-length'] = headers['content-length']
        if "content-length" in headers:
            with open(filename, 'w') as f:
                try:
                    f.truncate(int(headers["content-length"]))
                except IOError as e:
                    traceback.print_exc()
                    print(e)
        tfp = open(filename, 'wb')
        with tfp:
            result = filename, headers
            bs = 8192
            size = -1
            read = 0
            blocknum = 0
            if "content-length" in headers:
                size = int(headers["Content-Length"])
            while True:
                block = fp.read(bs)
                if not block:
                    tfp.flush()
                    tfp.close()
                    break
                read += len(block)
                tfp.write(block)
                tfp.flush()
                blocknum += 1
                cache[url]["progress"] = read
    if size >= 0 and read < size:
        cache[url]["status"] = -1
        raise Exception(
            "retrieval incomplete: got only %i out of %i bytes"
            % (read, size), result)
    cache[url]["status"] = 1
    return result

def downloadCacheFile(cache, path):
    headers = {}
    web = decode(path[2])
    ho = []
    if len(path) == 4:
        headers =  json.loads(decode(path[3]))
    for key in cache[web]["rheaders"]:
        if not(("host" in key.lower()) or ("referer" in key.lower())):
            ho.append((key, cache[web]["rheaders"].get(key)))
    for key in headers:
        ho.append((key, headers[key]))
    web = decode(path[2])
    opener = urllib.request.build_opener()
    opener.addheaders = ho
    urllib.request.install_opener(opener)
    ssl._create_default_https_context = ssl._create_unverified_context
    try:
        urlretrievecache(web, cache[web]["name"], cache)
    except Exception as e:
        print("Error: " + str(e) + " en " + web + "\n")
        traceback.print_exc()
        cache[web]["status"] = -2
        cache[web]["errdetails"] = str(e)

def cacheAndGet(path = [], server = None):
    web = decode(path[2])
    if (web in cache) and (cache[web]["status"] >= 0):
        #raise Exception("already cached")
        print("url cached active, serving {}".format(path))
    else:
        cache[web] = {}
        cache[web]["status"] = 0  #0 downloading | -1 error | 1 finished |3 paused| -2 deleted
        cache[web]["progress"] = 0
        cache[web]["errdetails"] = 0
        cache[web]["name"] = f'{cachedir}cache{str(len(cache))}.mp4'
        cache[web]["thread"] = Thread(target = downloadCacheFile, args = (cache, path))
        cache[web]["rheaders"] = server.headers
        cache[web]["thread"].start()
    
    while not os.path.exists(cache[web]["name"]):
        if cache[web]["status"] == -2:
                return
        time.sleep(0.5)
    start = 0
    end = int(cache[web]['content-length'])
    if(server.headers.get("Range")):
        start, end, unit = parseRangeHeader(server.headers.get("Range"), end)
        '''if(((end - start + 1)/float(cache[web]['content-length'])) <  0.001):
            cache[web]["status"] = 3  #0 downloading | -1 error | 1 finished |3 paused| -2 deleted
            getResponseFile(path, server)
            cache[web]["status"] = 0  #0 downloading | -1 error | 1 finished |3 paused| -2 deleted
            return'''
        server.send_response(206)
        server.send_header('Content-Length', min(end - start + 1, int(cache[web]['content-length'])))
        server.send_header('Content-Range', 'bytes {}-{}/{}'.format(start, min(end, int(cache[web]['content-length']) - 1) , cache[web]['content-length']))
    else:   
        server.send_response(200)
        server.send_header('Content-Length',cache[web]['content-length'])
        
    for header in cache[web]["headers"]._headers:
        if header[0].lower() == "connection":
            server.send_header(header[0], "keep-alive")
        elif header[0].lower() == "content-type":
            server.send_header(header[0], header[1])
        '''elif header[0].lower() == "content-length":
            server.send_header(header[0], header[1])'''
    #print(server.headers)
    server.end_headers()
    while not cache[web]["progress"] > start:
        if cache[web]["status"] < 0:
            return
        time.sleep(0.3)

    with open(cache[web]["name"], 'r+b') as fh:
        fh.seek(start)
        chunk = ""
        cp = start
        while True:
            if(cache[web]["progress"] > cp):
                chunk = fh.read(8192 if((end == -1) or ((end-cp) > 8192)) else (end-cp))
                cp += len(chunk)
                if not chunk:
                    break
                server.wfile.write(chunk)
            else:
                if(cache[web]["status"] == 1):
                    break
                time.sleep(0.5)
     #urllib.request.urlcleanup()

def check_for_update():
    if os.path.exists("version"):
        c_version = open("version", "r", encoding="utf-8").read().strip().split(".")
        c_version = [int(x) for x in c_version]
        c_version = c_version[0] * 100000000 + c_version[1] * 100000 + c_version[2]
        req =  request.Request("https://raw.githubusercontent.com/raulhaag/gean/master/version")
        r_version = request.urlopen(req).read().decode('utf-8').strip().split(".")
        r_version = [int(x) for x in r_version]
        r_version = r_version[0] * 100000000 + r_version[1] * 100000 + r_version[2]
        if c_version >= r_version:
            return False

    print("Actualizando...")
    download_file("https://github.com/raulhaag/gean/archive/refs/heads/master.zip", "update.zip")
    with ZipFile('update.zip', 'r') as zipf:
        zipinfos = zipf.infolist()
        for zipinfo in zipinfos:
            zipinfo.filename = zipinfo.filename.replace('gean-master/', '')
            if len(zipinfo.filename) > 0 and not ("test/" in zipinfo.filename) :
                zipf.extract(zipinfo)

    os.remove("update.zip")
    print("Actualizado, reinicie la aplicación")
    return True

def download_file(url, filename):
    request.urlretrieve(url, filename)


server = ThreadingSimpleServer(('', 8080), handler)

def sf(path):
    web_path = path
    server.serve_forever()

def generateSourceList():
    regex = r"class\s+(\S+)[\s|\S]+?this.name\s*=\s*([\S+]+)\s*;"
    soucesDir = "./www/js/sources/"
    sources = os.listdir(soucesDir)
    initial = ""
    imports = ""
    for file in sources:
        with open(file=(soucesDir + file), mode="r") as ofile:
            ctt = ("\n").join(ofile.readlines())
            ofile.close()
            if(ctt.__contains__("this.name")):
                match_ = re.findall(regex, ctt, re.MULTILINE)
                if((len(match_) > 0) and (match_[0][0][0:2] != "NO")):
                    imports += "import { " + match_[0][0] + " } from \"./" + file +"\";\n"
                    initial +=  match_[0][1] + ": new " + match_[0][0] +",\n"
    
    sOut = imports + '''\nexport function openInNewTab(url) {
        window.open(url, '_blank').focus();
}\n'''
    sOut += "let servers = {" + initial + "};\n"
    sOut += '''export function getSource(name) {return servers[name];}

export function getResponse(name, callback, error_callback) {
    if(servers[name]){
        return servers[name].getFrontPage(callback, error_callback);
    }
    return servers["jkanime"].getFrontPage(callback, error_callback);
}

export function getLinks(path, callback, error_callback) {
}

export function getSourceList(){
    return Object.keys(servers);
}'''
    with open("temp/sources.js","w") as file:
        file.write(sOut)
        file.close()

def main(page = "http://127.0.0.1:8080/main.html",path = "./www"):
    if os.path.exists(cachedir):
        shutil.rmtree(cachedir)
    os.makedirs(cachedir)
    web_path = path
    try:
        if(not check_for_update()):
            from threading import Thread
            thread = Thread(target = sf, args=(path,))
            thread.start()
            try:
                import webbrowser
                window = webbrowser.open(page)
            except Exception as e:
                print(e)
            thread.join()
    except Exception as e:
        print(e)
if __name__ == "__main__":
    main()