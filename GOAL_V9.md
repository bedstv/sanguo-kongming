# GOAL V9 — Hard Reboot：高完成度 FC 三國 RPG 致敬版

## Product Goal
V9 不再延續 V8 的「程式生成角色 + CSS 模擬復古 UI」路線，而是把戰鬥呈現層視為一個獨立遊戲產品重新製作。

**最高優先順序只有一個：玩家在 iPhone 上看到第一場戰鬥時，必須感覺這是一款真正完成過美術製作的經典主機三國 RPG，而不是網頁遊戲套上復古皮膚。**

V9 採 Battle-first。世界地圖、商店、長劇情擴充全部暫緩，直到 Golden Battle 通過品質門檻。

> V9 追求的是年代感、像素語言、戰鬥資訊密度、角色辨識度、動畫節奏與原創復古音色；不直接複製既有商業遊戲的 ROM、sprite、原曲旋律、原台詞或地圖素材。

---

## North Star
在 390×844 CSS viewport 的 iPhone 直向畫面上，隱藏遊戲標題後，玩家仍應直覺感到：

> 「這是一款 8-bit / 16-bit 初期世代的三國 RPG，而且人物與 UI 是完整製作過的。」

而不是：

> 「這是 HTML/CSS 做出來的復古風 Demo。」

---

## V9 開發原則

### 1. Asset-first，而不是 Procedural-first
- 名將不再用程式幾何圖形即時拼接。
- 名將不共用同一人體骨架只換顏色、頭飾、武器。
- 正式畫面使用手工逐角色 sprite sheet / portrait sheet。
- 程式只負責載入、切 frame、定位、動畫與狀態切換。

### 2. Golden Battle Gate
在 Golden Battle 未通過前：
- 不做大型世界地圖翻修。
- 不擴第二章。
- 不新增大量裝備、商店或支線。
- 不把「能玩」視為「完成」。

### 3. iPhone-first
主要驗收裝置為 iPhone Safari / PWA，baseline viewport 390×844 CSS px。
桌面版只做相容，不反過來犧牲手機畫面。

### 4. 一致像素語言
- Sprite、portrait、effect、frame、cursor、troop bar、文字框必須像同一款遊戲。
- 禁止以 blur、glassmorphism、大圓角、漸層陰影來掩蓋素材不足。
- UI geometry 以 2 / 4 / 8 px 規則為主。

---

# V9 Milestone 1 — Golden Battle

## Golden Battle 編成

### 我軍
1. 劉備
2. 關羽
3. 張飛
4. 趙雲
5. 孔明

### 敵軍
1. 曹仁
2. 張郃
3. 魏軍槍兵
4. 魏軍弓手
5. 夏侯惇

這一戰是 V9 所有美術、UI、動畫、音訊與 iPhone QA 的基準場景。

---

# Visual Direction

## Battle Field
- 主背景以黑色 / 極低亮度背景為主。
- 左右五列固定對陣。
- 左軍與右軍都採固定 row anchors，不因名字長短改變人物位置。
- 中央保留足夠負空間，形成清楚「兩軍對陣」感。
- 回合資訊縮成一行，不遮人物、不與姓名重疊。

## Unit Composition
每一列只保留三層資訊：
1. 武將 sprite
2. 姓名 + 兵力
3. segmented troop bar

不在主戰場顯示武、防、智、速等次要資訊。

## Troop Bar
- 8 格 segmented bar。
- 我軍：青藍色。
- 敵軍：金黃色。
- 1–2 px 高對比外框。
- 不使用單一 `<div width=x%>` 漸層條做正式樣式。

---

# Character Art Specification

## Sprite Grid
正式名將 sprite：
- logical canvas：64×80 px。
- 每位角色獨立 sheet。
- PNG，透明背景。
- 禁止使用 SVG 向量作為最終名將戰鬥資產。
- nearest-neighbor 顯示。

