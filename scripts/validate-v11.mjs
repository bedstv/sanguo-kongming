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
for(const p of ['golden-v11.html','styles/v110.css','src/v11/assetsV11.js','src/v11/battleRendererV11.js','src/v11/battleSystemV11.js','src/v11/goldenBattleV11.js','src/v11/enemyArtV11.js','src/v11/audioV11.js'])if(!fs.existsSync(p))throw new Error(`missing ${p}`);
eq(pngSizeFromB64([h0,h1,h2,h3,h4].join('')),[672,560],'hero atlas');eq(pngSizeFromB64([p0,p1].join('')),[560,112],'portrait strip');
const a=fs.readFileSync('src/v11/assetsV11.js','utf8');for(const s of ['HERO_W=96','HERO_H=112','HERO_COLS=7','HERO_ROWS=5','liubei:0','guanyu:1','zhangfei:2','zhaoyun:3','kongming:4'])if(!a.includes(s))throw new Error(`assetsV11 missing ${s}`);
const r=fs.readFileSync('src/v11/battleRendererV11.js','utf8');for(const s of ['V11_HERO_ATLAS','heroFrameFor','V11_PORTRAITS','enemySpriteUrl'])if(!r.includes(s))throw new Error(`renderer missing ${s}`);
const e=fs.readFileSync('src/v11/enemyArtV11.js','utf8');for(const s of ['caoren','zhanghe','pikeman','archer','xiahoudun','swordshield','halberd','spear','bow','saber','enemySpriteUrl'])if(!e.includes(s))throw new Error(`enemyArtV11 missing ${s}`);
const m=fs.readFileSync('src/v11/audioV11.js','utf8');for(const s of ['battle:{','boss:{','victory:{','visibilitychange','pageshow','touchstart','AudioV11'])if(!m.includes(s))throw new Error(`audioV11 missing ${s}`);
const h=fs.readFileSync('golden-v11.html','utf8');for(const s of ['v110.css?v=11.1','goldenBattleV11.js?v=11.1','identityV11','soundV11'])if(!h.includes(s))throw new Error(`golden-v11 missing ${s}`);
const c=fs.readFileSync('styles/v110.css','utf8');for(const s of ['.identity-test .v11-info strong','.enemy-window{width:96px;height:112px}','grid-template-columns:27% 73%'])if(!c.includes(s))throw new Error(`v110.css missing ${s}`);
console.log('V11 Phase 2 validation OK');
