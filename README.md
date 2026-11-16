# 旅伴 Wayfarer

公開原型：https://janinakao9-collab.github.io/trips-schedule-034/

GitHub Pages 由 `.github/workflows/deploy.yml` 在推送 `main` 後自動測試、建置及部署。正式建置的基底路徑為 `/trips-schedule-034/`；本機開發仍使用根路徑。

旅行應變互動原型，採 React、TypeScript、Vite。所有情境與推薦皆為模擬，沒有真實即時資料或 AI API。

## 執行

```sh
pnpm install
pnpm dev
```

開啟終端機印出的 localhost 網址。`pnpm test` 執行測試，`pnpm typecheck` 檢查型別，`pnpm build` 產生 dist。

## 操作

選擇景點休館、交通延誤或餐廳無法前往情境。主動回報可編輯脈絡；既有行程入口點「需要調整」帶入展示安排。填妥欄位後查看可信度、展開來源，再選擇推薦方案。選擇摘要保留未知事項，可返回比較或修改脈絡。原行程不會自動改寫。

展示範圍為京都、2026-11-15 與情境中的示例問題，超出範圍會提示，不假裝完成搜尋。預估分鐘不是查證結果。手機採單欄；已以 Chromium 390px 視窗驗證兩入口與 Tab／Enter 主要操作，核取方塊可按 Space 切換。詳細結果、重現步驟與測試範圍見 docs/verification.md。

「研究記錄」可補記評估、查看任務及匯出 JSON。資料只存在記憶體，重載會遺失。情境重設會保留已開始任務，未結束者標為放棄；清除所有記錄須確認。

研究與驗證對照見 docs/research.md；本地驗收狀態見 docs/verification.md。
