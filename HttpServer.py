from http.server import HTTPServer, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn
import ssl, urllib, contextlib, base64, os, json, time, shutil
from threading import Thread
from zipfile import ZipFile
from urllib import request, parse
from urllib.request import urlopen, Request
from urllib.error import HTTPError, URLError
import traceback
import re, subprocess, platform
from urllib.error import HTTPError

thread = None
server = None
window = None
alive = True
web_path = "./www"
defaultUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
favs = []
ssl._create_default_https_context = ssl._create_unverified_context
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
cache = {}
cachedir = "cache/"
lastBase_m3u8 = ""
last_m3u8_headers = ""


def handle_308_redirect(self, req, fp, code, msg, headers):
    if code == 308:
        new_url = headers.get('Location')
        if new_url:
            req = request.Request(new_url, headers=req.headers, method='GET')
            fp.close()
            return request.urlopen(req)
        else:
            raise HTTPError(req.full_url, code, msg, headers, fp)
    else:
        return self.http_error_default(req, fp, code, msg, headers)

# Monkey patching urllib.request.HTTPRedirectHandler
urllib.request.HTTPRedirectHandler.http_error_308 = handle_308_redirect


class ThreadingSimpleServer(ThreadingMixIn, HTTPServer):
    pass

def bytesDecode(bytesString):
    try:
        return bytesString.decode("utf-8", errors="ignore")
    except Exception as e:
        print(e)
        return bytesString.decode("latin-1")


