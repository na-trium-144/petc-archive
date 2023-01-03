const express = require("express");
const ejs = require("ejs");
const app = express();
const cheerio = require('cheerio');
const fs = require('fs');
const Encoding = require('encoding-japanese');
const path = __dirname + "/..";
app.use(express.static("public"));

function pageTemplate() {
  return fs.readFileSync(path + "/template.ejs", "utf-8");
}

function eucToStr(b) {
  return Encoding.codeToString(Encoding.convert(b, {
    from: "EUC-JP",
    to: "UNICODE"
  }));
}

function pageExists(page) {
  if (!page.startsWith("/")) {
    return true;
  }
  page = page.replace("?", "");
  if (page.indexOf("#") >= 0) {
    page = page.slice(0, page.indexOf("#"));
  }
  page = eucToStr(Encoding.urlDecode(page));
  if (fs.existsSync(path + "/websites_utf8/wiki.hosiken.jp/" + page + "/index.html")) {
    return true;
  }
  if (fs.existsSync(path + "/websites_utf8/wiki.hosiken.jp/" + page + "/" + page.slice(page.lastIndexOf("=") + 1))) {
    return true;
  }
  return false;
}

function checkBase(url) {
  if (url.startsWith("/petc4")) {
    return 4;
  } else if (url.startsWith("/petc3gou")) {
    return 3;
  } else if (url.startsWith("/petc")) {
    return 2;
  }
  return 0;
}