## Required Frames
每位名將至少：
- idle A
- idle B
- attack windup
- attack strike
- hit
- cast
- KO

至少 7 frame；可依角色增加 weapon follow-through / special pose。

## Silhouette Gate
角色縮小到約 48×60 顯示時：
- 五名我軍至少 4 名可不看姓名辨認。
- 曹仁、張郃、夏侯惇至少 2/3 可不看姓名辨認。

## Hero Identity

### 劉備
- 冕冠 / 王冠輪廓低而明確。
- 綠金主色。
- 單手劍。
- 身形端正，不做重裝坦克。

### 關羽
- 五人中最高大。
- 長髯是第一辨識特徵。
- 深綠戰袍。
- 長柄偃月類武器斜向穿過角色輪廓。

### 張飛
- 五人中最寬、最粗壯。
- 黑鬚 / 強烈臉部輪廓。
- 赤褐甲。
- 長矛 / 蛇矛感兵器。

### 趙雲
- 最修長。
- 銀盔、白羽、藍白甲。
- 長槍輪廓乾淨、速度感強。

### 孔明
- 無重甲輪廓。
- 綸巾、長袍、羽扇。
- 紫 / 靛色系。
- 站姿沉穩，施法 frame 差異最大。

## Enemy Identity

### 曹仁
- 重甲、厚肩、盾 / 刀輪廓。
- 偏冷色金屬甲。

### 張郃
- 身形較細長。
- 高速型武將，頭盔羽飾與長兵器明顯。

### 夏侯惇
- 眼罩必須在小尺寸仍看得出來。
- 赤黑重甲。
- 大刀 / 刃器。
- Boss 尺寸可比一般角色大 8–12%。

### 泛用兵種
- 槍兵與弓兵可共用部分基礎比例。
- 但兵器、頭盔、手臂姿勢與站姿必須明顯不同。

---

# Portrait Specification

- 96×96 logical px 或 112×112 logical px。
- 每名主將獨立 portrait，不直接放大戰鬥 sprite。
- 臉型、鬍鬚、頭飾、衣領必須有角色身份。
- 只在下方 actor panel 顯示。
- V9 M1 至少完成五名我軍 portrait。

---

# Command UI Specification

## Layout
下方 panel 建議約 34–38% 螢幕高度。

左側 27–30%：
- portrait
- 姓名
- role
- Lv
- 兵力
- SP

右側 70–73%：
- 1–2 行 battle message
- command grid

## Main Command
```text
▶ 攻擊        總攻
  計策        陣型
  軍糧        防禦
  撤退
```

## Tactic Command
```text
SP 24
▶ 火攻計      聖雨
  落雷計      擾亂計
  返回
```

## Cursor
- 使用 `▶` / sprite cursor。
- 不靠大面積 hover glow。
- A = confirm。
- B = back。
- 觸控點擊與鍵盤操作邏輯一致。

---

# Animation Specification

## Normal Attack
總長 450–650 ms：
1. windup 80–120 ms
2. strike 90–140 ms
3. impact flash / shake 70–100 ms
4. damage number 250–400 ms
5. recover

## Tactic
- cast pose
- effect sheet
- target reaction
- damage / heal number
- recover

## KO
- 專用 KO frame / collapse。
- 禁止只把完整彩色 sprite 調低 opacity 當死亡動畫。

## Required Effects
- slash
- spear thrust
- fire
- thunder
- heal
- confuse
- guard
- KO

---

# Audio Specification

V9 M1 只要求完成戰鬥聲音身份：

## Battle BGM
- 原創旋律。
- Pulse 1：主旋律。
- Pulse 2：對旋律 / 和聲。
- Triangle：bass。
- Noise：snare / hi-hat / 軍鼓。
- 132–150 BPM。
- 30–60 秒 loop 後不應明顯感到只有 8 小節無限重複。

## Boss BGM
- 低音 ostinato。
- 更密集 noise drum。
- 半音 / 增四度張力可使用，但旋律須原創。

