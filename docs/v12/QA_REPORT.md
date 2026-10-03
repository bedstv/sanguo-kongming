# V12 Golden Battle — implementation and QA

Status: complete first integrated review candidate. Not yet accepted as V12 M1.

## Delivered together

- Independent `golden-v12.html?v=12.0`; V11.6.1 runtime untouched.
- Exact 5v5 cast from GOAL_V12.md and issue #4.
- Ten independent 1024×144 RGBA sprite strips (8 × 128×144 cells), 80 distinct poses. Original generated source art and packing metadata retained.
- Five separately composed 128×128 portraits, original battlefield, seven effect families with four frames each.
- Timestamp animation: idle A/B, anticipation, strike, recover, hurt, cast, KO. Background tabs pause the battle timeline.
- Compact retro fixed UI, target selection, active indicator, troop bars, skills, rations, formation, guard, total assault, win/loss and replay.
- Original stereo battle / boss / victory score: `風起博望`, `鐵騎壓境`, `旌旗凱旋`; separate UI, attack, hit, cast, heal and KO cues. V11 synchronous iPhone primer and resume code inherited unchanged.
- V11 damage/equipment/formation/skill parameters retained. Input phases prevent double actions; spell cost is paid on confirmation; guard lasts through the enemy turn.

## Verified

- `python scripts/validate-v12.py`: full decode of every runtime and source PNG; sheet size, 80 unique poses, alpha bounds, hashes, portrait size, FX atlas, PCM audio, versioned references, no procedural hero fallback.
- `node tests/v12/rules.test.mjs`: 11 tests pass, including damage parity, guard, cancelled/invalid targets, double taps, SP, healing cap, enemy rounds, rush, KO, win/loss and single reward.
- `node tests/v12/browser.cjs`: 17 checks pass in Playwright WebKit 26.5 on Linux. No page errors or failed HTTP requests. See `browser-qa.json`.
- Viewports: 390×844, 393×852, simulated 47px top/34px bottom safe areas, and 390×664 shortened viewport. All ten units and their troop info fit without info overlap or horizontal overflow.
- Audio in WebKit: gesture activation, decoded boss/victory playback, mute/unmute, suspended AudioContext gesture recovery, simulated visibility/pageshow recovery.
- Captured and visually inspected baseline, production contact sheet, final mobile layouts and combat states.
- Fixed a real background PNG truncation found by visual QA; asset packing now serializes PNGs in memory before writing and validation fully decodes them.

Screenshots are browser simulations. Dynamic effect screenshots can miss the brief peak frame; automated tests separately assert live effect and animation states. The initial deterministic keyframe capture was blocked by the environment's approval-service usage limit. Subsequent live Chrome inspection on 2026-10-03 directly observed fire and lightning impact frames, cast poses, damage overlays and corresponding HP/SP changes. See `live-lightning-20261003.jpg` for the inspected lightning frame. This desktop live capture supplements the existing mobile WebKit checks; it is not physical iPhone evidence.

## Baseline regression gate

The existing V11 validator failed before any V12 change: its expected Guan Yu digest was stale. The actual decoded PNG digest is `808796201019b7b23a684b14d0715b8a9845db1645448017a31f6525bd31db93` in both baseline `70ad17d` and the working tree. Corrected only the test fixture digest after confirming full image decode and unchanged source; no V11 runtime or artwork was edited. Existing V8/V9/V10/V11 validators pass.

## Remaining human acceptance gates

- The user's earlier V11.6.1 physical iPhone screenshots were not recoverable in this session. `baseline-390x844.png` is a new WebKit reproduction, not a substitute claimed as user evidence.
- Physical iPhone Safari audio audition, background/foreground and lock-screen behavior.
- Blind recognition: at least 4/5 allies and 2/3 named enemies. The author cannot certify their own blind recognition test.
- User visual acceptance and the public-showcase commercial-quality gate in GOAL_V12.md. Issue #4 must stay open until these pass.

No world map, chapter, shop or equipment expansion. No V11 patch series. All implementation is one integrated commit.

## Post-deployment verification — 2026-10-03

- Integrated implementation: PR #5, main `4d8d2a5e5d2f351a1fc9e807858fea10dc5b7230`.
- Merged-main QA run `37131395180`: success; Pages deployment `37131394832`: success.
- Live Chrome UI: entry gesture, attack, fire, guard and lightning selection/execution verified; no game-origin errors observed in the captured console log (browser-extension metadata errors were present).
- Lightning sample: Kongming SP 42 → 33; Xiahou Dun HP 14500 → 12703; damage overlay 1797 matches the HP delta.
- Issue #4 implementation checklist reconciled; physical-device, blind-recognition and user-acceptance gates remain open.
