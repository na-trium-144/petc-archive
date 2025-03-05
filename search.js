import { env } from "hono/adapter";
// const lunr = require("lunr");
// require("lunr-languages/lunr.stemmer.support")(lunr);
// require("lunr-languages/tinyseg")(lunr);
// require("lunr-languages/lunr.ja")(lunr);
import { kanaToHira } from "./global.js";
import { html } from "hono/html";

export function searchTemplate({ word, base4, base3, base2 }) {
  return html`<p>Archive内のすべてのページから検索します。</p>
    <ul>
      <li>大文字小文字、ひらがなカタカナは区別されません。</li>
      <li>スペースで区切るとAND検索になります</li>
    </ul>
    <form action="/search_result" method="get">
      <p>
        サイト:
        <input
          type="checkbox"
          name="base4"
          id="base4"
          ${base4 ? "checked" : ""}
        />
        <label for="base4">プチコン4</label>
        <input
          type="checkbox"
          name="base3"
          id="base3"
          ${base3 ? "checked" : ""}
        />
        <label for="base3">3号/BIG</label>
        <input
          type="checkbox"
          name="base2"
          id="base2"
          ${base2 ? "checked" : ""}
        />
        <label for="base2">初代/mkII</label>
      </p>
      <p>
        検索する単語:
        <input type="text" name="word" value="${word}" size="40" />
      </p>
      <p><input type="submit" value="検索" /></p>
    </form> `;
}

export const search = async (c, word) => {
  // const idx = lunr.Index.load(JSON.parse(fs.readFileSync(__dirname + "/searchIndex.json", "utf-8")));
  // return idx.search(word).map((p) => p.ref);
  const idx = JSON.parse(
    await (await fetch(env(c).FILES_PREFIX + "/searchIndex.json")).text()
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