## Required SFX
- cursor
- confirm
- attack swing
- hit
- fire
- thunder
- heal
- KO
- victory

## iPhone Audio Gate
- 第一次手勢後可解鎖。
- Safari / PWA 從背景切回可恢復。
- 音樂與 SFX 不得彼此完全蓋掉。

---

# Technical Architecture

```text
/assets/v9/
  battle/
    heroes/
      liubei.png
      guanyu.png
      zhangfei.png
      zhaoyun.png
      kongming.png
    enemies/
      caoren.png
      zhanghe.png
      xiahoudun.png
      pikeman.png
      archer.png
    portraits/
      liubei.png
      guanyu.png
      zhangfei.png
      zhaoyun.png
      kongming.png
    effects.png
  ui/
    battle-frame.png
    cursor.png
    troop-bars.png
/src/v9/
  battleRendererV9.js
  spriteAnimatorV9.js
  battleUiV9.js
  assetLoaderV9.js
  musicV9.js
/styles/v90.css
```

## Code Boundaries

### `src/battle.js`
只負責：
- turn flow
- damage
- SP
- tactics
- AI
- win / lose

### `src/v9/battleRendererV9.js`
只負責：
- unit slots
- names
- troop values
- troop bars
- actor panel
- target state

### `src/v9/spriteAnimatorV9.js`
只負責：
- frame timeline
- pose state
- impact timing
- KO timeline

### `src/v9/assetLoaderV9.js`
只負責：
- preload PNG assets
- sheet metadata
- fallback detection

---

# Golden Battle Test Mode
V9 M1 應提供開發入口，例如：

`?v=9.0&battle=golden`

可直接進入固定 Golden Battle，不必重跑新野 → 隆中流程。

用途：
- iPhone 實機截圖比較
- sprite QA
- animation QA
- audio QA
- layout QA

正式遊戲流程完成後仍可保留 debug flag，但不在一般 UI 顯示。

---

# Quality Gates / Definition of Done

V9 M1 只有同時符合下列條件才算完成：

- [ ] 5 位我軍正式 hand-authored sprite sheet 已接入，無 procedural SVG fallback 出現在 Golden Battle。
- [ ] 曹仁、張郃、夏侯惇、槍兵、弓兵正式 sprite sheet 已接入。
- [ ] 五名我軍隱藏姓名後至少 4 名可辨識。
- [ ] 三名重點敵將隱藏姓名後至少 2 名可辨識。
- [ ] 每名主將至少 7 frame。
- [ ] KO 不是單純 opacity。
- [ ] actor portrait 為獨立 portrait asset。
- [ ] 8 格 troop bar 正常。
- [ ] 主戰場 / panel 比例在 390×844 iPhone 上無文字遮擋。
- [ ] Round label 不蓋到 unit name。
- [ ] Golden Battle 固定 5v5。
- [ ] 一般戰鬥 BGM 為原創完整 loop。
- [ ] iPhone Safari 聲音可解鎖且背景恢復後可續播。
- [ ] GitHub Actions V9 QA success。
- [ ] 至少一次 iPhone 實機 Golden Battle 截圖人工驗收。

---

# Stop Conditions
以下任一情況發生時，不得宣告 V9 M1 完成：

- 還在用 procedural SVG 當正式名將 sprite。
- 只靠換顏色區分名將。
- 需要看名字才知道關羽 / 張飛 / 趙雲是誰。
- 下方 UI 仍像大按鈕 dashboard。
- iPhone 上出現人物 / 姓名 / round label 重疊。
- 音樂只有短循環測試旋律。
- QA success 但實機畫面品質未過人工驗收。

---

# After M1
Golden Battle 通過後才依序進入：

1. V9 M2 — World / Town pixel-art reboot
2. V9 M3 — Story presentation / portrait dialogue
3. V9 M4 — Full Chapter 1 integration
4. V9 M5 — iPhone final polish / performance / PWA QA
