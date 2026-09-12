# GOAL V6 — Visual Quality + iPhone Audio Reliability

## Product Goal
把「畫面品質」提升為核心產品指標，不再用放大的 Canvas 方塊作為主要世界美術；同時讓 iPhone Safari / PWA 的聲音在首次啟動、切背景、回前景後都能可靠恢復。

## Definition of Done
- [x] 世界地圖底圖改為獨立資產 atlas，而不是逐格以 Canvas primitive 畫出主要地形。
- [x] 建立 `assets/world-atlas.svg`：草地、水域、森林、深林、城牆、商店、客棧、住宅、亭舍、樹叢、竹林、三大地標、橋樑、道路與岸線素材。
- [x] 建立 `assets/world-sprites.svg`：趙雲、孔明、軍官、斥候、商人、百姓、村民兩格世界動畫。
- [x] 建立 `src/assetAtlas.js`：統一載入、裁切、旋轉與繪製 tile / sprite / landmark atlas。
- [x] `src/world.js` 改為 asset-driven renderer；Canvas 只負責組合 atlas、鏡頭、標籤、指示與少量環境效果。
- [x] iPhone 音訊生命週期重做：pointer/touch gesture 解鎖、背景暫停、回前景 resume、持續保留 gesture recovery，不再首次成功後移除喚醒能力。
- [x] 音訊測試按鈕可直接播放雙音測試，並在 UI 顯示「待啟用 / 待恢復 / 已啟用」。
- [x] Service Worker 使用 V6 cache key 並預快取 atlas 與新模組。
- [x] V6 專屬 UI 樣式與 iPhone 音訊狀態提示。
- [ ] iPhone 實機驗證：首次進入、加入主畫面、切到其他 App 再回來後，BGM 與 SFX 均可恢復。
- [ ] V6 最終視覺 QA：依 iPhone 實機截圖繼續修正配色、地標比例、道路/河岸連接與人物大小。

## Acceptance Test
1. iPhone Safari 第一次點「啟用 / 測試聲音」後，立即播放雙音，狀態顯示「聲音 已啟用」。
2. 從 Safari / PWA 切到其他 App 再回來，若 AudioContext 被 iOS suspend，狀態顯示「聲音 待恢復」；下一次觸碰畫面會重新 resume。
3. 世界地圖載入時會請求 `assets/world-atlas.svg` 與 `assets/world-sprites.svg`；主要地形與角色不再由 `fillRect` 堆疊完成。
4. 新野、隆中、博望坡三個 landmark 使用 atlas 資產並可從輪廓辨識。
5. 道路由 atlas overlay 組合直線、彎道、交叉與末端；水域使用 atlas 水面與岸線 overlay。
6. Service Worker cache 必須包含 V6 atlas、`src/assetAtlas.js`、`src/v60.js`、`styles/v60.css`。
7. GitHub Actions 的 syntax / structure validation 必須通過。

## Non-goals
- 不使用《吞食天地 II》原始 ROM、sprite、音樂或地圖素材。
- V6 先把資產管線與 iPhone 音訊可靠性打穩，再進入下一輪更高細節的角色戰鬥美術。
