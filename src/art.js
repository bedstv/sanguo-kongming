const PALETTES={
  liubei:{main:'#5b9b68',trim:'#d4b559',hair:'#2c2a30',weapon:'#d9e4ef',skin:'#efc39a'},
  guanyu:{main:'#43815c',trim:'#b92f39',hair:'#3a2319',weapon:'#d9e4ef',skin:'#d9aa7f'},
  zhangfei:{main:'#713b43',trim:'#d4772c',hair:'#18181c',weapon:'#d9e4ef',skin:'#c38f68'},
  zhaoyun:{main:'#5b79c0',trim:'#e9eef8',hair:'#d9e4ef',weapon:'#f3f5fa',skin:'#edc69f'},
  kongming:{main:'#6b57a4',trim:'#e8dfc9',hair:'#293042',weapon:'#d8c98c',skin:'#efc9a4'},
  scout:{main:'#68734f',trim:'#4b3f35',hair:'#25262c',weapon:'#cfd6df',skin:'#d2a276'},
  pikeman:{main:'#72534a',trim:'#748057',hair:'#25262c',weapon:'#d8dfe8',skin:'#d3a47a'},
  archer:{main:'#6a5850',trim:'#617747',hair:'#25262c',weapon:'#b98a4b',skin:'#d3a47a'},
  officer:{main:'#7f4650',trim:'#353a48',hair:'#25262c',weapon:'#d7dce5',skin:'#d3a47a'},
  caoren:{main:'#4d5f86',trim:'#d6dce8',hair:'#1f252f',weapon:'#d7dce5',skin:'#d5a67c'},
  zhanghe:{main:'#70538e',trim:'#c84b55',hair:'#1d2026',weapon:'#d7dce5',skin:'#d7a77b'},
  xiahoudun:{main:'#8a343e',trim:'#242934',hair:'#171a20',weapon:'#e4e7ed',skin:'#d8a47a'}
};
function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h)}
export function spriteCanvas(key,pose='idle',frame=0,scale=3){const p=PALETTES[key]||PALETTES.scout;const cv=document.createElement('canvas');cv.width=24*scale;cv.height=24*scale;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;c.scale(scale,scale);const bob=pose==='idle'?(frame%2):0;rect(c,5,21,14,2,'#0005');rect(c,8,3+bob,8,4,p.skin);rect(c,7,2+bob,10,2,p.hair);rect(c,7,7+bob,10,9,p.main);rect(c,8,9+bob,8,3,p.trim);rect(c,9,16,3,5,'#4a332a');rect(c,14,16,3,5,'#4a332a');rect(c,6,9+bob,3,3,p.skin);rect(c,16,9+bob,3,3,p.skin);rect(c,10,5+bob,1,1,'#20242a');rect(c,14,5+bob,1,1,'#20242a');
  if(key==='guanyu'){rect(c,10,7+bob,5,2,'#4b241d');rect(c,11,8+bob,3,6,'#3c241e')}
  if(key==='zhaoyun'){rect(c,8,1+bob,8,2,'#dce7f5');rect(c,6,2+bob,3,4,'#ecf3fb')}
  if(key==='kongming'){rect(c,5,1+bob,14,2,'#3c3b4d');rect(c,4,9+bob,3,8,'#e5dbc7')}
  const atk=pose==='attack'; const cast=pose==='cast';
  if(key==='archer'){c.strokeStyle=p.weapon;c.lineWidth=1;c.beginPath();c.arc(atk?18:20,11+bob,4,Math.PI/2,Math.PI*1.5);c.stroke();rect(c,17,10+bob,5,1,p.weapon)}
  else if(key==='kongming'){rect(c,atk?18:17,8+bob,1,10,p.weapon);rect(c,18,7+bob,4,3,cast?'#9ee7ff':p.weapon)}
  else {rect(c,atk?17:19,5+bob,1,13,p.weapon);rect(c,atk?18:20,4,2,2,p.weapon)}
  if(pose==='hurt')rect(c,4,4,16,14,'#ff686855');
  return cv;}
export function spriteData(key,pose='idle',frame=0,scale=3){return spriteCanvas(key,pose,frame,scale).toDataURL()}
export function portraitData(key){return spriteData(key,'idle',0,5)}