class handler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        return
    
    def do_GET(self):
        defaultUserAgent = self.headers.get("User-Agent")
        ssl._create_default_https_context = ssl._create_unverified_context#not recomended but those sites dont have updates certs or w...
        path = replaceKnows(self.path.replace("/fscache.mp4", "").replace("/maskfile.ts", "").replace("/maskfile.m3u8", "").split("/"))
        try:
            if (len(path) >= 2) and not ("." in path[-1]):
                dp = path[1] + " -> " + ", ".join([decode(p) for p in path[2:]])
                print(dp)
        except:
            pass
        if path[1] == "shutdown":
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
                if "/cache/" in decode(path[2]):
                    abrir_video_con_reproductor(decode(path[2]) + "/fscache.mp4")
                else:
                    abrir_video_con_reproductor(decode(path[2]))
                self.return_response(
                    200,
                    "Solo soportado por android, quita esta cofiguración de tus opciones.",
                )
                return

            if path[1] == "file":
                getResponseFile(path, self)
                return
            if path[1] == "cache":
                """if self.headers.get("Range") != None:
                if self.headers.get("Range") != 'bytes=0-':
                    self.return_response(206, "Partial unsuported")
                    return"""
                try:
                    cacheAndGet(path, self)
                except IOError:
                    traceback.format_exc()
                    return
                return
            if path[1] == "m3u8":                                      
                def get_parent_path(url):
                    last_slash_index = url.rfind('/')
                    if last_slash_index == -1 or last_slash_index == len(url) - 1:
                        return url
                    return url[0:last_slash_index + 1]
                
                def eliminar_path_relativos(url):
                    url = url[0:8] + url[8:].replace("//", "/")
                    parsed_url = parse.urlparse(url)
                    url_absoluta = parse.urljoin(parsed_url.geturl(), parsed_url.path)
                    return url_absoluta
                      
                def transform(content, baseUrl, headers):
                    contentLines = content.split("\n")
                    encnl = False
                    for l in contentLines:
                        if encnl:
                            if l.startswith("http"):
                                content = content.replace(l, "http://127.0.0.1:8080/m3u8/" + encode(l) + headers)
                            else:
                                content = content.replace(l, "http://127.0.0.1:8080/m3u8/" + encode(eliminar_path_relativos(baseUrl + l)) + headers)
                        if l.startswith("#EXT-X-STREAM"):
                            encnl = True
                            continue
                        else:
                            encnl = False
                        if ".m3u8" in l:
                            if l.startswith("http"):
                                content = content.replace(l, "http://127.0.0.1:8080/m3u8/" + encode(l) + headers)
                            else:
                                content = content.replace(l, "http://127.0.0.1:8080/m3u8/" + encode(eliminar_path_relativos(baseUrl + l)) + headers)
                        elif (re.match(".+\.\w{2,4}$", l) != None):
                            if l.startswith("http"):
                                content = content.replace(l, "http://127.0.0.1:8080/file/" + encode(l) + headers)
                            else:
                                content = content.replace(l, "http://127.0.0.1:8080/file/" + encode(eliminar_path_relativos(baseUrl + l)) + headers)
                    return content
                content_t = ""
                message = None
                if(".key" in path[3]):
                    lastBase_m3u8 = get_parent_path(decode(path[2]))
                    path2 = ["get", "get", encode(lastBase_m3u8 + path[3])]
                    message = getGet(path2)
                    content_t = bytesDecode(message.read())
                else:
                    if len(path) == 4:
                        last_m3u8_headers = "/" + path[3]
                    else:
                        last_m3u8_headers = ""
                    lastBase_m3u8 = get_parent_path(decode(path[2]))
                    message = getGet(path)
                    content = bytesDecode(message.read())
                    content_t = transform(content, lastBase_m3u8, last_m3u8_headers)
                self.send_response(200)
                for header in message.headers._headers:
                    if header[0].lower() == "set-cookie":
                        self.send_header("gean_" + header[0], header[1])
                    if "content-type" in header[0].lower():
                        self.send_header(header[0], header[1])
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Access-Control-Expose-Headers", "*")
                self.send_header("Access-Control-Allow-Headers", "*")
                self.end_headers()
                self.wfile.write(content_t.encode("utf-8"))
                return
        except Exception as e:
            print("Error: " + str(e) + "en" + decode(path[2]) + "\n")
            traceback.format_exc()
            return
        except Exception as e:
            print("Error: " + str(e) + "en" + decode(path[2]) + "\n")
            traceback.format_exc()
            return
        if self.path.endswith("sources.js"):
            if not os.path.exists("temp"):
                os.mkdir("temp")
            generateSourceList()
            self.path = "temp/sources.js"
            return SimpleHTTPRequestHandler.do_GET(self)
        if os.path.exists(web_path + self.path) and path[-1].split(".")[-1] in [
            "html",
            "js",
            "css",
            "jpg",
            "png",
            "gif",
            "ico",
            "svg",
            "mp4",
        ]:
            self.path = web_path + self.path
            # read file to string
            return SimpleHTTPRequestHandler.do_GET(self)
        else:
            self.return_response(404, "Not Found")

    def end_headers(self):
        self.add_origin_headers()
        try:
            if (
                self.path.endswith(".js")
                or self.path.endswith(".css")
                or self.path.endswith(".html")
            ):
                self.send_my_headers()
        except:
            pass
        SimpleHTTPRequestHandler.end_headers(self)

    def add_origin_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Expose-Headers", "*")
        self.send_header("Access-Control-Allow-Headers", "*")

    def send_my_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        pass

    def return_response(self, code, message):
        self.send_response(code)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(bytes(message, "utf8"))

    def return_response_whit_headers(self, code, message):
        content = bytesDecode(message.read())
        self.send_response(code)
        for header in message.headers._headers:
            if header[0].lower() == "set-cookie":
                self.send_header("gean_" + header[0], header[1])
            if "content" in header[0].lower():
                self.send_header(header[0], header[1])
        self.end_headers()
        self.wfile.write(bytes(content, "utf8"))

    def return_response_file(self, code, message):
        self.send_response(code)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(message)


def decode(input):
    return base64.b64decode(input.replace("_", "/").encode("utf-8")).decode("utf-8")

def encode(input):
    encoded_bytes = base64.b64encode(input.encode("utf-8"))
    encoded_string = encoded_bytes.decode("utf-8").replace("/", "_")
    return encoded_string