function getSearchParamQuoted(search, key) {
  let param = search.slice(search.indexOf(key + "=") + key.length + 1);
  if (param.indexOf("&") >= 0) {
    param = param.slice(0, param.indexOf("&"));
  }
  return param;
}
app.get("/petc(3gou)?4?/", (request, response) => {
  let page = request.originalUrl;
  if (page.indexOf("#") >= 0) {
    page = page.slice(0, page.indexOf("#"));
  }
  page = page.replace("?", "");
  page = eucToStr(Encoding.urlDecode(page));
  if (fs.existsSync(path + "/websites_utf8/wiki.hosiken.jp/" + page + "/index.html")) {
    const $ = cheerio.load(eucToStr(fs.readFileSync(path + "/websites_utf8/wiki.hosiken.jp/" + page + "/index.html")));
    const orginalTitle = $("title").text();
    let bodyHtml;
    let lastUpdate = "";
    const base = checkBase(request.path);
    let pankuzuHtml = $("#list-pankuzu").html();
    if (orginalTitle.indexOf("プチコンまとめArchive") >= 0) {
      bodyHtml = $("#body").html();
      lastUpdate = $("#block-pankuzu-body > div").text();
    } else {
      // 変換前のhtmlのみ処理
      for (let a of $("a").get()) {
        let href = $(a).attr('href');
        let title = $(a).attr('title');
        let content = $(a).html();
        if (href && !href.startsWith("#")) {
          let url = new URL(href, `https://${request.hostname}/`);
          if (url.host === "wiki.hosiken.jp" || url.host === request.hostname) {
            //url.searchは%エンコードされたまま
            //url.searchParamsは勝手にデコードされてて無能
            if (url.searchParams.has("cmd") && url.searchParams.get("cmd") === "read") {
              //元のエンコードを保持する
              url = new URL(url.pathname + "?" + getSearchParamQuoted(url.search, "page") + url.hash, `https://${request.hostname}/`);
            }
            //画像はpublic公開のurlなのでutf-8に変換する
            if (url.searchParams.has("plugin") && url.searchParams.get("plugin") === "ref") {
              let sPage = Encoding.urlEncode(eucToStr(Encoding.urlDecode(getSearchParamQuoted(url.search, "page"))));
              let sSrc = Encoding.urlEncode(eucToStr(Encoding.urlDecode(getSearchParamQuoted(url.search, "src"))));
              $(a).replaceWith(`<a href="/ref${request.path}/${sPage}/${sSrc}" title="${title}">${content}</a>`);
            } else if (url.searchParams.has("plugin") && url.searchParams.has("refer") && url.searchParams.get("plugin") === "attach") {
              let sPage = Encoding.urlEncode(eucToStr(Encoding.urlDecode(getSearchParamQuoted(url.search, "refer"))));
              let sSrc = Encoding.urlEncode(eucToStr(Encoding.urlDecode(getSearchParamQuoted(url.search, "openfile"))));
              $(a).replaceWith(`<a href="/ref${request.path}/${sPage}/${sSrc}" title="${title}">${content}</a>`);
            } else if (pageExists(url.pathname + url.search)) {
              $(a).replaceWith(`<a href="${url.pathname + url.search + url.hash}" title="${title}">${content}</a>`);
            } else {
              $(a).replaceWith(`<a style="color: red;" href="${url.pathname + url.search + url.hash}" title="${title}">${content}</a>`)
            }
          }
        }
      }
      for (let a of $("img").get()) {
        let href = $(a).attr('src');
        let alt = $(a).attr('alt');
        let title = $(a).attr('title');
        let w = $(a).attr('width');
        let h = $(a).attr('height');
        if (href) {
          let url = new URL(href, `https://${request.hostname}/`);
          if (url.host === "wiki.hosiken.jp" || url.host === request.hostname) {
            if (url.searchParams.has("plugin") && url.searchParams.get("plugin") === "ref") {
              let sPage = Encoding.urlEncode(eucToStr(Encoding.urlDecode(getSearchParamQuoted(url.search, "page"))));
              let sSrc = Encoding.urlEncode(eucToStr(Encoding.urlDecode(getSearchParamQuoted(url.search, "src"))));
              $(a).replaceWith(`<img src="/ref${request.path}/${sPage}/${sSrc}" alt="${alt}" title="${title}" width=${w} height=${h} />`);
            } else if (url.searchParams.has("plugin") && url.searchParams.has("refer") && url.searchParams.get("plugin") === "attach") {
              let sPage = Encoding.urlEncode(eucToStr(Encoding.urlDecode(getSearchParamQuoted(url.search, "refer"))));
              let sSrc = Encoding.urlEncode(eucToStr(Encoding.urlDecode(getSearchParamQuoted(url.search, "openfile"))));
              $(a).replaceWith(`<a href="/ref${request.path}/${sPage}/${sSrc}" alt="${alt}" title="${title}" width=${w} height=${h} />`);
            }
          }
        }
      }
      if (base === 4) {
        pankuzuHtml = pankuzuHtml.replace("トップ", "プチコン4トップ");
      }
      if (base === 3) {
        pankuzuHtml = pankuzuHtml.replace("トップ", "プチコン3号&BIGトップ");
      }
      if (base === 2) {
        pankuzuHtml = pankuzuHtml.replace("トップ", "プチコン初代/mkIIトップ");
      }
      const about = $("#pukiwiki-about").text();
      lastUpdate = about.slice(about.indexOf("このページの最終更新 : "), about.indexOf("  (", about.indexOf("このページの最終更新 : ")));
      bodyHtml = $("#body").html();
    }
    const notesHtml = $("#notes").html();
    const pageTitle = $("#block-body-container > h2").text();
    const html = ejs.render(pageTemplate(), {
      wikiTitle: "プチコンまとめArchive",
      pageTitle: pageTitle,
      base: base,
      body: bodyHtml,
      pankuzu: pankuzuHtml,
      lastUpdate: lastUpdate,
      notes: notesHtml
    });
    response.send(html);
  } else if (fs.existsSync(path + "/websites_utf8/wiki.hosiken.jp/" + page + "/" + page.slice(page.lastIndexOf("=") + 1))) {
    response.sendFile(path + "/websites_utf8/wiki.hosiken.jp/" + page + "/" + page.slice(page.lastIndexOf("=") + 1));
  } else {
    const decodedAry = Encoding.urlDecode(request.originalUrl);
    const encoding = Encoding.detect(decodedAry);
    const decodedStr = Encoding.codeToString(Encoding.convert(decodedAry, {
      from: encoding,
      to: "UNICODE"
    }));
    let eucEncode = Encoding.urlEncode(Encoding.convert(decodedAry, {
      from: encoding,
      to: "EUC-JP"
    })).replaceAll("%2F", "/").replace("%3F", "?");
    if (!pageExists(eucEncode)) {
      eucEncode = "";
    }
    const html = ejs.render(pageTemplate(), {
      wikiTitle: "プチコンまとめArchive",
      pageTitle: "ページが見つかりません",
      base: checkBase(request.path),
      body: `<p>ページ ${eucToStr(Encoding.urlDecode(request.originalUrl))} は プチコンまとめArchive に存在しません。</p>` + (eucEncode ? `<p>ページ名はEUC-JPで指定する必要があります。もしかして: <a href="${eucEncode}">${decodedStr}</a></p>` : ""),
      pankuzu: "",
      lastUpdate: "",
      notes: ""
    });
    response.status(404).send(html);
  }
});
app.get("/", (request, response) => {
  const html = ejs.render(pageTemplate(), {
    wikiTitle: "プチコンまとめArchive",
    pageTitle: "プチコンまとめArchive トップページ",
    base: checkBase(request.path),
    body: fs.readFileSync(path + "/index.html", "utf-8"),
    pankuzu: "",
    lastUpdate: "",
    notes: ""
  });
  response.send(html);
});
app.use((request, response) => {
  const html = ejs.render(pageTemplate(), {
    wikiTitle: "プチコンまとめArchive",
    pageTitle: "ページが見つかりません",
    base: checkBase(request.path),
    body: request.method === "POST" ? `<p>編集やコメントの投稿は無効です。</p>` : `<p>URLが正しくありません。</p>`,
    pankuzu: "",
    lastUpdate: "",
    notes: ""
  });
  response.status(404).send(html);
});
module.exports = app;
