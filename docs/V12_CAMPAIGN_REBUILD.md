# V12.1 — playable first chapter

2026-10-04 使用者明確回覆「對戰畫面可以了，但是目前也只有對戰畫面其它什麼都沒有」，隨後指示繼續。這是接受既有對戰畫面並要求補齊旅程流程的新指示；原先 Golden Battle freeze 不再阻擋此輪第一章整合。未測得的隱名辨識率仍如實保留，不能當成已量測通過。

交付主入口為 `index.html?v=12.1`。完整範圍是第一章「臥龍出山 → 隆中問策 → 新野整軍 → 博望先鋒 → 博望決戰 → 首戰告捷」，使用 repository 既有地點、角色和物品設定。不宣稱已完成後續歷史章節。`golden-v12.html?v=12.0` 保留為獨立演武入口；`legacy-v8.html` 保留原首頁 prototype，V11.6.1 不變。

## 同批交付

- 標題、新旅程、繼續旅程、另開旅程確認與舊版進度接續。
- 新野、荊州北境、隆中、博望坡探索；方向鈕、長按、鍵盤、點地圖尋路與任務路標。遇敵會中斷自動行走，操作亦可停止尋路。
- 開場、孔明問策、返城軍議、先鋒與決戰引導、章節結尾。進度推進會同步更換目標與開放地點。
- 軍需購買、指定武將配給武器／防具、物品、陣型、客棧全隊恢復、軍議與返回標題。
- 魏軍巡邏、先鋒、原 Golden cast 決戰，分別為 5v2、5v3、5v5。使用同一套正式戰鬥素材、動畫、FX 和音訊。
- 兵力、策略、裝備、軍糧、陣型、經驗與金錢跨戰鬥保存；獎勵只結算一次；戰敗付出金錢代價後回新野休整。
- 下令階段保存完整戰鬥 checkpoint。途中重新開頁會恢復最近的穩定下令階段，不將未完成的一半動畫存入進度。
- 獨立 V12 存檔、不覆寫 V5 舊檔。新旅程備份目前進度，主要存檔破損時可讀備份。儲存失敗會顯示狀態。
- 新生成原創地圖 terrain atlas 與三類 NPC；原始圖、生成提示、包裝腳本與 hash 一併保留。
- 原創探索曲《荊州行旅》、城鎮曲《新野燈火》。Runtime MP3，PCM 編曲母帶留存；戰鬥／boss／勝利 WAV 不變。

## 架構與相容性

`campaign-state.js` 負責資料、checkpoint、整備與一次性結算；`campaign.js` 串接場景；`world-renderer.js` 僅使用正式 bitmap 素材繪製地圖和人物。Battle accepts an initial state and completion callback; renderer and timeline release observers/listeners when the journey resumes. Smaller encounter rosters occupy explicit grid rows rather than displacing allies.

旅程啟用 `equipmentDefense`，讓防具與裝備智力參與受傷計算。原本公式只讀取角色基礎防禦，購買防具不會降低敵軍傷害；本輪修正這個實際整備缺口。獨立 Golden Battle 仍使用原規則。軍勢面板顯示含裝備的有效能力。

保留 `AudioV11` 的同步 HTMLMediaElement primer、`audioSession` playback、gesture unlock、visibility/pageshow resume；V12 音樂來源只新增 world/town。沒有改寫已經由使用者 iPhone 確認成功的解鎖路徑。

驗證紀錄與限制見 [CAMPAIGN_QA.md](v12/CAMPAIGN_QA.md)。
