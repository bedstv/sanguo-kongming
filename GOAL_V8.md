# GOAL V8 — 高還原 FC 三國 RPG 致敬版

## Product Goal
把目前「現代網頁遊戲 + 復古元素」的方向，重構成真正具有 8-bit / 16-bit 初期主機三國 RPG 氣質的作品。V8 的最高優先順序是：**戰鬥畫面辨識度、像素美術一致性、資訊密度、復古音色、三國敘事節奏**。

高還原的對象是「年代感、戰鬥排版、像素語言、UI 資訊密度、操作節奏與音色編制」，不直接複製原商業遊戲的 ROM、sprite、原曲旋律、原台詞或原地圖素材。

---

## North Star
玩家在 iPhone 上第一次看到 V8 戰鬥畫面時，不需要閱讀標題，就應該直覺聯想到：

> 「這是一款 FC / 早期 16-bit 世代的三國 RPG。」

而不是：

> 「這是一個用 HTML/CSS 模仿復古風格的網頁遊戲。」

---

## V8 核心優先順序

### P0 — Battle Screen Rebuild
1. 五名我軍與五名敵軍採左右直列對陣。
2. 黑色 / 近黑背景為主，避免現代卡片化 UI。
3. 武將名稱、兵力、兵力條必須成為主要視覺資訊。
4. 每名武將 sprite 一眼可辨識，不依靠姓名判斷角色。
5. 下方使用「武將肖像 + 屬性 + 指令 / 計策框」的經典 RPG 配置。
6. 指令框使用直角 / 輕微圓角像素框，不使用現代 App 大圓角按鈕。
7. 戰鬥動畫短、快、清楚：移動、揮砍、受擊、計策、死亡。

### P0 — Sprite Art Direction
1. 戰鬥 sprite source：建議 96×128 或 128×160，最後以 nearest-neighbor 顯示為 54–72 CSS px。
2. 每名主將至少有：idle A / idle B / attack / hit / cast / KO。
3. 輪廓優先於細節：頭冠、髮型、鬍鬚、武器、披風、盔甲型態必須差異化。
4. 我軍五將第一批：劉備、關羽、張飛、趙雲、孔明。
5. 敵軍第一批：司馬懿、司馬炎、鄧艾、鍾會、曹仁、張郃、夏侯惇，另加 3–4 種泛用兵種。
6. 避免 Q 版大頭比例；改成約 1:2.5～1:3 的復古武將比例。

### P0 — UI Language
1. 移除大面積漸層卡片與現代 Dashboard 感。
2. 主要框線：1–2 px 白 / 暖灰線。
3. 我軍 HP：青藍；敵軍 HP：黃橙。
4. HP bar 採 8–10 段分格顯示。
5. 文字使用高對比白字，名稱與兵力數字比目前大 15–25%。
6. 指令採 2 欄 × 3 列或 2 欄 × 4 列文字選單，而不是獨立大按鈕卡。
7. 選取狀態使用 `▶` 游標 / 反白，不靠大面積發光。

### P1 — World Art Rebuild
1. 世界與城鎮畫面使用一致 pixel-art 規則，不使用平滑向量插畫感。
2. 以 16 / 24 / 32 px logical pixel grid 製作素材，再整數倍放大。
3. 地圖視覺強調樹林、山、河流、道路、城牆、村落密度，不保留大片空草地。
4. 道路避免「筆直 UI 線條」，改成有邊緣、破損、砂土、轉折。
5. 每個重要場景要有至少 1 個 landmark：新野城門、隆中草廬、博望坡軍寨。
6. 建立真正的 sprite sheet / tile sheet，不再用大量 runtime primitive 當主要美術。

### P1 — Music / SFX Identity
1. 採原創旋律，不直接重製原商業遊戲配樂。
2. 音色架構以經典主機聲源為核心：
   - Pulse 1：主旋律
   - Pulse 2：和聲 / 對旋律
   - Triangle：Bass
   - Noise：Snare / Hi-hat / 軍鼓
   - Arpeggio：和弦感
3. 世界曲：英雄遠征、五聲音階、96–112 BPM。
4. 戰鬥曲：急促軍勢感、132–150 BPM。
5. Boss 曲：低音 ostinato + 半音張力 + 戰鼓。
6. 城鎮曲：短 loop、柔和、低密度。
7. 勝利 / 升級 / 獲得物品 / 計策 / 普攻 / 受擊各自有短 SFX。

### P1 — Story Direction
1. 主線依三國演義 / 公版歷史題材重寫，不直接搬用原遊戲台詞。
2. 第一章：新野 → 隆中 → 孔明出山 → 返回新野 → 博望坡。
3. 對話短句化，每框 1–3 行，符合早期 RPG 節奏。
4. 重要武將出場要有專屬肖像 / 名稱框 / 短台詞。

---

## V8 Battle Visual Spec

### Portrait iPhone baseline
以 390×844 CSS viewport 為主要驗收基準。

### Battle screen vertical split
- Battle field：55–58%
- Command / portrait panel：42–45%

### Battle field
- 背景：#000 或非常接近黑色。
- Allies：左側 46%。
- Enemies：右側 46%。
- 中央保留 8% breathing space。
- 每側 5 個固定 row，垂直分布平均。

### Unit row
每名單位由 3 個主要元素組成：
1. sprite
2. 名稱 + 兵力數字
3. segmented troop bar

我軍：sprite 靠左，文字 / bar 靠中。
敵軍：sprite 靠右，文字 / bar 靠中。

