from http.server import BaseHTTPRequestHandler, HTTPServer, SimpleHTTPRequestHandler
import time, json, os

serve = None
alive = True
tdi = {}
tdi["name"] = "Tensei Moshuko"
tdi["path"] = "/server/serie/"
tdi["img"] = "/timg/timg1.jpg"
tdis = {}
tdis["favorites"] = []
for i in range(1, 10):
    tdis["favorites"].append(tdi)

class handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        print(self.path.split('/'))
        path = self.path.split('/')

        if(path[1] == "shutdown"):
            self.return_response(200, "Apagando")
            server.server_close()
            return
        if path[1] == "json":
            self.return_response(200, json.dumps(tdis))
            return
        if path[1] == "accion":
            self.return_response(200, json.dumps(tdis))
            return
        if(os.path.exists('.' + self.path)):
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
    server.serve_forever()
except:
    pass
