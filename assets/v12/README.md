# V12 production assets

Runtime sprites: 128×144 cells × eight poses, one sheet per character. Ground anchor: (64,140). Nearest-neighbor rendering only. Portraits are independently composed 128×128 images, not sprite crops.

`source/` retains the original high-resolution RGBA artwork. The art was made with the built-in image generation tool from the prompts in `docs/v12/generation-manifest.json`; no third-party game sprites or portraits were imported. Each character received its own generation and design. The artwork is AI-assisted original project art; no claim of trademark or copyright clearance is implied.

`manifest.json` records per-frame bounds and source/runtime SHA-256 values. `scripts/pack-v12.py` extracts connected opaque figures, preserves their source alpha, packs grounded production cells and emits a contact sheet. This is an asset packing pipeline, not a procedural character renderer.

`fx/battle-fx.png`: 4 columns × 7 rows of 128×128. Rows: slash, thrust, impact, fire, lightning, heal, KO. Both physical damage and spell effects use this production atlas.

`audio/`: original authored MIDI-note arrangements synthesized offline by `scripts/compose-v12.py`. Pulse lead and counterline, triangle bass, arpeggio, deterministic noise kit. No imported music or sound samples. Stereo PCM WAV, 22050 Hz. `score.json` is the composition source and `mix-report.json` records duration, peak and RMS. Runtime music gain reserves headroom for SFX and all audio shares the existing iPhone-unlocked master output.

Rebuild art packing: `python -m pip install Pillow numpy scipy`, then `python scripts/pack-v12.py`.
Rebuild music: `python scripts/compose-v12.py`.
Validate: `python scripts/validate-v12.py`.

## V12.1 exploration

`world/terrain.png`: sixteen 128px production terrain/building cells; three NPC strips: two 64×80 poses each. Original generated terrain and transparent NPC source images are retained in `source/`, with prompts in `docs/v12/world-generation-manifest.json`. `scripts/pack-v12-world.py` packages them and records runtime hashes. The exploration renderer uses these images and V12 hero sheets, without a geometric character fallback.

Original authored compositions `world` / `town` are synthesized by `scripts/compose-v12-world.py`, with score and measurements in `audio/campaign-score.json` and `campaign-mix-report.json`. PCM mother tracks are in `source/`; runtime MP3s are encoded with ffmpeg/libmp3lame for Safari-compatible decoding. The existing gesture/session/resume path is preserved. Rebuild requires numpy and ffmpeg, then `python scripts/compose-v12-world.py`.

## V12.2 chapter two

New production files: `sprites/caochun.png` (eight 128×144 poses), `portraits/caochun.png` (independent 128×128 composition), `backgrounds/changban.png` (520×780), `world/river.png` (four 128px cells), and `audio/bridge.mp3`. Generated sources are `source/caochun-sheet.png`, `caochun-portrait.png`, `changban-background.png`, `river-tiles.png`. Built-in imagegen prompts and source paths are recorded in `docs/v12/chapter2-generation-manifest.json`; packing and hashes in `scripts/pack-v122.py` and `chapter-two-manifest.json`. The bridge renderer reframes the authored background with a bottom-aligned camera so all five rows stand on the deck.

Original score 《當陽斷後》: `scripts/compose-v122.py`, `audio/chapter-two-score.json`, `audio/chapter-two-mix-report.json`, `source/bridge-score.wav`. Uses the same offline synthesis and Safari-compatible MP3 pipeline. Existing music files are untouched.
