const lunr = require("lunr");
require("lunr-languages/lunr.stemmer.support")(lunr);
require("lunr-languages/tinyseg")(lunr);
require("lunr-languages/lunr.ja")(lunr);
const fs = require("fs");

exports.search = (word) => {
  const idx = lunr.Index.load(JSON.parse(fs.readFileSync(__dirname + "/searchIndex.json", "utf-8")));
  return idx.search(word).map((p) => p.ref);
}
