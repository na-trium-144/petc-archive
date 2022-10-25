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

app.get("/petc3gou/", (request, response) => {
  let page = "";
  for (let q in request.query) {
    if (q === "plugin" || q === "cmd") {
      break;
    } else {
      page = q;
    }
  }
  page = iconv.decode(queryToBuffer(page), "eucjp");
  const $ = cheerio.load(iconv.decode(fs.readFileSync("websites_utf8/wiki.hosiken.jp/petc3gou/" + page + "/index.html"), "eucjp"));
  const bodyHtml = $("#body").html();
  const notesHtml = $("#notes").html();
  const pageTitle = $("#block-body-container > h2").text();
  const template = fs.readFileSync("template.ejs", "utf-8");
  const html = ejs.render(template, {
    wikititle: "プチコンまとめArchive",
    pagetitle: pageTitle,
    body: bodyHtml,
    notes: notesHtml
  });
  response.send(html);
});

app.listen(3000);
