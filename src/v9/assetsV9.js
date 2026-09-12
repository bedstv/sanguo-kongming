const ROOT='./assets/v9/battle';
const make=(path,{anchorX=32,anchorY=75,scale=1}={})=>({path:`${ROOT}/${path}`,frameWidth:64,frameHeight:80,columns:7,anchorX,anchorY,scale,frames:{idle:[0,1],attack:[2,3,2],hurt:[4,4],cast:[5,5],ko:[6]}});
export const V9_ASSETS={
  heroes:{
    liubei:make('heroes/liubei.png'),
    guanyu:make('heroes/guanyu.png',{scale:1.04}),
    zhangfei:make('heroes/zhangfei.png',{scale:1.04}),
    zhaoyun:make('heroes/zhaoyun.png',{scale:1.02}),
    kongming:make('heroes/kongming.png')
  },
  enemies:{
    caoren:make('enemies/caoren.png',{scale:1.04}),
    zhanghe:make('enemies/zhanghe.png'),
    xiahoudun:make('enemies/xiahoudun.png',{scale:1.06}),
    pikeman:make('enemies/pikeman.png'),
    archer:make('enemies/archer.png'),
    scout:make('enemies/pikeman.png'),
    officer:make('enemies/caoren.png')
  },
  portraits:{
    liubei:`${ROOT}/portraits/liubei.png`,guanyu:`${ROOT}/portraits/guanyu.png`,zhangfei:`${ROOT}/portraits/zhangfei.png`,zhaoyun:`${ROOT}/portraits/zhaoyun.png`,kongming:`${ROOT}/portraits/kongming.png`
  },
  effects:{path:`${ROOT}/effects/battle-effects.png`,frameWidth:64,frameHeight:64,frames:{slash:0,spear:1,fire:2,thunder:3,heal:4,confuse:5,guard:6,ko:7}}
};
export function assetFor(key,enemy=false){return (enemy?V9_ASSETS.enemies:V9_ASSETS.heroes)[key]||(enemy?V9_ASSETS.enemies.pikeman:V9_ASSETS.heroes.liubei)}
export function portraitFor(key){return V9_ASSETS.portraits[key]||V9_ASSETS.portraits.liubei}
export function frameIndex(asset,pose='idle',frame=0){const list=asset.frames[pose]||asset.frames.idle;return list[Math.abs(frame)%list.length]}
