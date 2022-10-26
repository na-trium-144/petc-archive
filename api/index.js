const express = require("express");
const ejs = require("ejs");
const app = express();
const cheerio = require('cheerio');
const fs = require('fs');
const iconv = require("iconv-lite");

function queryToBuffer(q) {
  let i = 0;
  let a = [];
  while (i < q.length) {
    if (q.charCodeAt(i) === 37) {
      a.push(parseInt(q.slice(i + 1, i + 3), 16));
      i += 3;
    } else {
      a.push(q.charCodeAt(i));
      i += 1;
    }
  }
  return Buffer.from(a);
}

function pageExists(page) {
  if (!page.startsWith("/")) {
    return true;
  }
  page = page.replace("?", "");
  if (page.indexOf("#") >= 0) {
    page = page.slice(0, page.indexOf("#"));
  }
  page = iconv.decode(queryToBuffer(page), "eucjp");
  if (fs.existsSync("websites_utf8/wiki.hosiken.jp/" + page + "/index.html")) {
    return true;
  }
  if (fs.existsSync("websites_utf8/wiki.hosiken.jp/" + page + "/" + page.slice(page.lastIndexOf("=") + 1))) {
    return true;
  }
  return false;
}

app.get("/petc(3gou)?4?/", (request, response) => {
  let page = request.originalUrl;
  if (page.indexOf("#") >= 0) {
    page = page.slice(0, page.indexOf("#"));
  }
  page = page.replace("?", "");
  page = iconv.decode(queryToBuffer(page), "eucjp");
  if (fs.existsSync("websites_utf8/wiki.hosiken.jp/" + page + "/index.html")) {
    const $ = cheerio.load(iconv.decode(fs.readFileSync("websites_utf8/wiki.hosiken.jp/" + page + "/index.html"), "eucjp"));
    for (let a of $("a").get()) {
      let href = $(a).attr('href');
      let title = $(a).attr('title');
      let content = $(a).html();
      if (href) {
        if (href.startsWith("http://wiki.hosiken.jp/")) {
          href = href.replace("http://wiki.hosiken.jp/", "/");
          $(a).replaceWith(`<a href="${href}" title="${title}">${content}</a>`);
        }
        if (!pageExists(href)) {
          $(a).replaceWith(`<a style="color: red;" href="${href}" title="${title}">${content}</a>`)
        }
      }
    }
    const bodyHtml = $("#body").html();
    const notesHtml = $("#notes").html();
    const pageTitle = $("#block-body-container > h2").text();
    const about = $("#pukiwiki-about").text();
    const lastUpdate = about.slice(about.indexOf("このページの最終更新 : "), about.indexOf("このページの最終更新 : ") + 36);

    const template = fs.readFileSync("template.ejs", "utf-8");
    const html = ejs.render(template, {
      wikiTitle: "プチコンまとめArchive",
      pageTitle: pageTitle,
      base: request.path,
      body: bodyHtml,
      lastUpdate: lastUpdate,
      notes: notesHtml
    });
    response.send(html);
  } else if (fs.existsSync("websites_utf8/wiki.hosiken.jp/" + page + "/" + page.slice(page.lastIndexOf("=") + 1))) {
    response.sendFile(__dirname + "/websites_utf8/wiki.hosiken.jp/" + page + "/" + page.slice(page.lastIndexOf("=") + 1));
  } else {
    const template = fs.readFileSync("template.ejs", "utf-8");
    const html = ejs.render(template, {
      wikiTitle: "プチコンまとめArchive",
      pageTitle: "ページが見つかりません",
      base: request.path,
      body: `<p>ページ ${iconv.decode(queryToBuffer(page), "eucjp")} は プチコンまとめArchive に存在しません。</p>`,
      lastUpdate: "",
      notes: ""
    });
    response.send(html);
  }
});

app.get("/", (request, response) => {
  const template = fs.readFileSync("template.ejs", "utf-8");
  const html = ejs.render(template, {
    wikiTitle: "プチコンまとめArchive",
    pageTitle: "プチコンまとめArchive トップページ",
    base: request.path,
    body: fs.readFileSync("index.html", "utf-8"),
    lastUpdate: "",
    notes: ""
  });
  response.send(html);
});

module.exports = app;
