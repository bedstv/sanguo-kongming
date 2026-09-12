# V9 Milestone 1 — Golden Battle 實作拆解

本文件把 `GOAL_V9.md` 轉成可直接執行的工程任務。原則是：**不再做小 patch；一次建立完整戰鬥資產管線，再切入口。**

---

## Phase 0 — Freeze / Baseline

### 0.1 保存 V8.1 baseline
- 記錄目前 main HEAD。
- 保留 V8.1 可回退版本。
- 不刪除既有 `src/v8/`，但 V9 Golden Battle 不再依賴 V8 的 procedural battle art。

### 0.2 建立 V9 debug entry
- 支援 `?v=9.0&battle=golden`。
- 直接建立固定我軍 / 敵軍狀態。
- 不需要走新野 → 隆中 → 野外遇敵。

驗收：網址打開後 1–2 秒內可進 Golden Battle。

---

# Phase 1 — Asset Pipeline

## 1.1 Asset manifest
新增 `src/v9/assetsV9.js`：

```js
export const V9_ASSETS = {
  heroes: {
    liubei: {...},
    guanyu: {...},
    zhangfei: {...},
    zhaoyun: {...},
    kongming: {...}
  },
  enemies: {...},
  portraits: {...},
  effects: {...}
}
```

每個 sprite 定義：
- path
- frameWidth = 64
- frameHeight = 80
- frame map
- anchorX / anchorY
- displayScale

## 1.2 PNG sprite sheets
Golden Battle 第一批：

### Heroes
- `assets/v9/battle/heroes/liubei.png`
- `guanyu.png`
- `zhangfei.png`
- `zhaoyun.png`
- `kongming.png`

### Enemies
- `caoren.png`
- `zhanghe.png`
- `xiahoudun.png`
- `pikeman.png`
- `archer.png`

每張 sheet：
- frame 64×80
- 至少 7 frames
- 背景透明
- 禁止 runtime SVG 最終輸出

## 1.3 Portraits
- 五名我軍 portrait
- 96×96 或 112×112
- 非 battle sprite 放大

## 1.4 Effects sheet
至少：
- slash
- spear
- fire
- thunder
- heal
- confuse
- guard
- KO burst / dust

---

# Phase 2 — Renderer Hard Rebuild

## 2.1 `battleRendererV9.js`
建立固定 slot：

```text
ally[0]             enemy[0]
ally[1]             enemy[1]
ally[2]             enemy[2]
ally[3]             enemy[3]
ally[4]             enemy[4]
```

不可依 DOM content 高度自然流動。

### Fixed anchors
每一列必須使用固定 top / y anchor，避免：
- 名字長度改變 sprite 位置
- HP 數字改變 bar 位置
- round label 跟第一列重疊

## 2.2 Unit component
HTML 只包含：

```html
<div class="v9-unit">
  <div class="v9-sprite-window"></div>
  <div class="v9-unit-info">
    <div class="v9-name"></div>
    <div class="v9-troops"></div>
    <div class="v9-bar"></div>
  </div>
</div>
```

禁止把 battle stats 塞回 row。

## 2.3 Troop bar component
- 8 cells
- cell state：full / empty / critical
- ratio 採 `Math.ceil()` 或明確規則
- dead 全空

## 2.4 Bottom panel
左 panel：portrait / name / role / Lv / troop / SP。
右 panel：message + command menu。

移除：
- 武 / 防 / 智 / 速常駐顯示
- 大面積 `返回指令` button
- 現代 card spacing

---

# Phase 3 — Sprite Animator

## 3.1 State machine

```text
idleA <-> idleB
idle -> windup -> strike -> recover -> idle
idle -> cast -> recover -> idle
idle -> hit -> idle
idle -> KO
```

## 3.2 Timing
- idle frame：450–650 ms
- windup：90–120 ms
- strike：90–130 ms
- hit：80–120 ms
- recover：100–160 ms
- KO：180–320 ms

## 3.3 Rendering
優先方案：CSS `object-position` / background-position sprite sheet。
若效能或縮放品質不理想，再改 `<canvas>` sprite blit。

### 禁止
- 每個 frame 重建大量 SVG data URL。
- 每個 frame 重新生成完整角色圖形。

---

# Phase 4 — Battle UI / Input

## 4.1 Main menu
固定七個命令：
- 攻擊
- 總攻
- 計策
- 陣型
- 軍糧
- 防禦
- 撤退

## 4.2 Cursor
- `▶` 或 `cursor.png`
- 點擊 = 選取 + 執行（手機）
- Keyboard / gamepad = 移動 cursor + confirm

## 4.3 Target selection
選敵時：
- 只顯示單一 target cursor / blink。
- 不畫整列大 outline。
- B 返回主命令。

