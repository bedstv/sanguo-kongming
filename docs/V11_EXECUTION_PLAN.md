# V11 一步到位重構計畫

## Objective

本文件是 V11 的實作順序與驗收方式。原則只有一個：先把 Golden Battle 做到視覺過關，再擴內容。

## Phase 0 — Freeze the target

固定測試入口：

`/golden-v11.html?v=11.0`

固定角色：

我軍：劉備／關羽／張飛／趙雲／孔明  
敵軍：曹仁／張郃／魏軍槍兵／魏軍弓手／夏侯惇

固定 iPhone 基準：390×844。

**Status: completed.**

## Phase 1 — Rebuild five heroes first

五名我軍已建立獨立 raster sprite rows，每名 7 frames：idle A/B、attack anticipation/strike、hurt、cast、KO；另有 5 張獨立 portrait。

V11 Golden Battle 已加入「隱名」按鈕，直接用於辨識 Gate。

### Gate

把姓名隱藏後，至少 4/5 能讓使用者直接辨識；否則不進下一階段。

**Status: implementation complete; awaiting iPhone visual/identity acceptance.**

## Phase 2 — Enemy art + atlas safety

下一階段逐一完成：曹仁、張郃、夏侯惇、槍兵、弓手。

Atlas 必須採固定 cell 規格，並由 QA 驗證：

- 圖片尺寸
- frame row/column 數量
- 所有 frame bounding box 不越界
- enemy facing 正確

### Gate

曹仁／張郃／夏侯惇至少 2/3 不看名字可辨識。

**Status: not started; V11 Phase 1 暫時沿用 V10 敵軍素材。**

## Phase 3 — Battle composition rebuild

重做 5v5 fixed slots：

- 角色尺寸比 V10 略增，但不壓姓名與兵力。
- 姓名＋數字＋兵力條與角色組成一個視覺單位。
- 上下五列間距依 iPhone 真實 viewport 固定。
- 戰場與下方 UI 比例約 70/30，依實機微調。

**Status: first-pass integrated in `styles/v110.css`; pending iPhone screenshot polish.**

## Phase 4 — Battle background

製作正式 Golden Battle 背景：低彩度、低對比、像素化遠景與地面層次，不搶角色。

## Phase 5 — Portrait + command UI

- 5 張獨立 portrait 已先接入。
- Command UI 需繼續壓低 Web App 感。

## Phase 6 — Animation polish

attack / hurt / cast / KO 已接入既有 state machine；後續調整 timing 與 impact。

## Phase 7 — Music rewrite

Normal Battle / Boss / Victory 改為原創 FC-style 完整曲式，並維持 iPhone 音訊可靠性。

## Phase 8 — QA

`validate-v11.mjs` 已建立，可驗證：

- V11 模組存在
- hero atlas / portrait strip 可由 base64 還原為有效 PNG
- hero atlas 為 672×560
- portrait strip 為 560×112
- 5 名我軍 row mapping
- Golden Battle 入口與 identity test control

**Current automated status: V11 Phase 1 validation success.**

## Phase 9 — User acceptance

在 390×844 iPhone 截圖上確認：

- 4/5 我軍隱名可辨識
- 無裁切／重疊
- 視覺品質明顯高於 V10

未通過則回到 Phase 1/3，不擴世界地圖。
