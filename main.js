const express = require("express");
const ejs = require("ejs");
const app = express();
const cheerio = require('cheerio');
const fs = require('fs');
const iconv = require("iconv-lite");

app.use(express.static("static"));

app.get("/", (request, response) => {
  const $ = cheerio.load(iconv.decode(fs.readFileSync("websites_utf8/wiki.hosiken.jp/petc3gou/index.html"), "eucjp"));
  const body_html = $("#body").html();
  const template = fs.readFileSync("template.ejs", "utf-8");
  const html = ejs.render(template, {
    body: body_html
  });
  response.send(html);
});

app.listen(3000);
