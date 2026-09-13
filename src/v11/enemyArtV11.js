const CACHE=new Map();
const FRAME_SEQ={idle:[0,1],attack:[2,3,2],hurt:[4,4],cast:[5,5],ko:[6]};
const C={outline:'#181513',skin:'#d29762',skin2:'#aa6845',steel:'#e8ebe8',wood:'#6d4724',spark:'#7fe5ff'};
const SPEC={
  caoren:{main:'#36558f',dark:'#1e315c',accent:'#9fb1cd',hair:'#201a1a',weapon:'swordshield'},
  zhanghe:{main:'#65447d',dark:'#3b244f',accent:'#d39759',hair:'#251c22',weapon:'halberd'},
  pikeman:{main:'#6b503e',dark:'#3e2f29',accent:'#a18764',hair:'#2b231d',weapon:'spear'},
  archer:{main:'#48563d',dark:'#29342a',accent:'#b69241',hair:'#26201b',weapon:'bow'},
  xiahoudun:{main:'#742d2b',dark:'#3c191c',accent:'#df932d',hair:'#1a1413',weapon:'saber'}
};
function R(g,x,y,w,h,c){g.fillStyle=c;g.fillRect(x,y,w,h)}
function P(g,pts,c){g.fillStyle=c;g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)g.lineTo(pts[i][0],pts[i][1]);g.closePath();g.fill()}
function L(g,x1,y1,x2,y2,c,w=1){g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.moveTo(x1+.5,y1+.5);g.lineTo(x2+.5,y2+.5);g.stroke()}
function head(g,id,s,x,y){
  R(g,x+2,y+5,14,12,C.outline);R(g,x+4,y+7,10,8,C.skin);R(g,x+4,y+5,10,3,s.hair);R(g,x+6,y+10,2,1,C.outline);R(g,x+11,y+10,2,1,C.outline);
  if(id==='caoren'){R(g,x+1,y+3,16,5,'#526fa4');R(g,x+4,y,10,4,s.accent);R(g,x,y+8,3,6,'#435a86');R(g,x+16,y+8,3,6,'#435a86');R(g,x+6,y+15,7,3,s.hair)}
  else if(id==='zhanghe'){P(g,[[x+1,y+6],[x+4,y+1],[x+8,y+4],[x+12,y],[x+15,y+4],[x+19,y+2],[x+18,y+8]],'#704b88');R(g,x+2,y+6,16,3,s.accent);R(g,x+7,y+15,7,2,s.hair)}
  else if(id==='pikeman'){R(g,x+1,y+4,17,5,'#54483b');R(g,x+5,y+1,9,4,'#71604d')}
  else if(id==='archer'){R(g,x+2,y+4,15,4,'#48503b');P(g,[[x+2,y+4],[x+7,y],[x+15,y+4]],'#596844')}
  else if(id==='xiahoudun'){R(g,x+1,y+4,17,4,s.hair);P(g,[[x+3,y+5],[x+9,y],[x+14,y+5]],'#87352f');P(g,[[x+11,y+1],[x+18,y],[x+21,y+2],[x+14,y+4]],'#dd402e');R(g,x+5,y+9,5,3,C.outline);L(g,x+4,y+8,x+11,y+13,C.outline,1);R(g,x+8,y+14,7,4,s.hair)}
}
function weapon(g,id,s,x,y,pose,frame){
  const attack=pose==='attack';
  if(s.weapon==='swordshield'){g.fillStyle='#526681';g.beginPath();g.ellipse(x+4,y+28,5,8,0,0,Math.PI*2);g.fill();g.strokeStyle=s.accent;g.stroke();L(g,x+29,y+40,x+(attack&&frame===3?43:36),y+(attack&&frame===3?25:18),C.steel,3)}
  if(s.weapon==='halberd'){L(g,x+1,y+43,x+36,y+15,C.wood,2);P(g,[[x+35,y+13],[x+42,y+10],[x+39,y+17],[x+43,y+17],[x+38,y+20]],C.steel)}
  if(s.weapon==='spear'){L(g,x+2,y+44,x+(attack&&frame===3?45:36),y+(attack&&frame===3?28:14),C.wood,2);P(g,[[x+(attack&&frame===3?44:35),y+(attack&&frame===3?26:12)],[x+(attack&&frame===3?47:39),y+(attack&&frame===3?28:14)],[x+(attack&&frame===3?43:35),y+(attack&&frame===3?31:18)]],C.steel)}
  if(s.weapon==='bow'){g.strokeStyle=s.accent;g.lineWidth=2;g.beginPath();g.arc(x+35,y+30,8,13,-Math.PI/2,Math.PI/2);g.stroke();L(g,x+35,y+17,x+35,y+43,'#dbc79e',1);L(g,x+25,y+30,x+39,y+30,C.steel,1)}
  if(s.weapon==='saber'){L(g,x+29,y+40,x+(attack&&frame===3?44:37),y+(attack&&frame===3?22:19),'#f0ead7',3);R(g,x+28,y+34,6,2,s.accent)}
}
function drawOne(id,pose='idle',frame=0){
  const s=SPEC[id]||SPEC.pikeman,cv=document.createElement('canvas');cv.width=48;cv.height=56;const g=cv.getContext('2d');g.imageSmoothingEnabled=false;
  if(pose==='ko'){R(g,7,31,31,13,C.outline);R(g,9,33,22,9,s.main);R(g,31,33,7,7,C.skin);R(g,9,40,20,3,s.accent);return cv}
  const bob=pose==='idle'&&frame%2?1:0,dx=pose==='hurt'?-2:0;
  R(g,18+dx,39+bob,5,11,s.dark);R(g,27+dx,39+bob,5,11,s.dark);R(g,16+dx,49+bob,8,3,C.outline);R(g,27+dx,49+bob,8,3,C.outline);
  R(g,13+dx,21+bob,23,20,C.outline);R(g,15+dx,23+bob,19,16,s.main);R(g,15+dx,34+bob,19,5,s.dark);R(g,10+dx,24+bob,5,9,C.outline);R(g,35+dx,24+bob,5,9,C.outline);R(g,11+dx,25+bob,4,6,s.main);R(g,35+dx,25+bob,4,6,s.main);
  if(id==='caoren'||id==='zhanghe'||id==='xiahoudun'){R(g,19+dx,25+bob,11,8,s.dark);R(g,20+dx,26+bob,9,5,s.accent);L(g,19+dx,35+bob,31+dx,35+bob,s.accent,2)}
  if(id==='pikeman'||id==='archer'){R(g,19+dx,25+bob,12,8,s.dark);L(g,17+dx,35+bob,33+dx,35+bob,s.accent,1)}
  R(g,21+dx,16+bob,8,6,C.skin2);head(g,id,s,16+dx,2+bob);
  if(pose==='cast'){R(g,9+dx,18+bob,4,9,C.skin);R(g,9+dx,17+bob,4,3,s.accent);L(g,7+dx,14+bob,7+dx,19+bob,C.spark,1);L(g,5+dx,16+bob,9+dx,16+bob,C.spark,1)}
  weapon(g,id,s,4+dx,bob,pose,frame);
  const out=document.createElement('canvas');out.width=96;out.height=112;const o=out.getContext('2d');o.imageSmoothingEnabled=false;o.drawImage(cv,0,0,96,112);return out;
}
export function enemySpriteUrl(id,pose='idle',frame=0){const seq=FRAME_SEQ[pose]||FRAME_SEQ.idle,col=seq[Math.abs(frame)%seq.length]??0,key=`${id}:${pose}:${col}`;if(CACHE.has(key))return CACHE.get(key);const url=drawOne(id,pose,col).toDataURL('image/png');CACHE.set(key,url);return url}
export const V11_ENEMY_IDS=['caoren','zhanghe','pikeman','archer','xiahoudun'];
