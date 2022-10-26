const express = require("express");
const ejs = require("ejs");
const app = express();
const cheerio = require('cheerio');
const fs = require('fs');
const iconv = require("iconv-lite");

const path = __dirname + "/..";
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
  if (fs.existsSync(path + "/websites_utf8/wiki.hosiken.jp/" + page + "/index.html")) {
    return true;
  }
  if (fs.existsSync(path + "/websites_utf8/wiki.hosiken.jp/" + page + "/" + page.slice(page.lastIndexOf("=") + 1))) {
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
  if (fs.existsSync(path + "/websites_utf8/wiki.hosiken.jp/" + page + "/index.html")) {
    const $ = cheerio.load(iconv.decode(fs.readFileSync(path + "/websites_utf8/wiki.hosiken.jp/" + page + "/index.html"), "eucjp"));
    for (let a of $("a").get()) {
      let href = $(a).attr('href');
      let title = $(a).attr('title');
      let content = $(a).html();
      if (href) {
        let url = new URL(href, `https://${request.hostname}/`);
        if (url.host === "wiki.hosiken.jp" || url.host === request.hostname) {
          if (url.searchParams.has("plugin") && url.searchParams.get("plugin") === "ref"){
            $(a).replaceWith(`<a href="/ref/${url.searchParams.get('page')}/${url.searchParams.get('src')}" title="${title}">${content}</a>`);
          } else if (url.searchParams.has("plugin") && url.searchParams.has("refer") && url.searchParams.get("plugin") === "attach"){
            $(a).replaceWith(`<a href="/ref/${url.searchParams.get('refer')}/${url.searchParams.get('openfile')}" title="${title}">${content}</a>`);
          }else if (pageExists(url.pathname + url.search)) {
            $(a).replaceWith(`<a href="${url.pathname + url.search}" title="${title}">${content}</a>`);
          }else{
            $(a).replaceWith(`<a style="color: red;" href="${url.href}" title="${title}">${content}</a>`)
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
          if (url.searchParams.has("plugin") && url.searchParams.get("plugin") === "ref"){
            $(a).replaceWith(`<img src="/ref/${url.searchParams.get('page')}/${url.searchParams.get('src')}" alt="${alt}" title="${title}" width=${w} height=${h} />`);
          } else if (url.searchParams.has("plugin") && url.searchParams.has("refer") && url.searchParams.get("plugin") === "attach"){
            $(a).replaceWith(`<a href="/ref/${url.searchParams.get('refer')}/${url.searchParams.get('openfile')}" alt="${alt}" title="${title}" width=${w} height=${h} />`);
          }
        }
      }
    }
    const bodyHtml = $("#body").html();
    const notesHtml = $("#notes").html();
    const pageTitle = $("#block-body-container > h2").text();
    const about = $("#pukiwiki-about").text();
    const lastUpdate = about.slice(about.indexOf("このページの最終更新 : "), about.indexOf("このページの最終更新 : ") + 36);

    const template = fs.readFileSync(path + "/template.ejs", "utf-8");
    const html = ejs.render(template, {
      wikiTitle: "プチコンまとめArchive",
      pageTitle: pageTitle,
      base: request.path,
      body: bodyHtml,
      lastUpdate: lastUpdate,
      notes: notesHtml
    });
    response.send(html);
  } else if (fs.existsSync(path + "/websites_utf8/wiki.hosiken.jp/" + page + "/" + page.slice(page.lastIndexOf("=") + 1))) {
    response.sendFile(path + "/websites_utf8/wiki.hosiken.jp/" + page + "/" + page.slice(page.lastIndexOf("=") + 1));
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
  const template = fs.readFileSync(path + "/template.ejs", "utf-8");
  const html = ejs.render(template, {
    wikiTitle: "プチコンまとめArchive",
    pageTitle: "プチコンまとめArchive トップページ",
    base: request.path,
    body: fs.readFileSync(path + "/index.html", "utf-8"),
    lastUpdate: "",
    notes: ""
  });
  response.send(html);
});

module.exports = app;
