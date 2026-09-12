import {MAPS} from './data.js';
import {drawTileAsset,drawSpriteAsset,drawLandmarkAsset,assetsReady} from './assetAtlas.js';

const TILE=64,COLS=12,ROWS=9;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const hash=(x,y,s=0)=>{let n=(x*374761393+y*668265263+s*69069)>>>0;n=(n^(n>>13))*1274126177>>>0;return (n^(n>>16))>>>0};

export class WorldSystem{
  constructor(canvas,state,onTile,onMessage){
    this.canvas=canvas;this.ctx=canvas.getContext('2d');this.state=state;this.onTile=onTile;this.onMessage=onMessage;this.frame=0;
    this._assetReady=()=>this.render();document.addEventListener('sanguo-assets-ready',this._assetReady,{once:true});
  }
  map(){return MAPS[this.state.map]}
  passable(ch){return !['#','W','T','F'].includes(ch)}
  tileAt(x,y){return this.map().rows[y]?.[x]||'#'}
  move(dx,dy){const nx=this.state.x+dx,ny=this.state.y+dy;if(!this.passable(this.tileAt(nx,ny))){this.onMessage('前方無法通行。請沿道路、草地或城門前進。');return false}this.state.x=nx;this.state.y=ny;this.frame++;this.render();this.onTile?.(this.tileAt(nx,ny));return true}
  npcAt(x,y){return this.map().npcs?.find(n=>n.x===x&&n.y===y)}
  nearbyNpc(){for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0],[0,0]]){const n=this.npcAt(this.state.x+dx,this.state.y+dy);if(n)return n}return null}
  objectiveChar(){const s=this.state.story?.stage??0;if(s===0)return'L';if(s===1)return'X';if(s===2||s===3)return'B';return null}
  npcKey(n){if(n.id==='kongmingNpc')return'kongming';if(n.id==='officer')return'officer';if(n.id==='merchant')return'merchant';if(n.id==='citizen')return'citizen';if(n.id==='villager')return'villager';return'scout'}
  is(ch,m,x,y){return (m.rows[y]?.[x]||'#')===ch}
  isPath(m,x,y){const q=m.rows[y]?.[x];return q==='R'||['X','L','B'].includes(q)}

  render(){
    const c=this.ctx,cv=this.canvas,m=this.map();c.imageSmoothingEnabled=true;c.clearRect(0,0,cv.width,cv.height);
    const camX=clamp(this.state.x-Math.floor(COLS/2),0,Math.max(0,m.width-COLS)),camY=clamp(this.state.y-Math.floor(ROWS/2),0,Math.max(0,m.height-ROWS));
    const sx=cv.width/(COLS*TILE),sy=cv.height/(ROWS*TILE);c.save();c.scale(sx,sy);
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const mx=camX+x,my=camY+y,ch=m.rows[my]?.[mx]||'#';this.drawTile(c,m,ch,x*TILE,y*TILE,mx,my)}
    this.drawAmbient(c,m,camX,camY);
    if(m.kind==='world')for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const mx=camX+x,my=camY+y,ch=m.rows[my]?.[mx];if(['X','L','B'].includes(ch))this.drawLandmark(c,ch,x*TILE+TILE/2,y*TILE+TILE/2,ch===this.objectiveChar())}
    for(const n of (m.npcs||[]))if(n.x>=camX&&n.x<camX+COLS&&n.y>=camY&&n.y<camY+ROWS){const px=(n.x-camX)*TILE+TILE/2,py=(n.y-camY)*TILE+TILE/2;if(!drawSpriteAsset(c,this.npcKey(n),this.frame,px-29,py-45,58,73))this.fallbackSprite(c,px,py,'#d8b26a');this.drawTalkMarker(c,px,py-47)}
    const px=(this.state.x-camX)*TILE+TILE/2,py=(this.state.y-camY)*TILE+TILE/2;if(!drawSpriteAsset(c,'zhaoyun',this.frame,px-31,py-49,62,78))this.fallbackSprite(c,px,py,'#6fa8ff');
    this.drawVignette(c);c.restore();
  }

  drawTile(c,m,ch,X,Y,x,y){
    if(ch==='W'){if(!drawTileAsset(c,'water',X,Y,TILE,TILE)){c.fillStyle='#2c85b3';c.fillRect(X,Y,TILE,TILE)}this.shore(c,m,X,Y,x,y);return}
    if(ch==='#'){if(!drawTileAsset(c,'wall',X,Y,TILE,TILE)){c.fillStyle='#59616b';c.fillRect(X,Y,TILE,TILE)}return}
    const grass=(hash(x,y)&1)?'grass':'grass2';if(!drawTileAsset(c,grass,X,Y,TILE,TILE)){c.fillStyle='#729b54';c.fillRect(X,Y,TILE,TILE)}
    if(ch==='R'||['X','L','B'].includes(ch)){this.road(c,m,X,Y,x,y);return}
    if(ch==='T'||ch==='F'){drawTileAsset(c,ch==='T'?'deepForest':'forest',X,Y,TILE,TILE);return}
    if(ch==='S'||ch==='I'||ch==='H'){drawTileAsset(c,ch==='S'?'shop':ch==='I'?'inn':'house',X,Y,TILE,TILE);return}
    if(ch==='P'){drawTileAsset(c,'pavilion',X,Y,TILE,TILE);return}
    if(ch==='N'){drawTileAsset(c,'shrub',X,Y,TILE,TILE);return}
  }

  shore(c,m,X,Y,x,y){
    if(!this.is('W',m,x,y-1))drawTileAsset(c,'shore',X,Y,TILE,TILE,{rotate:0});
    if(!this.is('W',m,x+1,y))drawTileAsset(c,'shore',X,Y,TILE,TILE,{rotate:Math.PI/2});
    if(!this.is('W',m,x,y+1))drawTileAsset(c,'shore',X,Y,TILE,TILE,{rotate:Math.PI});
    if(!this.is('W',m,x-1,y))drawTileAsset(c,'shore',X,Y,TILE,TILE,{rotate:-Math.PI/2});
  }

  road(c,m,X,Y,x,y){
    const L=this.isPath(m,x-1,y),R=this.isPath(m,x+1,y),U=this.isPath(m,x,y-1),D=this.isPath(m,x,y+1),n=[L,R,U,D].filter(Boolean).length;
    if(n>=3){drawTileAsset(c,'roadCross',X,Y,TILE,TILE);return}
    if(L&&R){drawTileAsset(c,'roadH',X,Y,TILE,TILE);return}
    if(U&&D){drawTileAsset(c,'roadV',X,Y,TILE,TILE);return}
    if(n===2){let rot=0;if(U&&R)rot=0;else if(R&&D)rot=Math.PI/2;else if(D&&L)rot=Math.PI;else if(L&&U)rot=-Math.PI/2;drawTileAsset(c,'roadTurn',X,Y,TILE,TILE,{rotate:rot});return}
    if(n===1){let rot=U?0:R?Math.PI/2:D?Math.PI:-Math.PI/2;drawTileAsset(c,'roadEnd',X,Y,TILE,TILE,{rotate:rot});return}
    drawTileAsset(c,'roadCross',X,Y,TILE,TILE,{alpha:.9});
  }

  drawAmbient(c,m,camX,camY){
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
      const mx=camX+x,my=camY+y,ch=m.rows[my]?.[mx],X=x*TILE,Y=y*TILE,n=hash(mx,my,99);
      if(ch==='.'&&n%13===0){c.fillStyle='#294f2d99';c.beginPath();c.ellipse(X+49,Y+47,9,4,-.5,0,Math.PI*2);c.fill()}
      if(ch==='R'&&n%4===0){c.fillStyle='#6f6555aa';c.beginPath();c.ellipse(X+12+(n%31),Y+51,5,3,0,0,Math.PI*2);c.fill()}
    }
  }

  drawLandmark(c,ch,cx,cy,objective){
    c.save();c.shadowColor='#0009';c.shadowBlur=8;c.shadowOffsetY=5;drawLandmarkAsset(c,ch,cx,cy,ch==='B'?116:120);c.shadowColor='transparent';
    this.label(c,ch==='X'?'新野城':ch==='L'?'隆中草廬':'博望坡軍寨',cx-(ch==='B'?48:40),cy-66);
    if(objective){c.fillStyle='#fff1a5';c.strokeStyle='#705010';c.lineWidth=2;c.beginPath();c.moveTo(cx,cy-88);c.lineTo(cx-13,cy-70);c.lineTo(cx-5,cy-70);c.lineTo(cx-5,cy-59);c.lineTo(cx+5,cy-59);c.lineTo(cx+5,cy-70);c.lineTo(cx+13,cy-70);c.closePath();c.fill();c.stroke();c.fillStyle='#fff9d2';c.fillRect(cx-2,cy-83,4,9)}c.restore();
  }

  fallbackSprite(c,x,y,color){c.fillStyle='#0004';c.beginPath();c.ellipse(x,y+25,18,5,0,0,Math.PI*2);c.fill();c.fillStyle=color;c.beginPath();c.arc(x,y,14,0,Math.PI*2);c.fill();c.fillRect(x-11,y+12,22,28)}
  label(c,text,x,y){c.font='bold 15px "PingFang TC",sans-serif';c.textBaseline='top';const w=c.measureText(text).width+14;c.fillStyle='#071019e6';c.fillRect(x-7,y-5,w,25);c.strokeStyle='#e5c869';c.lineWidth=2;c.strokeRect(x-7,y-5,w,25);c.fillStyle='#fff0b4';c.fillText(text,x,y)}
  drawTalkMarker(c,x,y){c.fillStyle='#071019e8';c.strokeStyle='#ffd76a';c.lineWidth=2;c.beginPath();c.roundRect(x-10,y-8,20,16,5);c.fill();c.stroke();c.fillStyle='#ffe58d';c.fillRect(x-2,y-5,4,7);c.fillRect(x-2,y+4,4,3)}
  drawVignette(c){const g=c.createRadialGradient(COLS*TILE/2,ROWS*TILE/2,190,COLS*TILE/2,ROWS*TILE/2,510);g.addColorStop(.55,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.15)');c.fillStyle=g;c.fillRect(0,0,COLS*TILE,ROWS*TILE)}
}
