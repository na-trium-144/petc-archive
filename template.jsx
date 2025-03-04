import React from "hono/jsx";
import { html, raw } from "hono/html";

export function pageTemplate({
  pageTitle,
  wikiTitle,
  base,
  body,
  pankuzu,
  lastUpdate,
  notes,
  officialEncode,
}) {
  return (
    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja">
      <head>
        <title>
          {pageTitle} - {wikiTitle}
        </title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/purecss@1.0.0/build/pure-min.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/purecss@1.0.0/build/grids-responsive-min.css"
        />
        <link
          rel="stylesheet"
          href="/sys/skin/pure/forms.css"
          type="text/css"
          media="screen"
          charset="Shift_JIS"
        />
        <link
          rel="stylesheet"
          href="/sys/skin/pure/buttons.css"
          type="text/css"
          media="screen"
          charset="Shift_JIS"
        />
        <link
          rel="stylesheet"
          href="/sys/skin/standard-3gou-pure.css"
          type="text/css"
          media="screen"
          charset="Shift_JIS"
        />
        <link
          rel="stylesheet"
          href="/sys/skin/smilebasic.css"
          type="text/css"
          media="screen"
          charset="Shift_JIS"
        />
        <link
          rel="stylesheet"
          href="/sys/skin/standard-petc/colorbox.css"
          type="text/css"
          media="screen"
          charset="Shift_JIS"
        />
        {html`<!--[if IE
          ]><link
            rel="stylesheet"
            href="/sys/skin/smilebasic-ie.css"
            type="text/css"
        /><![endif]-->`}
        <script
          type="text/javascript"
          src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"
        ></script>
        <script
          type="text/javascript"
          src="/sys/skin/standard-petc/wordbreak.js"
        ></script>
        <script
          type="text/javascript"
          src="/sys/skin/standard-petc/jquery.colorbox-min.js"
        ></script>
        <meta name="twitter:title" content={`${pageTitle} - ${wikiTitle}`} />
        <meta
          name="twitter:description"
          content="たぶんわかる! たぶん飛び出す! プログラムが組めそうな気がするWiki"
        />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:image"
          content="https://petc.natrium144.org/sys/skin/face/hakase-cry-rev.png"
        />
        <meta name="twitter:site" content="@hosiken" />
        {/*<!-- <link rel="alternate" type="application/rss+xml" title="RSS" href="/petc3gou/?cmd=rss" /> <meta name="keywords" content="投稿プログラム, ゲーム, 音楽, リズムゲーム, 音ゲー, リズミカルおもちつき" /> -->*/}
        {html`<script language="JavaScript">
          $(document).ready(function () {
            $(".ColorBoxYouTube").colorbox({
              iframe: true,
              innerWidth: 425,
              innerHeight: 344,
            });
          });
          (function (l) {
            var i,
              s = { touchend: function () {} };
            for (i in s) l.addEventListener(i, s);
          })(document); // sticky hover fix in iOS
        </script>`}
      </head>
      <body>
        <div id="block-container">
          <div id="block-header">
            <h1>
              <a href="/">{wikiTitle}</a>
            </h1>

            <div id="block-topbox">
              <div id="headermenu">
                {/*<!-- <ul class="menu">
        <li id="menu-button"><a href="#global-menu">メニュー</a></li>
        <li><a href="./?plugin=search">検索</a></li>
        <li><a href="./?Help">ヘルプ</a></li>
        <li class="parent last highlight"><a href="javascript:void(0);">Wikiの機能</a><ul>
                <li><a href="/petc3gou/?cmd=edit&amp;page=Toukou%2FNew%A5%EA%A5%BA%A5%DF%A5%AB%A5%EB%A4%AA%A4%E2%A4%C1%A4%C4%A4%ADSP">このページを編集</a></li>
                <li><a href="/petc3gou/?cmd=diff&amp;page=Toukou%2FNew%A5%EA%A5%BA%A5%DF%A5%AB%A5%EB%A4%AA%A4%E2%A4%C1%A4%C4%A4%ADSP">前回からの変更点</a></li>
                <li><a href="/petc3gou/?plugin=attach&amp;pcmd=upload&amp;page=Toukou%2FNew%A5%EA%A5%BA%A5%DF%A5%AB%A5%EB%A4%AA%A4%E2%A4%C1%A4%C4%A4%ADSP">ファイルをアップロード</a></li>
                <li><a href="/petc3gou/?plugin=newpage&amp;refer=Toukou%2FNew%A5%EA%A5%BA%A5%DF%A5%AB%A5%EB%A4%AA%A4%E2%A4%C1%A4%C4%A4%ADSP">新しいページをつくる</a></li>
                <li><a href="/petc3gou/?cmd=list">すべてのページの一覧</a></li>
                <li><a href="/petc3gou/?RecentChanges">最近更新されたページ</a></li>

</ul></li>
</ul> -->*/}
              </div>
            </div>
          </div>

          <div id="block-extra-navi">
            <ul>
              {base === 4 ? (
                <li id="active">プチコン4</li>
              ) : (
                <li>
                  <a href="/petc4/">プチコン4</a>
                </li>
              )}
              {base === 3 ? (
                <li id="active">3号/BIG</li>
              ) : (
                <li>
                  <a href="/petc3gou/">3号/BIG</a>
                </li>
              )}
              {base === 2 ? (
                <li id="active">初代/mkII</li>
              ) : (
                <li>
                  <a href="/petc/">初代/mkII</a>
                </li>
              )}
            </ul>
          </div>

          <div id="block-body" class="pure-g">
            <div class="with-sidemenu pure-u-lg-19-24 pure-u-md-18-24 pure-u-sm-17-24 pure-u-1">
              <div id="block-body-container">
                <h2>{pageTitle}</h2>

                <div id="block-pankuzu-body">
                  <h3 id="header-pankuzu">パンくずリスト</h3>

                  <ul id="list-pankuzu">{raw(pankuzu)}</ul>
                  <div style="margin-left: 1.5em; margin-top: -0.5em; color: #808080;">
                    {lastUpdate}
                  </div>
                </div>

                {officialEncode && (
                  <div
                    class="block-info"
                    style="margin-top: 1em; margin-bottom: 1em; padding: 10px;"
                  >
                    公式アーカイブのリンク:
                    <a href={`http://wiki.hosiken.jp${officialEncode}.html`}>
                      http://wiki.hosiken.jp{officialEncode}.html
                    </a>
                  </div>
                )}

                <div id="body">{raw(body)}</div>
              </div>
            </div>

            <div class="pure-u-lg-5-24 pure-u-md-6-24 pure-u-sm-7-24 pure-u-1">
              <a name="global-menu"></a>

              <div id="block-sidemenu">
                <div id="block-sidemenu-container">
                  <h3>メニュー</h3>
                  <ul>
                    <li>
                      <a href="/">Archiveトップ</a>
                    </li>
                    <li>
                      <a href="/search">検索</a>
                    </li>
                  </ul>

                  <h4>外部リンク</h4>
                  <ul>
                    <li>
                      <a
                        href="http://petitverse.hosiken.jp/community/petitcom/"
                        target="_blank"
                      >
                        Petitverse
                      </a>
                    </li>
                    <li>
                      <a href="https://smilebasic.kurun96.com/" target="_blank">
                        作品一覧のハコ
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://petitcom.mitsutan.dev/index"
                        target="_blank"
                      >
                        3号作品倉庫
                      </a>
                    </li>
                  </ul>

                  <h4 id="b8d544fa">プチコン4</h4>
                  <ul>
                    <li>
                      <a href="/petc4/?FrontPage" title="FrontPage">
                        トップページ
                      </a>
                    </li>
                    <li>
                      <a href="/petc4/?Toukou" title="Toukou">
                        投稿プログラム
                      </a>
                    </li>
                    <li>
                      <a href="/petc4/?Mame" title="Mame">
                        まめちしき
                      </a>
                    </li>
                    <li>
                      <a href="/petc4/?Memo" title="Memo">
                        プチコン4メモ
                      </a>
                    </li>
                    <li>
                      <a href="/petc4/?FAQ" title="FAQ">
                        よくある質問集
                      </a>
                    </li>
                    <li>
                      <a href="/petc4/?Bug" title="Bug">
                        既知の不具合
                      </a>
                    </li>
                    <li>
                      <a href="/petc4/?Sample" title="Sample">
                        サンプルプログラム集
                      </a>
                    </li>
                    <li>
                      <a href="/petc4/?WorksLink" title="WorksLink">
                        プチコン4作品集
                      </a>
                    </li>
                    <li>
                      <a href="/petc4/?Demand" title="Demand">
                        プチコン4への要望
                      </a>
                    </li>
                    <li>
                      <a href="/petc4/?OverFlow" title="OverFlow">
                        OFコーナー
                      </a>
                    </li>
                    {/*<!-- <li><a href="http://petitverse.hosiken.jp/community/petitcom/" rel="nofollow">Petitverse(掲示板)</a></li> -->*/}
                    {/*<!-- <li><a href="http://zawazawa.jp/petc/" rel="nofollow">まとめWiki用掲示板</a></li> -->*/}
                    {/*<!-- <li><a href="/petc4/?Chat" title="Chat">チャットルーム</a></li> -->*/}
                    {/*<!-- <li><a href="/petc4/?Contact" title="Contact">管理人に連絡</a></li></ul> -->*/}
                    <li>
                      <a href="/petc4/?Link" title="Link">
                        プチコン4 リンク集
                      </a>
                    </li>
                  </ul>
                  <h4 id="content_11_0">プチコン3号&BIG</h4>
                  <ul>
                    <li>
                      <a href="/petc3gou/?FrontPage" title="FrontPage">
                        トップページ
                      </a>
                    </li>
                    <li>
                      <a href="/petc3gou/?Beginner" title="Beginner">
                        非公式初心者講座
                      </a>
                    </li>
                    <li>
                      <a href="/petc3gou/?Toukou" title="Toukou">
                        投稿プログラム
                      </a>
                    </li>
                    <li>
                      <a href="/petc3gou/?Mame" title="Mame">
                        まめちしき
                      </a>
                    </li>
                    <li>
                      <a href="/petc3gou/?Memo" title="Memo">
                        プチコン3号メモ
                      </a>
                    </li>
                    <li>
                      <a href="/petc3gou/?FAQ" title="FAQ">
                        よくある質問集
                      </a>
                    </li>
                    <li>
                      <a href="/petc3gou/?Bug" title="Bug">
                        既知の不具合
                      </a>
                    </li>
                    <li>
                      <a href="/petc3gou/?Sample" title="Sample">
                        サンプルプログラム集
                      </a>
                    </li>
                    <li>
                      <a href="/petc3gou/?WorksLink" title="WorksLink">
                        プチコン3号作品集
                      </a>
                    </li>
                    <li>
                      <a href="/petc3gou/?Demand" title="Demand">
                        プチコン3号への要望
                      </a>
                    </li>
                    <li>
                      <a href="/petc3gou/?OverFlow" title="OverFlow">
                        OFコーナー
                      </a>
                    </li>
                    {/*<!-- <li><a href="http://petitverse.hosiken.jp/community/petitcom/" rel="nofollow">Petitverse(新掲示板)</a></li> -->*/}
                    {/*<!-- <li><a href="http://jbbs.livedoor.jp/computer/43199/" rel="nofollow">プチコン旧掲示板</a></li> -->*/}
                    {/*<!-- <li><a href="/petc3gou/?Chat" title="Chat (1049d)">チャットルーム</a></li> -->*/}
                    {/*<!-- <li><a href="/petc3gou/?Contact" title="Contact (2166d)">管理人に連絡</a></li></ul> -->*/}
                    {/*<!-- <ul><li><a href="http://wiki.hosiken.jp/petc/" rel="nofollow">旧プチコンまとめWiki<br class="spacer" />(初代/mkII)</a></li></ul> -->*/}
                    <li>
                      <a href="/petc3gou/?Link" title="Link">
                        プチコン3号リンク集
                      </a>
                    </li>
                  </ul>

                  <h4 id="content_6_0">プチコン初代&mkII</h4>
                  <ul>
                    <li>
                      <a href="/petc/?FrontPage" title="FrontPage">
                        トップページ
                      </a>
                    </li>
                    <li>
                      <a href="/petc/?Mame" title="Mame">
                        まめちしき
                      </a>
                    </li>
                    <li>
                      <a href="/petc/?Memo" title="Memo">
                        プチコンメモ
                      </a>
                    </li>
                    <li>
                      <a href="/petc/?FAQ" title="FAQ">
                        よくある質問集
                      </a>
                    </li>
                    <li>
                      <a href="/petc/?Bug" title="Bug">
                        既知の不具合
                      </a>
                    </li>
                    <li>
                      <a href="/petc/?Sample" title="Sample">
                        サンプルプログラム集
                      </a>
                    </li>
                    <li>
                      <a href="/petc/?Toukou" title="Toukou">
                        投稿プログラム
                      </a>
                    </li>
                    <li>
                      <a href="/petc/?WorksLink" title="WorksLink">
                        プチコン作品リンク集
                      </a>
                    </li>
                    <li>
                      <a href="/petc/?Demand" title="Demand">
                        プチコンへの要望
                      </a>
                    </li>
                    <li>
                      <a href="/petc/?OverFlow" title="OverFlow">
                        OFコーナー
                      </a>
                    </li>
                    {/*<!-- <li><a href="http://jbbs.livedoor.jp/computer/43199/" rel="nofollow">プチコン掲示板</a></li> -->*/}
                    {/*<!-- <li><a href="/petc/?Chat" title="Chat">チャットルーム</a></li> -->*/}
                    {/*<!-- <li><a href="/petc/?Contact" title="Contact">管理人に連絡</a></li></ul> -->*/}
                    {/*<!-- <ul><li><a href="http://wiki.hosiken.jp/petc3gou/" rel="nofollow">プチコン3号 まとめWiki</a></li></ul> -->*/}
                    <li>
                      <a href="/petc/?Link" title="Link">
                        プチコンリンク集
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div id="block-pukiwiki-info">
            <p id="notes">{notes ? raw(notes) : null}</p>

            {/*<!-- <p id="pukiwiki-about">表示モード : [ <strong>スマホ・3DS対応表示</strong> | <a href="./setskin.php?mode=pc">クラシック表示</a> ]<br />
        <strong>PukiWiki 1.4.7</strong> Copyright &copy; 2001-2006 <a href="http://pukiwiki.sourceforge.jp/">PukiWiki Developers Team</a>. License is <a href="http://www.gnu.org/licenses/gpl.html">GPL</a>. Based on "PukiWiki" 1.3 by <a href="http://factage.com/yu-ji/">yu-ji</a><br />
        ページの処理時間 : 0.161 秒  | このページの最終更新 : 2020/07/05 (日) 21:39:01  (471d) | <a href="/petc3gou/?plugin=login">ログイン</a><br />
        Copyright(C) 2011-2014 プチコンまとめWiki ◆1sxkymI8ji30</p> -->*/}
          </div>
        </div>

        {html`<script type="text/javascript">
          var _gaq = _gaq || [];
          _gaq.push(["_setAccount", "UA-2091180-9"]);
          _gaq.push(["_trackPageview"]);

          (function () {
            var ga = document.createElement("script");
            ga.type = "text/javascript";
            ga.async = true;
            ga.src =
              ("https:" == document.location.protocol
                ? "https://ssl"
                : "http://www") + ".google-analytics.com/ga.js";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(ga, s);
          })();
        </script>`}
      </body>
    </html>
  );
}
