import fs from 'node:fs';
import h0 from '../src/v11/heroData0.js';
import h1 from '../src/v11/heroData1.js';
import h2 from '../src/v11/heroData2.js';
import h3 from '../src/v11/heroData3.js';
import h4 from '../src/v11/heroData4.js';
import p0 from '../src/v11/portraitData0.js';
import p1 from '../src/v11/portraitData1.js';
function pngSizeFromB64(s){const b=Buffer.from(s,'base64');if(b.subarray(1,4).toString()!=='PNG')throw new Error('invalid PNG data');return [b.readUInt32BE(16),b.readUInt32BE(20)]}
function eq(a,b,msg){if(a[0]!==b[0]||a[1]!==b[1])throw new Error(`${msg}: got ${a.join('x')}, want ${b.join('x')}`)}
for(const p of ['golden-v11.html','styles/v110.css','styles/v113-audio.css','src/v11/assetsV11.js','src/v11/battleRendererV11.js','src/v11/battleSystemV11.js','src/v11/goldenBattleV11.js','src/v11/enemyArtV11.js','src/v11/audioV11.js'])if(!fs.existsSync(p))throw new Error(`missing ${p}`);
eq(pngSizeFromB64([h0,h1,h2,h3,h4].join('')),[672,560],'hero atlas');eq(pngSizeFromB64([p0,p1].join('')),[560,112],'portrait strip');
const r=fs.readFileSync('src/v11/battleRendererV11.js','utf8');for(const s of ['V11_HERO_ATLAS','heroFrameFor','enemySpriteUrl','data-char','pose-'])if(!r.includes(s))throw new Error(`renderer missing ${s}`);
const h=fs.readFileSync('golden-v11.html','utf8');for(const s of ['V11.3 Golden Battle','v110.css?v=11.3','v113-audio.css?v=11.3','goldenBattleV11.js?v=11.3','identityV11','soundGateV11'])if(!h.includes(s))throw new Error(`golden-v11 missing ${s}`);
const css=fs.readFileSync('styles/v110.css','utf8');for(const s of ['char-guanyu','char-zhangfei','pose-attack','pose-cast','identity-test .v11-info strong'])if(!css.includes(s))throw new Error(`css missing ${s}`);
const gate=fs.readFileSync('styles/v113-audio.css','utf8');for(const s of ['.sound-gate','.sound-gate.hidden','touch-action:manipulation'])if(!gate.includes(s))throw new Error(`audio gate css missing ${s}`);
const audio=fs.readFileSync('src/v11/audioV11.js','utf8');for(const s of ['battle:','boss:','victory:','visibilitychange','pageshow','primeGesture','navigator.audioSession','IOS_PRIME','webkitAudioContext'])if(!audio.includes(s))throw new Error(`audio missing ${s}`);
const boot=fs.readFileSync('src/v11/goldenBattleV11.js','utf8');for(const s of ['isIOS','enableSound','audio.primeGesture()','soundGateV11','audio.status()'])if(!boot.includes(s))throw new Error(`golden boot missing ${s}`);
console.log('V11.3 Phase 3 + iPhone audio validation OK');
