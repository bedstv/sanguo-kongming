# V12.1 first-chapter QA — 2026-10-04

Integrated first-chapter build; no intermediate feature commits. User accepted the existing battle visuals and requested the missing game flow. New campaign physical-device approval is not implied by that earlier acceptance.

## Automated gates

- Nine campaign-state tests: reachable chapter/shop routes, isolated save slot, backup/corrupt storage, old-save normalization, explicit equipment and consumables, full battle checkpoint, one-time rewards, defeat recovery, actual armor mitigation after reload.
- One actual-combat integration test, twelve seeded vanguard → boss runs: real unmodified HP/SP/damage, carried inventory/levels, attacks/fire/heal/rations. Only the animation clock is instant. Reports in `campaign-combat-qa.json`; this proves a viable strategy, not a complete difficulty or fun assessment.
- Eleven existing battle-rule and four actual Timeline tests. All legacy V8/V9/V10/V11 structural gates and V12 PNG/audio/hash checks pass.
- Eighteen campaign WebKit checks: title/opening, decoded original town music, south gate, patrol and mid-battle reload, rewards once, Longzhong dialogue persistence, return/preparation, shop/equipment, consumables/formation/overlay input, inn recovery, four mobile layouts, vanguard progression, exact Golden cast/boss music, ending persistence, defeat/retreat, title/new-game confirmation.
- Seventeen Golden Battle WebKit regression checks: animation/FX, target/command rules, identity mode, audio unlock/mute/suspend/visibility resume, four mobile layouts, KO/victory/defeat/replay.
- Both browser suites report zero page errors and zero failed asset requests. Results: `campaign-browser-qa.json`, `browser-qa.json`.

Campaign browser victories use test-only enemy HP=1 to isolate UI/progression efficiently. They do not certify combat balance; the separate actual-combat seeded test does not alter stats. QA mutable hooks exist only with the `qa` URL parameter. Default production URLs expose no campaign QA object.

## Visual inspection

Screenshots include title, new journey at Xinye, completed Longzhong objective, shop, army formation, resumed battle, five-on-five boss, and ending. Inspected real Chinese text after installing the missing local CJK font; screenshots with missing host fonts were replaced. Battle measures and draws immediately to avoid an empty first-frame canvas.

Primary viewport 390×844; also 393×852, 390×664, and simulated 47px top / 34px bottom safe areas. Map retains aspect ratio; controls remain within viewport, without horizontal scrolling. Campaign direction/action buttons are at least 44px. Shop/camp lists scroll within their dialogs.

## Device evidence and limits

Automated engine: Playwright WebKit 26.5 on Linux. This is not physical iPhone Safari. Existing Golden Battle has user-provided iPhone evidence and normal sound/app-switch recovery confirmation (see `QA_REPORT.md`); new journey audio uses the same unchanged unlock/resume path. New campaign app-switch behavior and touch feel still merit a physical-device pass, but are not represented as already tested. No lock-screen test or numeric blind-recognition score is claimed.

This release completes the first chapter only. Later chapters are outside this batch. Existing browser-local progress remains tied to the same origin/browser and is not a cloud account save.
