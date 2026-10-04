# V12.3 QA — 2026-10-04

Scope: chapter-two save continuation into the Wu alliance, wind and fire-ship preparations in either order, Red Cliffs five-versus-five decision, Zhou Yu ending and persistent Jiangling camp.

Status: 41 Node tests, twelve seeded full three-chapter combat journeys, 58 WebKit checks, new production asset checks and all legacy validators pass. No game page errors or failed asset requests.

## Verification

- Eight new Node tests cover migration without losing gear/resources; monotonic stage restoration with the chapter-two completion flag; every map grid, service, quest and exit route; one-time alliance and either preparation order; exact enemy-HP/checkpoint restoration without applying the fire-ship benefit twice; invalid/premature checkpoints; defeat/retry recovery; and twelve full three-chapter journeys.
- Each full journey fights vanguard, Bowang boss, both rescues, four-round bridge defense, both preparation battles and the Red Cliffs boss using actual HP/SP/damage/rewards. Only animation time is replaced with an instant test clock. Camp recovery uses the same full HP/SP restoration available from the game's free clinic/inn. No character combat values are inflated. See `chapter3-combat-qa.json`.
- The browser uses `chapter3-start-save.json`, generated from the first two chapters of the seeded combat run, to verify V12.2 continuation. Preparations, enemy damage checkpoints, independent Zhou Yu/Xu Huang portraits, ten production units, decoded naval MP3, the genuine 20-percent starting benefit, boss victory, once-only rewards, ending, journal retreat hub and final save/reload pass. See `chapter3-browser-qa.json`.
- Preparation-flow browser victories use test-only enemy HP=1 to isolate progression and checkpoint logic. The final boss browser fight uses full unmodified combat stats and actual Timeline animations. Twelve separate combat journeys also leave every enemy/player combat value unmodified and play all preparation fights.
- Existing first-chapter 18, second-chapter 11 and Golden Battle 17 WebKit checks pass again, for 58 total. Existing 33 Node tests pass again. The original first-chapter twelve seeded continuations and second-chapter twelve hold tests are retained.
- New PNG source/runtime SHA-256, sprite alpha/bounds, eight unique Xu Huang poses, two Zhou Yu idle poses, independent portraits, terrain/background dimensions, source stereo music and MP3 are validated. V8/V9/V10/V11 validators, JavaScript syntax and diff whitespace checks pass.

Mobile layouts: 390×844, 393×852, 390×664 and simulated 47px top/34px bottom safe areas. Exploration buttons stay within the viewport with at least 44px touch height. The shared ten-unit battle composition retains existing Golden Battle layout coverage; the new Red Cliffs battlefield is visually inspected at 390×844.

Engine: Playwright WebKit 26.5 on Linux. This is not a physical iPhone. V11 Safari primer/unlock/audioSession/resume code is unchanged; prior user audio acceptance is preserved, but no new physical chapter-three test or numeric blind-recognition score is claimed.

Visual inspection checked the alliance camp, altar, shipyard, battle and ending. The naval camp gains river frontage and a landing. The night-deck camera uses auto 110% / center bottom, preserving aspect ratio, visible distant fire ships and grounded first-row feet. Wood floor tiles are packed from the authored naval background rather than repeating complete dock structures. Prompt/source provenance is in `chapter3-generation-manifest.json`.
