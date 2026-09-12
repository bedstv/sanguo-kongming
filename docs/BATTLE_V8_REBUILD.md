# V8 戰鬥畫面重構方案

## 1. 問題診斷
目前 V7 戰鬥畫面已經具備五對五、兵力條、肖像與指令，但仍然有三個根本問題：

1. **角色辨識度不足**：sprite 太接近模板換色，沒有足夠 silhouette 差異。
2. **資訊層級不對**：角色、姓名、兵力、血條、回合資訊同時競爭視線。
3. **UI 太像 Web App**：下半部仍是大按鈕 grid、圓角框、現代面板感。

V8 不再 patch 現有 CSS，而是重建 battle presentation layer。

---

## 2. 目標畫面結構

```text
┌──────────────────────────────────────┐
│                                      │
│  我軍 row 1              敵軍 row 1  │
│  我軍 row 2              敵軍 row 2  │
│  我軍 row 3              敵軍 row 3  │
│  我軍 row 4              敵軍 row 4  │
│  我軍 row 5              敵軍 row 5  │
│                                      │
├──────────────┬───────────────────────┤
│   武將肖像    │ SP xxx                 │
│   姓名 / Lv   │ ▶ 攻擊       計策       │
│   兵力 / SP   │   陣型       軍糧       │
│              │   防禦       撤退       │
│              │                       │
└──────────────┴───────────────────────┘
```

戰鬥區以黑色為主。背景可以有極低亮度的地形 silhouette，但不得搶過 sprite。

---

## 3. Layout

### 3.1 Battlefield
- 高度：56vh 左右。
- 5 個固定 row。
- 每 row 佔 battlefield 高度約 18%。
- ally row 與 enemy row 垂直對齊。
- ally / enemy 中間保持 24–40 CSS px 的安全距離。

### 3.2 Unit composition
我軍 row：

```text
[sprite] [name]
         [troops]
         [bar]
```

敵軍 row：

```text
[name] [sprite]
[troops]
[bar]
```

### 3.3 Bottom panel
- 高度 42–44vh。
- 左 30%，右 70%。
- 像素框線分割，不使用 Card UI。

---

## 4. Character Sprite Pipeline

### Source sheet
- 每角色 cell：128×160。
- 6 frames：idleA, idleB, attack, hit, cast, ko。
- sheet 每 row 1 character。

### Display
- 普通將：64×80 CSS px 左右。
- 大型 Boss：72×90。
- nearest-neighbor。

### Hero silhouette rules

**劉備**
- 低皇冠 / 冕冠
- 綠金衣甲
- 單手劍
- 身形較端正，不做重裝

**關羽**
- 高大、長髯
- 深綠戰袍
- 長柄偃月類武器
- 肩寬明顯

**張飛**
- 黑鬚、黑頭巾 / 硬朗頭飾
- 赤褐甲
- 蛇矛類長兵器
- 站姿外擴、最粗壯

**趙雲**
- 白 / 銀頭盔
- 藍白甲
- 長槍
- 身形最修長

**孔明**
- 綸巾
- 紫 / 靛長袍
- 羽扇
- 無重甲輪廓

每名角色縮小到 48×60 時仍必須可辨識。

---

## 5. Enemy Art

### Named generals
至少：
- 曹仁：厚甲、盾 / 刀
- 張郃：細長兵器、較敏捷輪廓
- 夏侯惇：眼罩、赤黑甲、大刀
- 司馬懿：高冠、深紫、杖 / 扇
- 司馬炎：帝王式冠飾、紫金
- 鄧艾：重甲、戟
- 鍾會：文武混合、長劍

### Generic enemies
- 魏軍槍兵
- 魏軍弓手
- 魏軍校尉
- 斥候

Generic enemy 可共用骨架，但頭盔、兵器與姿態要有差異。

---

## 6. Typography

### Required hierarchy
1. Character name
2. Troop number
3. Troop bar
4. Round / encounter label

