# petc-archive
wiki.hosiken.jp の一時的な代替 https://petc-archive.vercel.app

ローカルで動かすときは`node main.js`

* attachファイル→ `public/ref/petc(3gou)?4?/ページ名/ファイル名`
* htmlファイル→ `websites_utf8/wiki.hosiken.jp/petc(3gou)?4?/ページ名/index.html`
  * ディレクトリ名にutf8とあるがそれは嘘で、内容はeuc-jpで記述すること
  * ファイル名はそのまま日本語(utf8)でok
* html内のリンクは基本的に元のままでもvercel.appのurlに置き換えられていても良い
  * api/index.jsが適切に変換して返す(はず)
