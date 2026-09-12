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
  render(){const c=this.ctx,cv=this.canvas,m=this.map();c.imageSmoothingEnabled=false;c.clearRect(0,0,cv.width,cv.height);const cols=12,rows=9,camX=Math.max(0,Math.min(this.state.x-6,m.width-cols)),camY=Math.max(0,Math.min(this.state.y-4,m.height-rows)),sx=cv.width/(cols*TILE),sy=cv.height/(rows*TILE);c.save();c.scale(sx,sy);for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const mx=camX+x,my=camY+y,ch=m.rows[my]?.[mx]||'#',X=x*TILE,Y=y*TILE;this.drawTile(c,ch,X,Y,x,y)}for(const n of (m.npcs||[])){if(n.x>=camX&&n.x<camX+cols&&n.y>=camY&&n.y<camY+rows){const img=spriteCanvas(n.id==='kongmingNpc'?'kongming':'scout','idle',this.frame%2,1);c.drawImage(img,(n.x-camX)*TILE-4,(n.y-camY)*TILE-8,24,24)}}const img=spriteCanvas('zhaoyun','idle',this.frame%2,1);c.drawImage(img,(this.state.x-camX)*TILE-4,(this.state.y-camY)*TILE-8,24,24);c.restore()}
  drawTile(c,ch,X,Y,x,y){const alt=(x+y)%2;if(ch==='W'){c.fillStyle='#2d78a9';c.fillRect(X,Y,TILE,TILE);c.fillStyle='#6dc0e8';c.fillRect(X,Y+3,TILE,2);return}c.fillStyle=alt?'#6fa453':'#78ae58';c.fillRect(X,Y,TILE,TILE);if(ch==='#'){c.fillStyle='#484f58';c.fillRect(X,Y,TILE,TILE);c.fillStyle='#717984';c.fillRect(X,Y,TILE,4)}if(ch==='T'||ch==='F'){c.fillStyle=ch==='T'?'#23532d':'#2d6435';c.fillRect(X+2,Y+2,12,11);c.fillStyle='#784f31';c.fillRect(X+7,Y+10,2,6)}if(ch==='R'){c.fillStyle='#b99869';c.fillRect(X,Y,TILE,TILE);c.fillStyle='#cbaa78';c.fillRect(X,Y+5,TILE,3)}if(['X','L','B'].includes(ch)){c.fillStyle=ch==='X'?'#a84c42':ch==='L'?'#d2b36c':'#8f483e';c.fillRect(X+2,Y+4,12,10);c.fillStyle='#2e2e32';c.fillRect(X+6,Y+9,4,5)}if(ch==='S'){c.fillStyle='#b15a3c';c.fillRect(X+1,Y+3,14,11)}if(ch==='I'){c.fillStyle='#456b8c';c.fillRect(X+1,Y+3,14,11)}if(ch==='H'){c.fillStyle='#d0ae68';c.fillRect(X+1,Y+3,14,11)}if(ch==='P'){c.fillStyle='#835a40';c.fillRect(X+4,Y+4,8,8)}if(ch==='N'){c.fillStyle='#889b5b';c.fillRect(X+5,Y+4,6,7)}}
}
