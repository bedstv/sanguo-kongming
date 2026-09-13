import liubei from './heroSheets/liubeiV115.js';
import guanyu from './heroSheets/guanyuV115.js';
import zhangfei from './heroSheets/zhangfeiV115.js';
import zhaoyun from './heroSheets/zhaoyunV115.js';
import kongming from './heroSheets/kongmingV115.js';
import liubeiPortrait from './heroPortraits/liubeiV115.js';
import guanyuPortrait from './heroPortraits/guanyuV115.js';
import zhangfeiPortrait from './heroPortraits/zhangfeiV115.js';
import zhaoyunPortrait from './heroPortraits/zhaoyunV115.js';
import kongmingPortrait from './heroPortraits/kongmingV115.js';

export const HERO_W=96,HERO_H=112,HERO_COLS=7;
export const HERO_IDS=['liubei','guanyu','zhangfei','zhaoyun','kongming'];
const SHEETS={liubei,guanyu,zhangfei,zhaoyun,kongming};
const PORTRAITS={liubei:liubeiPortrait,guanyu:guanyuPortrait,zhangfei:zhangfeiPortrait,zhaoyun:zhaoyunPortrait,kongming:kongmingPortrait};
const FRAME_SEQ={idle:[0,1],attack:[2,3,2],hurt:[4,4],cast:[5,5],ko:[6]};

export function heroSpriteMeta(id,pose='idle',frame=0){
  const safe=HERO_IDS.includes(id)?id:'liubei';
  const seq=FRAME_SEQ[pose]||FRAME_SEQ.idle;
  return {url:SHEETS[safe],col:seq[Math.abs(frame)%seq.length]??0,w:HERO_W,h:HERO_H,cols:HERO_COLS};
}

export function portraitUrl(id){return PORTRAITS[HERO_IDS.includes(id)?id:'liubei'];}
