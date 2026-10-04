# V12.4 QA — 2026-10-04

Scope: V12.3 clear-save continuation, Jiangling military order, Guiyang grain escort, Changsha parley, five-versus-five Huang Zhong decision, ending and permanent town services.

## Verification

- 49 Node tests pass, including eight new chapter-four cases. Migration preserves party/resources/gear/formation; previous completion flags do not downgrade stages 15–19. All map grids, exits, service NPCs and quest routes are reachable. Early destinations/checkpoints and completed quest checkpoints are rejected. Grain reward grants exactly two rations once; defeat preserves supply flags and spent resources; victory returns to the permanent Changsha hub.
- Twelve seeded full four-chapter combat journeys play vanguard, Bowang boss, both rescues, bridge defense, both Red Cliffs preparations, Red Cliffs boss, grain escort and Huang Zhong. Original HP/SP/damage/rewards are retained. Only animation time uses an instant test clock; rest equals the available free camp clinic/inn. All twelve complete stage 19. See `chapter4-combat-qa.json`.
- Browser fixture `chapter4-start-save.json` comes from a real-stat three-chapter journey, with version 12.3 recorded for continuation. Browser QA walks through gates, NPCs, grain combat/checkpoint, once-only rations, independent portrait, ten production battle units, decoded original music, exact damaged enemy reload, full Huang Zhong fight, ending and clinic/shop/journal services. See `chapter4-browser-qa.json`.
- Grain-flow browser victory uses test-only enemy HP=1 to isolate progression and checkpoint behavior. Huang Zhong browser victory uses full unmodified combat stats and real Timeline animations. The separate twelve full journeys play grain combat without modifying stats.
- Sixteen new WebKit checks and all 58 previous Golden/first/second/third chapter checks pass, for 74 checks total. Zero game page errors or failed asset requests. Node tests, V8/V9/V10/V11 validators, all production hashes/decoded PNGs, eight unique alpha/bounded poses, source stereo music/MP3, JavaScript syntax and diff whitespace pass.

## Mobile and visual checks

Battle and exploration: 390×844, 393×852, 390×664, and simulated 47px top / 34px bottom safe areas. All battle units/sprite bounds stay inside their rows and viewport. Command/header and exploration buttons have at least 44px touch height. The shortened journey battle panel/header are enlarged slightly to preserve touch height and avoid a half-pixel header overflow. Original standalone Golden composition is retained.

Visual inspection covers military camp, grain post, Changsha gate/parley, battle, short-height battle and Huang Zhong ending. New camps use authored stone ground, autumn trees and command hall, without the old naval tent underneath. Gate terrain is packed with its full roof from source crop recorded in `chapter-four-manifest.json`.

At normal height the battlefield uses auto 110% / center bottom. At 740px height or less, a square crop from the same original source fills the courtyard without side gaps or aspect distortion. The crop `(0,100,1024,1124)` retains the gate above the first row and grounded courtyard below; source artwork is unchanged. Full provenance and exact built-in imagegen prompts: `chapter4-generation-manifest.json`.

Engine: Playwright WebKit 26.5 on Linux. This is not a physical iPhone. The previously accepted AudioV11 Safari primer/unlock/audioSession/resume code is unchanged. New chapter-four physical iPhone and numeric blind-recognition acceptance remain unmeasured. The game plot is an original dramatization, not historical reconstruction.
