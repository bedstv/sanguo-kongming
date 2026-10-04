# V12 integrated Golden Battle

## V12.1 main journey

Open `http://localhost:8123/?v=12.1` for the playable first chapter. Start a journey, leave Xinye, visit Kongming in Longzhong, return to prepare at the shop/inn, then fight the vanguard and Golden cast at Bowang. Chapter completion, resources and command-phase battle checkpoints persist automatically. Move with the direction buttons, keyboard or map tap; **路標** follows the current quest route. **軍勢／整備** manages gear, items, formation and the journal. Shop gear requires explicit hero assignment. Existing V5 saves can be imported when no V12 journey is present; the old slot is retained.

`legacy-v8.html` preserves the former main-entry prototype. `golden-v12.html` remains standalone. See `../V12_CAMPAIGN_REBUILD.md` and `CAMPAIGN_QA.md` for scope and verification. Current first-chapter evidence is separate from prior physical iPhone battle acceptance.

Serve the repository with `python -m http.server 8123`, then open `http://localhost:8123/golden-v12.html?v=12.0`.

Tap **鳴鼓出戰** to unlock sound in the user gesture. **靜音進入** starts muted; the header **聲音** toggles audio. Select a command, then a highlighted unit. **取消** returns without spending SP. **隱名** hides names for recognition review. Victory/defeat offers replay. Default music is the boss arrangement; `&music=battle` auditions the normal battle arrangement.

The first mockup was made before the renderer. See `visual-mockup.png`, `BASELINE_AUDIT.md`, `production-contact-sheet.png`, and `QA_REPORT.md`. Generated concept text is not shipped as game text.

Tests:

```sh
python -m pip install Pillow
python scripts/validate-v12.py
node tests/v12/rules.test.mjs
node tests/v12/timeline.test.mjs
node tests/v12/campaign-state.test.mjs
node tests/v12/campaign-combat.test.mjs
npm install --no-save --package-lock=false playwright@1.62.1
npx playwright install --with-deps webkit
# Keep the local HTTP server running in another terminal.
node tests/v12/browser.cjs
node tests/v12/campaign-browser.cjs
```

`V12_BASE_URL` changes the test server URL. Test-only mutable state is exposed only with the `qa` query parameter. Browser QA writes fresh screenshots and `browser-qa.json`. Physical iPhone and blind-recognition acceptance remain separate from automation.

## V12.2 second chapter

Open `/?v=12.2`. A V12.1 chapter-one clear save continues directly: select **續章** or use the army journal. Provision two rations at the refugee camp, rescue both families on Changban Road, then speak to the ferry keeper. The bridge encounter wins after four enemy turns if at least one ally survives. Victory continues to Jiangxia; defeat returns to the refugee camp with rescue progress preserved.

See `../V12_SECOND_CHAPTER.md`, `CHAPTER2_QA.md`, and `chapter2-generation-manifest.json` for gameplay scope, QA, original production sources and exact prompts. Add `node tests/v12/chapter-two.test.mjs` and `node tests/v12/chapter2-browser.cjs` to the existing checks. Audio unlock/resume continues to use unchanged AudioV11 hooks.

## V12.3 三章旅程

正式首頁 `/?v=12.3`。第二章通關後點續章，或軍議中的前往第三章，接續赤壁風起。規格 `../V12_THIRD_CHAPTER.md`，QA `CHAPTER3_QA.md`，production 提示 `chapter3-generation-manifest.json`。

新增檢查：`node tests/v12/chapter-three.test.mjs`、`node tests/v12/chapter3-browser.cjs`；測試由三章真實戰鬥數值連戰產生 `chapter3-start-save.json`，供瀏覽器接續第二章完成進度，並非任意放大角色數值的 demo。

## V12.4 四章旅程

正式首頁 `/?v=12.4`。第三章通關後點「續章」或軍議中的「前往第四章」，接續荊南定策。與孔明商議、接應桂陽糧隊，再前往長沙與黃忠交涉；決戰後可在長沙軍府整備與探索。五將與資源保留，護糧只領一次兩份軍糧。

規格 `../V12_FOURTH_CHAPTER.md`，QA `CHAPTER4_QA.md`，production 提示 `chapter4-generation-manifest.json`。新增 `node tests/v12/chapter-four.test.mjs` 與 `node tests/v12/chapter4-browser.cjs`。`chapter4-start-save.json` 由原值三章連戰產生供瀏覽器測試續章；四章連戰測試保留原值 HP/SP／傷害，僅使用遊戲內同等免費營地恢復與 instant animation clock。
