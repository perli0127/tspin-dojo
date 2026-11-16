# AGENTS.md — T轉道場 專案規則

> 這份文件寫給「之後要繼續做這個網站的 AI」（Claude Code、Codex、Cursor…）以及人類協作者。
> 開始任何修改前，請先完整讀完本文件。**規則與實際檔案衝突時，以本文件為準，並回報衝突。**

---

## 1. 專案目的

**T轉道場** 是一個「俄羅斯方塊（Tetris）知識講義網站」，把 `kb/documents.json`
（我先前做的 tetris-rag 向量知識庫的原始文件，共 16 篇）整理成可以一篇一篇閱讀的講義。

- 讀者：想了解俄羅斯方塊歷史、規則、T轉技巧與賽事的初學者。
- 語氣：繁體中文、像社團學長姐上課講解；口語但準確，不誇大。
- 目標：每一頁都是「讀完就學會一個概念」的小講義，而不是百科全文。

## 2. 技術限制（不可違反）

- **純靜態網站**：只用 HTML + CSS + 原生 JavaScript，不要引入框架、套件管理或建置步驟。
- 部署在 **GitHub Pages**（`main` 分支根目錄），根目錄有 `.nojekyll`。
- 所有路徑一律用 **相對路徑**（例如 `../assets/style.css`），不可用 `/` 開頭的絕對路徑，
  因為網站掛在 `https://<帳號>.github.io/<repo>/` 子路徑下。
- 唯一允許的外部資源：Google Fonts 的 `Noto Sans TC` 與 `JetBrains Mono`。
- 必須能直接用瀏覽器開啟 `index.html`（file://）瀏覽，所以文章清單用 `data/articles.js`
  （`window.ARTICLES = [...]`），**不要改成 fetch JSON**。

## 3. 資料夾結構

```
/
├─ AGENTS.md              ← 本文件（專案規則，最高優先）
├─ CLAUDE.md              ← 給 Claude Code 的入口，內容是引用本文件
├─ README.md              ← 給人看的專案介紹
├─ index.html             ← 首頁：主題分類 + 文章卡片 + 搜尋（由 site.js 依清單自動產生）
├─ .nojekyll
├─ assets/
│  ├─ style.css           ← 全站唯一樣式表
│  └─ site.js             ← 全站唯一腳本：頁首、卡片、上一篇/下一篇、盤面圖
├─ data/
│  └─ articles.js         ← 文章清單（唯一的目錄來源）
├─ articles/
│  ├─ _template.html      ← 新文章範本，新增文章一律複製它
│  └─ NN-slug.html        ← 講義頁
└─ kb/
   ├─ documents.json      ← 知識庫原始文件（來源資料，唯讀）
   └─ config.json         ← 原向量索引的設定紀錄（唯讀）
```

## 4. 網頁整體風格

- **深色道場風**：深藍黑底、方塊格線點綴，主色取自 Tetris Guideline 標準方塊色。
- 每個主題有固定代表色（定義在 `style.css` 的 `:root`），**不可另外自創顏色**：

| 主題 key   | 顯示名稱       | 代表方塊 | CSS 變數       |
|------------|----------------|----------|----------------|
| `history`  | 歷史           | L（橘）  | `--c-history`  |
| `rules`    | 規則與機制     | I（淺藍）| `--c-rules`    |
| `tspin`    | T轉與技巧      | T（紫）  | `--c-tspin`    |
| `scene`    | 經典賽事與現代 | S（綠）  | `--c-scene`    |

- 字體：內文 `Noto Sans TC`，盤面與程式碼 `JetBrains Mono`。
- 版面寬度上限 760px（文章）／1080px（首頁），手機寬度 360px 也必須不出現橫向捲軸。
- 不使用 emoji 當裝飾圖示；需要圖示時用 CSS 畫的小方塊（`.mino`）。

## 5. 頁面結構

### 5.1 首頁 `index.html`
只放外框（hero、搜尋框、`<main id="topic-list">`）。卡片與分類 **全部由 `site.js`
讀 `data/articles.js` 產生**，新增文章時 **不要手動改 index.html**。

### 5.2 講義頁 `articles/NN-slug.html`
每一篇講義必須依序包含以下區塊（class 名稱固定）：

1. `<header class="lesson-head">`：`<h1>` 標題 + `<p class="lead">` 一句話導言
2. `<section class="keypoints">`：**三句話重點**（`<ul>` 剛好 3 個 `<li>`）
3. 正文 2～4 個 `<section>`，每個以 `<h2>` 開頭；段落短（每段 ≤ 4 句）
4. （選用）盤面圖 `<figure class="board-fig">`，見第 6 節
5. `<section class="quiz">`：**道場小測驗**，2～3 題，用 `<details><summary>題目</summary><p>答案</p></details>`
6. `<section class="sources">`：資料來源，列出原始網址與知識庫 `doc_id`

