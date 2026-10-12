import { glob, globSync, globStream, globStreamSync, Glob } from "glob";
import fs from "fs";
import * as cheerio from "cheerio";
import Encoding from "encoding-japanese";
import {
  eucToStr,
  strToEuc,
  getSearchParamQuoted,
  checkBase,
  pageExists,
  kanaToHira,
} from "./global.js";
// const lunr = require("lunr");
// require("lunr-languages/lunr.stemmer.support")(lunr);
// require("lunr-languages/tinyseg")(lunr);
// require("lunr-languages/lunr.ja")(lunr);

import { SitemapStream } from "sitemap";
import { Readable } from "node:stream";
import { text } from "node:stream/consumers";

const sitemapItems = [
  { url: "/", priority: 1 },
  { url: "/search" },
];

const convert = (page) => {
  const $ = cheerio.load(
    eucToStr(
      fs.readFileSync("websites_utf8/wiki.hosiken.jp/" + page + "/index.html")
    )
  );
  const orginalTitle = $("title").text();
  let bodyHtml;
  let lastUpdate = "";
  const base = checkBase(page);
  const basePath = page.slice(0, page.indexOf("/")); // petc or petc3gou or petc4

  if (orginalTitle.indexOf("プチコンまとめArchive") >= 0) {
    lastUpdate = $("#block-pankuzu-body > div").text();
  } else {
    // 変換前のhtmlのみ処理
    const about = $("#pukiwiki-about").text();
    lastUpdate = about.slice(
      about.indexOf("このページの最終更新 : "),
      about.indexOf("  (", about.indexOf("このページの最終更新 : "))
    );
  }
  // 全角半角の正規化、ひらがな化、小文字化
  const pageText = kanaToHira(
    $("#body *")
      .contents()
      .map(function () {
        return this.type === "text" ? $(this).text() + " " : "";
      })
      .get()
      .join(" ")
      .normalize("NFKD")
      .toLowerCase()
  );
  const pageTitle = kanaToHira(
    $("#block-body-container > h2").text().normalize("NFKD").toLowerCase()
  );
  if (pageTitle.endsWith("の編集")) {
    // 存在しないページ
    fs.unlinkSync("websites_utf8/wiki.hosiken.jp/" + page + "/index.html");
    return null;
  }
  return {
    page: page,
    pageNormalized: kanaToHira(page.normalize("NFKD").toLowerCase()),
    pageTitle: pageTitle,
    pageText: pageText,
    // base: base,
    // lastUpdate: lastUpdate,
  };
};

// let idx = lunr(function () {
// this.use(lunr.ja);
// this.ref("page");
// this.field("page");
// this.field("pageTitle");
// this.field("pageText");

const idx = [];
const pages = [];
const g = new Glob("websites_utf8/**/*.html", { withFileTypes: false });
for (const file of g) {
  // console.log(file);
  const page = file.slice(
    "websites_utf8/wiki.hosiken.jp/".length,
    -"/index.html".length
  );
  // console.log(page);
  try {
    // output.push(convert(page));
    if (!page.includes("ptcmcon")) {
      const i = convert(page);
      if (i != null) {
        if (page && !page.includes("cmd=") && !page.includes("plugin=")) {
          // this.add(i);
          idx.push(i);
          const si = i.page.indexOf("/");
          if(si === -1){
            sitemapItems.push({ url: `/${i.page}`});
          }else{
            sitemapItems.push({ url: `/${i.page.slice(0, si)}/?${strToEuc(i.page.slice(si + 1))}` });
          }
        }
        pages.push(i.page);
      }
    }
  } catch (err) {
    console.error(page);
    console.error(err.message);
  }
}
// });
fs.writeFileSync("searchIndex.json", JSON.stringify(idx), "utf-8");
fs.writeFileSync("pageIndex.json", JSON.stringify(pages), "utf-8");

const smStream = new SitemapStream({
  hostname: "https://petc.natrium144.org/",
});
Readable.from(sitemapItems).pipe(smStream);
// smStream.end();
fs.writeFileSync("public/sitemap.xml", await text(smStream), "utf-8");