def getResponseGet(path=[]):
    return bytesDecode(getGet(path).read())

def getFile(url, headers = {}, server=None):
    rcode = 200
    #preparar y combinar headers de peticion remota
    pHeaders = server.headers
    for key in pHeaders:
        if (key not in headers) and (key.lower() not in["host", "referer"]):
            headers[key] = pHeaders[key]
    #pasarlas a formato para hacer peticion en contexto
    contextPetitionHeaders = []
    for key in headers:
        contextPetitionHeaders.append((key, headers[key]))
        
    opener = urllib.request.build_opener()
    opener.addheaders = contextPetitionHeaders
    urllib.request.install_opener(opener)
    try:
        with contextlib.closing(urlopen(url, None, context=ssl._create_unverified_context)) as fp:
            headers = fp.info()
            bs = 8192
            size = -1
            read = 0
            blocknum = 0        
            server.send_response(fp.code)
            for header in headers._headers:
                if header[0].lower() == "connection":
                    server.send_header(header[0], "keep-alive")
                elif (header[0].lower() == "content-type") or (header[0].lower() == "content-length") or (header[0].lower() == "range"):
                    server.send_header(header[0], header[1])
            server.send_header('Pragma', 'public')
            server.send_header('Cache-Control', 'max-age=86400')
            server.end_headers()
            if "content-length" in headers:
                size = int(headers["Content-Length"])
            while True:
                block = fp.read(bs)
                if not block:
                    break
                read += len(block)
                server.wfile.write(block)
                blocknum += 1
    except:
        pass
    urllib.request.urlcleanup()
    #preparar headers de respuesta local
    rHeaders = {}

def getResponseFile(path=[], server=None):
        buffer_size = 8192  # Tamaño del buffer para leer el archivo en bloques
        custom_headers = {}
        url = decode(path[2])
        if len(path) == 4:
            try:
                custom_headers = json.loads(decode(path[3]))
            except (json.JSONDecodeError, UnicodeDecodeError) as e:
                print(f"Error decoding headers: {e}")
        pet_range = content_length = server.headers.get("Range")
        if pet_range and len(pet_range) > 2:
            custom_headers["Range"] = pet_range
        try:
            request = Request(url, headers=custom_headers)
            with urlopen(request) as inputStream:
                content_length = inputStream.headers.get("Content-Length")
                tlength = int(content_length) if content_length else 0
                content_type = inputStream.headers.get("Content-Type")
                # Si el archivo se encuentra y la respuesta es 200 o 206
                if inputStream.status in (200, 206):
                    server.send_response(200 if inputStream.status == 200 else 206)

                    # Agregar el header CORS para aceptar solicitudes desde cualquier origen
                    server.send_header('Access-Control-Allow-Origin', '*')

                    if content_type and len(content_type) > 2:
                        server.send_header('Content-Type', content_type)
                    else:
                        server.send_header('Content-Type', 'application/octet-stream')

                    server.send_header('Connection', 'keep-alive')

                    range_header = server.headers.get('Range')
                    if range_header:
                        # Reenviar la información del rango
                        content_range = inputStream.headers.get('Content-Range')
                        server.send_header('Content-Range', content_range)
                        partial_content_length = inputStream.headers.get("Content-Length")
                        server.send_header('Content-Length', partial_content_length)
                        server.send_header('Accept-Ranges', 'bytes')
                    else:
                        server.send_header('Content-Length', str(tlength))

                    server.end_headers()

                    # Leer y transmitir el archivo en bloques pequeños
                    while True:
                        chunk = inputStream.read(buffer_size)
                        if not chunk:
                            break
                        server.wfile.write(chunk)

                else:
                    server.send_response(500)
                    server.end_headers()
                    server.wfile.write(b"Unsupported response: " + str(inputStream.status).encode('utf-8'))

        except (HTTPError, URLError) as e:
            server.send_response(404)
            #server.send_header('Access-Control-Allow-Origin', '*')  # CORS también para errores
            server.end_headers()
            server.wfile.write(f"File not found: {e}".encode('utf-8'))