頁首導覽列、麵包屑、上一篇／下一篇、頁尾 **由 `site.js` 自動插入**，文章 HTML 不要自己寫。
`<body>` 必須帶 `data-slug="NN-slug"`，site.js 靠它找到這篇在清單中的位置。

## 6. 盤面圖語法（俄羅斯方塊場地示意）

在講義中畫場地時，寫一個 `<pre class="board">`，**一行字代表一列，由上往下**：

| 字元 | 意義 |
|------|------|
| `.` | 空格 |
| `#` | 已堆疊的灰色方塊（不在乎是哪一種） |
| `I O T S Z J L` | 該種方塊（以標準色顯示） |
| `i o t s z j l`（小寫） | 「要放進去的位置」，以半透明虛線顯示 |
| ` `（空白） | 不畫任何東西，用來排列多個方塊示意 |

```html
<figure class="board-fig">
<pre class="board">
###.......
##ttt#####
###t######
</pre>
<figcaption>T轉雙消：T 從右上旋轉塞進缺口</figcaption>
</figure>
```

- 同一個 `<pre>` 每一列字數要相同（標準場地 10 格寬）。
- 盤面必須「物理上合理」：不能有懸空不可能出現的形狀，除非文字說明就是在講它。

## 7. 新增一篇講義的標準流程（AI 必須照做）

1. **確認來源**：內容必須來自 `kb/documents.json` 的某一篇，或使用者明確提供的新資料。
   若是新資料，先把它以相同格式（`doc_id`、`text`、`metadata`）**追加**到 `kb/documents.json`，
   `doc_id` 依序編號（`doc_017`…），不可改動既有文件。
2. **決定編號與檔名**：`articles/NN-slug.html`
   - `NN` = 兩位數流水號，接在目前最大號後面（不重用、不插號）。
   - `slug` = 全小寫英文 + 連字號，2～4 個字，描述主題（例：`17-tspin-triple`）。
3. **複製範本**：從 `articles/_template.html` 複製，填入內容，保留所有固定區塊。
4. **登記清單**：在 `data/articles.js` 的陣列中 **依編號順序** 加一筆：
   ```js
   { slug: "17-tspin-triple", title: "T轉三消", topic: "tspin",
     summary: "一句話摘要（≤ 40 字）", docs: ["doc_017"], tags: ["T轉", "SRS"] }
   ```
   `topic` 只能是第 4 節表格中的四個 key；要新增主題，必須同時在 `site.js` 的
   `TOPICS`、`style.css` 的顏色變數與本文件表格中一起新增。
5. **自我檢查**（見第 9 節），完成後回報新增了哪些檔案。

## 8. 內容寫作規則

- **不可捏造**：年份、人名、分數、紀錄一律以 `kb/documents.json` 為準；知識庫沒有的
  細節寧可不寫。若來源之間矛盾（例如俄羅斯方塊誕生於 1984 或 1985），要把兩種說法都寫出來。
- 專有名詞第一次出現寫「中文（English）」，例如「超級旋轉系統（Super Rotation System, SRS）」；
  之後統一使用中文或縮寫。本站固定譯名：T轉、迷你T轉、T轉雙消（TSD）、T轉三消（TST）、
  踢牆、殺屏、全清、開局。
- 不可大段照抄來源網站；講義是「改寫與整理」，每篇都要在 `sources` 附上原始連結。
- 標點用全形（，。「」），中英文之間留一個半形空白（例：`Game Boy 版`）。
- 數字表格（例如計分表）用 `<table class="data">`。

## 9. 修改前後的檢查清單

- [ ] 新頁面在 `data/articles.js` 有登記，slug 與檔名、`data-slug` 三者一致
- [ ] 首頁出現新卡片、上一篇／下一篇連結正確
- [ ] 所有連結為相對路徑；外部連結加 `target="_blank" rel="noopener"`
- [ ] 三句話重點剛好 3 點；小測驗 2～3 題且答案在正文中找得到
- [ ] 手機寬度（360px）無橫向捲軸，盤面圖可以完整顯示
- [ ] 沒有修改 `kb/` 既有內容，沒有新增外部套件

## 10. AI 協作守則

- 只改與任務相關的檔案；**不要順手重構** `style.css` / `site.js`。若真的需要新元件，
  先在本文件新增規則，再實作，並保持既有頁面不壞。
- 新增 CSS 一律放在 `style.css` 對應的區段註解下，不要寫 inline style。
- 不刪除既有文章；要下架時先詢問使用者。
- commit 訊息用中文、動詞開頭，例如：`新增講義：17 T轉三消`、`修正：盤面圖手機版溢出`。
