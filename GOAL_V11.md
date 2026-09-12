# V11 — Battle Visual Identity Rebuild

## Product Goal

把目前 V10 的「可玩、可辨識」戰鬥畫面，提升成真正具有早期主機三國 RPG 商業作品感的高完成度致敬版。

V11 不追求 1:1 複製任何既有商業遊戲的受版權保護素材、原曲或逐字劇情；目標是以原創像素美術、原創 chiptune 與三國題材內容，達到相近年代感、資訊密度、辨識度與戰鬥氛圍。

## Highest Priority

畫面品質是 V11 的最高優先級。V11 完成前，不以增加地圖、章節、商店或額外系統作為進度替代品。

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

### 3. Sprite Standard

- 每角色使用獨立 sprite sheet row 或獨立檔案。
- 建議 logical frame：96×112 或 96×120。
- 至少包含：idle A、idle B、attack anticipation、attack strike、hurt、cast、KO。
- `image-rendering: pixelated`，禁止瀏覽器平滑縮放。
- 角色邊緣不得被 frame 裁切。
- 敵我方向必須相向。

### 4. Battle Scene

不再只有純黑背景。加入低彩度、低干擾的復古戰場層：

- 遠景天空／煙霧
- 山脈或林線 silhouette
- 中景旗幟／軍陣暗影
- 地面紋理
- 保留角色與文字高對比

背景不得搶過角色與 UI。

### 5. Battle UI

核心仍維持：

- 左右 5v5
- 我軍藍色 segmented troop bar
- 敵軍黃色 segmented troop bar
- 下方左側主將 portrait
- 下方右側文字式 commands

但需改善：

- 兵力、姓名、sprite 對位更緊密。
- Portrait 面板視覺重心更完整。
- 指令框使用老主機 RPG 的固定框體與游標節奏。
- 降低「HTML/CSS form」感。

## Portrait Standard

- 五名主角使用獨立 portrait art。
- Portrait 不得只是戰鬥 sprite 放大。
- 每張至少有頭部、髮飾／冠帽、肩甲／衣領、膚色陰影與角色專屬特徵。
- 尺寸建議 112×112 logical pixels，再依 iPhone UI 顯示縮放。

## Audio Goal

V11 戰鬥音樂採原創 FC-style chiptune，不複製既有遊戲受版權保護旋律。

### Required channels

- Pulse 1：主旋律
- Pulse 2：副旋律／和聲
- Triangle：Bass
- Noise：打擊
- Optional arpeggio：和弦感

### Required tracks

- Normal Battle
- Boss Battle
- Victory Jingle
- Tactic Cast SFX
- Physical Hit SFX
- Heal SFX

Normal Battle 至少需有 A/B section，而非 8～16 小節短 loop。

## Technical Architecture

```text
/assets/v11/
  battle/
    heroes/
    enemies/
    portraits/
    backgrounds/
    ui/
/src/v11/
  assetsV11.js
  battleRendererV11.js
  battleAnimatorV11.js
  audioV11.js
  goldenV11.js
/styles/
  v110.css
/golden-v11.html
```

規則與呈現分離：既有 `BattleSystem` 保留傷害、AI、技能與回合邏輯；V11 renderer 只處理畫面與動畫。

## Milestones

### M1 — Character Art Gate

- 先完成 5 名我軍 idle／attack／hurt／cast／KO。
- 隱藏名字後至少 4/5 我軍能由外觀辨識。
- iPhone 不得發生裁切、重疊、模糊。

### M2 — Enemy + Layout Gate

- 曹仁、張郃、夏侯惇至少 2/3 不看名字可辨識。
- 5v5 排版在 390×844 iPhone 上無重疊。
- troop bars、姓名與 sprite 視覺節奏穩定。

### M3 — Background + UI Gate

- 完成至少一張 Golden Battle 背景。
- Portrait 面板與 command panel 完成 V11 美術語言。
- 畫面不再有明顯 Web App 感。

### M4 — Audio + Animation Gate

- attack / hit / cast / KO 動畫完整。
- Normal Battle BGM 有 A/B section。
- iPhone Safari 音訊恢復、切背景與回前景正常。

### M5 — User Acceptance Gate

只有在使用者確認 Golden Battle 視覺品質通過後，才能將 V11 戰鬥系統移植回完整遊戲。

## Definition of Done

- [ ] 5 名我軍隱藏名字後至少 4 名可直接辨識。
- [ ] 曹仁／張郃／夏侯惇至少 2 名可直接辨識。
- [ ] 所有角色 frame 無裁切、錯位、模糊。
- [ ] 390×844 iPhone Safari 戰鬥畫面無文字或 sprite 重疊。
- [ ] 戰場背景具有場景層次但不搶角色。
- [ ] Portrait 為獨立角色美術，而非 sprite 放大。
- [ ] 指令 UI 不再呈現現代 Web App 視覺。
- [ ] attack / hurt / cast / KO 可見且時序合理。
- [ ] Normal Battle / Boss Battle / Victory 音訊完整。
- [ ] iPhone 音訊可啟用、切背景後可恢復。
- [ ] V11 QA 全部通過。
- [ ] 使用者確認 Golden Battle 視覺品質達標。

## Out of Scope Until Acceptance

- 大型世界地圖重製
- 第二章與後續章節
- 新商店／裝備系統
- 新角色大量擴充
- 其他非戰鬥玩法功能
