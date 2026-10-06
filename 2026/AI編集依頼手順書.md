# Markdownから出力したHTMLをAIに編集してもらう手順書

`2026/dayN/` に置いたMarkdownからHTMLを出力し、AIに共通デザイン用の形へ整えてもらう手順。

この手順で作成する教材HTMLでは、共通ヘッダーと「検索付きハンバーガーメニュー」を使用する。
メニューのHTMLを教材ファイルへ直接書く必要はない。`2026/css/style.css`と`2026/js/script.js`を正しく読み込むと、JavaScriptが本文内のh1・h2からメニューを自動生成する。

## 0. フォルダ構成

```
2026/
|_index.html          トップページ（各回へのリンク）
|_css/
|  |_style.css        教材ページ共通のCSS
|  |_style_index.css  トップページ用のCSS
|_js/
|  |_script.js        共通ヘッダー・コピーボタン・ページ内メニュー
|_img/                ヘッダー用画像
|_favicon.svg
|_day1/
|  |_img/             day1で使う画像
|  |_day1.md          元のMarkdown
|  |_ページタイトル.html  出力・編集したHTML
|_day2/ ～ day6/      day1と同じ構成
```

教材HTMLはすべて`dayN/`の直下に置くので、CSS・JavaScript・ヘッダー画像へのパスは常に1階層上（`../`）になる。

共通CSSでは、ページタイトル、章見出し、項目見出しを次の属性とタグで区別する。

- ページタイトル：`<h1 id="maintitle">ページタイトル</h1>`
- 章見出し：`maintitle`以外の一意のidを持つh1
- 項目見出し：一意のidを持つh2
- 小見出し：h2の項目の中で使うh3（Markdownでは項目の中の`####`。ハンバーガーメニューには表示しない）

ページタイトルのデザインはh1の出現順ではなく、`maintitle`というidを基準に適用される。ページタイトルが最初のh1であっても、`id="maintitle"`がなければタイトル用デザインは適用されない。

## 1. MarkdownをHTMLへ出力する

VS CodeのMarkdown Preview Enhancedを使い、編集したMarkdownファイルをHTMLへ出力する。

出力したHTMLは、元のMarkdownと同じ`dayN/`フォルダへ保存する。

`.html`を除いたHTMLのファイル名は、`<h1 id="maintitle">`の表示テキストの空白（半角・全角）をアンダーバー`_`に置き換えた文字列にする。`maintitle`の前後にある余分な空白はファイル名に含めない。HTMLエンティティや子タグがある場合は、HTMLソースではなくブラウザに表示されるテキストを使い、末尾に`.html`を付ける。

ファイル名に使えない半角記号（`\ / : * ? " < > |`）がタイトルにある場合は、先に`maintitle`内の記号を対応する全角記号へ直し、その同じ文字列をファイル名に使う。

例：

```
2026/day1/
|_img/
|_day1.md
|_day1_Pythonの基礎①.html     （maintitleが「day1 Pythonの基礎①」の場合）
```

## 2. 画像を確認する

Markdownで使用している画像が、同じ`dayN/img/`フォルダに入っていることを確認する。

HTML内の画像パスが次のようなローカルの絶対パスになっていても、この時点では手作業で直さなくてよい。

```
file:////Users/.../img/image.png
```

AIへ依頼するときに、次のような相対パスへ変更してもらう。

```
img/image.png
```

MarkdownからHTMLへ変換・編集するときは、各imgタグが参照している画像ファイル名の末尾を確認し、次の対応でclassを設定する。接尾辞は拡張子の直前にあるものを判定する。

| ファイル名の末尾 | class | 表示幅の目安 |
| --- | --- | --- |
| `_top` | `img_top` | ページ上部のメイン画像（本文幅の90%） |
| `_big` | `img_big` | 大きめの説明画像・図解（本文幅の70%） |
| `_small` | `img_small` | 小さめの補足画像・画面例（本文幅の50%） |

例：

```
img/pyxel_top.png   -> <img class="img_top" src="img/pyxel_top.png" ...>
img/pyxel_big.png   -> <img class="img_big" src="img/pyxel_big.png" ...>
img/pyxel_small.png -> <img class="img_small" src="img/pyxel_small.png" ...>
img/error_small.svg -> <img class="img_small" src="img/error_small.svg" ...>
```

