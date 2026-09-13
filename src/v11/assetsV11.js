import h0 from './heroData0.js';
import h1 from './heroData1.js';
import h2 from './heroData2.js';
import h3 from './heroData3.js';
import h4 from './heroData4.js';
import p0 from './portraitData0.js';
import p1 from './portraitData1.js';

export const V11_HERO_ATLAS='data:image/png;base64,'+[h0,h1,h2,h3,h4].join('');
export const V11_PORTRAITS='data:image/png;base64,'+[p0,p1].join('');
export const HERO_W=96,HERO_H=112,HERO_COLS=7,HERO_ROWS=5;
export const ENEMY_W=96,ENEMY_H=112,ENEMY_COLS=7;
export const HERO_ROWS_MAP={liubei:0,guanyu:1,zhangfei:2,zhaoyun:3,kongming:4};
export const PORTRAIT_MAP={liubei:0,guanyu:1,zhangfei:2,zhaoyun:3,kongming:4};
export const ENEMY_SHEETS={
  caoren:'assets/v11/enemies/caoren-v114.png',
  zhanghe:'assets/v11/enemies/zhanghe-v114.png',
  pikeman:'assets/v11/enemies/pikeman-v114.png',
  archer:'assets/v11/enemies/archer-v114.png',
  xiahoudun:'assets/v11/enemies/xiahoudun-v114.png'
};
export const FRAME_MAP={idle:[0,1],attack:[2,3,2],hurt:[4,4],cast:[5,5],ko:[6]};
function colFor(pose='idle',frame=0){const seq=FRAME_MAP[pose]||FRAME_MAP.idle;return seq[Math.abs(frame)%seq.length]??0}
export function heroFrameFor(id,pose='idle',frame=0){return {row:HERO_ROWS_MAP[id]??0,col:colFor(pose,frame)}}
export function enemyFrameFor(id,pose='idle',frame=0){return {url:ENEMY_SHEETS[id]||ENEMY_SHEETS.pikeman,col:colFor(pose,frame)}}
