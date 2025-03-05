import { env } from "hono/adapter";
import Encoding from "encoding-japanese";

export const eucToStr = (b) => {
  return Encoding.codeToString(
    Encoding.convert(b, {
      from: "EUC-JP",
      to: "UNICODE",
    })
  );
};

export const strToEuc = (s) =>
  Encoding.urlEncode(
    Encoding.convert(Encoding.stringToCode(s), {
      from: "UNICODE",
      to: "EUC-JP",
    })
  );

export const officialEncode = (s) => {
  const eucCode = Encoding.convert(Encoding.stringToCode(s), {
    from: "UNICODE",
    to: "EUC-JP",
  });
  let encoded = "";
  for (const c of eucCode) {
    if (
      c == 46 ||
      c == 47 ||
      (c >= 48 && c < 57) ||
      (c >= 65 && c <= 90) ||
      c == 95 ||
      (c >= 97 && c <= 122)
    ) {
      encoded += String.fromCharCode(c);
    } else {
      encoded += c.toString(16).toUpperCase() + "-";
    }
  }
  return encoded
    .replace("petc/", "petc/html/")
    .replace("petc3gou/", "petc3gou/html/")
    .replace("petc4/", "petc4/html/");
};

export const getSearchParamQuoted = (search, key) => {
  let param = search.slice(search.indexOf(key + "=") + key.length + 1);
  if (param.indexOf("&") >= 0) {
    param = param.slice(0, param.indexOf("&"));
  }
  return param;
};

export const checkBase = (url) => {
  if (url.startsWith("/petc4")) {
    return 4;
  } else if (url.startsWith("/petc3gou")) {
    return 3;
  } else if (url.startsWith("/petc")) {
    return 2;
  }
  if (url.startsWith("petc4")) {
    return 4;
  } else if (url.startsWith("petc3gou")) {
    return 3;
  } else if (url.startsWith("petc")) {
    return 2;
  }
  return 0;
};

export const pageExists = async (c, page, pageIndex) => {
  if (page.startsWith("http")) {
    return true;
  }
  page = page.replace("?", "");
  if (page.indexOf("#") >= 0) {
    page = page.slice(0, page.indexOf("#"));
  }
  page = eucToStr(Encoding.urlDecode(page));
  if (page.startsWith("/")) {
    page = page.slice(1);
  }
  if (page === "petc/" || page === "petc3gou/" || page === "petc4/") {
    return true;
  }
  if (pageIndex.includes(page)) {
    return true;
  }
  /*
  これなに?
  if (
    (
      await fetch(
        env(c).FILES_PREFIX +
          "/websites_utf8/wiki.hosiken.jp/" +
          page +
          "/" +
          page.slice(page.lastIndexOf("=") + 1)
      )
    ).ok
  ) {
    return true;
  }*/
  return false;
};

// https://qiita.com/mimoe/items/855c112625d39b066c9a
export function kanaToHira(str) {
  return str.replace(/[\u30a1-\u30f6]/g, function (match) {
    var chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

