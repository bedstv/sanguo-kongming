const TILE=128,SPR_W=96,SPR_H=120;
const TILE_COLS=6;
const tileIndex={
  grass:0,grass2:1,water:2,forest:3,deepForest:4,wall:5,
  shop:6,inn:7,house:8,pavilion:9,shrub:10,bamboo:11,
  xinye:12,longzhong:13,bowang:14,camp:15,mountain:16,bridge:17,
  roadH:18,roadV:19,roadTurn:20,roadCross:21,roadEnd:22,shore:23
};
const spriteIndex={zhaoyun:0,kongming:1,officer:2,scout:3,merchant:4,citizen:5,villager:6};

function loadImage(src){
  const img=new Image();img.decoding='async';img.src=src;return img;
}
export const tileAtlas=loadImage('./assets/world-atlas.svg?v=6.0');
export const spriteAtlas=loadImage('./assets/world-sprites.svg?v=6.0');
let readyCount=0;
const notify=()=>{readyCount++;if(readyCount>=2)document.dispatchEvent(new CustomEvent('sanguo-assets-ready'))};
tileAtlas.addEventListener('load',notify,{once:true});spriteAtlas.addEventListener('load',notify,{once:true});
export const assetsReady=()=>tileAtlas.complete&&tileAtlas.naturalWidth>0&&spriteAtlas.complete&&spriteAtlas.naturalWidth>0;

function crop(index,cols,w,h){return [(index%cols)*w,Math.floor(index/cols)*h,w,h]}
export function drawTileAsset(ctx,key,dx,dy,dw=64,dh=64,{rotate=0,alpha=1}={}){
  if(!tileAtlas.complete||!tileAtlas.naturalWidth)return false;
  const idx=tileIndex[key];if(idx==null)return false;const [sx,sy,sw,sh]=crop(idx,TILE_COLS,TILE,TILE);
  ctx.save();ctx.globalAlpha*=alpha;
  if(rotate){ctx.translate(dx+dw/2,dy+dh/2);ctx.rotate(rotate);ctx.drawImage(tileAtlas,sx,sy,sw,sh,-dw/2,-dh/2,dw,dh)}
  else ctx.drawImage(tileAtlas,sx,sy,sw,sh,dx,dy,dw,dh);
  ctx.restore();return true;
}
export function drawSpriteAsset(ctx,key,frame,dx,dy,dw=60,dh=75){
  if(!spriteAtlas.complete||!spriteAtlas.naturalWidth)return false;
  const col=spriteIndex[key]??spriteIndex.scout,row=Math.abs(frame||0)%2;
  ctx.drawImage(spriteAtlas,col*SPR_W,row*SPR_H,SPR_W,SPR_H,dx,dy,dw,dh);return true;
}
export function drawLandmarkAsset(ctx,key,cx,cy,size=112){
  const map={X:'xinye',L:'longzhong',B:'bowang'};const k=map[key]||key;
  return drawTileAsset(ctx,k,cx-size/2,cy-size/2,size,size);
}
