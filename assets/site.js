/* =========================================================
   T轉道場 — 全站唯一腳本（規則見 AGENTS.md）
   1. 頁首／頁尾   2. 首頁卡片與搜尋   3. 講義頁麵包屑與上一篇/下一篇
   4. 盤面圖 <pre class="board"> 轉成方格
   ========================================================= */
(function () {
  "use strict";

  /* 主題定義：新增主題時要同步修改 style.css 與 AGENTS.md 第 4 節 */
  var TOPICS = [
    { key: "history", name: "歷史", desc: "從蘇聯電腦室到 Game Boy，再到統一規則的 Tetris Guideline。" },
    { key: "rules", name: "規則與機制", desc: "七種方塊、旋轉系統、7-bag 與 Hold：現代俄羅斯方塊的地基。" },
    { key: "tspin", name: "T轉與技巧", desc: "道場本科：T轉怎麼判定、為什麼值錢，以及堆疊與操作技巧。" },
    { key: "scene", name: "經典賽事與現代", desc: "NES 殺屏、人類首次破關、世界錦標賽與線上對戰。" }
  ];
  var REPO_URL = "https://github.com/perli0127/tspin-dojo";

  var ARTICLES = window.ARTICLES || [];
  var body = document.body;
  var inArticle = body.hasAttribute("data-slug");
  var root = inArticle ? "../" : "";

  function topicOf(key) {
    for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].key === key) return TOPICS[i];
    return { key: key, name: key, desc: "" };
  }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function no(slug) { return slug.split("-")[0]; }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  /* ---------- 1. 頁首／頁尾 ---------- */
  var header = el("header", { "class": "site-header" },
    '<div class="wrap">' +
      '<a class="brand" href="' + root + 'index.html" aria-label="T轉道場 首頁">' +
        '<span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i class="e"></i><i></i><i class="e"></i></span>' +
        'T轉道場</a>' +
      '<nav class="site-nav">' +
        '<a href="' + root + 'index.html#topic-list">講義目錄</a>' +
        '<a href="' + REPO_URL + '" target="_blank" rel="noopener">GitHub</a>' +
      '</nav>' +
    '</div>');
  body.insertBefore(header, body.firstChild);

  var footer = el("footer", { "class": "site-footer" },
    '<div class="wrap">T轉道場・俄羅斯方塊知識講義。內容整理自 tetris-rag 知識庫（' + ARTICLES.length +
    ' 篇），為公開資料的教學改寫摘要。網站規則見 <a href="' + REPO_URL + '/blob/main/AGENTS.md" target="_blank" rel="noopener">AGENTS.md</a>。</div>');
  body.appendChild(footer);

  /* ---------- 2. 首頁 ---------- */
  var list = document.getElementById("topic-list");
  if (list) {
    var stats = document.getElementById("hero-stats");
    if (stats) {
      stats.innerHTML = '<span class="chip">' + ARTICLES.length + ' 篇講義</span>' +
        TOPICS.map(function (t) {
          var n = ARTICLES.filter(function (a) { return a.topic === t.key; }).length;
          return '<span class="chip" style="--topic:var(--c-' + t.key + ')"><span class="mino"></span>' + t.name + ' ' + n + '</span>';
        }).join("");
    }

    TOPICS.forEach(function (t) {
      var items = ARTICLES.filter(function (a) { return a.topic === t.key; });
      if (!items.length) return;
      var sec = el("section", { "class": "topic", id: "topic-" + t.key, style: "--topic:var(--c-" + t.key + ")" });
      sec.appendChild(el("h2", { "class": "topic-title" }, '<span class="mino"></span>' + t.name));
      sec.appendChild(el("p", { "class": "topic-desc" }, t.desc));
      var grid = el("div", { "class": "cards" });
      items.forEach(function (a) {
        var card = el("a", { "class": "card", href: "articles/" + a.slug + ".html" },
          '<span class="card-no">#' + no(a.slug) + '</span>' +
          '<span class="card-title">' + escapeHtml(a.title) + '</span>' +
          '<span class="card-sum">' + escapeHtml(a.summary) + '</span>');
        card.dataset.search = (a.title + " " + a.summary + " " + (a.tags || []).join(" ")).toLowerCase();
        grid.appendChild(card);
      });
      sec.appendChild(grid);
      list.appendChild(sec);
    });

    var input = document.getElementById("search-input");
    var empty = document.getElementById("search-empty");
    if (input) input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase(), shown = 0;
      list.querySelectorAll(".topic").forEach(function (sec) {
        var any = 0;
        sec.querySelectorAll(".card").forEach(function (c) {
          var hit = !q || c.dataset.search.indexOf(q) !== -1;
          c.style.display = hit ? "" : "none";
          if (hit) any++;
        });
        sec.style.display = any ? "" : "none";
        shown += any;
      });
      if (empty) empty.style.display = shown ? "none" : "block";
    });
  }

  /* ---------- 3. 講義頁 ---------- */
  if (inArticle) {
    var slug = body.getAttribute("data-slug");
    var idx = -1;
    for (var i = 0; i < ARTICLES.length; i++) if (ARTICLES[i].slug === slug) idx = i;
    var me = ARTICLES[idx];
    var lesson = document.querySelector(".lesson");
    if (me && lesson) {
      var t = topicOf(me.topic);
      lesson.style.setProperty("--topic", "var(--c-" + t.key + ")");
      document.title = me.title + "｜T轉道場";

      var head = lesson.querySelector(".lesson-head");
      if (head) head.insertBefore(el("span", { "class": "tag" }, '<span class="mino"></span>' + t.name + '・#' + no(slug)), head.firstChild);

      var crumb = el("nav", { "class": "crumb", "aria-label": "麵包屑" },
        '<a href="../index.html">T轉道場</a> ／ <a href="../index.html#topic-' + t.key + '">' + t.name + '</a> ／ ' + escapeHtml(me.title));
      lesson.parentNode.insertBefore(crumb, lesson);

      var prev = ARTICLES[idx - 1], next = ARTICLES[idx + 1];
      var pager = el("nav", { "class": "pager", "aria-label": "上一篇與下一篇" });
      if (prev) pager.appendChild(el("a", { "class": "prev", href: prev.slug + ".html" }, '<small>← 上一篇</small>' + escapeHtml(prev.title)));
      if (next) pager.appendChild(el("a", { "class": "next", href: next.slug + ".html" }, '<small>下一篇 →</small>' + escapeHtml(next.title)));
      lesson.parentNode.insertBefore(pager, lesson.nextSibling);
    } else if (window.console) {
      console.warn("[T轉道場] data/articles.js 找不到 slug：" + slug);
    }
  }

  /* ---------- 4. 盤面圖 ---------- */
  document.querySelectorAll("pre.board").forEach(function (pre) {
    var rows = pre.textContent.replace(/^\n+|\s+$/g, "").split("\n");
    var cols = rows.reduce(function (m, r) { return Math.max(m, r.length); }, 0);
    var grid = el("div", { "class": "board-grid", role: "img", "aria-label": "俄羅斯方塊盤面示意圖", style: "--cols:" + cols });
    rows.forEach(function (r) {
      for (var c = 0; c < cols; c++) {
        var ch = r.charAt(c) || " ";
        var cls = "";
        if (ch === " ") cls = "none";
        else if (ch === "#") cls = "G";
        else if (/[IOTSZJL]/.test(ch)) cls = ch;
        else if (/[iotszjl]/.test(ch)) cls = "ghost " + ch.toUpperCase();
        grid.appendChild(el("span", cls ? { "class": cls } : {}));
      }
    });
    pre.replaceWith(grid);
  });
})();
