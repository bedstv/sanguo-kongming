import {MAPS} from './data.js';
import {spriteCanvas} from './art.js';
const TILE=16;
export class WorldSystem{
  constructor(canvas,state,onTile,onMessage){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.state=state;this.onTile=onTile;this.onMessage=onMessage;this.frame=0}
  map(){return MAPS[this.state.map]}
  passable(ch){return !['#','W','T','F'].includes(ch)}
  tileAt(x,y){const m=this.map();return m.rows[y]?.[x]||'#'}
  move(dx,dy){const nx=this.state.x+dx,ny=this.state.y+dy;if(!this.passable(this.tileAt(nx,ny))){this.onMessage('前方無法通行。');return false}this.state.x=nx;this.state.y=ny;this.frame++;this.render();this.onTile?.(this.tileAt(nx,ny));return true}
  npcAt(x,y){return this.map().npcs?.find(n=>n.x===x&&n.y===y)}
  nearbyNpc(){const dirs=[[0,-1],[0,1],[-1,0],[1,0],[0,0]];for(const [dx,dy] of dirs){const n=this.npcAt(this.state.x+dx,this.state.y+dy);if(n)return n}return null}
  render(){const c=this.ctx,cv=this.canvas,m=this.map();c.imageSmoothingEnabled=false;c.clearRect(0,0,cv.width,cv.height);const cols=12,rows=9,camX=Math.max(0,Math.min(this.state.x-6,m.width-cols)),camY=Math.max(0,Math.min(this.state.y-4,m.height-rows)),sx=cv.width/(cols*TILE),sy=cv.height/(rows*TILE);c.save();c.scale(sx,sy);for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const mx=camX+x,my=camY+y,ch=m.rows[my]?.[mx]||'#',X=x*TILE,Y=y*TILE;this.drawTile(c,ch,X,Y,mx,my)}
    for(const n of (m.npcs||[])){if(n.x>=camX&&n.x<camX+cols&&n.y>=camY&&n.y<camY+rows){const key=n.id==='kongmingNpc'?'kongming':n.id==='officer'?'officer':'scout',img=spriteCanvas(key,'idle',this.frame%2,1);c.drawImage(img,(n.x-camX)*TILE-4,(n.y-camY)*TILE-8,24,24);this.drawMarker(c,(n.x-camX)*TILE+8,(n.y-camY)*TILE-5,'#ffd76a')}}
    const img=spriteCanvas('zhaoyun','idle',this.frame%2,1);c.drawImage(img,(this.state.x-camX)*TILE-4,(this.state.y-camY)*TILE-8,24,24);c.restore()}
  drawMarker(c,x,y,color){c.fillStyle='#071019cc';c.fillRect(x-3,y-3,6,5);c.fillStyle=color;c.fillRect(x-1,y-2,2,2)}
  drawTile(c,ch,X,Y,x,y){const alt=(x+y)%2;
    if(ch==='W'){c.fillStyle='#2b78aa';c.fillRect(X,Y,TILE,TILE);c.fillStyle='#5bb7e8';c.fillRect(X,Y+2,TILE,2);c.fillRect(X+4,Y+8,8,1);c.fillStyle='#1f5f8e';c.fillRect(X,Y+12,TILE,3);return}
    c.fillStyle=alt?'#6da254':'#78ad59';c.fillRect(X,Y,TILE,TILE);c.fillStyle='#86b968';c.fillRect(X,Y,16,2);if((x*3+y)%5===0){c.fillStyle='#4e813f';c.fillRect(X+3,Y+10,2,2);c.fillRect(X+11,Y+6,1,2)}
    if(ch==='#'){c.fillStyle='#565e68';c.fillRect(X,Y,TILE,TILE);c.fillStyle='#7d8793';c.fillRect(X,Y,TILE,4);c.fillStyle='#3d444d';c.fillRect(X,Y+12,TILE,4);c.fillStyle='#69727c';c.fillRect(X+1,Y+6,6,3);c.fillRect(X+9,Y+6,6,3)}
    if(ch==='T'||ch==='F'){const deep=ch==='T'?'#1c4727':'#245b30',mid=ch==='T'?'#2c6736':'#34763f';c.fillStyle='#6d482d';c.fillRect(X+7,Y+9,2,7);c.fillStyle=deep;c.fillRect(X+2,Y+5,12,8);c.fillStyle=mid;c.fillRect(X+4,Y+2,8,7);c.fillStyle='#4b8c4c';c.fillRect(X+7,Y+1,4,4);c.fillStyle='#8fc26c';c.fillRect(X+4,Y+5,2,2)}
    if(ch==='R'){c.fillStyle='#aa8a62';c.fillRect(X,Y,TILE,TILE);c.fillStyle='#c9a878';c.fillRect(X,Y+4,TILE,4);c.fillStyle='#92734e';c.fillRect(X,Y+12,TILE,2);c.fillStyle='#dfc08b';c.fillRect(X+2,Y+6,3,1);c.fillRect(X+10,Y+6,3,1)}
    if(['X','L','B'].includes(ch)){const roof=ch==='X'?'#a94d43':ch==='L'?'#c59c50':'#7f3e38',wall=ch==='X'?'#d8b278':ch==='L'?'#e0c68a':'#9c6b55';c.fillStyle='#40312b';c.fillRect(X+3,Y+9,10,6);c.fillStyle=wall;c.fillRect(X+2,Y+6,12,7);c.fillStyle=roof;c.fillRect(X+1,Y+4,14,3);c.fillStyle='#26272c';c.fillRect(X+6,Y+10,4,5);c.fillStyle='#f0d079';c.fillRect(X+3,Y+7,2,2);c.fillRect(X+11,Y+7,2,2);if(ch==='B'){c.fillStyle='#5a1e1e';c.fillRect(X+7,Y+1,2,5);c.fillStyle='#d55643';c.fillRect(X+9,Y+1,5,3)}}
    if(ch==='S'||ch==='I'||ch==='H'){const roof=ch==='S'?'#b2583c':ch==='I'?'#416b93':'#b9964f',wall=ch==='S'?'#e2b47a':ch==='I'?'#d8d0b8':'#dbc382';c.fillStyle=wall;c.fillRect(X+2,Y+6,12,8);c.fillStyle=roof;c.fillRect(X+1,Y+3,14,4);c.fillStyle='#352d2b';c.fillRect(X+6,Y+10,4,4);c.fillStyle='#f5dc8a';c.fillRect(X+3,Y+8,2,2);c.fillRect(X+11,Y+8,2,2)}
    if(ch==='P'){c.fillStyle='#75503a';c.fillRect(X+4,Y+5,8,7);c.fillStyle='#9c7656';c.fillRect(X+5,Y+4,6,2);c.fillStyle='#3f2f29';c.fillRect(X+7,Y+9,2,3)}
    if(ch==='N'){c.fillStyle='#58683e';c.fillRect(X+5,Y+5,6,7);c.fillStyle='#b9b268';c.fillRect(X+6,Y+3,4,4);c.fillStyle='#38442d';c.fillRect(X+7,Y+9,2,4)}
  }
}
