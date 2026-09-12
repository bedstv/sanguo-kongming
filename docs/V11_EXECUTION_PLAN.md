# V11 一步到位重構計畫

## Objective

本文件是 V11 的實作順序與驗收方式。原則只有一個：先把 Golden Battle 做到視覺過關，再擴內容。

## Phase 0 — Freeze the target

建立固定測試入口：

`/golden-v11.html?v=11.0`

固定角色：

我軍：劉備／關羽／張飛／趙雲／孔明  
敵軍：曹仁／張郃／魏軍槍兵／魏軍弓手／夏侯惇

固定 iPhone 基準：390×844。

## Phase 1 — Rebuild five heroes first

先不做敵軍、不做地圖。

每一名我軍都獨立重畫：

1. 劉備 — 冠冕、綠金、劍
2. 關羽 — 長髯、深綠、紅點綴、長柄刀
3. 張飛 — 粗壯、黑鬚、赤褐甲、蛇矛輪廓
4. 趙雲 — 白盔白羽、藍銀甲、長槍
5. 孔明 — 綸巾、紫白袍、羽扇

每名至少完成 7 frames：idle A/B、attack anticipation/strike、hurt、cast、KO。

### Gate

把姓名隱藏後，至少 4/5 能讓使用者直接辨識；否則不進下一階段。

## Phase 2 — Enemy art + atlas safety

逐一完成：曹仁、張郃、夏侯惇、槍兵、弓手。

Atlas 必須採固定 cell 規格，並由 QA 驗證：

- 圖片尺寸
- frame row/column 數量
- 所有 frame bounding box 不越界
- enemy facing 正確

### Gate

曹仁／張郃／夏侯惇至少 2/3 不看名字可辨識。

## Phase 3 — Battle composition rebuild

重做 5v5 fixed slots：

- 角色尺寸比 V10 略增，但不壓姓名與兵力。
- 姓名＋數字＋兵力條與角色組成一個視覺單位。
- 上下五列間距依 iPhone 真實 viewport 固定。
- 戰場與下方 UI 比例約 70/30，依實機微調。

### Gate

390×844 Safari：無裁切、無重疊、無文字溢出。

## Phase 4 — Background art

Golden Battle 先只做一張正式背景：

- 遠山／林線
- 暗色天空或煙塵
- 中景軍旗／軍影
- 地面紋理

背景使用低彩度，人物與 UI 永遠保持最高辨識度。

## Phase 5 — Portrait and command UI

Portrait：

- 5 張獨立像素頭像
- 112×112 logical target
- 頭飾、臉型、鬍鬚、肩甲清晰

Command UI：

- 固定白框／淺米框
- 黑底
- 文字游標
- 不使用圓角 card、漸層 button、現代 shadow
- 選取／取消／技能列表都採同一套視覺語言

## Phase 6 — Animation polish

至少實作：

- idle subtle motion
- attack anticipation → strike → return
- hurt flash / recoil
- cast pose + effect
- KO settle

所有動畫由 sprite state machine 控制，不用 CSS 隨機抖動代替。

## Phase 7 — Original FC-style soundtrack

Normal Battle：至少 30～45 秒後才自然 loop，具 A/B section。  
Boss Battle：節奏與 bass 更有壓迫感。  
Victory：2～4 秒短曲。  
SFX：hit / cast / heal / UI / defeat。

iPhone 音訊測試：

- 首次觸控 unlock
- Safari 靜音／音量狀態提示
- background → foreground 恢復
- 螢幕鎖定再回來後可再次 resume

## Phase 8 — Automated QA

新增 `scripts/validate-v11.mjs`：

- 必要檔案存在
- JS syntax
- sprite metadata 完整
- 角色數量＝10
- frames per actor >= 7
- portrait count >= 5
- atlas bounds 不越界
- golden-v11.html 引用完整
- V11 audio hooks 存在

## Phase 9 — iPhone acceptance

只看三件事：

1. 不看名字，角色是否能辨識？
2. 第一眼是否像「完整遊戲」而非工程 prototype？
3. 與參考畫面的完成度差距是否已縮到可接受？

只要其中一項不通過，就留在 V11 Golden Battle 迭代，不移植完整遊戲。

## Commit Strategy

避免零碎 patch。每個 commit 必須至少完成一個完整 phase 或一個明確 Gate：

- `V11 M1 hero sprite identity`
- `V11 M2 enemy art and atlas safety`
- `V11 M3 battle composition`
- `V11 M4 background and UI`
- `V11 M5 animation and audio`
- `V11 QA and iPhone acceptance`

## Definition of “一步到位”

不是一次 commit 就宣告完成，而是停止用小修 UI 冒充大進步；每一輪提交必須跨過一個清楚的品質門檻，且 Golden Battle 未通過前不做其他功能。
