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
  return idx.filter(
    (p) =>
      words.filter(
        (w) =>
          p.page.includes(w) ||
          p.pageTitle.includes(w) ||
          p.pageText.includes(w)
      ).length > 0
  ).map((p) => p.page);
};
