from animeServer import AnimeServer
import requests
from bs4 import BeautifulSoup
import base64
import re
class JKAnime(AnimeServer):
    name = "jkanime"

    def getFrontPage(self):
        r = requests.get("https://jkanime.net/").text
        soup = BeautifulSoup(r, "html.parser")
        nc = soup.select("body section.hero div.container div.row div.col-lg-4.pt-3 div.anime__sidebar__comment div.listadoanime-home div.maximoaltura a.bloqq")
        ncs = []
        for n in nc:
            name = '{} - {}'.format(n.select_one("h5").text, re.sub('\s+',' ',n.select_one("h6").text).strip())
            image = n.select_one("img")['src']
            path = JKAnime.name + '/getLinks/' + base64.b64encode(n["href"].encode("utf-8")).decode("utf-8")
            ncs.append({"name":name, "image":image, "path":path})
        nas = []
        nc = soup.select("html body section.contenido.spad div.container div.row div.col-lg-8 div.trending__anime div.row div.col-lg-3.col-md-6.col-sm-6 div.anime__item")
        for n in nc:
            name = n.select('a')[1].text
            image = n.select_one("div")['data-setbg']
            path = JKAnime.name + '/getInfo/' + base64.b64encode(n.select_one("a")["href"].encode("utf-8")).decode("utf-8")
            nas.append({"name":name, "image":image, "path":path})
        return {"Últimos episodios":ncs, "Últimos animes":nas}

    def getLinks(self, path):
        web = base64.b64decode(path[0].encode('utf-8')).decode('utf-8')
        data = requests.get(web).text
        links = []
        links.append("https://www.fembed.com/v/" + re.findall('jkfembed\.php\?u=(.+?)"', data)[0])
        if len(links) == 1:
            from download_servers.fembed import Fembed
            return Fembed.getDDL(links[0])
        else:
            return links


if __name__ == "__main__":
    s = JKAnime()
    print(s.getFrontPage())