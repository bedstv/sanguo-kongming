const ROOT='./assets/v9/battle';
const ATLAS=`${ROOT}/battle-atlas.png`;
const make=(row,{anchorX=32,anchorY=75,scale=1}={})=>({path:ATLAS,row,frameWidth:64,frameHeight:80,atlasWidth:448,atlasHeight:800,columns:7,anchorX,anchorY,scale,frames:{idle:[0,1],attack:[2,3,2],hurt:[4,4],cast:[5,5],ko:[6]}});
export const V9_ASSETS={
  heroes:{liubei:make(0),guanyu:make(1,{scale:1.04}),zhangfei:make(2,{scale:1.04}),zhaoyun:make(3,{scale:1.02}),kongming:make(4)},
  enemies:{caoren:make(5,{scale:1.04}),zhanghe:make(6),xiahoudun:make(7,{scale:1.06}),pikeman:make(8),archer:make(9),scout:make(8),officer:make(5)},
  portraits:{liubei:`${ROOT}/portraits/liubei.png`,guanyu:`${ROOT}/portraits/guanyu.png`,zhangfei:`${ROOT}/portraits/zhangfei.png`,zhaoyun:`${ROOT}/portraits/zhaoyun.png`,kongming:`${ROOT}/portraits/kongming.png`},
  effects:{path:`${ROOT}/effects/battle-effects.png`,frameWidth:64,frameHeight:64,frames:{slash:0,spear:1,fire:2,thunder:3,heal:4,confuse:5,guard:6,ko:7}}
};
export function assetFor(key,enemy=false){return (enemy?V9_ASSETS.enemies:V9_ASSETS.heroes)[key]||(enemy?V9_ASSETS.enemies.pikeman:V9_ASSETS.heroes.liubei)}
export function portraitFor(key){return V9_ASSETS.portraits[key]||V9_ASSETS.portraits.liubei}
export function frameIndex(asset,pose='idle',frame=0){const list=asset.frames[pose]||asset.frames.idle;return list[Math.abs(frame)%list.length]}