画像はPNGとSVGのどちらでもよく、接尾辞とclassの対応は拡張子にかかわらず同じ。

画像直前のコメントとファイル名の接尾辞が異なる場合は、ファイル名の接尾辞を優先し、不一致があることを報告する。

## 3. ページごとの参考サイトを書く

ヘッダー右側の「document」ボタンを押すと、参考サイトのプルダウンが開く。

- 全ページ共通のドキュメントは Python 公式ドキュメントと pyxel公式github の2つ。`js/script.js` の `commonReferences` で設定されているので、HTML作成時に追加の作業はいらない。
- そのページだけの参考サイトは、Markdownの末尾などに次のブロックを書く。本文には表示されず、プルダウンの「このページの参考サイト」に表示される。HTML作成時に、Markdownに書かれていない参考サイトを勝手に追加しない。

```html
<div id="page-references" hidden>
<a href="https://www.kigyoshimin.com/">八幡平市 起業志民プロジェクト</a>
<a href="https://paiza.io/ja/projects/new">paiza.io（ブラウザでPythonを動かせるサイト）</a>
</div>
```


- `id="page-references"` と `hidden` は変えない。1ページに1つだけ書く。
- リンクは `<a href="URL">表示名</a>` を1行に1つ書く。Markdownのリンク記法（`[表示名](URL)`）は使わない。

## 4. 画像サイズ用のコメントを書く

必要に応じて、Markdownの画像の直前に使用するクラスが分かる補助コメントを入れておく。

```
<!-- top -->
<!-- big -->
<!-- small -->
```

AIにはファイル名末尾を基準にクラスを設定してもらい、コメントは確認用の補助情報として使ってもらう。

## 5. AIへ編集を依頼する

`2026`フォルダをAIが操作できる状態にして、次の依頼文を送る。

---------- ここからコピー ----------

「対象ファイル名」に対し、`AI編集依頼手順書.md`に沿って次の編集を行ってください。

- styleタグをすべて削除する
- spanタグをすべて削除する。ただし、spanタグ内のテキストや子要素は残す
- VS CodeのMarkdown Previewが追加したmarkdown.cssとhighlight.cssのlinkタグを削除する
- headタグ内でPrismのCSSとJavaScriptを読み込む
  - CSS: https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/themes/prism.min.css
  - JavaScript: https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/prism.min.js
  - Python用JavaScript: https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-python.min.js
- headタグ内で `../css/style.css` を読み込む
- headタグ内で `<link rel="icon" href="../favicon.svg" type="image/svg+xml">` を読み込む
- bodyタグを `<body for="html-export" data-header-base-path="../">` に変更する
- bodyタグの先頭に `<div id="pagetop"></div>` を追加する
- 本文を囲む要素のクラスを `class="crossnote markdown-preview"` に変更する
- vscode-body、vscode-light、qiita-styleクラスは削除する
- file:////から始まる画像パスを、同じフォルダ内のimgフォルダを基準にしたパス（`img/ファイル名`）へ変更する
- imgタグが参照するファイル名末尾の `_top`、`_big`、`_small` を基準に、対応するimg_top、img_big、img_smallクラスを設定する。画像直前のコメントは補助情報として参照し、不一致の場合はファイル名末尾を優先して報告する
- ページタイトルとして使うh1タグには、必ず `id="maintitle"` を設定する
  - h1の出現順だけでページタイトルを判定せず、教材全体のタイトルになっているh1を特定する
  - Markdown Previewがページタイトルへ別のidを付けている場合は、そのidを `maintitle` へ置き換える
  - `maintitle`は1ページに1つだけとし、通常の章見出しやh2には使用しない
  - 章見出しのh1には`maintitle`以外の、空ではない一意のidを設定する
  - 項目見出しのh2にも、空ではない一意のidを設定する
  - 項目の中の小見出しはh3のまま残し、h2へ変更しない
