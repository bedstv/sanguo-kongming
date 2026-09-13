import fs from 'node:fs';
import h0 from '../src/v11/heroData0.js';
import h1 from '../src/v11/heroData1.js';
import h2 from '../src/v11/heroData2.js';
import h3 from '../src/v11/heroData3.js';
import h4 from '../src/v11/heroData4.js';
import p0 from '../src/v11/portraitData0.js';
import p1 from '../src/v11/portraitData1.js';
function pngSizeFromB64(s){const b=Buffer.from(s,'base64');if(b.subarray(1,4).toString()!=='PNG')throw new Error('invalid PNG data');return [b.readUInt32BE(16),b.readUInt32BE(20)]}
function pngSize(path){const b=fs.readFileSync(path);if(b.subarray(1,4).toString()!=='PNG')throw new Error(`${path}: invalid PNG`);return [b.readUInt32BE(16),b.readUInt32BE(20)]}
function eq(a,b,msg){if(a[0]!==b[0]||a[1]!==b[1])throw new Error(`${msg}: got ${a.join('x')}, want ${b.join('x')}`)}
const enemyIds=['caoren','zhanghe','pikeman','archer','xiahoudun'];
for(const p of ['golden-v11.html','styles/v110.css','styles/v113-audio.css','src/v11/assetsV11.js','src/v11/battleRendererV11.js','src/v11/battleSystemV11.js','src/v11/goldenBattleV11.js','src/v11/audioV11.js',...enemyIds.map(id=>`assets/v11/enemies/${id}-v114.png`)])if(!fs.existsSync(p))throw new Error(`missing ${p}`);
eq(pngSizeFromB64([h0,h1,h2,h3,h4].join('')),[672,560],'hero atlas');eq(pngSizeFromB64([p0,p1].join('')),[560,112],'portrait strip');for(const id of enemyIds)eq(pngSize(`assets/v11/enemies/${id}-v114.png`),[672,112],`${id} enemy sheet`);
const a=fs.readFileSync('src/v11/assetsV11.js','utf8');for(const s of ['ENEMY_SHEETS','caoren-v114.png','zhanghe-v114.png','pikeman-v114.png','archer-v114.png','xiahoudun-v114.png','enemyFrameFor'])if(!a.includes(s))throw new Error(`assetsV11 missing ${s}`);
const r=fs.readFileSync('src/v11/battleRendererV11.js','utf8');for(const s of ['enemyFrameFor','ENEMY_W*ENEMY_COLS','data-char','pose-'])if(!r.includes(s))throw new Error(`renderer missing ${s}`);if(r.includes('enemySpriteUrl'))throw new Error('renderer still uses procedural enemySpriteUrl');
const h=fs.readFileSync('golden-v11.html','utf8');for(const s of ['V11.4 Golden Battle','v110.css?v=11.4','v113-audio.css?v=11.4','goldenBattleV11.js?v=11.4','soundGateV11'])if(!h.includes(s))throw new Error(`golden-v11 missing ${s}`);
const css=fs.readFileSync('styles/v110.css','utf8');for(const s of ['char-guanyu','char-zhangfei','pose-attack','pose-cast','identity-test .v11-info strong'])if(!css.includes(s))throw new Error(`css missing ${s}`);if(css.includes('background-size:96px 112px!important'))throw new Error('enemy sheet CSS still forces single-frame background size');
const audio=fs.readFileSync('src/v11/audioV11.js','utf8');for(const s of ['primeGesture','navigator.audioSession','IOS_PRIME','webkitAudioContext'])if(!audio.includes(s))throw new Error(`audio missing ${s}`);
console.log('V11.4 fixed enemy raster sheets + iPhone audio validation OK');