def getResponseFile0(path=[], server=None):
    headers = {}
    url = decode(path[2])
    if len(path) == 4:
        try:
            headers = json.loads(decode(path[3]))
        except (json.JSONDecodeError, UnicodeDecodeError) as e:
            print(f"Error decoding headers: {e}")
    getFile(url, headers, server)

def getResponseFile1(path=[], server=None):
    headers = {}
    rcode = 200    
    url = decode(path[2])
    ho = []
    
    if len(path) == 4:
        try:
            headers = json.loads(decode(path[3]))
        except (json.JSONDecodeError, UnicodeDecodeError) as e:
            print(f"Error decoding headers: {e}")

    rheaders = server.headers
    for key in rheaders:
        if not (("host" in key.lower()) or ("referer" in key.lower())):
            ho.append((key, rheaders.get(key)))

    range_header = server.headers.get("Range")
    if range_header is not None:
        headers["Range"] = range_header
        rcode = 206
    for key in headers:
        ho.append((key, headers[key]))
        
    opener = urllib.request.build_opener()
    opener.addheaders = ho
    urllib.request.install_opener(opener)
    
    try:
        with contextlib.closing(urlopen(url, None, context=ssl._create_unverified_context)) as fp:
            headers = fp.info()
            bs = 8192
            size = -1
            read = 0
            blocknum = 0        
            server.send_response(rcode)
            for header in headers._headers:
                if header[0].lower() == "connection":
                    server.send_header(header[0], "keep-alive")
                elif (header[0].lower() == "content-type") or (header[0].lower() == "content-length"):
                    server.send_header(header[0], header[1])
            server.end_headers()
            if "content-length" in headers:
                size = int(headers["Content-Length"])
            while True:
                block = fp.read(bs)
                if not block:
                    break
                read += len(block)
                server.wfile.write(block)
                blocknum += 1
    except:
        pass
    urllib.request.urlcleanup()
        

def getGet(path=[]):
    headers = {}
    if len(path) == 4:
        headers = json.loads(decode(path[3]))
    if "User-Agent" not in headers:
        headers["User-Agent"] = defaultUserAgent
    web = decode(path[2])
    req = request.Request(web, headers=headers)
    return request.urlopen(req)


def getRedirectGet(path=[]):
    resp = getGet(path)
    return resp.url


def getRedirectPost(path=[]):
    resp = getPost(path)
    return resp.url


def getPost(path=[]):
    headers = {}
    data = {}
    if len(path) == 5:
        headers = json.loads(decode(path[3]))
        data = json.loads(decode(path[4]))
    if "User-Agent" not in headers:
        headers["User-Agent"] = defaultUserAgent
    web = decode(path[2])
    data = parse.urlencode(data).encode()
    req = request.Request(web, data=data, headers=headers)
    resp = request.urlopen(req)
    return resp


def getResponsePost(path=[]):
    return bytesDecode(getPost(path).read())


def parseRangeHeader(header, content_len):
    unit, range = header.split("=")
    start, end = range.split("-")
    if end == "":
        end = content_len
    return int(start), int(end), unit


def urlretrievecache(url, filename, cache, data=None):
    with contextlib.closing(urlopen(url, data)) as fp:
        headers = fp.info()
        cache[url]["headers"] = headers
        cache[url]["content-length"] = headers["content-length"]
        if "content-length" in headers:
            with open(filename, "w") as f:
                try:
                    f.truncate(int(headers["content-length"]))
                except IOError as e:
                    traceback.print_exc()
                    print(e)
        tfp = open(filename, "wb")
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
            "retrieval incomplete: got only %i out of %i bytes" % (read, size), result
        )
    cache[url]["status"] = 1
    return result


