# V12 integrated Golden Battle

Serve the repository with `python -m http.server 8123`, then open `http://localhost:8123/golden-v12.html?v=12.0`.

Tap **鳴鼓出戰** to unlock sound in the user gesture. **靜音進入** starts muted; the header **聲音** toggles audio. Select a command, then a highlighted unit. **取消** returns without spending SP. **隱名** hides names for recognition review. Victory/defeat offers replay. Default music is the boss arrangement; `&music=battle` auditions the normal battle arrangement.

The first mockup was made before the renderer. See `visual-mockup.png`, `BASELINE_AUDIT.md`, `production-contact-sheet.png`, and `QA_REPORT.md`. Generated concept text is not shipped as game text.

Tests:

```sh
python -m pip install Pillow
python scripts/validate-v12.py
node tests/v12/rules.test.mjs
npm install --no-save --package-lock=false playwright@1.62.1
npx playwright install --with-deps webkit
# Keep the local HTTP server running in another terminal.
node tests/v12/browser.cjs
```

`V12_BASE_URL` changes the test server URL. Test-only mutable state is exposed only with the `qa` query parameter. Browser QA writes fresh screenshots and `browser-qa.json`. Physical iPhone and blind-recognition acceptance remain separate from automation.
