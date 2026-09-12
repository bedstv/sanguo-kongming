# GOAL V10 — Battle Art Hard Rebuild

V10 的唯一優先事項是讓 Golden Battle 在 iPhone 上看起來像真正完成過美術製作的早期主機三國 RPG，而不是網頁復古 Demo。

## 核心改變
- 10 名角色改用 80×96 raster pixel-art atlas，固定 frame cell，禁止 runtime SVG。
- 修正 V9 敵軍 frame 切圖錯位：改成單一 atlas + 明確 row/column mapping。
- 戰鬥布局採左右鏡像固定欄位：我軍文字→sprite / sprite→敵軍文字。
- 戰場維持黑底，底部加入低調主機時代戰場裝飾，不使用卡片、玻璃、圓角 UI。
- 兵力條固定 8 格，藍/黃兩軍色彩。
- 下方 UI 壓縮至約 31%，避免指令面板吞掉戰場。
- 五名我軍 portrait 使用獨立 96×96 portrait strip，不放大 battle sprite。
- V10 音訊保留 iPhone unlock/resume hooks，使用原創多聲道 chiptune。

## Golden Battle Gate
- 劉備、關羽、張飛、趙雲、孔明隱藏名字後至少 4/5 可辨識。
- 曹仁、張郃、夏侯惇至少 2/3 可辨識。
- 10 名角色不得出現裁切、frame 錯位、鏡像破圖。
- 390×844 iPhone 直向無橫向捲動、文字不得與 sprite 重疊。
- attack/hurt/cast/KO frame 必須正確切換。
- V10 QA 必須 success。

## Scope Freeze
Golden Battle 未通過 iPhone 實機畫面驗收前，不擴世界地圖、第二章、商店或其他系統。V10 的成功標準不是「功能更多」，而是戰鬥畫面、角色辨識、動畫、音訊與 UI 完成度產生明顯世代差異。
