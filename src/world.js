import {MAPS} from './data.js';
import {buildSceneImage,sceneReady} from './sceneArt.js';
import {characterImage} from './characterArtV7.js';
const SRC=128,DST=64,COLS=12,ROWS=9;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export class WorldSystem{
  constructor(canvas,state,onTile,onMessage){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.state=state;this.onTile=onTile;this.onMessage=onMessage;this.frame=0;this._ready=e=>{if(e.detail?.id===this.state.map)this.render()};document.addEventListener('sanguo-scene-ready',this._ready)}
  map(){return MAPS[this.state.map]}
  passable(ch){return !['#','W','T','F'].includes(ch)}
  tileAt(x,y){return this.map().rows[y]?.[x]||'#'}
  move(dx,dy){const nx=this.state.x+dx,ny=this.state.y+dy;if(!this.passable(this.tileAt(nx,ny))){this.onMessage('前方無法通行。請沿道路、草地或城門前進。');return false}this.state.x=nx;this.state.y=ny;this.frame++;this.render();this.onTile?.(this.tileAt(nx,ny));return true}
  npcAt(x,y){return this.map().npcs?.find(n=>n.x===x&&n.y===y)}
  nearbyNpc(){for(const [dx,dy] of [[0,-1],[0,1],[-1,0],[1,0],[0,0]]){const n=this.npcAt(this.state.x+dx,this.state.y+dy);if(n)return n}return null}
  objectiveChar(){const s=this.state.story?.stage??0;if(s===0)return'L';if(s===1)return'X';if(s===2||s===3)return'B';return null}
  npcKey(n){if(n.id==='kongmingNpc')return'kongming';if(n.id==='officer')return'officer';if(n.id==='merchant')return'merchant';if(n.id==='citizen')return'citizen';if(n.id==='villager')return'villager';return'scout'}
  camera(m){let x=clamp(this.state.x-Math.floor(COLS/2),0,Math.max(0,m.width-COLS)),y=clamp(this.state.y-Math.floor(ROWS/2),0,Math.max(0,m.height-ROWS));if(m.kind==='world'){const target=this.objectiveChar();if(target){for(let yy=0;yy<m.height;yy++){const xx=m.rows[yy].indexOf(target);if(xx<0)continue;if(Math.abs(xx-this.state.x)<=5&&Math.abs(yy-this.state.y)<=4){x=clamp(Math.round((this.state.x+xx)/2)-Math.floor(COLS/2),0,Math.max(0,m.width-COLS));y=clamp(Math.round((this.state.y+yy)/2)-Math.floor(ROWS/2),0,Math.max(0,m.height-ROWS))}break}}}return{x,y}}
  render(){const c=this.ctx,cv=this.canvas,m=this.map(),cam=this.camera(m),scene=buildSceneImage(this.state.map);c.clearRect(0,0,cv.width,cv.height);c.imageSmoothingEnabled=true;if(sceneReady(this.state.map)){c.drawImage(scene,cam.x*SRC,cam.y*SRC,COLS*SRC,ROWS*SRC,0,0,COLS*DST,ROWS*DST)}else{const g=c.createLinearGradient(0,0,0,cv.height);g.addColorStop(0,'#789d59');g.addColorStop(1,'#4f7445');c.fillStyle=g;c.fillRect(0,0,cv.width,cv.height);c.fillStyle='#fff8d7';c.font='bold 16px sans-serif';c.fillText('場景美術載入中…',18,28)}if(m.kind==='world')this.drawWorldLabels(c,m,cam);for(const n of (m.npcs||[])){if(n.x<cam.x||n.x>=cam.x+COLS||n.y<cam.y||n.y>=cam.y+ROWS)continue;const px=(n.x-cam.x)*DST+DST/2,py=(n.y-cam.y)*DST+DST/2,img=characterImage(this.npcKey(n),this.frame);if(img.complete)c.drawImage(img,px-32,py-46,64,80);this.drawTalkMarker(c,px,py-49)}const player=characterImage('zhaoyun',this.frame),px=(this.state.x-cam.x)*DST+DST/2,py=(this.state.y-cam.y)*DST+DST/2;if(player.complete)c.drawImage(player,px-35,py-50,70,88);this.drawVignette(c)}
  drawWorldLabels(c,m,cam){const obj=this.objectiveChar();for(let y=cam.y;y<Math.min(m.height,cam.y+ROWS);y++)for(let x=cam.x;x<Math.min(m.width,cam.x+COLS);x++){const ch=m.rows[y][x];if(!'XLB'.includes(ch))continue;const px=(x-cam.x)*DST+DST/2,py=(y-cam.y)*DST+DST/2,name=ch==='X'?'新野城':ch==='L'?'隆中草廬':'博望坡軍寨';this.label(c,name,px,py+36);if(ch===obj)this.arrow(c,px,py-53)}}
  label(c,text,x,y){c.save();c.font='700 12px "PingFang TC",sans-serif';c.textBaseline='middle';const w=c.measureText(text).width+18;c.fillStyle='#16110bdd';c.strokeStyle='#d4b464';c.lineWidth=1.5;c.beginPath();c.roundRect(x-w/2,y-11,w,22,6);c.fill();c.stroke();c.fillStyle='#ffe8a7';c.textAlign='center';c.fillText(text,x,y);c.restore()}
  arrow(c,x,y){c.save();c.shadowColor='#0008';c.shadowBlur=5;c.fillStyle='#ffe783';c.strokeStyle='#6e4d10';c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.lineTo(x-11,y+16);c.lineTo(x-4,y+16);c.lineTo(x-4,y+27);c.lineTo(x+4,y+27);c.lineTo(x+4,y+16);c.lineTo(x+11,y+16);c.closePath();c.fill();c.stroke();c.restore()}
  drawTalkMarker(c,x,y){c.save();c.fillStyle='#18120de8';c.strokeStyle='#f0d06c';c.lineWidth=2;c.beginPath();c.roundRect(x-10,y-8,20,16,5);c.fill();c.stroke();c.fillStyle='#ffe68b';c.fillRect(x-2,y-5,4,7);c.fillRect(x-2,y+4,4,3);c.restore()}
  drawVignette(c){const g=c.createRadialGradient(384,288,170,384,288,520);g.addColorStop(.58,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(3,7,5,.24)');c.fillStyle=g;c.fillRect(0,0,768,576)}
}
