const PALETTES={
  zhaoyun:{armor:'#4a70bd',dark:'#263f78',trim:'#eef5ff',skin:'#efc79e',hair:'#dce8f7',accent:'#78d5ff',weapon:'#dbe8f5'},
  kongming:{armor:'#6750a3',dark:'#352b61',trim:'#eee1c5',skin:'#efc9a4',hair:'#242b3a',accent:'#83d9ff',weapon:'#d4bb70'},
  officer:{armor:'#824651',dark:'#45272e',trim:'#d3aa48',skin:'#d3a078',hair:'#202127',accent:'#dbe4ee',weapon:'#dbe4ee'},
  scout:{armor:'#5d704b',dark:'#35412d',trim:'#9a7648',skin:'#cd9d73',hair:'#24252a',accent:'#d2dbe4',weapon:'#d0d9e2'},
  merchant:{armor:'#b16a3d',dark:'#6b3f28',trim:'#efd07a',skin:'#e0ad82',hair:'#3a281f',accent:'#f4e7bf',weapon:'#8b6845'},
  citizen:{armor:'#788b58',dark:'#455334',trim:'#d7c383',skin:'#dda980',hair:'#3a2b24',accent:'#e9dbc2',weapon:'#9d805f'},
  villager:{armor:'#6e8757',dark:'#405036',trim:'#d8bd78',skin:'#dea980',hair:'#473029',accent:'#e8d9bc',weapon:'#9c784b'}
};
function r(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(x,y,w,h)}
function p(c,pts,col){c.fillStyle=col;c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.closePath();c.fill()}
export function worldSpriteCanvas(key='scout',frame=0){
  const q=PALETTES[key]||PALETTES.scout,cv=document.createElement('canvas');cv.width=40;cv.height=48;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;const bob=frame%2;
  r(c,8,43,24,3,'#0005');r(c,11,46,18,1,'#0003');
  p(c,[[12,20+bob],[7,24+bob],[5,36],[13,34],[9,42],[18,37]],q.dark);
  r(c,13,34,7,9,q.dark);r(c,22,34,7,9,q.dark);r(c,11,41,10,4,'#24201f');r(c,22,41,10,4,'#24201f');
  r(c,11,20+bob,19,16,q.armor);r(c,13,22+bob,15,5,q.dark);r(c,14,27+bob,13,4,q.trim);r(c,17,23+bob,7,6,q.accent);
  r(c,7,22+bob,6,8,q.armor);r(c,29,22+bob,5,8,q.armor);r(c,8,23+bob,3,3,q.trim);r(c,30,23+bob,3,3,q.trim);
  r(c,13,8+bob,15,12,q.skin);r(c,12,5+bob,17,6,q.hair);r(c,14,11+bob,3,2,'#222831');r(c,23,11+bob,3,2,'#222831');r(c,18,17+bob,5,1,'#75453b');
  if(key==='zhaoyun'){
    r(c,11,5+bob,19,3,q.trim);p(c,[[17,5+bob],[20,0+bob],[23,5+bob]],q.accent);p(c,[[22,2+bob],[31,0+bob],[27,5+bob],[34,5+bob],[27,8+bob]],q.hair);
    c.strokeStyle='#795b36';c.lineWidth=2;c.beginPath();c.moveTo(31,34);c.lineTo(38,9);c.stroke();p(c,[[36,7],[39,9],[37,14],[34,11]],q.weapon);r(c,34,12,3,2,q.accent);
  }else if(key==='kongming'){
    r(c,8,5+bob,25,4,q.hair);r(c,14,2+bob,13,4,q.hair);p(c,[[27,3+bob],[37,6+bob],[29,9+bob]],q.trim);
    r(c,5,25+bob,8,9,q.trim);p(c,[[29,24+bob],[38,18+bob],[38,31+bob],[31,35+bob]],q.trim);c.strokeStyle='#9b783f';c.lineWidth=1;for(let x=31;x<38;x+=2){c.beginPath();c.moveTo(31,33+bob);c.lineTo(x,21+bob);c.stroke()}
  }else if(key==='officer'){
    r(c,11,5+bob,19,3,q.trim);p(c,[[18,5+bob],[21,0+bob],[24,5+bob]],'#c94d5a');c.strokeStyle='#795b36';c.lineWidth=2;c.beginPath();c.moveTo(31,34);c.lineTo(37,10);c.stroke();p(c,[[35,8],[39,10],[36,15],[33,12]],q.weapon);
  }else if(key==='merchant'){
    r(c,10,5+bob,21,3,q.trim);r(c,9,3+bob,23,3,q.dark);r(c,31,24,6,10,q.weapon);r(c,33,22,2,2,q.trim);
  }else{
    r(c,11,5+bob,19,3,q.trim);c.strokeStyle='#806039';c.lineWidth=2;c.beginPath();c.moveTo(30,36);c.lineTo(36,11);c.stroke();p(c,[[34,9],[38,11],[35,15],[32,12]],q.weapon);
  }
  return cv;
}
