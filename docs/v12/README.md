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
