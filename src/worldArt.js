const PALETTES={
  zhaoyun:{armor:'#4f77c8',dark:'#263f78',trim:'#f3f7ff',skin:'#efc79e',hair:'#e2edf8',accent:'#7ad9ff',weapon:'#e8f2ff',cape:'#355b9a'},
  kongming:{armor:'#6d56aa',dark:'#352b61',trim:'#f0e4ca',skin:'#efc9a4',hair:'#252c3c',accent:'#8addff',weapon:'#d8bd72',cape:'#514183'},
  officer:{armor:'#874955',dark:'#45272e',trim:'#d6ae4a',skin:'#d3a078',hair:'#202127',accent:'#e5edf7',weapon:'#e5edf7',cape:'#673640'},
  scout:{armor:'#61774e',dark:'#35412d',trim:'#a47b49',skin:'#cd9d73',hair:'#24252a',accent:'#dbe5ee',weapon:'#d9e2eb',cape:'#4b5d3d'},
  merchant:{armor:'#b56c3e',dark:'#6b3f28',trim:'#f1d27b',skin:'#e0ad82',hair:'#3a281f',accent:'#fff0c8',weapon:'#8b6845',cape:'#8d522f'},
  citizen:{armor:'#7d915c',dark:'#455334',trim:'#dcc989',skin:'#dda980',hair:'#3a2b24',accent:'#eee0c7',weapon:'#9d805f',cape:'#5d6d45'},
  villager:{armor:'#718b59',dark:'#405036',trim:'#dec37d',skin:'#dea980',hair:'#473029',accent:'#ecdec1',weapon:'#9c784b',cape:'#526743'}
};
function r(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(x,y,w,h)}
function p(c,pts,col){c.fillStyle=col;c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.closePath();c.fill()}
function line(c,x1,y1,x2,y2,col,w=2){c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke()}
export function worldSpriteCanvas(key='scout',frame=0){
  const q=PALETTES[key]||PALETTES.scout,cv=document.createElement('canvas');cv.width=64;cv.height=80;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;const bob=frame%2;
  c.globalAlpha=.22;c.fillStyle='#000';c.beginPath();c.ellipse(32,73,20,5,0,0,Math.PI*2);c.fill();c.globalAlpha=1;
  p(c,[[22,32+bob],[13,37+bob],[10,58],[23,55],[17,68],[31,60]],q.cape||q.dark);
  r(c,21,54,10,14,q.dark);r(c,35,54,10,14,q.dark);r(c,18,66,15,6,'#29211e');r(c,34,66,15,6,'#29211e');r(c,21,57,3,8,'#64718b');r(c,39,57,3,8,'#64718b');
  p(c,[[19,31+bob],[26,27+bob],[43,28+bob],[49,35+bob],[46,55],[19,55],[14,40]],q.armor);
  r(c,23,33+bob,21,7,q.dark);r(c,25,41+bob,17,7,q.trim);r(c,29,34+bob,9,10,q.accent);r(c,20,50,25,4,q.trim);
  p(c,[[17,33+bob],[10,36+bob],[8,46],[15,47],[23,38]],q.armor);p(c,[[46,33+bob],[54,36+bob],[56,46],[49,47],[41,38]],q.armor);r(c,10,38+bob,6,5,q.skin);r(c,49,38+bob,6,5,q.skin);r(c,11,34+bob,5,4,q.trim);r(c,49,34+bob,5,4,q.trim);
  r(c,27,27+bob,10,5,q.skin);p(c,[[22,12+bob],[27,8+bob],[41,9+bob],[46,15+bob],[44,28+bob],[38,32+bob],[27,31+bob],[20,25+bob]],q.skin);
  p(c,[[20,13+bob],[26,6+bob],[40,6+bob],[48,13+bob],[43,17+bob],[37,13+bob],[27,13+bob],[21,19+bob]],q.hair);
  r(c,27,19+bob,3,3,'#222831');r(c,38,19+bob,3,3,'#222831');r(c,31,26+bob,7,2,'#78473c');
  if(key==='zhaoyun'){
    r(c,20,8+bob,27,4,q.trim);p(c,[[29,8+bob],[34,0+bob],[38,8+bob]],q.accent);p(c,[[36,3+bob],[50,0+bob],[45,7+bob],[56,7+bob],[44,12+bob]],q.hair);
    line(c,49,58,61,13,'#795b36',3);p(c,[[58,8],[64,12],[60,20],[55,15]],q.weapon);r(c,55,20,6,3,q.accent);
  }else if(key==='kongming'){
    r(c,15,8+bob,36,5,q.hair);r(c,24,2+bob,20,7,q.hair);p(c,[[43,4+bob],[61,9+bob],[47,14+bob]],q.trim);
    p(c,[[49,35+bob],[62,24+bob],[62,45+bob],[52,52+bob]],q.trim);for(let x=51;x<62;x+=3)line(c,51,49+bob,x,28+bob,'#9b783f',1);
  }else if(key==='officer'){
    r(c,20,8+bob,28,4,q.trim);p(c,[[30,8+bob],[34,0+bob],[38,8+bob]],'#ca4e5b');line(c,49,57,61,14,'#795b36',3);p(c,[[58,9],[64,13],[60,21],[55,16]],q.weapon);
  }else if(key==='merchant'){
    r(c,18,8+bob,31,4,q.trim);r(c,16,4+bob,35,5,q.dark);r(c,52,37,9,16,q.weapon);r(c,55,32,4,5,q.trim);r(c,51,44,10,3,'#5b402d');
  }else{
    r(c,20,8+bob,27,4,q.trim);line(c,48,59,60,15,'#806039',3);p(c,[[57,10],[63,14],[59,21],[54,16]],q.weapon);
  }
  r(c,23,36+bob,2,2,'#ffffff88');r(c,43,31+bob,2,3,'#ffffff55');r(c,25,15+bob,2,2,'#fff2');
  return cv;
}
