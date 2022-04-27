class Coder:
    def getFrontPage(self, categories = {}):
        keys = categories.keys()
        rv = ""
        for key in keys:
            rv += self.tansformCat(key, categories[key]) + "<br>"
        return rv

    def tansformCat(self, name, items):
        '''
        <div class="cat_container">
            <h1 class="cat_container__title">Nuevos capítulos</h1>
            <div class="cat_container__list">
                <div class="cat_container__media">
                    <div class="cat_container__media_title">Moshuko tensei</div>
                </div>
                <div class="cat_container__media">
                    <div class="cat_container__media_title">Moshuko tensei</div>
                </div>
                <div class="cat_container__media">
                    <div class="cat_container__media_title">Moshuko tensei</div>
                </div>
            </div>
        </div>'''
        itemshtml = ""
        for item in items:
            itemshtml += '<div class="cat_container__media" style="background-image: url(\'{}\')" onclick="{{mediaClick(this, \'{}\')}}"><div class="cat_container__media_title">{}</div></div>'.format(item["image"],item["path"], item["name"])
        return '<div class="cat_container"><h1 class="cat_container__title">{}</h1><div class="cat_container__list">{}</div></div>'.format(name, itemshtml)

    def tansformFavorites(self, items):
        return self.tansformCat("Favoritos", items)


if __name__ == '__main__':
    from jkanime import JKAnime
    print(Coder().tansformFrontPage(JKAnime().getFrontPage()))