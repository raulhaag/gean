import json
from jkanime import JKAnime
from coder import Coder
import base64, requests
servers = {"jkanime": JKAnime()}
coder = Coder()

def getResponseAction(path = []):
    if path[2] not in servers:
        return ""
    if not hasattr(servers[path[2]], path[3]):
        return ""
    if len(path ) == 4:
        val =  getattr(servers[path[2]], path[3])()
    else:
        val = getattr(servers[path[2]], path[3])(path[4:])
    if hasattr(coder, path[3]):
        return getattr(coder, path[3])(val)
    else:
        return val

def getResponseGet(path = []):
    headers = {}
    if len(path) == 4:
        headers =  json.dumps(base64.b64decode(path[3].encode('utf-8')).decode('utf-8'))
    web = base64.b64decode(path[2].encode('utf-8')).decode('utf-8')
    return requests.get(web, headers=headers).text

def getResponsePost(path = []):
    headers = {}
    params = {}
    if len(path) == 5:
        headers =  json.dumps(base64.b64decode(path[3].encode('utf-8')).decode('utf-8'))
        params =  json.dumps(base64.b64decode(path[3].encode('utf-8')).decode('utf-8'))
    web = base64.b64decode(path[2].encode('utf-8')).decode('utf-8')
    return requests.post(web, headers=headers, params=params).text