export class NOTestServer {
  constructor() {
    this.name = "testserver";
  }
  wait(ms) {
    const start = performance.now();
    while (performance.now() - start < ms);
  }

  waitOrFail() {
	  //return false
    this.wait(Math.floor(Math.random() * 3000));
    return Math.random() > 0.95;
  }

  async getFrontPage(after, onError) {
    if (this.waitOrFail()) {
      onError();
      return;
    }
    after({
      "Últimos Capítulos": [
        {
          name: "Dosanko Gal wa Namara Menkoi - Episodio 8",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/dosanko-gal-wa-namara-menkoi.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9kb3NhbmtvLWdhbC13YS1uYW1hcmEtbWVua29pLzgv",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9kb3NhbmtvLWdhbC13YS1uYW1hcmEtbWVua29p",
        },
        {
          name: 'Himesama "Goumon" no Jikan desu - Episodio 8',
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/himesama-goumon-no-jikan-desu.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9oaW1lc2FtYS1nb3Vtb24tbm8tamlrYW4tZGVzdS84Lw==",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9oaW1lc2FtYS1nb3Vtb24tbm8tamlrYW4tZGVzdQ==",
        },
        {
          name: "Synduality: Noir Part 2 - Episodio 8",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/synduality-noir-part-2.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0yLzgv",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0y",
        },
        {
          name: "Tsuki ga Michibiku Isekai Douchuu 2nd Season - Episodio 8",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/tsuki-ga-michibiku-isekai-douchuu-2nd-season.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC90c3VraS1nYS1taWNoaWJpa3UtaXNla2FpLWRvdWNodXUtMm5kLXNlYXNvbi84Lw==",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC90c3VraS1nYS1taWNoaWJpa3UtaXNla2FpLWRvdWNodXUtMm5kLXNlYXNvbg==",
        },
        {
          name: "Yami Shibai 12 - Episodio 7",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/yami-shibai-12.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC95YW1pLXNoaWJhaS0xMi83Lw==",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC95YW1pLXNoaWJhaS0xMg==",
        },
        {
          name: "Kyuujitsu no Warumono-san - Episodio 8",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/kyuujitsu-no-warumono-san.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9reXV1aml0c3Utbm8td2FydW1vbm8tc2FuLzgv",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9reXV1aml0c3Utbm8td2FydW1vbm8tc2Fu",
        },
        {
          name: "High Card Season 2 - Episodio 8",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/high-card-season-2.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9oaWdoLWNhcmQtc2Vhc29uLTIvOC8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9oaWdoLWNhcmQtc2Vhc29uLTI=",
        },
        {
          name: 'Meitou "Isekai no Yu" Kaitakuki: Around 40 Onsen Mania no Tensei Saki wa, Nonbiri Onsen Tengoku deshita - Episodio 7',
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/meitou-isekai-no-yu-kaitakuki-around-40-onsen-mania-no-tensei-saki-wa-nonbiri-onsen-tengoku-deshita.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9tZWl0b3UtaXNla2FpLW5vLXl1LWthaXRha3VraS1hcm91bmQtNDAtb25zZW4tbWFuaWEtbm8tdGVuc2VpLXNha2ktd2Etbm9uYmlyaS1vbnNlbi10ZW5nb2t1LWRlc2hpdGEvNy8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9tZWl0b3UtaXNla2FpLW5vLXl1LWthaXRha3VraS1hcm91bmQtNDAtb25zZW4tbWFuaWEtbm8tdGVuc2VpLXNha2ktd2Etbm9uYmlyaS1vbnNlbi10ZW5nb2t1LWRlc2hpdGE=",
        },
        {
          name: "Hikari no Ou 2nd Season - Episodio 7",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/hikari-no-ou-2nd-season.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9oaWthcmktbm8tb3UtMm5kLXNlYXNvbi83Lw==",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9oaWthcmktbm8tb3UtMm5kLXNlYXNvbg==",
        },
        {
          name: "Meiji Gekken: 1874 - Episodio 7",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/meiji-gekken-1874.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9tZWlqaS1nZWtrZW4tMTg3NC83Lw==",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9tZWlqaS1nZWtrZW4tMTg3NA==",
        },
        {
          name: "Shin no Nakama ja Nai to Yuusha no Party wo Oidasareta node, Henkyou de Slow Life suru Koto ni Shimashita 2nd - Episodio 8",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/shin-no-nakama-ja-nai-to-yuusha-no-party-wo-oidasareta-node-henkyou-de-slow-life-suru-koto-ni-shimashita-2nd.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zaGluLW5vLW5ha2FtYS1qYS1uYWktdG8teXV1c2hhLW5vLXBhcnR5LXdvLW9pZGFzYXJldGEtbm9kZS1oZW5reW91LWRlLXNsb3ctbGlmZS1zdXJ1LWtvdG8tbmktc2hpbWFzaGl0YS0ybmQvOC8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zaGluLW5vLW5ha2FtYS1qYS1uYWktdG8teXV1c2hhLW5vLXBhcnR5LXdvLW9pZGFzYXJldGEtbm9kZS1oZW5reW91LWRlLXNsb3ctbGlmZS1zdXJ1LWtvdG8tbmktc2hpbWFzaGl0YS0ybmQ=",
        },
        {
          name: "Loop 7-kaime no Akuyaku Reijou wa, Moto Tekikoku de Jiyuu Kimama na Hanayome Seikatsu wo Mankitsu suru - Episodio 8",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/loop-7-kaime-no-akuyaku-reijou-wa-moto-tekikoku-de-jiyuu-kimama-na-hanayome-seikatsu-wo-mankitsu-suru.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9sb29wLTcta2FpbWUtbm8tYWt1eWFrdS1yZWlqb3Utd2EtbW90by10ZWtpa29rdS1kZS1qaXl1dS1raW1hbWEtbmEtaGFuYXlvbWUtc2Vpa2F0c3Utd28tbWFua2l0c3Utc3VydS84Lw==",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9sb29wLTcta2FpbWUtbm8tYWt1eWFrdS1yZWlqb3Utd2EtbW90by10ZWtpa29rdS1kZS1qaXl1dS1raW1hbWEtbmEtaGFuYXlvbWUtc2Vpa2F0c3Utd28tbWFua2l0c3Utc3VydQ==",
        },
        {
          name: "Isekai de Mofumofu Nadenade suru Tame ni Ganbattemasu. - Episodio 9",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/isekai-de-mofumofu-nadenade-suru-tame-ni-ganbattemasu.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9pc2VrYWktZGUtbW9mdW1vZnUtbmFkZW5hZGUtc3VydS10YW1lLW5pLWdhbmJhdHRlbWFzdS85Lw==",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9pc2VrYWktZGUtbW9mdW1vZnUtbmFkZW5hZGUtc3VydS10YW1lLW5pLWdhbmJhdHRlbWFzdQ==",
        },
        {
          name: "Nanatsu no Taizai: Mokushiroku no Yonkishi - Episodio 19",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/nanatsu-no-taizai-mokushiroku-no-yonkishi.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uYW5hdHN1LW5vLXRhaXphaS1tb2t1c2hpcm9rdS1uby15b25raXNoaS8xOS8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uYW5hdHN1LW5vLXRhaXphaS1tb2t1c2hpcm9rdS1uby15b25raXNoaQ==",
        },
        {
          name: "Shangri-La Frontier: Kusoge Hunter, Kamige ni Idoman to su - Episodio 20",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/shangri-la-frontier-kusoge-hunter-kamige-ni-idoman-to-su.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zaGFuZ3JpLWxhLWZyb250aWVyLWt1c29nZS1odW50ZXIta2FtaWdlLW5pLWlkb21hbi10by1zdS8yMC8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zaGFuZ3JpLWxhLWZyb250aWVyLWt1c29nZS1odW50ZXIta2FtaWdlLW5pLWlkb21hbi10by1zdQ==",
        },
        {
          name: "Captain Tsubasa Season 2: Junior Youth-hen - Episodio 21",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/captain-tsubasa-season-2-junior-youth-hen.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9jYXB0YWluLXRzdWJhc2Etc2Vhc29uLTItanVuaW9yLXlvdXRoLWhlbi8yMS8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9jYXB0YWluLXRzdWJhc2Etc2Vhc29uLTItanVuaW9yLXlvdXRoLWhlbg==",
        },
        {
          name: "Ninja Kamui - Episodio 3",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/ninja-kamui.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uaW5qYS1rYW11aS8zLw==",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uaW5qYS1rYW11aQ==",
        },
        {
          name: "One Piece - Episodio 1095",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/one-piece.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9vbmUtcGllY2UvMTA5NS8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9vbmUtcGllY2U=",
        },
        {
          name: "Wonderful Precure! - Episodio 4",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/wonderful-precure.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC93b25kZXJmdWwtcHJlY3VyZS80Lw==",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC93b25kZXJmdWwtcHJlY3VyZQ==",
        },
        {
          name: "Kingdom 5th Season - Episodio 7",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/kingdom-5th-season.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9raW5nZG9tLTV0aC1zZWFzb24vNy8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9raW5nZG9tLTV0aC1zZWFzb24=",
        },
        {
          name: "Saikyou Tank no Meikyuu Kouryaku: Tairyoku 9999 no Rare Skill-mochi Tank, Yuusha Party wo Tsuihou sareru - Episodio 8",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/saikyou-tank-no-meikyuu-kouryaku-tairyoku-9999-no-rare-skill-mochi-tank-yuusha-party-wo-tsuihou-sareru.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zYWlreW91LXRhbmstbm8tbWVpa3l1dS1rb3VyeWFrdS10YWlyeW9rdS05OTk5LW5vLXJhcmUtc2tpbGwtbW9jaGktdGFuay15dXVzaGEtcGFydHktd28tdHN1aWhvdS1zYXJlcnUvOC8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zYWlreW91LXRhbmstbm8tbWVpa3l1dS1rb3VyeWFrdS10YWlyeW9rdS05OTk5LW5vLXJhcmUtc2tpbGwtbW9jaGktdGFuay15dXVzaGEtcGFydHktd28tdHN1aWhvdS1zYXJlcnU=",
        },
        {
          name: "Kusuriya no Hitorigoto - Episodio 20",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/kusuriya-no-hitorigoto.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9rdXN1cml5YS1uby1oaXRvcmlnb3RvLzIwLw==",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9rdXN1cml5YS1uby1oaXRvcmlnb3Rv",
        },
        {
          name: "Great Pretender: Razbliuto - ONA 1",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/great-pretender-razbliuto.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9ncmVhdC1wcmV0ZW5kZXItcmF6YmxpdXRvLzEv",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9ncmVhdC1wcmV0ZW5kZXItcmF6YmxpdXRv",
        },
        {
          name: "Ao no Exorcist: Shimane Illuminati-hen - Episodio 8",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/ao-no-exorcist-shimane-illuminati-hen.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9hby1uby1leG9yY2lzdC1zaGltYW5lLWlsbHVtaW5hdGktaGVuLzgv",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9hby1uby1leG9yY2lzdC1zaGltYW5lLWlsbHVtaW5hdGktaGVu",
        },
        {
          name: "Boku no Kokoro no Yabai Yatsu Season 2 - Episodio 8",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/boku-no-kokoro-no-yabai-yatsu-season-2.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9ib2t1LW5vLWtva29yby1uby15YWJhaS15YXRzdS1zZWFzb24tMi84Lw==",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9ib2t1LW5vLWtva29yby1uby15YWJhaS15YXRzdS1zZWFzb24tMg==",
        },
        {
          name: "Mashle 2nd Season - Episodio 7",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/mashle-2nd-season.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9tYXNobGUtMm5kLXNlYXNvbi83Lw==",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9tYXNobGUtMm5kLXNlYXNvbg==",
        },
        {
          name: "Ragna Crimson - Episodio 19",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/ragna-crimson.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9yYWduYS1jcmltc29uLzE5Lw==",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9yYWduYS1jcmltc29u",
        },
        {
          name: "Yubisaki to Renren - Episodio 8",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/yubisaki-to-renren.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC95dWJpc2FraS10by1yZW5yZW4vOC8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC95dWJpc2FraS10by1yZW5yZW4=",
        },
        {
          name: "Kekkon Yubiwa Monogatari - Episodio 8",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/kekkon-yubiwa-monogatari.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9rZWtrb24teXViaXdhLW1vbm9nYXRhcmkvOC8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9rZWtrb24teXViaXdhLW1vbm9nYXRhcmk=",
        },
        {
          name: "Megumi no Daigo: Kyuukoku no Orange - Episodio 19",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/megumi-no-daigo-kyuukoku-no-orange.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9tZWd1bWktbm8tZGFpZ28ta3l1dWtva3Utbm8tb3JhbmdlLzE5Lw==",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9tZWd1bWktbm8tZGFpZ28ta3l1dWtva3Utbm8tb3Jhbmdl",
        },
        {
          name: "Kui Cheng Shoufu Cong Youxi Kaishi - ONA 5",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/kui-cheng-shoufu-cong-youxi-kaishi.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9rdWktY2hlbmctc2hvdWZ1LWNvbmcteW91eGkta2Fpc2hpLzUv",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9rdWktY2hlbmctc2hvdWZ1LWNvbmcteW91eGkta2Fpc2hp",
        },
        {
          name: "Ni De Rensheng Shi Wo Lai Chi Le - ONA Final",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/ni-de-rensheng-shi-wo-lai-chi-le.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uaS1kZS1yZW5zaGVuZy1zaGktd28tbGFpLWNoaS1sZS8xNi8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uaS1kZS1yZW5zaGVuZy1zaGktd28tbGFpLWNoaS1sZQ==",
        },
        {
          name: "Shi Fang Wu Sheng - ONA Final",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/shi-fang-wu-sheng.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zaGktZmFuZy13dS1zaGVuZy8xNi8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zaGktZmFuZy13dS1zaGVuZw==",
        },
        {
          name: "Kui Cheng Shoufu Cong Youxi Kaishi - ONA 4",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/kui-cheng-shoufu-cong-youxi-kaishi.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9rdWktY2hlbmctc2hvdWZ1LWNvbmcteW91eGkta2Fpc2hpLzQv",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9rdWktY2hlbmctc2hvdWZ1LWNvbmcteW91eGkta2Fpc2hp",
        },
        {
          name: "Aishang Ta de Liyou Extra - ONA",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/aishang-ta-de-liyou-extra.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9haXNoYW5nLXRhLWRlLWxpeW91LWV4dHJhL29uYS8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9haXNoYW5nLXRhLWRlLWxpeW91LWV4dHJh",
        },
        {
          name: "Bu Shi Bu Mie - ONA 16",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/bu-shi-bu-mie.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9idS1zaGktYnUtbWllLzE2Lw==",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9idS1zaGktYnUtbWll",
        },
        {
          name: "Wu Nao Monu 2nd Season - ONA 9",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/wu-nao-monu-2nd-season.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC93dS1uYW8tbW9udS0ybmQtc2Vhc29uLzkv",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC93dS1uYW8tbW9udS0ybmQtc2Vhc29u",
        },
        {
          name: "Huoxing Xi Lu 7 Hao - ONA 9",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/huoxing-xi-lu-7-hao.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9odW94aW5nLXhpLWx1LTctaGFvLzkv",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9odW94aW5nLXhpLWx1LTctaGFv",
        },
        {
          name: "Huoxing Xi Lu 7 Hao - ONA 8",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/huoxing-xi-lu-7-hao.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9odW94aW5nLXhpLWx1LTctaGFvLzgv",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9odW94aW5nLXhpLWx1LTctaGFv",
        },
        {
          name: "Yi Ren Jun Moye - ONA 6",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/yi-ren-jun-moye.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC95aS1yZW4tanVuLW1veWUvNi8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC95aS1yZW4tanVuLW1veWU=",
        },
        {
          name: "Shi Fang Wu Sheng - ONA 15",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/shi-fang-wu-sheng.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zaGktZmFuZy13dS1zaGVuZy8xNS8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zaGktZmFuZy13dS1zaGVuZw==",
        },
        {
          name: "Xiao Lu He Xiao Lan 4th Season - ONA 9",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/xiao-lu-he-xiao-lan-4th-season.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC94aWFvLWx1LWhlLXhpYW8tbGFuLTR0aC1zZWFzb24vOS8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC94aWFvLWx1LWhlLXhpYW8tbGFuLTR0aC1zZWFzb24=",
        },
        {
          name: "Yi Ren Jun Moye - ONA 5",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/yi-ren-jun-moye.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC95aS1yZW4tanVuLW1veWUvNS8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC95aS1yZW4tanVuLW1veWU=",
        },
        {
          name: "Shi Fang Wu Sheng - ONA 14",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/shi-fang-wu-sheng.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zaGktZmFuZy13dS1zaGVuZy8xNC8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zaGktZmFuZy13dS1zaGVuZw==",
        },
        {
          name: "Bu Shi Bu Mie - ONA 15",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/bu-shi-bu-mie.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9idS1zaGktYnUtbWllLzE1Lw==",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9idS1zaGktYnUtbWll",
        },
        {
          name: "Shi Fang Wu Sheng - ONA 13",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/shi-fang-wu-sheng.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zaGktZmFuZy13dS1zaGVuZy8xMy8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zaGktZmFuZy13dS1zaGVuZw==",
        },
        {
          name: "Shi Fang Wu Sheng - ONA 12",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/shi-fang-wu-sheng.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zaGktZmFuZy13dS1zaGVuZy8xMi8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zaGktZmFuZy13dS1zaGVuZw==",
        },
        {
          name: "Bu Shi Bu Mie - ONA 14",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/bu-shi-bu-mie.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9idS1zaGktYnUtbWllLzE0Lw==",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9idS1zaGktYnUtbWll",
        },
        {
          name: "Ni De Rensheng Shi Wo Lai Chi Le - ONA 15",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/ni-de-rensheng-shi-wo-lai-chi-le.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uaS1kZS1yZW5zaGVuZy1zaGktd28tbGFpLWNoaS1sZS8xNS8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uaS1kZS1yZW5zaGVuZy1zaGktd28tbGFpLWNoaS1sZQ==",
        },
        {
          name: "Wangzhe Rongyao: Rongyao Zhi Zhang - ONA Final",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/wangzhe-rongyao-rongyao-zhi-zhang.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC93YW5nemhlLXJvbmd5YW8tcm9uZ3lhby16aGktemhhbmcvNC8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC93YW5nemhlLXJvbmd5YW8tcm9uZ3lhby16aGktemhhbmc=",
        },
        {
          name: "The Daily Life of the Immortal King 4 - ONA 11",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/xian-wang-de-richang-shenghuo-4.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC90aGUtZGFpbHktbGlmZS1vZi10aGUtaW5tb3J0YWwta2luZy00bmQtc2Vhc29uLzExLw==",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC90aGUtZGFpbHktbGlmZS1vZi10aGUtaW5tb3J0YWwta2luZy00bmQtc2Vhc29u",
        },
        {
          name: "Yi Ren Jun Moye - ONA 4",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/yi-ren-jun-moye.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC95aS1yZW4tanVuLW1veWUvNC8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC95aS1yZW4tanVuLW1veWU=",
        },
        {
          name: "Wu Nao Monu 2nd Season - ONA 8",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/wu-nao-monu-2nd-season.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC93dS1uYW8tbW9udS0ybmQtc2Vhc29uLzgv",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC93dS1uYW8tbW9udS0ybmQtc2Vhc29u",
        },
        {
          name: "Wangzhe Rongyao: Rongyao Zhi Zhang - ONA 3",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/wangzhe-rongyao-rongyao-zhi-zhang.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC93YW5nemhlLXJvbmd5YW8tcm9uZ3lhby16aGktemhhbmcvMy8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC93YW5nemhlLXJvbmd5YW8tcm9uZ3lhby16aGktemhhbmc=",
        },
        {
          name: "Wangzhe Rongyao: Rongyao Zhi Zhang - ONA 2",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/wangzhe-rongyao-rongyao-zhi-zhang.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC93YW5nemhlLXJvbmd5YW8tcm9uZ3lhby16aGktemhhbmcvMi8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC93YW5nemhlLXJvbmd5YW8tcm9uZ3lhby16aGktemhhbmc=",
        },
        {
          name: "Wangzhe Rongyao: Rongyao Zhi Zhang - ONA 1",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/wangzhe-rongyao-rongyao-zhi-zhang.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC93YW5nemhlLXJvbmd5YW8tcm9uZ3lhby16aGktemhhbmcvMS8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC93YW5nemhlLXJvbmd5YW8tcm9uZ3lhby16aGktemhhbmc=",
        },
        {
          name: "Yi Ren Jun Moye - ONA 3",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/yi-ren-jun-moye.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC95aS1yZW4tanVuLW1veWUvMy8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC95aS1yZW4tanVuLW1veWU=",
        },
        {
          name: "Yi Ren Jun Moye - ONA 2",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/yi-ren-jun-moye.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC95aS1yZW4tanVuLW1veWUvMi8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC95aS1yZW4tanVuLW1veWU=",
        },
        {
          name: "Yi Ren Jun Moye - ONA 1",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/yi-ren-jun-moye.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC95aS1yZW4tanVuLW1veWUvMS8=",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC95aS1yZW4tanVuLW1veWU=",
        },
        {
          name: "Bu Shi Bu Mie - ONA 13",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/bu-shi-bu-mie.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9idS1zaGktYnUtbWllLzEzLw==",
          parentPath:
            "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9idS1zaGktYnUtbWll",
        },
      ],
      "Últimos animes": [
        {
          name: "Aishang Ta de Liyou Extra",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/aishang-ta-de-liyou-extra.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9haXNoYW5nLXRhLWRlLWxpeW91LWV4dHJhLw==",
        },
        {
          name: "Great Pretender: Razbliuto",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/great-pretender-razbliuto.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9ncmVhdC1wcmV0ZW5kZXItcmF6YmxpdXRvLw==",
        },
        {
          name: "Wangzhe Rongyao: Rongyao Zhi Zhang",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/wangzhe-rongyao-rongyao-zhi-zhang.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC93YW5nemhlLXJvbmd5YW8tcm9uZ3lhby16aGktemhhbmcv",
        },
        {
          name: "Yi Ren Jun Moye",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/yi-ren-jun-moye.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC95aS1yZW4tanVuLW1veWUv",
        },
        {
          name: "Ninja Kamui",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/ninja-kamui.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uaW5qYS1rYW11aS8=",
        },
        {
          name: "Meng Qi Shi Shen: Zaijie Liangyuan",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/meng-qi-shi-shen-zaijie-liangyuan.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9tZW5nLXFpLXNoaS1zaGVuLXphaWppZS1saWFuZ3l1YW4v",
        },
        {
          name: "Zhen Hun Jie: Bei Luo Shi Men Pian Part 2",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/zhen-hun-jie-bei-luo-shi-men-pian-part-2.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC96aGVuLWh1bi1qaWUtYmVpLWx1by1zaGktbWVuLXBpYW4tcGFydC0yLw==",
        },
        {
          name: "Bishoujo Senshi Sailor Moon Cosmos Movie",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/bishoujo-senshi-sailor-moon-cosmos-movie.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9iaXNob3Vqby1zZW5zaGktc2FpbG9yLW1vb24tY29zbW9zLW1vdmllLw==",
        },
        {
          name: "Zhen Hun Jie: Bei Luo Shi Men Pian Part 1",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/zhen-hun-jie-bei-luo-shi-men-pian-part-1.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC96aGVuLWh1bi1qaWUtYmVpLWx1by1zaGktbWVuLXBpYW4tcGFydC0xLw==",
        },
        {
          name: "Kui Cheng Shoufu Cong Youxi Kaishi",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/kui-cheng-shoufu-cong-youxi-kaishi.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9rdWktY2hlbmctc2hvdWZ1LWNvbmcteW91eGkta2Fpc2hpLw==",
        },
        {
          name: "Wonderful Precure!",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/wonderful-precure.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC93b25kZXJmdWwtcHJlY3VyZS8=",
        },
        {
          name: "Blame! Movie",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/blame-movie.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9ibGFtZS1tb3ZpZS8=",
        },
        {
          name: "Meng Qi Shi Shen",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/meng-qi-shi-shen.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9tZW5nLXFpLXNoaS1zaGVuLw==",
        },
        {
          name: "Monsters: Ippyaku Sanjou Hiryuu Jigoku",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/monsters-ippyaku-sanjou-hiryuu-jigoku.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9tb25zdGVycy1pcHB5YWt1LXNhbmpvdS1oaXJ5dXUtamlnb2t1Lw==",
        },
        {
          name: "Alice to Therese no Maboroshi Koujou",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/alice-to-therese-no-maboroshi-koujou.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9hbGljZS10by10aGVyZXNlLW5vLW1hYm9yb3NoaS1rb3Vqb3Uv",
        },
        {
          name: "Wu Nao Monu 2nd Season",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/wu-nao-monu-2nd-season.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC93dS1uYW8tbW9udS0ybmQtc2Vhc29uLw==",
        },
        {
          name: "Yami Shibai 12",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/yami-shibai-12.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC95YW1pLXNoaWJhaS0xMi8=",
        },
        {
          name: "Hikari no Ou 2nd Season",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/hikari-no-ou-2nd-season.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9oaWthcmktbm8tb3UtMm5kLXNlYXNvbi8=",
        },
        {
          name: "Meiji Gekken: 1874",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/meiji-gekken-1874.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9tZWlqaS1nZWtrZW4tMTg3NC8=",
        },
        {
          name: "Cardfight!! Vanguard: Divinez",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/cardfight-vanguard-divinez.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9jYXJkZmlnaHQtdmFuZ3VhcmQtZGl2aW5lei8=",
        },
        {
          name: "Chou Futsuu Ken Chiba Densetsu",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/chou-futsuu-ken-chiba-densetsu.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9jaG91LWZ1dHN1dS1rZW4tY2hpYmEtZGVuc2V0c3Uv",
        },
        {
          name: "Snack Basue",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/snack-basue.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zbmFjay1iYXN1ZS8=",
        },
        {
          name: "Yuuki Bakuhatsu Bang Bravern",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/yuuki-bakuhatsu-bang-bravern.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC95dXVraS1iYWt1aGF0c3UtYmFuZy1icmF2ZXJuLw==",
        },
        {
          name: 'Meitou "Isekai no Yu" Kaitakuki: Around 40 Onsen Mania no Tensei Saki wa, Nonbiri Onsen Tengoku deshita',
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/meitou-isekai-no-yu-kaitakuki-around-40-onsen-mania-no-tensei-saki-wa-nonbiri-onsen-tengoku-deshita.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9tZWl0b3UtaXNla2FpLW5vLXl1LWthaXRha3VraS1hcm91bmQtNDAtb25zZW4tbWFuaWEtbm8tdGVuc2VpLXNha2ktd2Etbm9uYmlyaS1vbnNlbi10ZW5nb2t1LWRlc2hpdGEv",
        },
        {
          name: "Gekkan Mousou Kagaku",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/gekkan-mousou-kagaku.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9nZWtrYW4tbW91c291LWthZ2FrdS8=",
        },
        {
          name: "Xiao Lu He Xiao Lan 4th Season",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/xiao-lu-he-xiao-lan-4th-season.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC94aWFvLWx1LWhlLXhpYW8tbGFuLTR0aC1zZWFzb24v",
        },
        {
          name: "Synduality: Noir Part 2",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/synduality-noir-part-2.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0yLw==",
        },
        {
          name: "Saikyou Tank no Meikyuu Kouryaku: Tairyoku 9999 no Rare Skill-mochi Tank, Yuusha Party wo Tsuihou sareru",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/saikyou-tank-no-meikyuu-kouryaku-tairyoku-9999-no-rare-skill-mochi-tank-yuusha-party-wo-tsuihou-sareru.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zYWlreW91LXRhbmstbm8tbWVpa3l1dS1rb3VyeWFrdS10YWlyeW9rdS05OTk5LW5vLXJhcmUtc2tpbGwtbW9jaGktdGFuay15dXVzaGEtcGFydHktd28tdHN1aWhvdS1zYXJlcnUv",
        },
        {
          name: "Pon no Michi",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/pon-no-michi.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9wb24tbm8tbWljaGkv",
        },
        {
          name: "Sasaki to Pii-chan",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/sasaki-to-pii-chan.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zYXNha2ktdG8tcGlpLWNoYW4v",
        },
        {
          name: "Huoxing Xi Lu 7 Hao",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/huoxing-xi-lu-7-hao.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9odW94aW5nLXhpLWx1LTctaGFvLw==",
        },
        {
          name: "Zhen Hun Jie",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/zhen-hun-jie.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC96aGVuLWh1bi1qaWUv",
        },
        {
          name: "Jie Yao",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/jie-yao.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9qaWUteWFvLw==",
        },
        {
          name: "Xue Yu Xin",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/xue-yu-xin.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC94dWUteXUteGluLw==",
        },
        {
          name: "Tuanzimen de Shiming",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/tuanzimen-de-shiming.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC90dWFuemltZW4tZGUtc2hpbWluZy8=",
        },
        {
          name: "Burn the Witch 0.8",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/burn-the-witch-08.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9idXJuLXRoZS13aXRjaC0wOC8=",
        },
        {
          name: "30-sai made Doutei dato Mahoutsukai ni Nareru Rashii",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/30-sai-made-doutei-dato-mahoutsukai-ni-nareru-rashii.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC8zMC1zYWktbWFkZS1kb3V0ZWktZGF0by1tYWhvdXRzdWthaS1uaS1uYXJlcnUtcmFzaGlpLw==",
        },
        {
          name: "Sengoku Youko",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/sengoku-youko.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zZW5nb2t1LXlvdWtvLw==",
        },
        {
          name: "Momochi-san Chi no Ayakashi Ouji",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/momochi-san-chi-no-ayakashi-ouji.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9tb21vY2hpLXNhbi1jaGktbm8tYXlha2FzaGktb3VqaS8=",
        },
        {
          name: 'Himesama "Goumon" no Jikan desu',
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/himesama-goumon-no-jikan-desu.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9oaW1lc2FtYS1nb3Vtb24tbm8tamlrYW4tZGVzdS8=",
        },
      ],
      "Ovas, Películas, etc.": [
        {
          name: "Great Pretender: Razbliuto - ONA 1",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/great-pretender-razbliuto.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9ncmVhdC1wcmV0ZW5kZXItcmF6YmxpdXRvLzEv",
        },
        {
          name: "Bishoujo Senshi Sailor Moon Cosmos Movie - Pelicula 2",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/bishoujo-senshi-sailor-moon-cosmos-movie.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9iaXNob3Vqby1zZW5zaGktc2FpbG9yLW1vb24tY29zbW9zLW1vdmllLzIv",
        },
        {
          name: "Bishoujo Senshi Sailor Moon Cosmos Movie - Pelicula 1",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/bishoujo-senshi-sailor-moon-cosmos-movie.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9iaXNob3Vqby1zZW5zaGktc2FpbG9yLW1vb24tY29zbW9zLW1vdmllLzEv",
        },
        {
          name: "Monsters: Ippyaku Sanjou Hiryuu Jigoku - ONA",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/monsters-ippyaku-sanjou-hiryuu-jigoku.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9tb25zdGVycy1pcHB5YWt1LXNhbmpvdS1oaXJ5dXUtamlnb2t1Lw==",
        },
        {
          name: "Ooyukiumi no Kaina: Hoshi no Kenja - Pelicula",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/ooyukiumi-no-kaina-hoshi-no-kenja.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9vb3l1a2l1bWktbm8ta2FpbmEtaG9zaGktbm8ta2VuamEv",
        },
        {
          name: 'Jashin-chan Dropkick "Seikimatsu-hen" - Especial',
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/jashin-chan-dropkick-seikimatsu-hen.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9qYXNoaW4tY2hhbi1kcm9wa2ljay1zZWlraW1hdHN1LWhlbi8=",
        },
        {
          name: "Dragon Ball Heroes - ONA 52",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/dragon-ball-heroes.jpg",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9kcmFnb24tYmFsbC1oZXJvZXMvNTIv",
        },
        {
          name: "Twi-Yaba - ONA",
          image:
            "https://cdn.jkdesu.com/assets/images/animes/image/twi-yaba.jpg",
          path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC90d2kteWFiYS8=",
        },
      ],
    });
  }
  async getDescription(after, onError, path, page = 0) {
    if (this.waitOrFail()) {
      onError();
      return;
    }
    after({
      name: "Synduality: Noir Part 2",
      path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0y",
      image:
        "https://cdn.jkdesu.com/assets/images/animes/image/synduality-noir-part-2.jpg",
      items: ["Parte 2 de Sindualidad: Noir", "Tipo: Serie"],
      chapters: [
        {
          name: "Capítulo 1",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0yLzEv",
        },
        {
          name: "Capítulo 2",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0yLzIv",
        },
        {
          name: "Capítulo 3",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0yLzMv",
        },
        {
          name: "Capítulo 4",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0yLzQv",
        },
        {
          name: "Capítulo 5",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0yLzUv",
        },
        {
          name: "Capítulo 6",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0yLzYv",
        },
        {
          name: "Capítulo 7",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0yLzcv",
        },
        {
          name: "Capítulo 8",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0yLzgv",
        },
      ],
    });
  }
  async getParent(after, path) {
    after({
      name: "Synduality: Noir Part 2",
      path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0y",
      image:
        "https://cdn.jkdesu.com/assets/images/animes/image/synduality-noir-part-2.jpg",
      items: ["Parte 2 de Sindualidad: Noir", "Tipo: Serie"],
      chapters: [
        {
          name: "Capítulo 1",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0yLzEv",
        },
        {
          name: "Capítulo 2",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0yLzIv",
        },
        {
          name: "Capítulo 3",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0yLzMv",
        },
        {
          name: "Capítulo 4",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0yLzQv",
        },
        {
          name: "Capítulo 5",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0yLzUv",
        },
        {
          name: "Capítulo 6",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0yLzYv",
        },
        {
          name: "Capítulo 7",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0yLzcv",
        },
        {
          name: "Capítulo 8",
          path: "testserver/getLinks/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zeW5kdWFsaXR5LW5vaXItcGFydC0yLzgv",
        },
      ],
    });
  }
  async getSearch(after, onError, query) {
    if (this.waitOrFail()) {
      onError();
      return;
    }

    after([
      {
        name: "Arata naru Sekai: Mirai-hen - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/arata-naru-sekai-mirai-hen.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9hcmF0YS1uYXJ1LXNla2FpLW1pcmFpLWhlbi8=",
      },
      {
        name: "Boruto: Naruto Next Generations - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/boruto-naruto-next-generations.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9ib3J1dG8tbmFydXRvLW5leHQtZ2VuZXJhdGlvbnMv",
      },
      {
        name: "Boruto: Naruto the Movie - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/boruto-naruto-the-movie.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9ib3J1dG8tbmFydXRvLXRoZS1tb3ZpZS8=",
      },
      {
        name: "Higeki no Genkyou to Naru Saikyou Gedou Last Boss Joou wa Tami no Tame ni Tsukushimasu. - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/higeki-no-genkyou-to-naru-saikyou-gedou-last-boss-joou-wa-tami-no-tame-ni-tsukushimasu.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9oaWdla2ktbm8tZ2Vua3lvdS10by1uYXJ1LXNhaWt5b3UtZ2Vkb3UtbGFzdC1ib3NzLWpvb3Utd2EtdGFtaS1uby10YW1lLW5pLXRzdWt1c2hpbWFzdS8=",
      },
      {
        name: "Honzuki no Gekokujou: Shisho ni Naru Tame ni wa Shudan wo Erandeiraremasen - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/honzuki-no-gekokujou-shisho-ni-naru-tame-ni-wa-shudan-wo-erandeiraremasen.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9ob256dWtpLW5vLWdla29rdWpvdS1zaGlzaG8tbmktbmFydS10YW1lLW5pLXdhLXNodWRhbi13by1lcmFuZGVpcmFyZW1hc2VuLw==",
      },
      {
        name: "Honzuki no Gekokujou: Shisho ni Naru Tame ni wa Shudan wo Erandeiraremasen 3rd Season - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/honzuki-no-gekokujou-shisho-ni-naru-tame-ni-wa-shudan-wo-erandeiraremasen-3rd-season.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9ob256dWtpLW5vLWdla29rdWpvdS1zaGlzaG8tbmktbmFydS10YW1lLW5pLXdhLXNodWRhbi13by1lcmFuZGVpcmFyZW1hc2VuLTNyZC1zZWFzb24v",
      },
      {
        name: "Kamisama Hajimemashita: Kamisama, Shiawase ni Naru - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/kamisama-hajimemashita-kamisama-shiawase-ni-naru.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9rYW1pc2FtYS1oYWppbWVtYXNoaXRhLWthbWlzYW1hLXNoaWF3YXNlLW5pLW5hcnUv",
      },
      {
        name: "Naruto - Concluido",
        image: "https://cdn.jkdesu.com/assets/images/animes/image/naruto.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uYXJ1dG8v",
      },
      {
        name: "Naruto ga Hokage ni Natta Hi - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/boruto-naruto-the-movie-naruto-ga-hokage-ni-natta-hi.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9ib3J1dG8tbmFydXRvLXRoZS1tb3ZpZS1uYXJ1dG8tZ2EtaG9rYWdlLW5pLW5hdHRhLWhpLw==",
      },
      {
        name: "Naruto Narutimate Hero 3: Tsuini Gekitotsu! Jounin vs. Genin!! Musabetsu Dairansen Taikai Kaisai!! - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/naruto-narutimate-hero-3-tsuini-gekitotsu-jounin-vs-genin-musabetsu-dairansen-taikai-kaisai.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uYXJ1dG8tbmFydXRpbWF0ZS1oZXJvLTMtdHN1aW5pLWdla2l0b3RzdS1qb3VuaW4tdnMtZ2VuaW4tbXVzYWJldHN1LWRhaXJhbnNlbi10YWlrYWkta2Fpc2FpLw==",
      },
      {
        name: "Naruto Shippuden - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/naruto-shippuden.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uYXJ1dG8tc2hpcHB1ZGVuLw==",
      },
      {
        name: "Naruto Shippuden: Sunny Side Battle - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/naruto-shippuuden-sunny-side-battle.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uYXJ1dG8tc2hpcHB1dWRlbi1zdW5ueS1zaWRlLWJhdHRsZS8=",
      },
      {
        name: "Naruto: Akaki Yotsuba no Clover wo Sagase - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/naruto-akaki-yotsuba-no-clover-wo-sagase.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uYXJ1dG8tYWtha2kteW90c3ViYS1uby1jbG92ZXItd28tc2FnYXNlLw==",
      },
      {
        name: "Naruto: Honoo no Chuunin Shiken! Naruto vs. Konohamaru!! - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/naruto-honoo-no-chuunin-shiken-naruto-vs.-konohamaru.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uYXJ1dG8taG9ub28tbm8tY2h1dW5pbi1zaGlrZW4tbmFydXRvLXZzLi1rb25vaGFtYXJ1Lw==",
      },
      {
        name: "Naruto: Shippuuden Movie 1 - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/naruto-shippuuden-movie-1.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uYXJ1dG8tc2hpcHB1dWRlbi1tb3ZpZS0xLw==",
      },
      {
        name: "Naruto: Shippuuden Movie 2 - Kizuna - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/naruto-shippuuden-movie-2-kizuna.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uYXJ1dG8tc2hpcHB1dWRlbi1tb3ZpZS0yLWtpenVuYS8=",
      },
      {
        name: "Naruto: Shippuuden Movie 3 - Hi no Ishi wo Tsugu Mono - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/naruto-shippuuden-movie-3-hi-no-ishi-wo-tsugu-mono.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uYXJ1dG8tc2hpcHB1dWRlbi1tb3ZpZS0zLWhpLW5vLWlzaGktd28tdHN1Z3UtbW9uby8=",
      },
      {
        name: "Naruto: Shippuuden Movie 4 - The Lost Tower - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/naruto-shippuuden-movie-4-the-lost-tower.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uYXJ1dG8tc2hpcHB1dWRlbi1tb3ZpZS00LXRoZS1sb3N0LXRvd2VyLw==",
      },
      {
        name: "Naruto: Shippuuden Movie 5 - Blood Prison - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/naruto-shippuuden-movie-5-blood-prison.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uYXJ1dG8tc2hpcHB1dWRlbi1tb3ZpZS01LWJsb29kLXByaXNvbi8=",
      },
      {
        name: "Naruto: Shippuuden Movie 6 - Road to Ninja - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/naruto-shippuuden-movie-6-road-to-ninja.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uYXJ1dG8tc2hpcHB1dWRlbi1tb3ZpZS02LXJvYWQtdG8tbmluamEv",
      },
      {
        name: "Naruto: Shippuuden Movie 7 - The Last - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/naruto-shippuuden-movie-7-the-last.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uYXJ1dG8tc2hpcHB1dWRlbi1tb3ZpZS03LXRoZS1sYXN0Lw==",
      },
      {
        name: "Naruto: Takigakure no Shitou - Ore ga Eiyuu Dattebayo! - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/naruto-takigakure-no-shitou-ore-ga-eiyuu-dattebayo.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9uYXJ1dG8tdGFraWdha3VyZS1uby1zaGl0b3Utb3JlLWdhLWVpeXV1LWRhdHRlYmF5by8=",
      },
      {
        name: "Subete ga F ni Naru: The Perfect Insider - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/subete-ga-f-ni-naru-the-perfect-insider.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zdWJldGUtZ2EtZi1uaS1uYXJ1LXRoZS1wZXJmZWN0LWluc2lkZXIv",
      },
      {
        name: "Suki ni Naru Sono Shunkan wo.: Kokuhaku Jikkou Iinkai - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/suki-ni-naru-sono-shunkan-wo-kokuhaku-jikkou-iinkai.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC9zdWtpLW5pLW5hcnUtc29uby1zaHVua2FuLXdvLWtva3VoYWt1LWppa2tvdS1paW5rYWkv",
      },
      {
        name: "Yagate Kimi ni Naru - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/yagate-kimi-ni-naru.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC95YWdhdGUta2ltaS1uaS1uYXJ1Lw==",
      },
      {
        name: "Zom 100: Zombie ni Naru made ni Shitai 100 no Koto - Concluido",
        image:
          "https://cdn.jkdesu.com/assets/images/animes/image/zom-100-zombie-ni-naru-made-ni-shitai-100-no-koto.jpg",
        path: "testserver/getDescription/aHR0cHM6Ly9qa2FuaW1lLm5ldC96b20tMTAwLXpvbWJpZS1uaS1uYXJ1LW1hZGUtbmktc2hpdGFpLTEwMC1uby1rb3RvLw==",
      },
    ]);
  }
  async getLinks(after, onError, path) {
    if (this.waitOrFail()) {
      onError();
      return;
    }

    after([
      "/um.php?e=UWdjRXBzWHUxUEQzVWZaT204VzJGQ2N0S2FkelR5dXZRdjkrSXRWZTh1L1Bab2txVi9QZ3N4Smh6VGdaMzFQbi91Rk5jNFo5Nys4OFBqbHhEaE5mNERjMmRJQ2ZPZHBQbksxMlpCWmVqSWM9OjqMxqNskdq9dcgV9p3twFKb&t=2c175aeb483b4ff56458a40fe255d607",
      "https://sfastwish.com/e/vkebtx9hk5jf||server_name_streamwish.",
      "https://voe.sx/e/kyyw7ahmjuw8||server_name_voe.",
      "https://mixdrop.is/e/mdpwmjlwbmenxl||server_name_mixdrop.",
      "https://www.mp4upload.com/embed-a00lx2jxp5zt.html||server_name_mp4upload.",
      "https://filemoon.sx/e/orjkge3kt7hq/||server_name_filemoon.",
      "https://streamtape.com/e/rAJvBX3GrpIbJbQ/tsuuukiiimichiiisakdouucho2nseasunss-08.mp4||server_name_streamtape.",
    ]);
  }
}
