# V12.5 QA

## 執行環境
本輪工作環境未提供本機 shell／瀏覽器。程式與素材經 GitHub connector 準備；GitHub Actions 將作為原生 Node 與 Linux WebKit 的執行環境，不冒充本機或實機 iPhone。

## 提交前檢查
- V8 記憶體內 import adapter：8 項第五章規則測試與 12 組完整五章原始數值旅程通過。使用 structuredClone 相容函式與 instant animation clock；這不是原生 Node 執行。
- 地圖出入口、設施及任務路線可達；新增前端 modules 通過 JavaScript 語法解析。
- 原創 WAV 合成完成，peak 0.468、RMS 0.137，無 clipping；尚未人工聽音。
- 生產戰場與概念稿已直接檢視，尚未檢視實際手機 renderer 最終截圖。

## CI 驗證計畫
原生 Node 全部既有測試加新增第五章 8 項；12 組完整五章戰鬥，兩種準備順序、舊存檔、戰敗、一次性獎勵與 checkpoint。
完整既有 86 項 WebKit 回歸加第五章瀏覽器流程：全數使用未修改敵軍 HP／攻擊／傷害，390×844 DPR 3、393×852、390×664、安全區、主線門檻、讀檔、音樂解碼及決戰／結尾。戰鬥 fixture 由完整四章實際數值旅程產生；恢復等同遊戲免費客棧。
執行報告、截圖與 fixture 由 CI artifact 保存。最終 CI 狀態以 PR checks 與 Actions 為準。

## 待驗收
第五章實機 iPhone 畫面、聽音與背景切回；V12.4.1 探索清晰度實機回饋。既有音訊恢復通過不擴大解讀為新曲人工聽音通過。
