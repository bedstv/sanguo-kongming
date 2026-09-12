# V11 — Battle Visual Identity Rebuild

## Product Goal

把目前 V10 的「可玩、可辨識」戰鬥畫面，提升成真正具有早期主機三國 RPG 商業作品感的高完成度致敬版。

V11 不追求 1:1 複製任何既有商業遊戲的受版權保護素材、原曲或逐字劇情；目標是以原創像素美術、原創 chiptune 與三國題材內容，達到相近年代感、資訊密度、辨識度與戰鬥氛圍。

## Highest Priority

畫面品質是 V11 的最高優先級。V11 完成前，不以增加地圖、章節、商店或額外系統作為進度替代品。

## Current Phase

Phase 1 已完成「可執行版本」：

- `golden-v11.html?v=11.0` 已建立。
- 五名我軍已有各自獨立 7-frame raster sprite row。
- 五名我軍已有獨立 portrait strip。
- 新增「隱名」按鈕，可直接進行 4/5 武將辨識 Gate。
- attack / hurt / cast / KO 已接入既有戰鬥 state machine。
- V11 QA 已能驗證嵌入式 raster PNG 尺寸與結構。

Phase 1 尚未通過的關鍵 Gate：使用者實機隱名辨識測試與 iPhone 排版驗收。

## Why V10 is not enough

目前 V10 已解決基本 5v5 排版、分格兵力條、固定 atlas 與 iPhone 可玩性，但仍存在：

- 武將 silhouette 不夠鮮明，仍有模板感。
- 臉部、頭飾、鬍鬚、盔甲、武器細節不足。
- 戰場黑底過於空洞，缺少場景層次。
- portrait 與 command panel 仍有工程介面感。
- 音樂具有 8-bit 聲音，但缺乏完整曲式與鮮明主題動機。

## V11 Art Direction

### 1. Hero Sprite Identity

五名我軍必須各自有不可混淆的 silhouette：

- 劉備：冠冕、綠金主色、佩劍、較端正站姿。
- 關羽：高大身形、長髯、深綠長袍、紅色點綴、長柄刀。
- 張飛：最寬重的身形、黑鬚、深紅褐甲、長矛／蛇矛輪廓。
- 趙雲：白／銀頭盔、白羽、藍銀甲、長槍、修長身形。
- 孔明：綸巾、紫／白文士袍、羽扇、非重甲輪廓。

### 2. Enemy Identity

至少以下角色具有不同頭部、身形、武器與配色，而非雜兵換色：

- 曹仁
- 張郃
- 夏侯惇
- 魏軍槍兵
- 魏軍弓手

### 3. Animation

每個正式武將至少：idle A、idle B、attack anticipation、attack strike、hurt、cast、KO。

### 4. Battle Composition

390×844 iPhone 為第一基準；固定 5v5，戰場約 70%，UI 約 30%。姓名、兵力、分格條、角色不得互相壓住。

### 5. UI

黑底、細框、文字指令、游標，不採大型圓角卡片。Portrait 是獨立美術，不是戰鬥 sprite 放大。

### 6. Background

Golden Battle 必須有低彩度、低對比、像素化的正式戰場背景，能提供遠景／地面層次但不可搶走角色。

### 7. Audio

Normal Battle、Boss、Victory 使用原創 FC-style 曲目；Pulse lead/harmony、Triangle bass、Noise percussion，並維持 iPhone Safari/PWA 音訊解鎖與前景恢復。

## Definition of Done

- 隱藏名字後，至少 4/5 我軍可由 sprite 辨識。
- 曹仁／張郃／夏侯惇至少 2/3 可不看名字區分。
- 10 名角色 animation atlas 無越界、裁切錯誤、朝向錯誤。
- 390×844 iPhone 無人物／文字／兵力條重疊或裁切。
- Golden Battle 有正式背景、五張獨立 portrait、完成版 command UI。
- attack / hurt / cast / KO 動畫可見且節奏一致。
- Normal Battle / Boss / Victory 音樂可在 iPhone 穩定播放。
- V11 automated QA 成功。
- 使用者 iPhone 實機 Golden Battle 驗收通過後，才可移植到完整遊戲。
