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
    download_html('https://www.jkanime.net/', 'jkanime/frontpage.html')
    download_html('https://jkanime.net/directorio/', 'jkanime/directorio.html')
    download_html('https://jkanime.net/lupin-iii/', 'jkanime/details.html')
    download_html('https://jkanime.net/lupin-iii/episodio/1/', 'jkanime/links.html')

def startjkanimeTestServer():
    class handler(SimpleHTTPRequestHandler):
        def do_GET(self):
            print(self.path.split('/'))
            path = self.path.split('/')
            if path[1] == "get":
                web = base64.b64decode(path[2].encode('utf-8')).decode('utf-8')
                if "directorio" in web:
                    return_response_file(200, open('jkanime/directorio.html', 'r').read())
                    return
                elif web == "https://www.jkanime.net/":
                    return_response_file(200, open('jkanime/frontpage.html', 'r').read())
                    return
                else:
                    return_response_file(200, open('jkanime/details.html', 'r').read())
                    return
            return_response(404, "Not Found")
    server = HTTPServer(('', 8080), handler)
    try:
        server.serve_forever()
    except:
        pass

if __name__ == "__main__":
    #download_jkanime_test()
    startjkanimeTestServer()