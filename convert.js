import { glob, globSync, globStream, globStreamSync, Glob } from "glob";
import fs from "fs";
import cheerio from "cheerio";
import Encoding from "encoding-japanese";
import {
  eucToStr,
  getSearchParamQuoted,
  checkBase,
  pageExists,
  kanaToHira,
} from "./global.js";
// const lunr = require("lunr");
// require("lunr-languages/lunr.stemmer.support")(lunr);
// require("lunr-languages/tinyseg")(lunr);
// require("lunr-languages/lunr.ja")(lunr);

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
    if (!page.includes("ptcmcon/")) {
      const i = convert(page);
      if (i != null) {
        if (!page.includes("cmd=") && !page.includes("plugin=")) {
          // this.add(i);
          idx.push(i);
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
