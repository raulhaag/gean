from email import header
from unittest.mock import patch
import requests, re
class Fembed:
    def getDDL(web):
        path = web.split("/")
        id = path[path.index('v') + 1]
        s = requests.post("https://www.fembed.com/api/source/{}".format(id), headers={"Referer":web})
        link = re.findall('"file":"(.+?)".+?', s.text)
        return link[-1].replace("\\", "").replace('"', '')

if __name__ == '__main__':
    Fembed.getDDL("https://www.fembed.com/v/1-02gujw-p2k-yy")