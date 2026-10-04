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

## V12.3 原創第三章資產

- Runtime：`sprites/xuhuang.png`、`portraits/xuhuang.png`、`portraits/zhouyu.png`、`world/zhouyu.png`、`backgrounds/redcliff.png`、`world/naval.png`、`world/deck.png`。來源為同名 source sheets／portraits／naval-tiles／redcliff-background；deck 從背景木板區域 (448,1024,576,1152) 取樣。
- 母帶 `source/naval-score.wav`，runtime `audio/naval.mp3`，編曲／混音紀錄 `audio/chapter-three-score.json` 與 `chapter-three-mix-report.json`。
- built-in imagegen 的完整提示與來源路徑：`docs/v12/chapter3-generation-manifest.json`；每張 source/runtime hash：`chapter-three-manifest.json`。`scripts/pack-v123.py` 使用 Pillow、NumPy、SciPy 包裝 alpha-connected authored 人物，不改寫原始美術。
- 夜艦戰場取景 auto 110%／center bottom，維持比例與腳下甲板；iOS 音訊解鎖實作未修改。

## V12.4 原創第四章資產

- Runtime：`sprites/huangzhong.png`（八個 128×144 RGBA poses，anchor 64,140）、`portraits/huangzhong.png`（獨立 128×128）、`backgrounds/changsha.png`（520×780）、`world/jingnan.png`（四個 128px cells）、`world/courtyard.png`（原創背景石地區域 448,1024,576,1152）。探索黃忠使用同一正式 sheet 的 idle 幀；城軍槍兵／弓兵共用既有 production 素材，每名敵人有獨立 instance id。
- 來源：`source/huangzhong-sheet.png`、`huangzhong-portrait.png`、`changsha-background.png`、`jingnan-tiles.png`。built-in imagegen 完整提示與保存路徑：`docs/v12/chapter4-generation-manifest.json`。`scripts/pack-v124.py` 包裝原始 alpha 並記錄 `chapter-four-manifest.json` 的 source/runtime SHA-256；不改寫原圖美術。
- 原創《長沙弓影》：152 BPM、28.421 秒，`scripts/compose-v124.py`、`audio/chapter-four-score.json`、`chapter-four-mix-report.json`、`source/jingnan-score.wav`、`audio/jingnan.mp3`。既有曲目與 Safari unlock/resume 保留。
- 城門戰場 auto 110%／center bottom，保留城門與角色落腳地面。第四章營地使用原創石地、軍議堂與秋樹，不重疊舊營帳。

短視窗（≤740px）使用同一原畫的方形城門取景 `backgrounds/changsha-wide.png`，source crop (0,100,1024,1124)，以 cover 保持比例並填滿戰場。正式像素文字仍由程式呈現。
