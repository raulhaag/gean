from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import requests

from requests.api import request
from actions import getRedirectPost, getResponseGet, getResponsePost

serve = None
alive = True
favs = []

class handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split('/')
        if(path[1] == "shutdown"):
            self.return_response(200, "Apagando")
            server.server_close()
            return

        if path[1] == "get":
            self.return_response(200, getResponseGet(path))
            return

        if path[1] == "post":
            self.return_response(200, getResponsePost(path))
            return

        if path[1] == "rpost":
            self.return_response(200, getRedirectPost(path))
            return

        if(os.path.exists('.' + self.path) and path[-1].split(".")[-1] in["html", "js", "css", "jpg", "png", "gif", "ico"]):
            #read file to string
            return SimpleHTTPRequestHandler.do_GET(self)
        else:
            self.return_response(404, "Not Found")

    def end_headers(self):
        self.send_my_headers()
        SimpleHTTPRequestHandler.end_headers(self)

    def send_my_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")

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

def check_for_update():
    
    c_version = open("version", "r", encoding="utf-8").read().strip().split(".")
    c_version = [int(x) for x in c_version]
    c_version = c_version[0] * 100000000 + c_version[1] * 100000 + c_version[2]
    r_version = requests.get("https://raw.githubusercontent.com/raulhaag/gean/master/version").text.strip().split(".")
    r_version = [int(x) for x in r_version]
    r_version = r_version[0] * 100000000 + r_version[1] * 100000 + r_version[2]
    if c_version < r_version:
        print("Update available")
        print("Current version: " + str(c_version))
        print("New version: " + str(r_version))

server = HTTPServer(('', 8080), handler)

try:
    try:
        #os.system(r"load.html")
        pass
    except Exception as e:
        print(e)
    check_for_update()
    server.serve_forever()
except Exception as e:
    print(e)

