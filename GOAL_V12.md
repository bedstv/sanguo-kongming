# V12 — Commercial Quality Rebuild

## Mission
把目前 V11.x 的可玩 prototype 升級成可公開展示、可作為正式獨立遊戲 vertical slice 的商業品質版本。

V12 不再採用「每次只修一點」的方式。Golden Battle 是唯一品質閘門：在戰鬥畫面、美術、動畫、音效、BGM、UI 與 iPhone 實機體驗沒有明顯跳級前，不擴世界地圖、章節、商店或其他功能。

## Product principles
1. 畫面品質 > 新功能數量。
2. Asset-first，不再以程序幾何小人或 CSS 裝飾作為主要美術來源。
3. 每位主將要有獨立 silhouette、裝備、臉部、服飾與動作語言。
4. UI 必須像一款遊戲，而不是網頁 App。
5. iPhone 390×844 級 viewport 為第一優先驗收裝置。
6. 音訊必須保留已驗證可在 iPhone Safari 解鎖與恢復播放的流程。
7. 保留三國與早期主機 RPG 的致敬方向，但不直接複製原作受版權保護的 sprite、音樂或台詞。

## Golden Battle cast
我軍：劉備、關羽、張飛、趙雲、孔明。
敵軍：曹仁、張郃、夏侯惇、魏軍槍兵、魏軍弓手。

## Visual target
- 不看名字至少 4/5 我軍可辨識。
- 曹仁、張郃、夏侯惇至少 2/3 可辨識。
- 角色不再呈現方塊紙娃娃感。
- 角色有 3/4 視角、重量感、盔甲層次與武器曲線。
- portrait 為獨立頭肩像素稿，不是戰鬥 sprite 放大。
- 背景有戰場氛圍，但不搶角色可讀性。
- 戰鬥 UI 應緊湊、固定、復古、無現代卡片感。
- 5v5 在 iPhone 上不得裁切、重疊或造成資訊碰撞。

## Animation target
每名主要角色至少：
- idle A/B
- anticipation
- attack
- recover
- hurt
- cast
- KO

攻擊必須有 anticipation → strike → recover，而不是單純位移加換圖。

## FX target
至少完成：
- sword slash
- spear thrust
- impact flash
- fire tactic
- lightning tactic
- heal
- defeat / KO

## Audio target
- Normal Battle
- Boss Battle
- Victory
- UI / select
- attack / hit / cast / heal / KO

採原創 FC/SFC-era chiptune 編曲語言，不直接複製原作旋律。

## Technical direction
- 保留既有 battle rules，但 renderer / assets / animation / FX / audio 解耦。
- V12 Golden Battle 使用獨立入口，不污染 V11 穩定版。
- 先完成 visual mockup 與 Golden Battle vertical slice，再整批整合。
- 自動 QA 必須檢查 asset 尺寸、frame count、引用完整性、iPhone 音訊 hooks 與無 legacy procedural hero renderer。

## Definition of Done
V12 M1 只有在以下全部成立才算完成：
- [x] 5 名我軍正式高細節 sprite + portrait。
- [x] 5 名敵軍正式高細節 sprite。
- [x] 主要角色至少 8-frame animation pipeline。
- [x] 戰場背景、UI、FX、BGM 全部使用 V12 production assets。
- [ ] iPhone 390×844 5v5 無裁切／無重疊。
- [x] iPhone Safari 可正常解鎖 BGM / SFX，背景返回後可恢復。（2026-10-04 使用者確認）
- [ ] 隱名測試 4/5 我軍可辨識。
- [ ] 主要敵將 2/3 可辨識。
- [x] 使用者實機視覺驗收通過。（2026-10-04：「對戰畫面可以了」）
- [ ] Golden Battle 達到「可公開展示」而非 prototype 的完成度。

## Freeze
Golden Battle 未通過前：
- 不擴世界地圖
- 不新增章節
- 不做商店 / 裝備系統擴充
- 不以增加功能代替美術品質提升

## 使用者後續指示 — 2026-10-04

使用者確認「對戰畫面可以了，但是目前也只有對戰畫面其它什麼都沒有」，並指示繼續。因此接續整批完成第一章遊戲旅程：首頁、探索、劇情、整備、戰鬥返回、通關與存檔。這項明確新指示解除此範圍的功能 freeze；不將未測得的 4/5、2/3 辨識率或精確實機 viewport 當成已驗收。範圍與 QA 見 `docs/V12_CAMPAIGN_REBUILD.md`、`docs/v12/CAMPAIGN_QA.md`。

## V12.2 接續交付

第一章整批交付後，使用者再指示「請繼續」。第二章「長坂護民」接續營地集結、百姓救援、四回合守橋與江夏安民；角色與裝備資源保留。這是本遊戲新編的戲劇改編，非 repository 既有歷史復原劇本。範圍與驗證見 `docs/V12_SECOND_CHAPTER.md`、`docs/v12/CHAPTER2_QA.md`，維持素材優先、完整章節後整批提交，以及未量測實機／辨識指標如實保留。

## V12.3 接續交付

兩章部署後，使用者再次指示繼續。第三章「赤壁風起」整批完成孫劉盟約、東風／火船準備、連環艦決戰與江陵安定；維持視覺稿先行、production assets、完整流程與舊存檔接續後再整批提交。規格與驗證見 `docs/V12_THIRD_CHAPTER.md`、`docs/v12/CHAPTER3_QA.md`。
