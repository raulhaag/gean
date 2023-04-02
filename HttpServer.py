from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn
import ssl, urllib, contextlib, base64, os, json, time, shutil
from threading import Thread
from zipfile import ZipFile
from urllib import request, parse
from urllib.request import urlopen

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
        path = self.path.split('/')
        try:
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
                if self.headers.get("Range") != None:
                    if self.headers.get("Range") != 'bytes=0-':
                        self.return_response(206, "Partial unsuported")
                        return
                getResponseFile(path, self)
                return
            if path[1] == "cache":
                if self.headers.get("Range") != None:
                    if self.headers.get("Range") != 'bytes=0-':
                        self.return_response(206, "Partial unsuported")
                        return
                cacheAndGet(path, self)
                return
        except Exception as e:
            print("Error: " + str(e) + "en" + decode(path[2]))
        if(os.path.exists(web_path + self.path) and path[-1].split(".")[-1] in["html", "js", "css", "jpg", "png", "gif", "ico"]):
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

    errorcount = 0
    while True:
        try:
            chunk = res.read(4096)
            if not chunk:
                break
            server.wfile.write(chunk)
            errorcount = 0
        except Exception as e:
            print("Retry after " + str(e))
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

def urlretrievecache(url, filename, cache, data=None):
    with contextlib.closing(urlopen(url, data)) as fp:
        headers = fp.info()
        cache[url]["headers"] = headers
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
    if len(path) == 4:
        headers =  json.loads(decode(path[3]))
    if "User-Agent" not in headers:
        headers["User-Agent"] = defaultUserAgent
    ho = []
    for key in headers:
        ho.append((key, headers[key]))
    web = decode(path[2])
    opener = urllib.request.build_opener()
    opener.addheaders = ho
    urllib.request.install_opener(opener)
    ssl._create_default_https_context = ssl._create_unverified_context
    try:
        urlretrievecache(web, cache[web]["name"], cache)
    except:
        cache[web] = -2

def cacheAndGet(path = [], server = None):
    web = decode(path[2])
    if hasattr(cache, web) and (cache[web]["status"] >= 0):
        #raise Exception("already cached")
        print("url cached active, serving {}".format(path))
    else:
        cache[web] = {}
        cache[web]["status"] = 0  #0 downloading | -1 error | 1 finished | -2 deleted
        cache[web]["progress"] = 0
        cache[web]["name"] = f'{cachedir}cache{str(len(cache))}.mp4'
        cache[web]["thread"] = Thread(target = downloadCacheFile, args = (cache, path))
        cache[web]["thread"].start()
    while True:
        if os.path.exists(cache[web]["name"]):
            server.send_response(200)
            for header in cache[web]["headers"]._headers:
                server.send_header(header[0], header[1])
            server.send_my_headers()
            with open(cache[web]["name"], 'rb') as fh:
                chunk = ""
                cp = 0
                while True:
                    if(cache[web]["progress"] > cp):
                        chunk = fh.read(8192)
                        cp += len(chunk)
                        if not chunk:
                            break
                        server.wfile.write(chunk)
                    else:
                        if(cache[web]["status"] == 1):
                            break
                        time.sleep(0.5)
            break
        else:
            if cache[web]["status"] == -2:
                break
            time.sleep(0.5)
    urllib.request.urlcleanup()


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