def downloadCacheFile(cache, path):
    headers = {}
    web = decode(path[2])
    ho = []
    if len(path) == 4:
        headers = json.loads(decode(path[3]))
    for key in cache[web]["rheaders"]:
        if not (("host" in key.lower()) or ("referer" in key.lower())):
            ho.append((key, cache[web]["rheaders"].get(key)))
    for key in headers:
        ho.append((key, headers[key]))
    web = decode(path[2])
    opener = urllib.request.build_opener()
    opener.addheaders = ho
    urllib.request.install_opener(opener)
    try:
        urlretrievecache(web, cache[web]["name"], cache)
    except Exception as e:
        print("Error: " + str(e) + " en " + web + "\n")
        cache[web]["status"] = -2
        cache[web]["errdetails"] = str(e)
        traceback.format_exc()



def cacheAndGet(path=[], server=None):
    web = decode(path[2])
    if (web in cache) and (cache[web]["status"] >= 0):
        # raise Exception("already cached")
        print("url cached active, serving {}".format(path))
    else:
        cache[web] = {}
        cache[web][
            "status"
        ] = 0  # 0 downloading | -1 error | 1 finished |3 paused| -2 deleted
        cache[web]["progress"] = 0
        cache[web]["errdetails"] = 0
        cache[web]["name"] = f"{cachedir}cache{str(len(cache))}.mp4"
        cache[web]["thread"] = Thread(target=downloadCacheFile, args=(cache, path))
        cache[web]["rheaders"] = server.headers
        cache[web]["thread"].start()

    while not os.path.exists(cache[web]["name"]):
        if cache[web]["status"] == -2:
            return
        time.sleep(0.5)
    start = 0
    end = int(cache[web]["content-length"])
    if server.headers.get("Range"):
        start, end, unit = parseRangeHeader(server.headers.get("Range"), end)
        """if(((end - start + 1)/float(cache[web]['content-length'])) <  0.001):
            cache[web]["status"] = 3  #0 downloading | -1 error | 1 finished |3 paused| -2 deleted
            getResponseFile(path, server)
            cache[web]["status"] = 0  #0 downloading | -1 error | 1 finished |3 paused| -2 deleted
            return"""
        server.send_response(206)
        server.send_header(
            "Content-Length", min(end - start + 1, int(cache[web]["content-length"]))
        )
        server.send_header(
            "Content-Range",
            "bytes {}-{}/{}".format(
                start,
                min(end, int(cache[web]["content-length"]) - 1),
                cache[web]["content-length"],
            ),
        )
    else:
        server.send_response(200)
        server.send_header("Content-Length", cache[web]["content-length"])

    for header in cache[web]["headers"]._headers:
        if header[0].lower() == "connection":
            server.send_header(header[0], "keep-alive")
        elif header[0].lower() == "content-type":
            server.send_header(header[0], header[1])
        """elif header[0].lower() == "content-length":
            server.send_header(header[0], header[1])"""
    # print(server.headers)
    server.end_headers()
    while not cache[web]["progress"] > start:
        if cache[web]["status"] < 0:
            return
        time.sleep(0.3)

    with open(cache[web]["name"], "r+b") as fh:
        fh.seek(start)
        chunk = ""
        cp = start
        while True:
            if cache[web]["progress"] > cp:
                chunk = fh.read(
                    8192 if ((end == -1) or ((end - cp) > 8192)) else (end - cp)
                )
                cp += len(chunk)
                if not chunk:
                    break
                server.wfile.write(chunk)
            else:
                if cache[web]["status"] == 1:
                    break
                time.sleep(0.5)
    # urllib.request.urlcleanup()

