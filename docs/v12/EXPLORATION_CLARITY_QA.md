# V12.4.1 exploration clarity — 2026-10-05 Asia/Taipei

User reported the refugee camp looked soft and hard to identify. Original iPhone upload IMG_4160.jpeg is preserved unchanged as `iphone-user-20261005.jpeg` (707×1536). Its CSS viewport and device pixel ratio cannot be established from the image alone.

## Change

The old exploration renderer downsampled the entire map, actors and 9px labels into a 320×320 canvas before CSS enlarged it. Grass/path detail competed with small actors. The new renderer retains 320×320 logical map coordinates but sizes its backing canvas to the contained square's displayed CSS size times devicePixelRatio, redrawing on viewport changes. Labels are rendered at device resolution, without CSS pixelated enlargement of text. Character art still uses nearest-neighbor sampling directly from original production sheets.

- Heroes 32×36 → 42×48 logical units; NPCs 26×33 → 36×45.
- Landmark labels 9px → semibold 12px, opaque contrasting panels; all actors also receive names, with Liu Bei's label colored separately. Label placement considers actor and previous-label bounds, moving aside when standing next to an NPC.
- Only grass and path backgrounds use cached 32px filtered samples and a restrained color overlay, reducing high-frequency sparkle. Buildings, trees, original sheets, portraits and source files remain unchanged. This is a runtime rendering adjustment, without new generated artwork.
- The map reserves a 23px caption strip, so exit labels are not covered by save status. Map hit testing still uses logical tile coordinates, independent of the backing resolution.
- Main entry/CSS/renderer imports use `12.4.1` cache tokens. Save schema/key and V12.4 chapter progression are preserved; no content expansion. Accepted AudioV11 Safari unlock/resume and standalone Golden battle are unchanged.

## Verification

49 Node tests, including 12 full four-chapter seeded journeys with original combat values, pass. Existing V8/V9/V10/V11 validators, V12 asset validation, syntax and whitespace checks pass. Local chapter-one (18) and chapter-two (11) browser checks pass with no game page errors or asset failures.

Twelve dedicated WebKit 26.5 Linux checks pass at DPR 3: 390×844, 393×852, 390×664, and 390×844 with 47px top / 34px bottom safe areas. They verify backing resolution, control bounds and at least 44px heights, actual click-to-walk after resizing, exact position/gold save reload, elder proximity interaction and convoy progression, and rendering in first/second/third/fourth chapter maps. See `exploration-clarity-qa.json`.

Visual QA inspected refugee camp at normal/short/safe-area sizes, adjacent elder/player labels, Xinye, Longzhong, Changban, allied naval camp, Jingnan camp and Changsha town. Screenshots are CSS-size exports from DPR 3 rendering, not physical iPhone captures. CI also runs all previous 74 browser checks plus the 12 dedicated checks.

`exploration-refugecamp-before-390x844.png` renders the previous renderer against the same chapter-two fixture, with old CSS pixelated scaling and no caption inset. `exploration-refugecamp-390x844.png` shows the current renderer. To reproduce the optional baseline locally, write `git show ab8263f:src/v12/world-renderer.js > src/v12/world-renderer-before.mjs`, run with `CAPTURE_BEFORE=1`, then remove the temporary module. It is not shipped.

New physical iPhone clarity acceptance remains pending user observation. The original upload is evidence for the reported problem, not evidence the update has passed physical-device acceptance.