## 4.4 Tactic menu
同一 frame 內替換 command content，不開 modal。

---

# Phase 5 — Golden Battle Data

## 5.1 Fixed player party
- 劉備 4200
- 關羽 5000
- 張飛 5200
- 趙雲 4700
- 孔明 3600

## 5.2 Fixed enemy party
Golden Battle 測試資料建議：
- 曹仁 6200
- 張郃 5800
- 魏軍槍兵 3200
- 魏軍弓手 2900
- 夏侯惇 8200

測試目的不是平衡正式關卡，而是讓五列全滿，驗收 layout / animation / targeting。

## 5.3 Golden Battle 不寫正式存檔
Debug 入口離開後不覆蓋玩家正式 save。

---

# Phase 6 — Audio M1

## 6.1 新增 `musicV9.js`
不要沿用 V8 短 pattern 當最終曲目。

要求：
- battle loop 30–60 秒
- boss loop 30–60 秒
- melody / harmony / bass / percussion 明確分離
- 原創旋律

## 6.2 SFX envelope
每種音效獨立 envelope，不只改 frequency：
- cursor：極短 pulse
- confirm：雙音 ascending
- slash：noise + falling tone
- hit：noise transient + low pulse
- thunder：多段 noise + low rumble
- fire：filtered noise impression
- heal：ascending arpeggio
- KO：descending pulse/noise

## 6.3 iPhone lifecycle
沿用目前已驗證的：
- pointer/touch unlock
- `visibilitychange`
- `pageshow`

並加入 V9 音量 mix QA。

---

# Phase 7 — CSS Hard Reset

新增 `styles/v90.css`，對 `#battle` 做完整 reset。

## 7.1 必須覆蓋
- V5/V7 card styles
- border-radius
- gradients
- shadows
- battle background image

## 7.2 允許
- solid black
- 1–2 px white / warm gray border
- cyan / amber bars
- minimal pixel shadow for text readability

## 7.3 iPhone 390×844 baseline
驗收：
- battlefield 約 62–66%
- bottom panel 約 34–38%
- 五列完整可見
- Safari bottom bar 出現時仍不截斷最後一列命令

---

# Phase 8 — Integration

## 8.1 `battle.js`
建立 renderer / animator adapter：

```js
this.renderer = new BattleRendererV9(...)
this.animator = new SpriteAnimatorV9(...)
```

逐步移除：
- procedural pose image generation
- V8-specific class assumptions

戰鬥計算公式先不改，避免 art refactor 同時造成 gameplay regression。

## 8.2 Entry switch
只有在 Golden Battle quality gate 通過後，才把正式一般戰鬥切到 V9 renderer。

---

# Phase 9 — QA

## Automated
新增 `scripts/validate-v9.mjs` 或擴充 `validate.mjs`：

檢查：
- V9 required asset paths
- 10 張 sprite sheet 是否存在
- 5 張 portrait 是否存在
- renderer wired
- no procedural battle SVG import in V9 Golden Battle path
- CSS entry loaded
- SW precache paths valid
- JavaScript syntax

## Visual / Manual
必須人工檢查：
- 390×844 iPhone screenshot
- target mode screenshot
- tactic menu screenshot
- attack frame screenshot
- KO frame screenshot

---

# Commit Strategy

V9 M1 不是每做一個小改就宣告完成，但仍可拆 commit 方便回退：

1. `V9: scaffold golden battle pipeline`
2. `V9: add hero sprite sheets`
3. `V9: add enemy and portrait assets`
4. `V9: replace battle renderer`
5. `V9: add sprite animation state machine`
6. `V9: add battle audio identity`
7. `V9: hard reset battle UI`
8. `V9: enable golden battle test mode`
9. `V9: pass iPhone and CI quality gate`

最後一個 commit 才能稱為 **V9 M1 complete**。

---

# Acceptance Checklist

- [ ] `?v=9.0&battle=golden` 可直接開固定 5v5。
- [ ] 10 個正式 battle sprite sheet。
- [ ] 5 個正式 hero portraits。
- [ ] 每名名將至少 7 frames。
- [ ] 角色不依賴 procedural SVG。
- [ ] 4/5 我軍 silhouette test 通過。
- [ ] 2/3 重點敵將 silhouette test 通過。
- [ ] 8-cell troop bars。
- [ ] target cursor 清楚且不覆蓋角色。
- [ ] attack / hit / cast / KO animation 正常。
- [ ] battle BGM 為 30–60 秒原創 loop。
- [ ] iPhone audio resume 正常。
- [ ] 390×844 沒有文字重疊 / panel 截斷。
- [ ] V9 QA success。
- [ ] iPhone 實機截圖人工核准。
