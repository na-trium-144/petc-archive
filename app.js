import { env } from "hono/adapter";
import { Hono } from "hono";
import cheerio from "cheerio";
import Encoding from "encoding-japanese";
import {
  eucToStr,
  getSearchParamQuoted,
  checkBase,
  pageExists,
  strToEuc,
  officialEncode,
} from "./global.js";
import { search, searchTemplate } from "./search.js";
import { pageTemplate } from "./template.jsx";

const wikiTitle = "プチコンまとめArchive";
const cache = "max-age=86400";

async function fetchPageIndex(c) {
  return JSON.parse(
    await (await fetch(env(c).FILES_PREFIX + "/pageIndex.json")).text()
  );
}
const app = new Hono({ strict: false });

app
  .get("/:route{petc(3gou)?4?.*}", async (c) => {
    const pageIndex = await fetchPageIndex(c);
    const origin = new URL(c.req.url).origin;
    let page = c.req.url;
    page = page.slice(8); // https://
    page = page.slice(page.indexOf("/")); // origin
    if (page.indexOf("#") >= 0) {
      page = page.slice(0, page.indexOf("#"));
    }
    page = page.replace("?", "");
    page = eucToStr(Encoding.urlDecode(page));
    if (page.endsWith("=")) {
      page = page.slice(0, -1);
    }
    const res = await fetch(
      env(c).FILES_PREFIX +
        "/websites_utf8/wiki.hosiken.jp/" +
        page +
        "/index.html"
    );
    if (res.ok) {
      const originalHtml = eucToStr(await res.bytes());
      const $ = cheerio.load(originalHtml);
      const orginalTitle = $("title").text();
      let bodyHtml;
      let lastUpdate = "";
      const base = checkBase(c.req.path);
      let pankuzuHtml = $("#list-pankuzu").html();
      if (orginalTitle.indexOf("プチコンまとめArchive") >= 0) {
        bodyHtml = $("#body").html();
        lastUpdate = $("#block-pankuzu-body > div").text();
      } else {
        // 変換前のhtmlのみ処理
        for (let a of $("a").get()) {
          let href = $(a).attr("href");
          let title = $(a).attr("title");
          let content = $(a).html();
          if (href && !href.startsWith("#")) {
            let url = new URL(href, origin);
            if (url.host === "wiki.hosiken.jp" || url.origin === origin) {
              //url.searchは%エンコードされたまま
              //url.searchParamsは勝手にデコードされてて無能
              if (
                url.searchParams.has("cmd") &&
                url.searchParams.get("cmd") === "read"
              ) {
                //元のエンコードを保持する
                url = new URL(
                  url.pathname +
                    "?" +
                    getSearchParamQuoted(url.search, "page") +
                    url.hash,
                  origin
                );
              }
              //画像はpublic公開のurlなのでutf-8に変換する
              if (
                url.searchParams.has("plugin") &&
                url.searchParams.get("plugin") === "ref"
              ) {
                let sPage = Encoding.urlEncode(
                  eucToStr(
                    Encoding.urlDecode(getSearchParamQuoted(url.search, "page"))
                  )
                );
                let sSrc = Encoding.urlEncode(
                  eucToStr(
                    Encoding.urlDecode(getSearchParamQuoted(url.search, "src"))
                  )
                );
                $(a).replaceWith(
                  `<a href="/ref${c.req.path}/${sPage}/${sSrc}" title="${title}">${content}</a>`
                );
              } else if (
                url.searchParams.has("plugin") &&
                url.searchParams.has("refer") &&
                url.searchParams.get("plugin") === "attach"
              ) {
                let sPage = Encoding.urlEncode(
                  eucToStr(
                    Encoding.urlDecode(
                      getSearchParamQuoted(url.search, "refer")
                    )
                  )
                );
                let sSrc = Encoding.urlEncode(
                  eucToStr(
                    Encoding.urlDecode(
                      getSearchParamQuoted(url.search, "openfile")
                    )
                  )
                );
                $(a).replaceWith(
                  `<a href="/ref${c.req.path}/${sPage}/${sSrc}" title="${title}">${content}</a>`
                );
              } else if (
                await pageExists(c, url.pathname + url.search, pageIndex)
              ) {
                $(a).replaceWith(
                  `<a href="${
                    url.pathname + url.search + url.hash
                  }" title="${title}">${content}</a>`
                );
              } else {
                $(a).replaceWith(
                  `<a style="color: red;" href="${
                    url.pathname + url.search + url.hash
                  }" title="${title}">${content}</a>`
                );
              }
            }
          }
        }
        for (let a of $("img").get()) {
          let href = $(a).attr("src");
          let alt = $(a).attr("alt");
          let title = $(a).attr("title");
          let w = $(a).attr("width");
          let h = $(a).attr("height");
          if (href) {
            let url = new URL(href, origin);
            if (url.host === "wiki.hosiken.jp" || url.origin === origin) {
              if (
                url.searchParams.has("plugin") &&
                url.searchParams.get("plugin") === "ref"
              ) {
                let sPage = Encoding.urlEncode(
                  eucToStr(
                    Encoding.urlDecode(getSearchParamQuoted(url.search, "page"))
                  )
                );
                let sSrc = Encoding.urlEncode(
                  eucToStr(
                    Encoding.urlDecode(getSearchParamQuoted(url.search, "src"))
                  )
                );
                $(a).replaceWith(
                  `<img src="/ref${c.req.path}/${sPage}/${sSrc}" alt="${alt}" title="${title}" width=${w} height=${h} />`
                );
              } else if (
                url.searchParams.has("plugin") &&
                url.searchParams.has("refer") &&
                url.searchParams.get("plugin") === "attach"
              ) {
                let sPage = Encoding.urlEncode(
                  eucToStr(
                    Encoding.urlDecode(
                      getSearchParamQuoted(url.search, "refer")
                    )
                  )
                );
                let sSrc = Encoding.urlEncode(
                  eucToStr(
                    Encoding.urlDecode(
                      getSearchParamQuoted(url.search, "openfile")
                    )
                  )
                );
                $(a).replaceWith(
                  `<a href="/ref${c.req.path}/${sPage}/${sSrc}" alt="${alt}" title="${title}" width=${w} height=${h} />`
                );
              }
            }
          }
        }
        if (base === 4) {
          pankuzuHtml = pankuzuHtml.replace("トップ", "プチコン4トップ");
        }
        if (base === 3) {
          pankuzuHtml = pankuzuHtml.replace("トップ", "プチコン3号&BIGトップ");
        }
        if (base === 2) {
          pankuzuHtml = pankuzuHtml.replace(
            "トップ",
            "プチコン初代/mkIIトップ"
          );
        }
        const about = $("#pukiwiki-about").text();
        lastUpdate = about.slice(
          about.indexOf("このページの最終更新 : "),
          about.indexOf("  (", about.indexOf("このページの最終更新 : "))
        );
        bodyHtml = $("#body").html();
      }
      const notesHtml = $("#notes").html();
      const pageTitle = $("#block-body-container > h2").text();
      const html = pageTemplate({
        wikiTitle: "プチコンまとめArchive",
        pageTitle: pageTitle,
        base: base,
        body: bodyHtml,
        pankuzu: pankuzuHtml,
        lastUpdate: lastUpdate,
        notes: notesHtml,
        officialEncode: officialEncode(page),
      });
      return c.html(html, 200, { "Cache-Control": cache });
    } else {
      const res2 = await fetch(
        env(c).FILES_PREFIX +
          "/websites_utf8/wiki.hosiken.jp/" +
          page +
          "/" +
          page.slice(page.lastIndexOf("=") + 1)
      );
      if (res2.ok) {
        return c.body(res2.body, 200, {
          "Content-Type": res2.headers.get("Content-Type"),
          "Cache-Control": cache,
        });
      } else {
        let page = c.req.url;
        page = page.slice(8); // https://
        page = page.slice(page.indexOf("/")); // origin
        const decodedAry = Encoding.urlDecode(page);
        const encoding = Encoding.detect(decodedAry);
        const decodedStr = Encoding.codeToString(
          Encoding.convert(decodedAry, {
            from: encoding,
            to: "UNICODE",
          })
        );
        let eucEncode = Encoding.urlEncode(
          Encoding.convert(decodedAry, {
            from: encoding,
            to: "EUC-JP",
          })
        )
          .replaceAll("%2F", "/")
          .replace("%3F", "?");
        if (!(await pageExists(c, eucEncode, pageIndex))) {
          eucEncode = "";
        }
        const html = pageTemplate({
          wikiTitle,
          pageTitle: "ページが見つかりません",
          base: checkBase(c.req.path),
          body:
            `<p>ページ ${eucToStr(
              Encoding.urlDecode(c.req.url)
            )} は プチコンまとめArchive に存在しません。</p>` +
            (eucEncode
              ? `<p>ページ名はEUC-JPで指定する必要があります。もしかして: <a href="${eucEncode}">${decodedStr}</a></p>`
              : ""),
          pankuzu: "",
          lastUpdate: "",
          notes: "",
          officialEncode: officialEncode(page),
        });
        return c.html(html, 404, { "Cache-Control": cache });
      }
    }
  })
  .get("/", async (c) => {
    const html = pageTemplate({
      wikiTitle,
      pageTitle: "プチコンまとめArchive トップページ",
      base: checkBase(c.req.path),
      body: await (await fetch(env(c).FILES_PREFIX + "/toppage.html")).text(),
      pankuzu: "",
      lastUpdate: "",
      notes: "",
      officialEncode: null,
    });
    return c.html(html, 200, { "Cache-Control": cache });
  })
  .get("/search", async (c) => {
    const html = pageTemplate({
      wikiTitle,
      pageTitle: "検索",
      base: 0,
      body: searchTemplate({
        word: "",
        base4: true,
        base3: true,
        base2: true,
      }),
      pankuzu: "",
      lastUpdate: "",
      notes: "",
      officialEncode: null,
    });
    return c.html(html, 200, { "Cache-Control": cache });
  })
  .get("/search_result", async (c) => {
    let result = await search(c, c.req.query("word"));
    let baseStrTitle = ["プチコン4", "3号/BIG", "初代/mkII"];
    if (!c.req.query("base4")) {
      result = result.filter((p) => !p.startsWith("petc4/"));
      baseStrTitle[0] = "";
    }
    if (!c.req.query("base3")) {
      result = result.filter((p) => !p.startsWith("petc3gou/"));
      baseStrTitle[1] = "";
    }
    if (!c.req.query("base2")) {
      result = result.filter((p) => !p.startsWith("petc/"));
      baseStrTitle[2] = "";
    }
    let body = `<p>${result.length} 件見つかりました</p>\n`;
    body += "<ul>";
    body += result
      .map((p) => {
        const base = checkBase(p);
        const basePath = ["", "", "petc", "petc3gou", "petc4"][base];
        const baseStr = ["", "", "初代/mkII", "3号/BIG", "プチコン4"][base];
        return (
          `<li>` +
          `<span style="font-size: small; padding-right: 10px;">(${baseStr})</span>` +
          `<a href="/${basePath}/?${strToEuc(
            p.slice(basePath.length + 1)
          )}">${p.slice(p.indexOf("/") + 1)}</a>` +
          `</li>`
        );
      })
      .join("\n");
    body += "</ul>";

    const html = pageTemplate({
      wikiTitle,
      pageTitle: `${c.req.query("word")} の検索結果 (${baseStrTitle
        .filter((a) => a)
        .join(", ")})`,
      base: 0,
      body:
        body +
        searchTemplate({
          word: c.req.query("word"),
          base4: !!c.req.query("base4"),
          base3: !!c.req.query("base3"),
          base2: !!c.req.query("base2"),
        }),
      pankuzu: "",
      lastUpdate: "",
      notes: "",
      officialEncode: null,
    });
    return c.html(html, 200, { "Cache-Control": cache });
  })
  .on("GET", ["/ref/*", "/sys/*"], async (c) => {
    const res = await fetch(env(c).FILES_PREFIX + "/public" + c.req.path);
    if (res.status === 404) {
      const html = pageTemplate({
        wikiTitle,
        pageTitle: "ページが見つかりません",
        base: checkBase(c.req.path),
        body: "指定したファイルはプチコンまとめArchiveに存在しません。",
        pankuzu: "",
        lastUpdate: "",
        notes: "",
        officialEncode: null,
      });
      return c.html(html, 404, { "Cache-Control": cache });
    }
    return c.body(res.body, res.status, {
      "Content-Type": res.headers.get("Content-Type"),
      "Cache-Control": cache,
    });
  })
  .notFound(async (c) => {
    console.error("404 Not Found: " + c.req.url);
    const html = pageTemplate({
      wikiTitle,
      pageTitle: "ページが見つかりません",
      base: checkBase(c.req.path),
      body:
        c.req.method === "POST"
          ? `<p>編集やコメントの投稿は無効です。</p>`
          : `<p>URLが正しくありません。</p>`,
      pankuzu: "",
      lastUpdate: "",
      notes: "",
      officialEncode: null,
    });
    return c.html(html, 404, { "Cache-Control": cache });
  });

export default app;
