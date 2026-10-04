import {MAPS,isCamp} from './chapter-two.js?v=12.2';
import {asset,sheet,CELL} from './assets.js';
const COLS=10,ROWS=10,TILE=32;
const terrain={'.':0,R:1,W:2,T:3,F:3,'#':4,H:5,S:6,I:7,P:13,N:15,X:13,L:12,B:14,C:0,A:1,D:0,q:2,d:0};
export async function loadWorldArt(){const urls=['terrain','villager','merchant','innkeeper','river'].map(n=>asset(`world/${n}.png`));return new Map(await Promise.all(urls.map(url=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve([url,im]);im.onerror=()=>reject(Error('地圖素材載入失敗'));im.src=url;}))));}
export class WorldRendererV12{
 constructor(canvas,images,state){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.images=images;this.state=state;this.cam={x:0,y:0};this.facing=1;this.step=0;this.draw(0);}
 draw(time){const s=this.state,m=MAPS[s.map],c=this.ctx;this.cam={x:Math.max(0,Math.min(m.width-COLS,s.x-5)),y:Math.max(0,Math.min(m.height-ROWS,s.y-5))};c.imageSmoothingEnabled=false;c.clearRect(0,0,COLS*TILE,ROWS*TILE);const atlas=this.images.get(asset('world/terrain.png'));
  for(let row=0;row<ROWS;row++)for(let col=0;col<COLS;col++){const x=col+this.cam.x,y=row+this.cam.y,ch=m.rows[y]?.[x]||'#',road=ch==='.'&&(isCamp(s.map)&&(x===8||x===9||y===3||y===9)||s.map==='longzhong'&&(y===5&&x>=6&&x<=7||x===7&&y>=5)),t=road?1:isCamp(s.map)&&s.map!=='xinye'&&ch==='P'?0:terrain[ch]??0;c.drawImage(atlas,(t%4)*128,Math.floor(t/4)*128,128,128,col*TILE,row*TILE,TILE,TILE);}
  const river=this.images.get(asset('world/river.png'));
  for(let row=0;row<ROWS;row++)for(let col=0;col<COLS;col++){const x=col+this.cam.x,y=row+this.cam.y,ch=m.rows[y]?.[x];if(ch==='q'&&m.rows[y]?.[x-1]!=='q'&&m.rows[y-1]?.[x]!=='q')c.drawImage(river,128,0,128,128,col*TILE,row*TILE,2*TILE,2*TILE);else if(ch==='d'||ch==='C'||ch==='D')c.drawImage(river,ch==='C'?128:0,128,128,128,col*TILE,row*TILE,TILE,TILE);else if(isCamp(s.map)&&s.map!=='xinye'&&x===8&&y===6)c.drawImage(river,128,128,128,128,col*TILE,row*TILE,2*TILE,2*TILE);}
  const landmarks=m.landmarks||(m.points?Object.entries(m.points).flatMap(([ch,p])=>{for(let y=0;y<m.height;y++){const x=m.rows[y].indexOf(ch);if(x>=0)return [{x,y,name:p.name,ch}];}return [];}):s.map==='xinye'?[{x:4.5,y:2,name:'軍需所'},{x:10.5,y:2,name:'客棧'},{x:8,y:11,name:'南門'}]:s.map==='longzhong'?[{x:5.5,y:4,name:'草廬'},{x:7,y:9,name:'山道'}]:[{x:8,y:1,name:s.story.stage<4?'魏軍主力':'魏軍已退'},{x:8,y:11,name:'出坡'}]);
  const target=s.story.stage===0?'L':s.story.stage===1?'X':s.story.stage<4?'B':s.story.stage===5?'C':s.story.stage===6?'A':s.story.stage<9?'D':null;
  for(const p of landmarks){if(p.x<this.cam.x-1||p.x>=this.cam.x+COLS||p.y<this.cam.y||p.y>=this.cam.y+ROWS)continue;const x=(p.x-this.cam.x+.5)*TILE,y=(p.y-this.cam.y+1)*TILE;this.label(p.name,x,y-2);if(p.ch===target){c.fillStyle='#ffe2a0';c.font='bold 13px serif';c.textAlign='center';c.fillText('▼',x,y-TILE-2);}}
  const sprites=(m.npcs||[]).map(n=>({...n,npc:true}));sprites.push({x:s.x,y:s.y,id:'player',name:'劉備'});sprites.sort((a,b)=>a.y-b.y);
  for(const p of sprites){if(p.x<this.cam.x||p.x>=this.cam.x+COLS||p.y<this.cam.y||p.y>=this.cam.y+ROWS)continue;const x=(p.x-this.cam.x+.5)*TILE,y=(p.y-this.cam.y+1)*TILE-2;c.save();c.fillStyle='#09101188';c.beginPath();c.ellipse(x,y,10,2,0,0,Math.PI*2);c.fill();const frame=Math.floor(time/780)%2;
   if(p.id==='player'||p.id==='kongmingNpc'||p.id==='officer'){const id=p.id==='player'?'liubei':p.id==='kongmingNpc'?'kongming':'pikeman';const im=this.images.get(sheet(id));c.translate(x,y-36);if(p.id==='player'&&this.facing<0)c.scale(-1,1);c.drawImage(im,frame*CELL.w,0,CELL.w,CELL.h,-16,0,32,36);}
   else {const key=p.id==='merchant'?'merchant':p.id==='innkeeper'?'innkeeper':'villager';const im=this.images.get(asset(`world/${key}.png`));c.drawImage(im,frame*64,0,64,80,x-13,y-33,26,33);}
   c.restore();if(p.npc){c.fillStyle='#ffdc83';c.font='bold 11px serif';c.textAlign='center';c.strokeStyle='#0b141d';c.lineWidth=2;const mark=p.rescue&&s.story.rescued?.includes(p.rescue)||p.id==='elder'&&s.story.stage>=6?'✓':'！';c.strokeText(mark,x,y-39);c.fillText(mark,x,y-39);}
  }
 }
 label(text,x,y){const c=this.ctx;c.save();c.font='9px sans-serif';c.textAlign='center';const w=c.measureText(text).width+8;c.fillStyle='#101b24ec';c.strokeStyle='#b09660';c.lineWidth=1;c.fillRect(Math.round(x-w/2),y-11,w,13);c.strokeRect(Math.round(x-w/2),y-11,w,13);c.fillStyle='#f3d89b';c.fillText(text,x,y-1);c.restore();}
 cellAt(clientX,clientY){const r=this.canvas.getBoundingClientRect(),scale=Math.min(r.width/(COLS*TILE),r.height/(ROWS*TILE)),ox=(r.width-COLS*TILE*scale)/2,oy=(r.height-ROWS*TILE*scale)/2;const x=(clientX-r.left-ox)/scale,y=(clientY-r.top-oy)/scale;if(x<0||x>=COLS*TILE||y<0||y>=ROWS*TILE)return null;return {x:Math.floor(x/TILE)+this.cam.x,y:Math.floor(y/TILE)+this.cam.y};}
}
