# GOAL V7 — Scene Art + Retro Sound Identity

## Product Goal
把「畫面品質」列為目前最高優先級。V7 不再追求單純把 tile 放大或增加細節，而是讓世界地圖、UI、戰鬥場景看起來像一款有完整美術方向的復古三國 RPG。

音樂部分不直接複製既有商業遊戲的原曲旋律；改做原創的復古主機風格編曲，重現同年代的方波主旋律、三角波低音、琶音與噪聲打擊樂質感。

## Definition of Done
- [x] 世界地圖改成「連續場景圖」概念：先產生整張場景，再由鏡頭裁切，不再讓每個 64px tile 像獨立方塊。
- [x] 新增 `src/sceneArt.js`：用完整 SVG 場景組合地形、道路、水域、樹林、建築與大型地標。
- [x] 新增 `src/characterArtV7.js`：地圖人物使用更高細節 128×160 原始向量角色，包含武器、頭飾、披風與兩格移動變化。
- [x] 世界 renderer 改用 128px source scene → 64px display 的 downsample pipeline，以減少鋸齒與 tile seam。
- [x] 主線地標在鏡頭接近時會調整 framing，降低建築被畫面邊緣切掉的情況。
- [x] UI 改成古典漆器 / 銅飾風格，降低現代 dashboard 感。
- [x] 移除 V6 的 `ASSET ATLAS` 畫面 watermark。
- [x] 新增 `assets/battle-scenes.svg`：野外、森林 / 博望坡、Boss 三種戰鬥背景，不再使用純黑背景。
- [x] 新增 `src/v70.js`：依戰鬥標籤自動切換戰鬥背景。
- [x] 音樂引擎升級：雙聲部方波、三角波低音、琶音與 noise percussion；世界 / 戰鬥 / Boss 使用不同原創樂句。
- [x] 保留 V6 的 iPhone AudioContext unlock / background resume 機制。
- [x] Service Worker / manifest / query cache 全部切到 V7。
- [ ] iPhone 實機視覺 QA：確認世界地圖在 6.1–6.9 吋螢幕上不再有明顯重複方格感、路網不突兀、地標完整可見。
- [ ] iPhone 戰鬥 QA：確認背景不干擾兵力文字、武將 sprite 與命令列的可讀性。
- [ ] 下一階段：若 V7 仍不達標，進入 V7.1「手工場景資產」：逐張製作新野、隆中、博望坡的獨立場景圖，而不是由通用場景組件產生。

## Visual Acceptance Test
1. 草地不可再呈現一格一格完全相同的矩形重複紋理。
2. 道路須視覺連續、邊緣柔和，不再像木板或方格管線。
3. 河流、水岸、森林、城牆與聚落要能從輪廓與材質直接分辨。
4. 新野、隆中、博望坡接近畫面邊緣時，主要建築輪廓不應被裁掉一半。
5. 地圖角色不看名字也能從顏色、頭飾與武器辨識趙雲、孔明、軍官與一般 NPC。
6. 戰鬥畫面必須有對應環境背景，Boss 戰需要與一般野戰有明顯色調差異。
7. UI 應從現代藍色控制面板轉成較符合古代戰策 / 漆器 / 金屬裝飾的視覺語彙。

## Audio Acceptance Test
1. iPhone 點一次「啟用 / 測試聲音」後立即有聲，切背景後回來可恢復。
2. 世界 / 戰鬥 / Boss 三種 BGM 在旋律、速度與低音走向上可明顯區分。
3. 編曲使用復古主機常見的 pulse / triangle / noise 聲部，但旋律為本專案原創，不直接重製既有商業遊戲原曲。