- ページタイトルと`maintitle`の設定が確定した後、HTMLのファイル名を変更する
  - `.html`を除いたファイルのベース名を、`<h1 id="maintitle">`の表示テキストから前後の余分な空白を除き、途中の空白（半角・全角）をアンダーバー`_`に置き換えた文字列にする
  - `maintitle`内にHTMLエンティティや子タグがある場合は、HTMLソースの文字列ではなく、ブラウザに表示されるテキストをファイル名に使う
  - ファイル名に使えない半角記号（`\ / : * ? " < > |`）がある場合は、先に`maintitle`内の記号を対応する全角記号へ直し、同じ文字列で保存する
- `2026/index.html`の該当する日のセクションに、このHTMLへのリンクを追加する（「準備中」の項目は置き換える）
- HTMLのファイル名を変更した場合は、`2026`フォルダ全体から変更前のファイル名またはパスへの参照を検索し、新しいファイル名へ更新する
- 共通CSSの見出しスタイルをそのまま使用する
  - `h1#maintitle`にはページタイトル用の、左側に緑色ラインがある薄緑背景のデザインが適用される
  - 通常のh1には章見出し用のカードデザインが適用される
  - h2には項目見出し用のタブデザインが適用される
  - h3には小見出し用の、字下げして左にオレンジ線がある小さめのデザインが適用される
  - HTML内のstyleタグや追加CSSで、これらの見出しデザインを上書きしない
- JavaScriptはbodyタグ末尾で `../js/script.js` を読み込む
- `<div id="page-references" hidden>` のブロックがある場合は、中のリンクも含めてそのまま残す（documentボタンのプルダウンに使う）
- 検索付きハンバーガーメニューは、共通のstyle.cssとscript.jsから自動生成する
  - メニュー専用のHTMLを直接追加しない
  - 個別のメニュー用CSS・JavaScriptを追加で読み込まない

コピーするpreタグに対する処理と、編集不可能にするタグへuneditableクラスを追加する処理は、こちらで手動で行うのでスキップしてください。

編集後は、次の点を確認してください。

- styleタグとspanタグが残っていない
- ローカルのfile:////パスが残っていない
- CSSとJavaScriptの参照先が存在する
- 画像ファイルの参照先が存在する
- 各imgタグのclassが、参照する画像ファイル名末尾の `_top`、`_big`、`_small` と一致している
- pagetopが重複していない
- `id="maintitle"`がページ内に1つだけあり、通常のh1やh2には設定されていない
- `.html`を除いたHTMLのファイル名が、`maintitle`のh1の表示テキストから前後の余分な空白を除き、途中の空白を`_`に置き換えた文字列と一致している
- `maintitle`以外のh1・h2にも空または重複したidがなく、すべてページ内リンク先として使用できる
- `index.html`からのリンク先ファイルが存在する
- メニュー専用HTMLや個別のメニュー用CSS・JavaScriptを重複して追加していない
- HTMLの構文に問題がない
- preタグ、コピーボタン、uneditableクラスを変更していない

---------- ここまでコピー ----------

「対象ファイル名」は、実際に編集するHTMLファイル名へ置き換える。

例：

```
「対象ファイル名」 -> day1/Pythonの基礎①.html
```

## 6. AIの編集後に表示を確認する

VS CodeのLive Serverなどで`2026/index.html`を開き、次の項目を確認する。

- [ ] ヘッダーが画面上部の正しい位置に表示される
- [ ] ヘッダーの画像が表示される
- [ ] 本文がほかの教材ページと同じ位置・幅で表示される
- [ ] `id="maintitle"`を持つh1が、左側に緑色ラインがある薄緑背景のページタイトルとして表示される
- [ ] 通常のh1が章見出し用のカード、h2が項目見出し用のタブとして表示され、3種類を見分けられる
- [ ] h3がある場合、h2より一段下の小見出し（字下げ・左にオレンジ線）として表示される
- [ ] 各画像が表示され、サイズが適切になっている
- [ ] Pythonコードの色分けが表示される
- [ ] ページ上部へ戻るボタンが動く
- [ ] documentボタンを押すとプルダウンが開き、共通ドキュメントとこのページの参考サイトが表示される
- [ ] プルダウンの外側のクリックやEscキーで閉じられる
- [ ] ヘッダー右側にハンバーガーメニューボタンが1つだけ表示される
- [ ] メニューに本文のh1・h2が表示され、各項目を押すと対応する見出しへ移動する
- [ ] 検索欄へ文字を入力すると、該当する項目だけに絞り込まれる
- [ ] 閉じるボタン、背景部分のクリック、Escキーでメニューを閉じられる
- [ ] PC幅とスマートフォン幅の両方で、メニューが画面外にはみ出さない
- [ ] `index.html`から各回のページへ移動できる