### CSS target
- name: 16–18px
- troop: 19–22px
- command: 18–20px
- info: 13–15px

Chinese font 優先：
`"PingFang TC", "Noto Sans TC", sans-serif`

外觀用描邊 / pixel shadow 模擬早期主機，而非導入原作字型。

---

## 7. HP / Troop Bar

建立 `SegmentBar` component：
- 10 cells。
- gap 1px。
- 外框 1px white。
- ally cyan / enemy amber。
- 低於 25% 時 ally 轉淡紅或 flashing。
- dead = empty bar + dark sprite。

禁止再用單一漸層 `<i style="width:x%">` 當最終樣式。

---

## 8. Command UI

### Main command
```text
SP 24
▶ 攻擊         計策
  陣型         軍糧
  防禦         撤退
```

### Tactic submenu
```text
SP 24
▶ 落雷計       聖雨
  火焰計       金仙計
  擾亂         返回
```

### Touch behavior
- 點選文字區 = 移動 cursor 並立即確認，或採「第一次選、第二次確認」；全遊戲只選一種規則。
- A = 確認。
- B = 返回上一層。

---

## 9. Battle Messages
把現在獨立的大訊息框縮成 1–2 行戰鬥訊息區：

```text
劉備 行動。
```

或：

```text
關羽使出猛擊！ 魏軍槍兵損失 723。
```

不要讓訊息框高度壓縮指令區。

---

## 10. Animation State Machine

```text
idle
 -> windup
 -> attack/cast
 -> impact
 -> recover
 -> idle
```

每次動作不超過約 650 ms；全攻模式可縮短到每名約 300–400 ms。

### Required visual effects
- slash
- spear thrust
- fire
- thunder
- heal
- confuse
- guard
- KO

Effects sheet 與 character sheet 分離。

---

## 11. Code Refactor

### Battle rules
`src/battle.js`
- 保留純邏輯。
- 建議新增：
  - `getBattleViewModel()`
  - `resolveAction()`
  - `selectTarget()`
- render 與 animation 不再直接散落在 rule methods。

### Renderer
`src/v8/battleRenderer.js`
- renderUnits
- renderActorPanel
- renderCommands
- renderCursor
- renderTroopBar

### Animation
`src/v8/spriteAnimator.js`
- setPose(id, pose)
- play(id, sequence)
- playEffect(effect, target)
- wait(ms)

### Assets
`src/v8/battleAssets.js`
- preload sheets
- sprite frame lookup
- portrait lookup
- effect lookup

---

## 12. Responsive Rules

### iPhone baseline 390×844
優先完成。

### 430×932
只做比例放大，不重新排版。

### Landscape / Desktop
可把 battlefield 與 command panel變成 65/35，但不影響 portrait mobile layout。

---

## 13. QA Screenshot Gate
每次 Visual QA 必須留三張截圖：
1. 普通野戰
2. 計策選單
3. Boss 戰

人工檢查：
- 角色有沒有撞文字
- 兵力數字有沒有被 sprite 遮住
- 5v5 是否在 390px 寬仍保持清楚
- 下方指令是否不用縮到難讀
- 角色名隱藏時，五名我軍是否至少辨識 4 名

---

## 14. 第一個 V8 Milestone
只先完成一個「黃金戰鬥畫面」：

**劉備 / 關羽 / 張飛 / 趙雲 / 孔明 VS 曹仁 / 張郃 / 槍兵 / 弓兵 / 夏侯惇**

功能至少包含：
- 5v5 layout
- 分格兵力條
- 新 command panel
- 5 名我軍新 silhouette
- 3 名具名敵將新 silhouette
- 普攻 / 計策 / hit 動畫
- world battle BGM V8 prototype

這個 milestone 在 iPhone 實機視覺通過以前，**不擴充更多劇情與地圖**，先把最重要的戰鬥畫面做到位。
