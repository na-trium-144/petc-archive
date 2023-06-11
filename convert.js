const { glob, globSync, globStream, globStreamSync, Glob } = require("glob");
const fs = require("fs");
const cheerio = require("cheerio");
const Encoding = require("encoding-japanese");
const { eucToStr, getSearchParamQuoted, checkBase, pageExists } = require("./global");

const hostname = "petc-archive.vercel.app";

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
  const pageText = $('html *').contents().map(function() {
    return (this.type === 'text') ? $(this).text()+' ' : '';
  }).get().join(' ');
  const pageTitle = $("#block-body-container > h2").text();
  return {
    page: page,
    pageTitle: pageTitle,
    pageText: pageText,
    base: base,
    lastUpdate: lastUpdate,
  }
};

const main = () => {
  output = [];
  const g = new Glob("websites_utf8/**/*.html", { withFileTypes: false });
  for (const file of g) {
    // console.log(file);
    const page = file.slice(
      "websites_utf8/wiki.hosiken.jp/".length,
      -"/index.html".length
    );
    // console.log(page);
    try{
      output.push(convert(page));
    }catch(err){
      console.error(page);
      console.error(err.message);
    }
  }
  fs.writeFileSync("websites.json", JSON.stringify(output), "utf-8");
};

main();
