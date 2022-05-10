from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
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

server = HTTPServer(('', 8080), handler)

try:
    try:
        os.system(r"load.html")
    except Exception as e:
        print(e)
    server.serve_forever()
except:
    pass

