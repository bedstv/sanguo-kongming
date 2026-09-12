import {V10_ATLAS,FRAME_W as E_W,FRAME_H as E_H,COLS as E_COLS,ROWS as E_ROWS,frameFor as enemyFrameFor} from '../v10/assetsV10.js';

export const V11_HERO_ATLAS='./assets/v11/heroes-v11.png?v=11.0';
export const V11_PORTRAITS='./assets/v11/portraits-v11.png?v=11.0';
export const HERO_W=96,HERO_H=112,HERO_COLS=7,HERO_ROWS=5;
export const ENEMY_ATLAS=V10_ATLAS,ENEMY_W=E_W,ENEMY_H=E_H,ENEMY_COLS=E_COLS,ENEMY_ROWS=E_ROWS;
export const HERO_ROWS_MAP={liubei:0,guanyu:1,zhangfei:2,zhaoyun:3,kongming:4};
export const PORTRAIT_MAP={liubei:0,guanyu:1,zhangfei:2,zhaoyun:3,kongming:4};
export const FRAME_MAP={idle:[0,1],attack:[2,3,2],hurt:[4,4],cast:[5,5],ko:[6]};
export function heroFrameFor(id,pose='idle',frame=0){
  const row=HERO_ROWS_MAP[id]??0,seq=FRAME_MAP[pose]||FRAME_MAP.idle;
  return {row,col:seq[Math.abs(frame)%seq.length]??0};
}
export {enemyFrameFor};