## 7. ヘッダーまたはハンバーガーメニューが表示されない場合

HTML内のJavaScriptが、次のパスになっているか確認する。

```html
<script src="../js/script.js"></script>
```

続けて、次の点を確認する。

- bodyタグの先頭に`<div id="pagetop"></div>`が1つだけある
- 本文が`class="crossnote markdown-preview"`の要素で囲まれている
- ページタイトルのh1に`id="maintitle"`が1つだけ設定されている
- 本文内にid属性を持つh1またはh2がある
- bodyタグの閉じタグ直前でscript.jsを読み込んでいる
- ブラウザのコンソールにJavaScriptエラーが出ていない

ハンバーガーメニューはscript.jsが`#header`、`.markdown-preview`、`h1[id]`、`h2[id]`を読み取って生成する。これらがない場合は生成されない。

ヘッダー画像やトップページへのリンクだけが表示されない場合は、`data-header-base-path="../"`になっているか確認する。

## 8. ヘッダーだけ横にズレる場合

HTMLに次の記述が残っていないか確認する。

- markdown.css
- highlight.css
- `class="vscode-body vscode-light"`
- `class="qiita-style"`

これらはVS Codeのプレビュー用スタイルで、共通ヘッダーや本文の余白を上書きすることがある。

正常なページは次の構造になる。

```html
<head>
    <meta charset="UTF-8">
    <title>ページタイトル</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/themes/prism.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="../css/style.css">
    <link rel="icon" href="../favicon.svg" type="image/svg+xml">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-python.min.js"></script>
</head>
<body for="html-export" data-header-base-path="../">
    <div id="pagetop"></div>
    <div class="crossnote markdown-preview">
        <h1 id="maintitle">ページタイトル</h1>
        <h1 id="章見出し">章見出し</h1>
        <h2 id="項目見出し">項目見出し</h2>
        本文
    </div>
    <script src="../js/script.js"></script>
</body>
```

HTMLソース内に`.page-menu-panel`などのメニュー本体がなくても問題ない。ブラウザでページを開いたときに、共通JavaScriptがメニューを生成する。

## 9. 手動で仕上げる

表示確認が終わったら、必要に応じて次の処理を手動で行う。

- コピー対象のpreタグを設定する
- コピーボタンを追加する
- 編集不可能にするタグへuneditableクラスを追加する

コピーボタンを追加する場合は、ボタンだけを追加せず、コピー対象のpreタグも必ず設定する。

共通CSSでは、`pre[data-role="codeBlock"]`をボタンの絶対配置の基準にしている。`data-role="codeBlock"`がないと、copyボタンがコードブロックの枠外へ出ることがある。

Pythonコードブロックでは、preタグの開始部分を必ず次の形にする。

```html
<pre data-role="codeBlock" data-info="python" class="language-python python"><code>
```

Markdownから出力したHTMLが次の形になっている場合は、

```html
<pre><code class="language-python">
```

preタグとcodeタグの開始部分を、上記の正しい形へ置き換える。`data-role="codeBlock"`、`data-info="python"`、`class="language-python python"`のいずれも省略しない。

そのうえで、コピー対象のpreタグ内にあるcode終了タグの直後へ、次のHTMLを追加する。ボタンはpre終了タグより前に置く。

```html
<button class="copy-btn" onclick="copyCode(this)">copy</button>
```

例：

```html
<pre data-role="codeBlock" data-info="python" class="language-python python"><code>print("Hello")
</code><button class="copy-btn" onclick="copyCode(this)">copy</button></pre>
```

`copyCode(this)`は、押されたボタンに最も近い親のpreタグを探し、その中のcodeタグの内容をコピーする。

コピーを禁止するコードブロックでは、preタグのclassへ`uneditable`を追加する。

```html
<pre data-role="codeBlock" data-info="python" class="language-python python uneditable"><code>print("コピー禁止")
</code><button class="copy-btn" onclick="copyCode(this)">copy</button></pre>
```