### Sprite display
- CSS display width：約 58–68 px。
- Boss / 大型武將可到 76 px。
- `image-rendering: pixelated`。
- 不使用 blur / drop-shadow 作為主要輪廓手段。
- 以 sprite 本身 outline 做可讀性。

### Troop number
- 16–20 px 等效字級。
- 名稱 15–18 px。
- 兵力 18–22 px。

### HP / troop bar
- 寬 96–130 px。
- 高 12–15 px。
- 8–10 個 segmented cells。
- 我軍 #7fdcff / #4da9df。
- 敵軍 #ffd45c / #f0a928。
- 空格 #171717。
- 1 px 白框。

### Bottom command panel
左側 28–32%：
- 96×96 左右武將肖像。
- 姓名。
- 主將 / 軍師 / 猛將類型。
- Lv、兵力、SP。

右側 68–72%：
- 上方一行戰鬥訊息。
- 中間顯示 `SP xxx`。
- 下方 2 欄文字選單：攻擊 / 計策 / 陣型 / 軍糧 / 防禦 / 撤退。
- 計策畫面沿用相同框架，不跳成完全不同 UI。

### Cursor model
- 目前選項前顯示 `▶`。
- 觸控點擊後移動 cursor，再次確認或直接執行，需保持一致。
- A = 確認、B = 返回。

---

## Battle Animation Spec

### Normal attack
1. 80–120 ms 前傾 / step-in。
2. 90–140 ms 攻擊 frame。
3. 命中閃白 / shake 60–90 ms。
4. Damage number 300–450 ms。
5. 回 idle。

整段不超過 650 ms。

### Tactic
1. 施法者 cast pose。
2. 角色上方 / 中央出現 300–500 ms effect。
3. 目標 flash / shake。
4. 數值結算。

### KO
- 角色變暗 → 下降 / dissolve 150–250 ms。
- 不留彩色完整 sprite 只降低 opacity。

---

## Visual Art Rules
1. 禁止以大圓角 glassmorphism 當主要 UI。
2. 禁止把 SVG 向量素材直接當作最終像素美術而不做 pixel pass。
3. 禁止大量漸層、blur、box-shadow 掩蓋素材不足。
4. 每個 hero sprite 必須先通過 silhouette test：縮到 48×60 仍能辨識。
5. 戰鬥畫面若隱藏角色名字，至少 4/5 名我軍仍需能靠外觀辨認。
6. 同一資產不得只換顏色就當不同名將。

---

## Technical Architecture
建議 V8 新增：

```text
/assets/v8/
  battle/
    heroes.png
    enemies.png
    effects.png
    portraits.png
  world/
    tiles.png
    landmarks.png
    npcs.png
  ui/
    frames.png
    cursors.png
/src/v8/
  battleRenderer.js
  battleLayout.js
  spriteAnimator.js
  pixelUi.js
  musicV8.js
/styles/v80.css
```

現有 `BattleSystem` 保留戰鬥規則，render layer 從 `battle.js` 拆出去，避免規則和 DOM/CSS 綁死。

---

## File-level Refactor Plan

### `src/battle.js`
- 保留：回合、傷害、SP、技能、敵 AI、勝敗。
- 移除大部分 DOM template rendering。
- 改呼叫 `BattleRenderer.render(state)`。
- 動畫交給 `SpriteAnimator`。

### `src/v8/battleRenderer.js`
- 建立固定 5×2 row layout。
- 統一 unit row、兵力 bar、死傷狀態、target cursor。
- 處理 portrait panel 與 command panel。

### `src/v8/spriteAnimator.js`
- idle / attack / hit / cast / ko frame state machine。
- requestAnimationFrame 驅動。
- 不依賴 CSS translate 模擬所有動畫。

### `src/v8/musicV8.js`
- pattern / channel sequencer。
- 原創 world / battle / boss / town patterns。
- 共用既有 iPhone AudioContext unlock lifecycle。

### `styles/v80.css`
- 移除現代 App card look。
- 重建像素框線、2-column command list、HP bars、portrait panel。
- iPhone 390×844 / 430×932 為優先 breakpoint。

---

## Definition of Done
- [ ] V8 戰鬥畫面與 V7 有「世代級」差距，而不是微調。
- [ ] 黑底五對五戰鬥布局完成。
- [ ] 五名我軍主將能只看 sprite 辨識至少 4 名。
- [ ] 至少 7 名具名敵將有獨立 silhouette。
- [ ] 兵力條分格、名稱與數字比例符合 V8 spec。
- [ ] 下方 portrait + command panel 完成。
- [ ] A / B / touch 操作一致。
- [ ] 普攻、受擊、計策、KO 有逐格動畫。
- [ ] 世界地圖至少一個場景完成真正 pixel-art pass。
- [ ] world / battle / boss / town 四套原創復古 BGM 完成。
- [ ] iPhone Safari 實機完整玩 20 分鐘，聲音不中斷。
- [ ] iPhone 實機截圖通過 visual review，不再有「現代網頁 UI」感。
- [ ] GitHub Actions syntax / structure / asset validation 通過。

---

## V8 Acceptance Gate
若以下任一項不過，V8 不得標記完成：

1. 只看戰鬥截圖，必須明顯有早期主機三國 RPG 氣質。
2. 武將不能再只是不同顏色的小人。
3. 戰鬥下半部不能像一般 Web App button grid。
4. 世界場景不能出現大片重複空草地。
5. 音樂必須有清楚的 pulse / triangle / noise 復古聲源層次。
6. 所有美術與音樂素材必須是新製 / 原創或具合法使用權，不直接抽取原商業遊戲資產。
