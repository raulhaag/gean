import requests
from http.server import HTTPServer, SimpleHTTPRequestHandler
import re, os, base64
import requests

#download html files from a website
def download_html(url, filename):
    r = requests.get(url)
    f = open(filename, 'w', encoding='utf8')
    f.write(r.text)
    f.close()

class ServerHandler(SimpleHTTPRequestHandler):
    def return_response_file(self, code, message):
        self.send_response(code)
        self.send_header('Content-type','text/html')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(message)

    def return_response(self, code, message):
        self.send_response(code)
        self.send_header('Content-type','text/html')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(bytes(message, "utf8"))

def download_jkanime_test():
    download_html('https://www.jkanime.net/', 'test/jkanime/frontpage.html')
    download_html('https://jkanime.net/directorio/', 'test/jkanime/directorio.html')
    download_html('https://jkanime.net/lupin-iii/', 'test/jkanime/details.html')
    download_html('https://jkanime.net/lupin-iii/episodio/1/', 'test/jkanime/links.html')

def startjkanimeTestServer():
    class jkhandler(ServerHandler):
        def do_GET(self):
            print(self.path.split('/'))
            path = self.path.split('/')
            if path[1] == "get":
                web = base64.b64decode(path[2].encode('utf-8')).decode('utf-8')
                if "directorio" in web:
                    self.return_response(200, open('test/jkanime/directorio.html', 'r', encoding='utf-8').read())
                    return
                elif web == "https://jkanime.net/":
                    self.return_response(200, open('test/jkanime/frontpage.html', 'r', encoding='utf-8').read())
                    return
                else:
                    self.return_response(200, open('test/jkanime/details.html', 'r', encoding='utf-8').read())
                    return
            self.return_response(404, "Not Found")
    server = HTTPServer(('', 8080), jkhandler)
    try:
        server.serve_forever()
    except:
        pass

if __name__ == "__main__":
    #download_jkanime_test()
    startjkanimeTestServer()