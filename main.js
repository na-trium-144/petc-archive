const express = require("express");
const ejs = require("ejs");
const app = express();
const cheerio = require('cheerio');
const fs = require('fs');
const iconv = require("iconv-lite");

app.use(express.static("static"));

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
  if(!page.startsWith("/")){
    return true;
  }
  page = page.replace("?", "");
  if(page.indexOf("#") >= 0){
    page = page.slice(0, page.indexOf("#"));
  }
  page = iconv.decode(queryToBuffer(page), "eucjp");
  return fs.existsSync("websites_utf8/wiki.hosiken.jp/" + page + "/index.html");
}

app.get("/petc(3gou)?4?/", (request, response) => {
  let page = request.originalUrl;
  if(page.indexOf("#") >= 0){
    page = page.slice(0, page.indexOf("#"));
  }
  if(pageExists(page)){
    page = page.replace("?", "");
    page = iconv.decode(queryToBuffer(page), "eucjp");
    const $ = cheerio.load(iconv.decode(fs.readFileSync("websites_utf8/wiki.hosiken.jp/" + page + "/index.html"), "eucjp"));
    for (let a of $("a").get()){
      console.log(a)
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
    const template = fs.readFileSync("template.ejs", "utf-8");
    const html = ejs.render(template, {
      wikititle: "プチコンまとめArchive",
      pagetitle: pageTitle,
      base: request.path,
      body: bodyHtml,
      notes: notesHtml
    });
    response.send(html);
  } else{
    const template = fs.readFileSync("template.ejs", "utf-8");
    const html = ejs.render(template, {
      wikititle: "プチコンまとめArchive",
      pagetitle: "ページが見つかりません",
      base: request.path,
      body: `<p>ページ ${iconv.decode(queryToBuffer(page), "eucjp")} は プチコンまとめArchive に存在しません。</p>`,
      notes: ""
    });
    response.send(html);
  }
});

app.get("/", (request, response) => {
  const template = fs.readFileSync("template.ejs", "utf-8");
  const html = ejs.render(template, {
    wikititle: "プチコンまとめArchive",
    pagetitle: "プチコンまとめArchive トップページ",
    base: request.path,
    body: fs.readFileSync("index.html", "utf-8"),
    notes: ""
  });
  response.send(html);
});
app.listen(3000);
