import json
from jkanime import JKAnime
from coder import Coder
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
        return json.dumps(val)