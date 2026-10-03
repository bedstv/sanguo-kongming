# V12 baseline audit

Baseline: V11.6.1 `70ad17d656b33d61cc70013382c510a984b96884`.
Working base: `d511c87`, whose only later changes are the V12 specifications.
Scope: GOAL_V12.md, docs/V12_COMMERCIAL_REBUILD.md, GitHub issue #4 (read 2026-10-03).

## Evidence and limits

- Inspected the actual hero/enemy PNGs, renderer, portraits, battle rules, CSS, and audio implementation. `baseline-assets.png` is a decoded contact sheet of the existing assets.
- The user's earlier iPhone screenshots are not attached to this session and could not be recovered by contextual lookup. Do not claim to have visually reviewed those screenshots. The recorded Guan Yu disappearance regression is covered by asset decode/coverage checks.
- Automated browser captures are viewport simulations, not physical iPhone evidence. Physical Safari audio, recognition and visual acceptance remain human gates.

## Findings

| Area | V11 evidence | V12 response |
|---|---|---|
| Hero art | 96×112 cells, seven poses; sparse rectangular anatomy and minimally differentiated equipment | Independently authored eight-pose RGBA sheets; consistent grounded cells; characteristic anatomy, silhouette and weapons |
| Enemy art | Five 672×112 strips, generic bodies and mostly palette differentiation | Unique Cao Ren shield, Zhang He plumes/hook spear, Xiahou Dun eyepatch/heavy saber; distinct infantry and bow silhouettes |
| Portraits | Independent files exist but detail and identity remain weak | New separately composed head-and-shoulder portraits |
| Animation | attack `[2,3,2]`, no independent recovery; idle only changes on render | Timestamp-based idle/anticipation/strike/recover/hurt/cast/KO timeline |
| Layout | Fixed offsets (88px), 96px sprite windows, large numbers beside art; collision risk at narrow widths | Fixed five rows, independent art and info zones; hit regions >=44px; compact fixed commands |
| Background | Predominantly black, tiny scanline decoration | Original atmospheric pass background with quiet playable foreground |
| FX | Primarily floating text and brightness flashes | Original animated raster effect atlas plus independent damage overlays |
| Battle state | Delayed callbacks reopen input; SP spent before target confirmation; guard cleared before enemy attack | Explicit phase lock; payment on confirmation; defense lasts through enemy turn; cancellation does not spend resources |
| Audio | WebAudio oscillators; synchronous media primer, audioSession playback, gesture resume, pageshow and visibility handlers | Preserve the unlock implementation by inheritance; original multi-section arrangements and balanced SFX |
| Isolation | V11 entry shares old modules | New golden-v12.html, V12 assets/styles/modules; no V11 modifications |

## Art direction checkpoint

`visual-mockup.png` was generated before any V12 renderer. Direction accepted internally for production: warm dusk pass, dark navy antique-gold framing, five rows, full-body 3/4 fighters, independent portrait, six primary commands. Production uses actual data text (not generated labels), exact layout constraints, and a larger command zone than the concept image. This is an internal design checkpoint, not user visual acceptance.

Character identifiers: Liu Bei twin jian/emerald/gold crown; Guan Yu red face/long beard/guandao; Zhang Fei broad torso/wild beard/serpent spear; Zhao Yun white plume/silver/blue cape; Kongming ivory robes/black scholar cap/feather fan; Cao Ren indigo fortress armor/shield; Zhang He violet/twin plumes/hooked spear; Xiahou Dun eyepatch/crimson/black/heavy saber; pikeman steel cap/pike; archer hood/bow/quiver.
