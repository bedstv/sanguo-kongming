import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const fail=[];const ok=m=>console.log(`✓ ${m}`);const bad=m=>{console.error(`✗ ${m}`);fail.push(m)};
const required=['golden.html','styles/v90.css','src/v9/assetsV9.js','src/v9/battleRendererV9.js','src/v9/audioV9.js','src/v9/goldenBattle.js','GOAL_V9.md','docs/V9_MILESTONE1_GOLDEN_BATTLE.md'];
for(const f of required){const p=path.join(root,f);if(!fs.existsSync(p))bad(`missing ${f}`);else if(fs.statSync(p).size<100)bad(`file too small ${f}`);else ok(f)}
const html=fs.readFileSync(path.join(root,'golden.html'),'utf8');for(const ref of ['styles/v90.css','src/v9/goldenBattle.js','allyList','enemyList','battleRound','portrait','actorStats','cmds'])if(!html.includes(ref))bad(`golden entry missing ${ref}`);
const renderer=fs.readFileSync(path.join(root,'src/v9/battleRendererV9.js'),'utf8');for(const token of ['v9-sprite-sheet','v9-troopbar','portraitFor','frameIndex','background-position'])if(!renderer.includes(token))bad(`renderer missing ${token}`);else ok(`renderer ${token}`);
const art=fs.readFileSync(path.join(root,'src/v9/assetsV9.js'),'utf8');
if(art.includes('data:image/svg'))bad('V9 final battle sprites must not be runtime SVG');else ok('no runtime SVG battle sprites');
if(!art.includes("data:image/png;base64,"))bad('embedded raster PNG atlas missing');else ok('embedded raster PNG assets');
for(const key of ['liubei','guanyu','zhangfei','zhaoyun','kongming','caoren','zhanghe','xiahoudun','pikeman','archer'])if(!art.includes(key))bad(`asset manifest missing ${key}`);else ok(`asset ${key}`);
const audio=fs.readFileSync(path.join(root,'src/v9/audioV9.js'),'utf8');for(const token of ['touchstart','visibilitychange','pageshow','battle','boss'])if(!audio.includes(token))bad(`audio missing ${token}`);else ok(`audio ${token}`);
const css=fs.readFileSync(path.join(root,'styles/v90.css'),'utf8');for(const token of ['height:70%','v9-troopbar','grid-template-rows:repeat(5','image-rendering:pixelated'])if(!css.includes(token))bad(`V9 CSS missing ${token}`);else ok(`CSS ${token}`);
if(fail.length){console.error(`\nV9 validation failed: ${fail.length}`);process.exit(1)}console.log('\nV9 Golden Battle validated.');
