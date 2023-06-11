// const lunr = require("lunr");
// require("lunr-languages/lunr.stemmer.support")(lunr);
// require("lunr-languages/tinyseg")(lunr);
// require("lunr-languages/lunr.ja")(lunr);
const fs = require("fs");
const { kanaToHira } = require("./global");

exports.search = (word) => {
  // const idx = lunr.Index.load(JSON.parse(fs.readFileSync(__dirname + "/searchIndex.json", "utf-8")));
  // return idx.search(word).map((p) => p.ref);
  const idx = JSON.parse(
    fs.readFileSync(__dirname + "/searchIndex.json", "utf-8")
  );
  const words = kanaToHira(word.normalize("NFKD").toLowerCase()).split(" ");
  const result = [];
  // 検索文字列の出現回数を調べ多い順に並べる
  for (const p of idx) {
    let count = words.map(
      (w) =>
        p.page.split(w).length +
        p.pageTitle.split(w).length +
        p.pageText.split(w).length -
        3
    );
    if (!count.includes(0)) {
      result.push({
        page: p.page,
        count: count.reduce((prev, c) => prev + c, 0),
      });
    }
  }
  result.sort((a, b) => b.count - a.count);
  return result.map((r) => r.page);
};