def replaceKnows(path):
    try:
        url = decode(path[2])
        knows = [("ww3.animeonline.ninja", "MzguNjIuMjI0Ljc3", "animeonline.ninja"), 
                 ("www.animeonline.ninja", "MzguNjIuMjI0Ljc3", "animeonline.ninja"),
                 ("animeonline.ninja", "MzguNjIuMjI0Ljc3", "animeonline.ninja")]
        for key in knows:
            if(key[0] in url):
                headers = {}
                if len(path) == 4:
                    try:
                        headers = json.loads(decode(path[3]))
                        headers["host"] = key[2]
                        path[3] = encode(json.dumps(headers))
                        break
                    except (json.JSONDecodeError, UnicodeDecodeError) as e:
                        print(f"Error decoding headers: {e}")
                else:
                    path.append(encode('{"host": "'+ key[2] + '"}'))   
                path[2] = encode(url.replace(key[0], decode(key[1])))
    except:
        pass
    return path

def check_for_update():
    import sys

    if os.path.exists("version"):
        c_version = open("version", "r", encoding="utf-8").read().strip().split(".")
        c_version = [int(x) for x in c_version]
        c_version = c_version[0] * 100000000 + c_version[1] * 100000 + c_version[2]
        req = request.Request(
            "https://raw.githubusercontent.com/raulhaag/gean/master/version"
        )
        r_version = request.urlopen(req).read().decode("utf-8").strip().split(".")
        r_version = [int(x) for x in r_version]
        r_version = r_version[0] * 100000000 + r_version[1] * 100000 + r_version[2]
        if c_version >= r_version:
            return False

    print("Actualizando...")
    download_file(
        "https://github.com/raulhaag/gean/archive/refs/heads/master.zip", "update.zip"
    )
    with ZipFile("update.zip", "r") as zipf:
        zipinfos = zipf.infolist()
        for zipinfo in zipinfos:
            zipinfo.filename = zipinfo.filename.replace("gean-master/", "")
            if len(zipinfo.filename) > 0 and not ("test/" in zipinfo.filename):
                zipf.extract(zipinfo)

    os.remove("update.zip")
    print("Actualizado, reinicie la aplicación")
    try:
        os.execv(sys.executable, ["python"] + sys.argv)
    except:
        pass
    return True


def download_file(url, filename):
    request.urlretrieve(url, filename)


server = ThreadingSimpleServer(("127.0.0.1", 8080), handler)


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
            if ctt.__contains__("this.name"):
                match_ = re.findall(regex, ctt, re.MULTILINE)
                if (len(match_) > 0) and (match_[0][0][0:2] != "NO"):
                    imports += (
                        "import { " + match_[0][0] + ' } from "./' + file + '";\n'
                    )
                    initial += match_[0][1] + ": new " + match_[0][0] + ",\n"

    sOut = (
        imports
        + """\nexport function openInNewTab(url) {
        window.open(url, '_blank').focus();
}\n"""
    )
    sOut += "let servers = {" + initial + "};\n"
    sOut += """export function getSource(name) {
    return (servers[name])? servers[name]:servers["DeadServer"];
}

export function getResponse(name, callback, error_callback) {
    getSource(name).getFrontPage(callback, error_callback);
}

export function getLinks(path, callback, error_callback) {
}

export function getSourceList(){
    return Object.keys(servers);
}"""
    with open("temp/sources.js", "w") as file:
        file.write(sOut)
        file.close()


def abrir_video_con_reproductor(ruta_o_url):
    sistema_operativo = platform.system()

    if sistema_operativo == "Windows":
        subprocess.run(["start", ruta_o_url], shell=True)
    elif sistema_operativo == "Darwin":  # macOS
        subprocess.run(["open", ruta_o_url])
    elif sistema_operativo == "Linux":
        subprocess.run(["xdg-open", ruta_o_url])
    else:
        print("Sistema operativo no compatible.")


def main(page="http://127.0.0.1:8080/main.html", path="./www"):
    if os.path.exists(cachedir):
        shutil.rmtree(cachedir)
    os.makedirs(cachedir)
    web_path = path
    try:
        if not check_for_update():
            from threading import Thread

            thread = Thread(target=sf, args=(path,))
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
