import a from './atlasA.js';
import b from './atlasB.js';
import c from './atlasC.js';
import d from './atlasD.js';
import portraitData from './portraitData.js';
export const V10_ATLAS='data:image/png;base64,'+[a,b,c,d].join('');
export const V10_PORTRAITS='data:image/png;base64,'+portraitData;
export const FRAME_W=80, FRAME_H=96, COLS=7, ROWS=10;
export const FRAME_MAP={idle:[0,1],attack:[2,3,2],hurt:[4,4],cast:[5,5],ko:[6]};
export const ROW_MAP={liubei:0,guanyu:1,zhangfei:2,zhaoyun:3,kongming:4,caoren:5,zhanghe:6,pikeman:7,archer:8,xiahoudun:9,scout:7,officer:5};
export const PORTRAIT_MAP={liubei:0,guanyu:1,zhangfei:2,zhaoyun:3,kongming:4};
export function frameFor(id,pose='idle',frame=0){const row=ROW_MAP[id]??7,seq=FRAME_MAP[pose]||FRAME_MAP.idle,col=seq[Math.abs(frame)%seq.length]??0;return {row,col}}
