# V12 M1 — Commercial Golden Battle Execution Plan

## Phase 0 — Baseline audit
- 保存 V11.6.1 作為 baseline。
- 用最新 iPhone 實機截圖列出 crowding、sprite、portrait、UI、背景、FX、audio 的缺口。
- 建立 V12 獨立測試入口 `golden-v12.html?v=12.0`。

## Phase 1 — Art direction board
先產出一張完整靜態 Golden Battle mockup，再寫 renderer。
Mockup 必須一次包含：5v5、portrait、command UI、HP bars、戰場背景、active cursor、FX placement。
只有 mockup 視覺方向通過才進 production assets。

## Phase 2 — Hero production art
逐一完成劉備、關羽、張飛、趙雲、孔明：
- 3/4 pose
- silhouette 差異
- headgear / beard / armor / robe / weapon
- 8+ frames
- 128×144 或相近 production cell
- nearest-neighbor display
- 每人獨立 sheet，不共用人體模板

## Phase 3 — Enemy production art
曹仁、張郃、夏侯惇與兩類魏軍：
- 名將使用獨立 silhouette
- 雜兵可共享規格但不可只換色
- 與我軍 scale、anchor、grounding 一致

## Phase 4 — Portrait pass
五位我軍獨立 128×128 左右頭肩 portrait。
至少關羽、張飛、孔明在縮圖下仍高度可辨識。

## Phase 5 — Renderer + layout
- 固定 5-row battle composition
- 角色與資訊不互相遮擋
- 命令區低於約 28–30% 高度
- 無 modern-card UI
- active / target / KO 清楚
- iPhone safe-area 正確

## Phase 6 — Animation + FX
建立 timeline-based animation state：
`idle -> anticipation -> strike -> recover`
以及 `hurt / cast / KO`。

加入 slash、thrust、fire、lightning、heal、impact FX。

## Phase 7 — Audio production
保留 V11 iPhone unlock hardening。
重寫 battle / boss / victory 編曲，並校準 SFX loudness，避免 BGM 淹沒攻擊聲。

## Phase 8 — QA
自動：
- 檢查每張 sheet 尺寸與 frame count
- 檢查所有角色都有必要 pose
- 檢查 renderer 不回退到 procedural hero art
- 檢查 V12 cache/version
- 檢查 iPhone audio hooks

實機：
- 390×844
- 393×852
- Safari
- 聲音開啟 / 背景切換 / 回前景
- 隱名辨識
- attack / cast / KO

## Delivery rule
不要在 Phase 1–7 每完成一小塊就宣告完成。
第一次提交給使用者驗收的 V12 Golden Battle，必須同時包含正式 hero、enemy、portrait、UI、background、FX、animation 與 audio。
