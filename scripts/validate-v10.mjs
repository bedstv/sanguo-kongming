import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');let bad=0;
const ok=m=>console.log('✓ '+m),fail=m=>{console.error('✗ '+m);bad++};
const req=['GOAL_V10.md','golden-v10.html','styles/v100.css','src/v10/assetsV10.js','src/v10/atlasA.js','src/v10/atlasB.js','src/v10/atlasC.js','src/v10/atlasD.js','src/v10/portraitData.js','src/v10/battleRendererV10.js','src/v10/battleSystemV10.js','src/v10/audioV10.js','src/v10/goldenBattleV10.js'];
for(const f of req)fs.existsSync(path.join(root,f))?ok(f):fail('missing '+f);
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const html=read('golden-v10.html');if(!html.includes('styles/v100.css')||!html.includes('goldenBattleV10.js'))fail('entry not wired');else ok('V10 entry wired');
const renderer=read('src/v10/battleRendererV10.js');if(!renderer.includes('FRAME_W')||!renderer.includes('v10-troopbar')||!renderer.includes('backgroundPosition'))fail('renderer incomplete');else ok('V10 fixed-cell renderer');
const system=read('src/v10/battleSystemV10.js');if(!system.includes('BattleRendererV10'))fail('V10 battle system not wired');else ok('V10 battle system wired');
const audio=read('src/v10/audioV10.js');if(!audio.includes('touchstart')||!audio.includes('visibilitychange')||!audio.includes('triangle')||!audio.includes('noise'))fail('V10 audio incomplete');else ok('V10 iPhone chiptune hooks');
function exportedString(f){const t=read(f),m=t.match(/export default '([^']*)';/s);if(!m){fail('cannot parse '+f);return ''}return m[1]}
const atlas64=['A','B','C','D'].map(x=>exportedString(`src/v10/atlas${x}.js`)).join('');
const portrait64=exportedString('src/v10/portraitData.js');
function checkPng(label,b64,w,h){try{const b=Buffer.from(b64,'base64');const sig='89504e470d0a1a0a';if(b.subarray(0,8).toString('hex')!==sig){fail(label+' invalid PNG signature');return}const rw=b.readUInt32BE(16),rh=b.readUInt32BE(20);if(rw!==w||rh!==h)fail(`${label} dimensions ${rw}x${rh}, expected ${w}x${h}`);else ok(`${label} PNG ${rw}x${rh}`)}catch(e){fail(label+' decode failed: '+e.message)}}
checkPng('battle atlas',atlas64,560,960);checkPng('portrait strip',portrait64,480,96);
const assets=read('src/v10/assetsV10.js');if(!assets.includes("[a,b,c,d].join('')")||!assets.includes('ROWS=10')||!assets.includes('COLS=7'))fail('asset mapping incomplete');else ok('10x7 raster atlas mapping');
const css=read('styles/v100.css');if(!css.includes('grid-template-rows:repeat(5,1fr)')||!css.includes('grid-template-rows:auto minmax(0,1fr) 31%'))fail('V10 iPhone layout gate missing');else ok('V10 5v5 iPhone layout');
if(bad){console.error(`V10 validation failed: ${bad} problem(s).`);process.exit(1)}
console.log('V10 validation passed.');
