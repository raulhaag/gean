from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib
from zipfile import ZipFile
import base64, os, json
from urllib import request, parse
thread = None
server = None
window = None
alive = True
web_path = "./www"
defaultUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
favs = []

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
                self.return_response(200, getResponseGet(path))
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
    res = urllib.request.urlopen(web)
    server.send_response(200)
    server.send_my_headers()
    length = res.headers['content-length']
    while True:
        chunk = res.read(4096)
        if not chunk:
            break
        server.wfile.write(chunk)
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


server = HTTPServer(('', 8080), handler)

def sf(path):
    web_path = path
    server.serve_forever()


def main(path = "./www"):
    web_path = path
    try:
        if(not check_for_update()):
            from threading import Thread
            thread = Thread(target = sf, args=(path,))
            thread.start()    
            try:
                import webbrowser
                window = webbrowser.open("http://127.0.0.1:8080/main.html")
            except Exception as e:
                print(e)
            thread.join()
    except Exception as e:
        print(e)
if __name__ == "__main__":
    main()