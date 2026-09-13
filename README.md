# 三國戰策：孔明篇

目前主線版本：**V5.2 Goal-driven Vertical Slice — Cinematic Art Pass**。

完整開發目標與驗收條件請見 [`GOAL_V5.md`](./GOAL_V5.md)，角色美術規格請見 [`ART_DIRECTION_V5.md`](./ART_DIRECTION_V5.md)。

目前已完成的第一章主流程：**新野 → 隆中 → 回新野整備 → 商店/裝備 → 野外戰鬥與升級 → 博望坡 → 夏侯惇 Boss → 第一章完成**。

V5.2 美術與演出重點：
- 主要武將 64×64 級高辨識度原創 sprite rig + 80×96 獨立肖像。
- 攻擊 3 frame、施法 2 frame、受擊 2 frame 的逐格動作。
- 火攻、落雷、補血、弱化、總攻、陣型等戰鬥特效。
- 孔明計策 cut-in、夏侯惇 Boss 登場與「烈斬」專屬 cut-in。
- 世界 tile 第二輪重畫與武將圖鑑。
- GitHub Actions 自動檢查 JavaScript 語法、地圖尺寸與 PWA 資產完整性。

V11 Golden Battle 美術驗收入口：`https://bedstv.github.io/sanguo-kongming/golden-v11.html?v=11.4`

V11.4 重點：iPhone 音訊已完成 gesture hardening；敵軍改為固定 raster sprite sheets，不再 runtime 程序繪製，並持續以 iPhone 5v5 畫面作為品質閘門。
