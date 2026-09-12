import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const fail=[];const ok=m=>console.log(`✓ ${m}`);const bad=m=>{console.error(`✗ ${m}`);fail.push(m)};
const required=['golden.html','styles/v90.css','src/v9/assetsV9.js','src/v9/battleRendererV9.js','src/v9/audioV9.js','src/v9/goldenBattle.js','assets/v9/battle/battle-atlas.png','assets/v9/battle/effects/battle-effects.png',...['liubei','guanyu','zhangfei','zhaoyun','kongming'].map(x=>`assets/v9/battle/portraits/${x}.png`)];
for(const f of required){const p=path.join(root,f);if(!fs.existsSync(p))bad(`missing ${f}`);else if(fs.statSync(p).size<100)bad(`asset too small ${f}`);else ok(f)}
const html=fs.readFileSync(path.join(root,'golden.html'),'utf8');for(const ref of ['styles/v90.css','src/v9/goldenBattle.js','allyList','enemyList','battleRound','portrait','actorStats','cmds'])if(!html.includes(ref))bad(`golden entry missing ${ref}`);
const renderer=fs.readFileSync(path.join(root,'src/v9/battleRendererV9.js'),'utf8');for(const token of ['v9-sprite-sheet','v9-troopbar','portraitFor','frameIndex','background-position'])if(!renderer.includes(token))bad(`renderer missing ${token}`);
const art=fs.readFileSync(path.join(root,'src/v9/assetsV9.js'),'utf8');if(art.includes('data:image/svg'))bad('V9 final sprite assets must not be runtime SVG');else ok('no runtime SVG battle sprites');if(!art.includes('battle-atlas.png'))bad('V9 battle atlas not wired');else ok('V9 battle atlas wired');
if(fail.length){console.error(`\nV9 validation failed: ${fail.length}`);process.exit(1)}console.log('\nV9 Golden Battle assets validated.');
