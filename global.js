const Encoding = require("encoding-japanese");
const fs = require("fs");


const path = __dirname + "/.";

const eucToStr = (b) => {
  return Encoding.codeToString(
    Encoding.convert(b, {
      from: "EUC-JP",
      to: "UNICODE",
    })
  );
};
exports.eucToStr = eucToStr;

const getSearchParamQuoted = (search, key) => {
  let param = search.slice(search.indexOf(key + "=") + key.length + 1);
  if (param.indexOf("&") >= 0) {
    param = param.slice(0, param.indexOf("&"));
  }
  return param;
};
exports.getSearchParamQuoted = getSearchParamQuoted;

const checkBase = (url) => {
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
exports.checkBase = checkBase;

const pageExists = (page) => {
  if (!page.startsWith("/")) {
    return true;
  }
  page = page.replace("?", "");
  if (page.indexOf("#") >= 0) {
    page = page.slice(0, page.indexOf("#"));
  }
  page = eucToStr(Encoding.urlDecode(page));
  if (
    fs.existsSync(
      path + "/websites_utf8/wiki.hosiken.jp/" + page + "/index.html"
    )
  ) {
    return true;
  }
  if (
    fs.existsSync(
      path +
        "/websites_utf8/wiki.hosiken.jp/" +
        page +
        "/" +
        page.slice(page.lastIndexOf("=") + 1)
    )
  ) {
    return true;
  }
  return false;
};
exports.pageExists = pageExists;
