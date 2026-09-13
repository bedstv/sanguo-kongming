import fs from 'node:fs';
import liubei from '../src/v11/heroSheets/liubeiV115.js';
import guanyu from '../src/v11/heroSheets/guanyuV115.js';
import zhangfei from '../src/v11/heroSheets/zhangfeiV115.js';
import zhaoyun from '../src/v11/heroSheets/zhaoyunV115.js';
import kongming from '../src/v11/heroSheets/kongmingV115.js';
import liubeiPortrait from '../src/v11/heroPortraits/liubeiV115.js';
import guanyuPortrait from '../src/v11/heroPortraits/guanyuV115.js';
import zhangfeiPortrait from '../src/v11/heroPortraits/zhangfeiV115.js';
import zhaoyunPortrait from '../src/v11/heroPortraits/zhaoyunV115.js';
import kongmingPortrait from '../src/v11/heroPortraits/kongmingV115.js';
function pngSizeFromDataUrl(s){const b=Buffer.from(s.replace(/^data:image\/png;base64,/,''),'base64');if(b.subarray(1,4).toString()!=='PNG')throw new Error('invalid PNG data');return [b.readUInt32BE(16),b.readUInt32BE(20)]}
function pngSize(path){const b=fs.readFileSync(path);if(b.subarray(1,4).toString()!=='PNG')throw new Error(`${path}: invalid PNG`);return [b.readUInt32BE(16),b.readUInt32BE(20)]}
function eq(a,b,msg){if(a[0]!==b[0]||a[1]!==b[1])throw new Error(`${msg}: got ${a.join('x')}, want ${b.join('x')}`)}
const enemyIds=['caoren','zhanghe','pikeman','archer','xiahoudun'];
const required=['golden-v11.html','styles/v110.css','styles/v113-audio.css','src/v11/assetsV11.js','src/v11/heroArtV115.js','src/v11/battleRendererV11.js','src/v11/battleSystemV11.js','src/v11/goldenBattleV11.js','src/v11/audioV11.js',...enemyIds.map(id=>`assets/v11/enemies/${id}-v114.png`)];
for(const p of required)if(!fs.existsSync(p))throw new Error(`missing ${p}`);
for(const [id,data] of Object.entries({liubei,guanyu,zhangfei,zhaoyun,kongming}))eq(pngSizeFromDataUrl(data),[672,112],`${id} hero sheet`);
for(const [id,data] of Object.entries({liubeiPortrait,guanyuPortrait,zhangfeiPortrait,zhaoyunPortrait,kongmingPortrait}))eq(pngSizeFromDataUrl(data),[112,112],`${id} portrait`);
for(const id of enemyIds)eq(pngSize(`assets/v11/enemies/${id}-v114.png`),[672,112],`${id} enemy sheet`);
const hero=fs.readFileSync('src/v11/heroArtV115.js','utf8');for(const s of ['heroSpriteMeta','portraitUrl','HERO_IDS','liubeiV115','guanyuV115','zhangfeiV115','zhaoyunV115','kongmingV115'])if(!hero.includes(s))throw new Error(`heroArtV115 missing ${s}`);
const a=fs.readFileSync('src/v11/assetsV11.js','utf8');for(const s of ['ENEMY_SHEETS','caoren-v114.png','zhanghe-v114.png','pikeman-v114.png','archer-v114.png','xiahoudun-v114.png','enemyFrameFor'])if(!a.includes(s))throw new Error(`assetsV11 missing ${s}`);
const r=fs.readFileSync('src/v11/battleRendererV11.js','utf8');for(const s of ['heroSpriteMeta','portraitUrl','enemyFrameFor','data-char','pose-'])if(!r.includes(s))throw new Error(`renderer missing ${s}`);for(const legacy of ['V11_HERO_ATLAS','V11_PORTRAITS','heroFrameFor'])if(r.includes(legacy))throw new Error(`renderer still uses legacy hero atlas: ${legacy}`);
const h=fs.readFileSync('golden-v11.html','utf8');for(const s of ['V11.6 Golden Battle','v110.css?v=11.6','v113-audio.css?v=11.6','goldenBattleV11.js?v=11.6','soundGateV11'])if(!h.includes(s))throw new Error(`golden-v11 missing ${s}`);
const css=fs.readFileSync('styles/v110.css','utf8');for(const s of ['grid-template-rows:32px minmax(0,1fr) 27%','background:#000','.char-liubei .v11-sprite-window','scale:.90','.v11-portrait{width:88px'])if(!css.includes(s))throw new Error(`css missing ${s}`);
const audio=fs.readFileSync('src/v11/audioV11.js','utf8');for(const s of ['primeGesture','navigator.audioSession','IOS_PRIME','webkitAudioContext'])if(!audio.includes(s))throw new Error(`audio missing ${s}`);
console.log('V11.6 iPhone composition + Hero Identity Pass + audio validation OK');
