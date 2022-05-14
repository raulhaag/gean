import json
import base64, requests

def decode(input):
    return base64.b64decode(input.replace("_", "/").encode('utf-8')).decode('utf-8')


def getResponseGet(path = []):
    headers = {}
    if len(path) == 4:
        headers =  json.loads(decode(path[3]))
    web = decode(path[2])
    return requests.get(web, headers=headers).text

def getRedirectPost(path = []):
    resp =  getPost(path)
    return resp.url

def getPost(path = []):
    headers = {}
    params = {}
    if len(path) == 5:
        headers =  json.loads(decode(path[3]))
        params =  json.loads(decode(path[4]))
    web = decode(path[2])
    return requests.post(web, headers=headers, data=params)

def getResponsePost(path = []):
    return getPost(path).text