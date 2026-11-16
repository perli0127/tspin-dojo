# CLAUDE.md

本專案的完整規則寫在 `AGENTS.md`，Claude Code 請以它為準：

@AGENTS.md

## Claude Code 補充

- 新增講義時，最少需要動到三個地方：`articles/NN-slug.html`（從 `_template.html` 複製）、
  `data/articles.js`（登記一筆）、必要時 `kb/documents.json`（追加來源）。
- 本機預覽：直接開 `index.html` 即可；或在專案根目錄執行 `python -m http.server 8000`。
- 完成後依 `AGENTS.md` 第 9 節逐項自我檢查，並在回覆中列出改了哪些檔案。
