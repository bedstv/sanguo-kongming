import {MAPS} from './data.js';
import {worldSpriteCanvas} from './worldArt.js';
const TILE=64,COLS=12,ROWS=9;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const hash=(x,y,s=0)=>{let n=(x*374761393+y*668265263+s*69069)>>>0;n=(n^(n>>13))*1274126177>>>0;return (n^(n>>16))>>>0};
export class WorldSystem{
  constructor(canvas,state,onTile,onMessage){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.state=state;this.onTile=onTile;this.onMessage=onMessage;this.frame=0}
  map(){return MAPS[this.state.map]}
  passable(ch){return !['#','W','T','F'].includes(ch)}
  tileAt(x,y){return this.map().rows[y]?.[x]||'#'}
  move(dx,dy){const nx=this.state.x+dx,ny=this.state.y+dy;if(!this.passable(this.tileAt(nx,ny))){this.onMessage('前方無法通行。請沿道路、草地或城門前進。');return false}this.state.x=nx;this.state.y=ny;this.frame++;this.render();this.onTile?.(this.tileAt(nx,ny));return true}
  npcAt(x,y){return this.map().npcs?.find(n=>n.x===x&&n.y===y)}
  nearbyNpc(){const dirs=[[0,-1],[0,1],[-1,0],[1,0],[0,0]];for(const [dx,dy] of dirs){const n=this.npcAt(this.state.x+dx,this.state.y+dy);if(n)return n}return null}
  objectiveChar(){const s=this.state.story?.stage??0;if(s===0)return'L';if(s===1)return'X';if(s===2||s===3)return'B';return null}
  npcKey(n){if(n.id==='kongmingNpc')return'kongming';if(n.id==='officer')return'officer';if(n.id==='merchant')return'merchant';if(n.id==='citizen')return'citizen';if(n.id==='villager')return'villager';return'scout'}
  render(){
    const c=this.ctx,cv=this.canvas,m=this.map();c.imageSmoothingEnabled=true;c.clearRect(0,0,cv.width,cv.height);
    const camX=clamp(this.state.x-Math.floor(COLS/2),0,Math.max(0,m.width-COLS)),camY=clamp(this.state.y-Math.floor(ROWS/2),0,Math.max(0,m.height-ROWS));
    const sx=cv.width/(COLS*TILE),sy=cv.height/(ROWS*TILE);c.save();c.scale(sx,sy);
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const mx=camX+x,my=camY+y,ch=m.rows[my]?.[mx]||'#';this.drawTile(c,m,ch,x*TILE,y*TILE,mx,my)}
    this.drawAmbient(c,m,camX,camY);
    if(m.kind==='world')for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const mx=camX+x,my=camY+y,ch=m.rows[my]?.[mx];if(['X','L','B'].includes(ch))this.drawLandmark(c,ch,x*TILE+TILE/2,y*TILE+TILE/2,ch===this.objectiveChar())}
    for(const n of (m.npcs||[])){if(n.x>=camX&&n.x<camX+COLS&&n.y>=camY&&n.y<camY+ROWS){const img=worldSpriteCanvas(this.npcKey(n),this.frame);const px=(n.x-camX)*TILE+TILE/2,py=(n.y-camY)*TILE+TILE/2;c.drawImage(img,px-28,py-42,56,70);this.drawTalkMarker(c,px,py-46)}}
    const player=worldSpriteCanvas('zhaoyun',this.frame);const px=(this.state.x-camX)*TILE+TILE/2,py=(this.state.y-camY)*TILE+TILE/2;c.drawImage(player,px-30,py-46,60,75);
    this.drawVignette(c);c.restore()
  }
  is(ch,m,x,y){return (m.rows[y]?.[x]||'#')===ch}
  isPath(m,x,y){const q=m.rows[y]?.[x];return q==='R'||['X','L','B'].includes(q)}
  drawTile(c,m,ch,X,Y,x,y){if(ch==='W'){this.water(c,m,X,Y,x,y);return}this.ground(c,X,Y,x,y);if(ch==='R'){this.road(c,m,X,Y,x,y);return}if(ch==='#'){this.wall(c,X,Y,x,y);return}if(ch==='T'||ch==='F'){this.forest(c,X,Y,ch==='T',x,y);return}if(['X','L','B'].includes(ch)){this.road(c,m,X,Y,x,y);return}if(ch==='S'||ch==='I'||ch==='H'){this.building(c,X,Y,ch,x,y);return}if(ch==='P'){this.pavilion(c,X,Y);return}if(ch==='N'){this.shrub(c,X,Y,x,y);return}}
  ground(c,X,Y,x,y){
    const n=hash(x,y);const base=n%3===0?'#668f4b':n%3===1?'#6f9950':'#739e55';c.fillStyle=base;c.fillRect(X,Y,TILE,TILE);
    c.fillStyle='#7eaa5d';c.globalAlpha=.32;c.fillRect(X+(n%19),Y+((n>>4)%17),30,18);c.fillRect(X+((n>>8)%28),Y+34,24,20);c.globalAlpha=1;
    for(let i=0;i<13;i++){const h=hash(x,y,i),gx=X+5+(h%54),gy=Y+7+((h>>7)%50);if(i%5===0){c.fillStyle='#d9cf7b';c.fillRect(gx,gy,2,2);c.fillStyle='#8d5d71';c.fillRect(gx+2,gy+1,1,1)}else if(i%4===0){c.fillStyle='#9ebf72';c.fillRect(gx,gy,3,2);c.fillStyle='#53763f';c.fillRect(gx+1,gy+2,1,2)}else{c.fillStyle=i%2?'#426d39':'#84b163';c.fillRect(gx,gy,2,4);c.fillRect(gx-2,gy+2,2,2)}}
    c.fillStyle='#5d7d49';c.fillRect(X+2,Y+62,60,2);c.fillStyle='#8eb66b';c.fillRect(X+2,Y,60,2)
  }
  water(c,m,X,Y,x,y){
    const grad=c.createLinearGradient(X,Y,X,Y+TILE);grad.addColorStop(0,'#2c82b1');grad.addColorStop(.48,'#2477a7');grad.addColorStop(1,'#185c8b');c.fillStyle=grad;c.fillRect(X,Y,TILE,TILE);
    const n=hash(x,y);for(let i=0;i<7;i++){const yy=Y+8+i*8+((n>>(i%8))&3),xx=X+4+((n>>(i*3))%27);c.fillStyle=i%3===0?'#8ed9ee':i%2?'#5bb9db':'#3d9cc8';c.globalAlpha=.65;c.fillRect(xx,yy,20+(i%3)*5,2);c.fillRect(X+40-(i%2)*8,yy+3,12,1)}c.globalAlpha=1;
    const bank=(side)=>{c.fillStyle='#b7a66b';if(side==='l'){c.fillRect(X,Y,7,TILE);c.fillStyle='#859b5e';c.fillRect(X,Y,4,TILE);c.fillStyle='#d9ca86';for(let yy=5;yy<TILE;yy+=12)c.fillRect(X+6,Y+yy,2,5)}if(side==='r'){c.fillRect(X+57,Y,7,TILE);c.fillStyle='#859b5e';c.fillRect(X+60,Y,4,TILE);c.fillStyle='#d9ca86';for(let yy=7;yy<TILE;yy+=12)c.fillRect(X+56,Y+yy,2,5)}if(side==='t'){c.fillRect(X,Y,TILE,7);c.fillStyle='#859b5e';c.fillRect(X,Y,TILE,4);c.fillStyle='#d9ca86';for(let xx=5;xx<TILE;xx+=13)c.fillRect(X+xx,Y+6,5,2)}if(side==='b'){c.fillRect(X,Y+57,TILE,7);c.fillStyle='#859b5e';c.fillRect(X,Y+60,TILE,4);c.fillStyle='#d9ca86';for(let xx=7;xx<TILE;xx+=13)c.fillRect(X+xx,Y+56,5,2)}};
    if(!this.is('W',m,x-1,y))bank('l');if(!this.is('W',m,x+1,y))bank('r');if(!this.is('W',m,x,y-1))bank('t');if(!this.is('W',m,x,y+1))bank('b')
  }
  road(c,m,X,Y,x,y){
    const main='#aa8759',light='#c3a06d',dark='#856642';const L=this.isPath(m,x-1,y),R=this.isPath(m,x+1,y),U=this.isPath(m,x,y-1),D=this.isPath(m,x,y+1);
    const fill=(x0,y0,w,h)=>{c.fillStyle=dark;c.fillRect(x0-3,y0-3,w+6,h+6);c.fillStyle=main;c.fillRect(x0,y0,w,h)};
    fill(X+18,Y+18,28,28);if(L)fill(X,Y+18,34,28);if(R)fill(X+30,Y+18,34,28);if(U)fill(X+18,Y,28,34);if(D)fill(X+18,Y+30,28,34);
    c.fillStyle='#8f704a';if(L||R){c.fillRect(X+2,Y+27,60,2);c.fillRect(X+2,Y+38,60,2)}if(U||D){c.fillRect(X+27,Y+2,2,60);c.fillRect(X+38,Y+2,2,60)}
    const n=hash(x,y);for(let i=0;i<8;i++){const px=X+18+((n>>(i*3))%28),py=Y+18+((n>>(i*4+2))%28);c.fillStyle=i%2?light:'#72573a';c.fillRect(px,py,3+(i%3),2)}
  }
  wall(c,X,Y,x,y){
    c.fillStyle='#4b525c';c.fillRect(X,Y,TILE,TILE);c.fillStyle='#7f8995';c.fillRect(X,Y,TILE,9);c.fillStyle='#343b43';c.fillRect(X,Y+56,TILE,8);
    for(let yy=12,row=0;yy<55;yy+=11,row++){for(let xx=(row%2?-7:0);xx<TILE;xx+=22){c.fillStyle='#66707b';c.fillRect(X+xx,Y+yy,19,8);c.fillStyle='#3d444c';c.fillRect(X+xx,Y+yy+8,19,2);c.fillStyle='#89939d';c.fillRect(X+xx+2,Y+yy+1,13,1)}}
    const n=hash(x,y);if(n%3===0){c.fillStyle='#425c3a';c.fillRect(X+4,Y+42,6,14);c.fillStyle='#6c8a52';c.fillRect(X+3,Y+38,8,7)}
  }
  forest(c,X,Y,dark,x,y){
    c.fillStyle=dark?'#315e39':'#497943';c.fillRect(X,Y,TILE,TILE);const n=hash(x,y);
    const tree=(cx,cy,s=1)=>{const trunk=dark?'#5a3a28':'#68442d',deep=dark?'#143823':'#194827',mid=dark?'#225b30':'#2c6c37',hi=dark?'#3f8245':'#4d914b';c.fillStyle='#0004';c.beginPath();c.ellipse(cx,cy+20*s,15*s,6*s,0,0,Math.PI*2);c.fill();c.fillStyle=trunk;c.fillRect(cx-3*s,cy+5*s,6*s,24*s);c.fillStyle=deep;c.beginPath();c.arc(cx,cy,18*s,0,Math.PI*2);c.arc(cx-10*s,cy+5*s,13*s,0,Math.PI*2);c.arc(cx+11*s,cy+5*s,13*s,0,Math.PI*2);c.fill();c.fillStyle=mid;c.beginPath();c.arc(cx-5*s,cy-5*s,10*s,0,Math.PI*2);c.arc(cx+8*s,cy-2*s,9*s,0,Math.PI*2);c.fill();c.fillStyle=hi;c.fillRect(cx-11*s,cy-8*s,6*s,5*s);c.fillRect(cx+4*s,cy-8*s,5*s,4*s);c.fillStyle='#9dc875';c.fillRect(cx-6*s,cy+1*s,3*s,3*s)};
    tree(X+20+(n%5),Y+25,0.85);tree(X+45-((n>>3)%5),Y+22,0.92);if(dark)tree(X+34,Y+45,.72)
  }
  building(c,X,Y,ch,x,y){
    const cfg=ch==='S'?['#91372f','#d9ad74','#f5ce64','#5c291f']:ch==='I'?['#31587d','#d6ccb0','#90cce9','#283b53']:['#9b7839','#d8c080','#eed078','#59462a'];const [roof,wall,sign,beam]=cfg;
    c.fillStyle='#0005';c.fillRect(X+8,Y+20,50,40);c.fillStyle=wall;c.fillRect(X+9,Y+20,46,37);c.fillStyle=beam;c.fillRect(X+9,Y+30,46,4);c.fillRect(X+20,Y+20,4,37);c.fillRect(X+43,Y+20,4,37);
    c.fillStyle=roof;c.fillRect(X+4,Y+12,56,12);c.fillRect(X+10,Y+7,44,8);c.fillStyle='#552922';for(let xx=8;xx<58;xx+=8)c.fillRect(X+xx,Y+13,5,2);c.fillStyle='#d7a65a';c.fillRect(X+2,Y+24,60,3);
    c.fillStyle='#362b28';c.fillRect(X+27,Y+38,12,19);c.fillStyle='#6f4632';c.fillRect(X+30,Y+42,6,15);c.fillStyle=sign;c.fillRect(X+12,Y+34,9,8);c.fillRect(X+47,Y+34,7,8);c.fillStyle='#fff6cf';c.globalAlpha=.45;c.fillRect(X+14,Y+35,5,2);c.globalAlpha=1
  }
  pavilion(c,X,Y){c.fillStyle='#0004';c.fillRect(X+12,Y+26,42,30);c.fillStyle='#c29a5d';c.fillRect(X+14,Y+24,38,28);c.fillStyle='#63382c';c.fillRect(X+14,Y+33,38,4);c.fillStyle='#7c342e';c.fillRect(X+7,Y+15,50,9);c.fillRect(X+14,Y+10,36,7);c.fillStyle='#312721';c.fillRect(X+27,Y+38,11,18);c.fillStyle='#efcc7d';c.fillRect(X+17,Y+29,7,5);c.fillRect(X+43,Y+29,6,5)}
  shrub(c,X,Y,x,y){const n=hash(x,y);c.fillStyle='#4f633b';c.fillRect(X+26,Y+31,11,25);c.fillStyle='#617846';c.beginPath();c.arc(X+31,Y+28,17,0,Math.PI*2);c.fill();c.fillStyle='#a3a25b';c.beginPath();c.arc(X+34,Y+19,12,0,Math.PI*2);c.fill();c.fillStyle='#d2c777';c.fillRect(X+30,Y+16,5,5);if(n%2)c.fillRect(X+41,Y+27,3,3)}
  drawAmbient(c,m,camX,camY){
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){const mx=camX+x,my=camY+y,ch=m.rows[my]?.[mx],X=x*TILE,Y=y*TILE,n=hash(mx,my,99);if(ch==='R'&&n%3===0){c.fillStyle='#6b6e63';c.fillRect(X+5+(n%11),Y+50,7,4);c.fillStyle='#a1a38d';c.fillRect(X+7+(n%11),Y+49,3,1)}if(ch==='.'&&n%11===0){c.fillStyle='#3b6d38';c.fillRect(X+48,Y+40,3,13);c.fillStyle='#7f9c4d';c.fillRect(X+42,Y+35,14,8)}}
  }
  drawLandmark(c,ch,cx,cy,objective){
    c.save();c.translate(cx,cy);c.shadowColor='#0008';c.shadowBlur=5;c.shadowOffsetY=5;
    if(ch==='X'){
      c.fillStyle='#352b27';c.fillRect(-45,8,90,38);c.fillStyle='#d8b379';c.fillRect(-40,-1,80,38);c.fillStyle='#7b322d';c.fillRect(-48,-18,96,15);c.fillStyle='#a74639';c.fillRect(-36,-31,72,16);c.fillStyle='#6d2e29';for(let x=-40;x<43;x+=12)c.fillRect(x,-15,8,3);c.fillStyle='#25262b';c.fillRect(-11,18,22,28);c.fillStyle='#f3d981';c.fillRect(-32,7,10,10);c.fillRect(23,7,10,10);c.fillStyle='#4d2f27';c.fillRect(-43,35,86,5);this.label(c,'新野城',-28,-44)
    }else if(ch==='L'){
      c.fillStyle='#46382b';c.fillRect(-40,8,80,36);c.fillStyle='#ddc88c';c.fillRect(-35,0,70,37);c.fillStyle='#6e4b2c';c.beginPath();c.moveTo(-46,-3);c.lineTo(0,-34);c.lineTo(46,-3);c.closePath();c.fill();c.fillStyle='#956638';c.beginPath();c.moveTo(-38,-2);c.lineTo(0,-25);c.lineTo(38,-2);c.closePath();c.fill();c.fillStyle='#332a24';c.fillRect(-10,17,20,27);c.fillStyle='#285f39';c.fillRect(-55,-5,9,45);c.fillRect(46,-8,9,48);c.fillStyle='#4d8b4a';c.beginPath();c.arc(-51,-9,14,0,Math.PI*2);c.arc(51,-12,15,0,Math.PI*2);c.fill();this.label(c,'隆中草廬',-37,-47)
    }else{
      c.fillStyle='#54372f';c.fillRect(-48,2,96,42);c.fillStyle='#87604f';c.fillRect(-42,-8,84,45);c.fillStyle='#3b2b29';c.fillRect(-14,13,28,31);c.fillStyle='#641f20';c.fillRect(-46,-38,6,39);c.fillRect(40,-38,6,39);c.fillStyle='#d9513e';c.fillRect(-40,-36,27,14);c.fillRect(13,-36,27,14);c.fillStyle='#251c1b';c.fillRect(-36,-2,72,6);c.fillStyle='#c09364';for(let x=-33;x<34;x+=12)c.fillRect(x,3,7,4);this.label(c,'博望坡軍寨',-45,-51)
    }
    c.shadowColor='transparent';if(objective){c.fillStyle='#fff0a6';c.strokeStyle='#705010';c.lineWidth=2;c.beginPath();c.moveTo(0,-68);c.lineTo(-13,-51);c.lineTo(-5,-51);c.lineTo(-5,-42);c.lineTo(5,-42);c.lineTo(5,-51);c.lineTo(13,-51);c.closePath();c.fill();c.stroke();c.fillStyle='#fff8cf';c.fillRect(-2,-63,4,8)}c.restore()
  }
  label(c,text,x,y){c.font='bold 15px "PingFang TC",sans-serif';c.textBaseline='top';const w=c.measureText(text).width+14;c.fillStyle='#071019e6';c.fillRect(x-7,y-5,w,25);c.strokeStyle='#e5c869';c.lineWidth=2;c.strokeRect(x-7,y-5,w,25);c.fillStyle='#fff0b4';c.fillText(text,x,y)}
  drawTalkMarker(c,x,y){c.fillStyle='#071019e8';c.strokeStyle='#ffd76a';c.lineWidth=2;c.beginPath();c.roundRect(x-10,y-8,20,16,5);c.fill();c.stroke();c.fillStyle='#ffe58d';c.fillRect(x-2,y-5,4,7);c.fillRect(x-2,y+4,4,3)}
  drawVignette(c){const g=c.createRadialGradient(COLS*TILE/2,ROWS*TILE/2,180,COLS*TILE/2,ROWS*TILE/2,500);g.addColorStop(.55,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.18)');c.fillStyle=g;c.fillRect(0,0,COLS*TILE,ROWS*TILE)}
}
