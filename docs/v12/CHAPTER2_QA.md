# V12.2 QA — 2026-10-04

Scope: first-chapter continuation through refugee provisioning, two independent rescues, four-round river-bridge defense, ending and persistent Jiangxia camp. Physical iPhone chapter-two QA is separate from prior battle/audio acceptance.

Status: 33 Node tests, 24 actual-stat seeded combat runs (12 first-chapter, 12 bridge), 46 WebKit checks and all asset/legacy gates pass. No page errors or failed asset requests.

## Verification

- Eight chapter-two tests: V12.1 save migration and preserved equipment/resources; all map grids and quest/service/exit routes; ration gate and one-time consumption; rescue and hold checkpoint restoration; defeat/retry recovery; first surviving actor; four-round objective with enemies still alive and one-time reward; defeat priority on the fourth round.
- The hold test runs twelve seeds with actual HP/SP/damage, all five heroes defending for four rounds; only animation timing is replaced by an instant test clock. See `chapter2-combat-qa.json`.
- Existing 25 Node tests cover original combat, Timeline, first-chapter state and twelve actual-stat vanguard/boss continuations.
- Mobile WebKit chapter-two flow covers old-save continuation, provisioning/shop, two rescues with reload and combat checkpoint, Cao Chun art and original bridge music, guard/hold restoration, actual four-round defense with surviving enemies, one-time rewards, ending/reload, and four exploration layouts. See `chapter2-browser-qa.json`.
- Existing 18 first-chapter and 17 Golden Battle WebKit checks run again. The shared iPhone audio unlock/session/resume implementation is unchanged.
- Full PNG decode, alpha/pose bounds/uniqueness, all new source/runtime hashes, independent portrait, river atlas, original stereo mother track and compressed music are checked by `scripts/validate-v12.py`. Legacy validators also run.

Rescue-flow browser victories use test-only enemy HP=1 to isolate progression/checkpoint behavior. The browser's bridge defense uses full unmodified enemy/player stats and waits for the actual four enemy rounds. The independent twelve-seed hold test also leaves all combat stats untouched. No numeric blind-recognition score or physical iPhone test is invented.

Layouts: 390×844, 393×852, 390×664, and simulated 47px top/34px bottom safe areas. Controls remain within the viewport with 44px touch height. Engine: Playwright WebKit 26.5 on Linux; this is not a physical iPhone. Screenshot evidence includes camp, first rescue, ferry, bridge formation and ending.

New images use original AI-assisted production art; source/prompt paths are in `chapter2-generation-manifest.json`. New music source and measurements: `assets/v12/audio/chapter-two-score.json`, `chapter-two-mix-report.json`.

Visual inspection adjusted bridge camera framing to keep the first row on timber decking, enlarged the camp landmark without stretching it, and corrected location-specific travel and completed-NPC guidance. New sprites, ferry, camp, bridge and ending screenshots were inspected.
