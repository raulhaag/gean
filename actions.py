import json
import base64, requests

def getResponseGet(path = []):
    headers = {}
    if len(path) == 4:
        headers =  json.loads(base64.b64decode(path[3].encode('utf-8')).decode('utf-8'))
    web = base64.b64decode(path[2].encode('utf-8')).decode('utf-8')
    return requests.get(web, headers=headers).text

def getRedirectPost(path = []):
    resp =  getPost(path)
    return resp.url

def getPost(path = []):
    headers = {}
    params = {}
    if len(path) == 5:
        headers =  json.loads(base64.b64decode(path[3].encode('utf-8')).decode('utf-8'))
        params =  json.loads(base64.b64decode(path[4].encode('utf-8')).decode('utf-8'))
    web = base64.b64decode(path[2].encode('utf-8')).decode('utf-8')
    return requests.post(web, headers=headers, data=params)

def getResponsePost(path = []):
    return getPost(path).text