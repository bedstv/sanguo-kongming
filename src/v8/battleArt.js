const CFG={
  liubei:{name:'劉備',skin:'#e6b37e',hair:'#2a1b16',main:'#2f744f',dark:'#163c2b',trim:'#d9b44a',metal:'#dce7ef',accent:'#315a43',weapon:'sword',head:'crown',cape:'#244f3b'},
  guanyu:{name:'關羽',skin:'#ca8f63',hair:'#241714',main:'#236a43',dark:'#123725',trim:'#d6a83b',metal:'#e6e7dc',accent:'#b63238',weapon:'guandao',head:'guan',cape:'#194e35',beard:'long'},
  zhangfei:{name:'張飛',skin:'#b77f5a',hair:'#171719',main:'#70333a',dark:'#3b1c22',trim:'#c97a2f',metal:'#cfd7df',accent:'#241f29',weapon:'spear',head:'horn',cape:'#4a252a',beard:'wide'},
  zhaoyun:{name:'趙雲',skin:'#e8bf91',hair:'#e7edf4',main:'#496fb5',dark:'#253e73',trim:'#edf3f8',metal:'#f4f7fb',accent:'#77c7e8',weapon:'spear',head:'silver',cape:'#365d9b'},
  kongming:{name:'孔明',skin:'#ebc49e',hair:'#252a37',main:'#66529e',dark:'#352b5b',trim:'#eee2c8',metal:'#d9c27c',accent:'#7ed7ef',weapon:'fan',head:'scholar',cape:'#4e4078'},
  scout:{name:'魏軍斥候',skin:'#c99970',hair:'#242426',main:'#66784e',dark:'#36412d',trim:'#9d7748',metal:'#cfd7df',accent:'#4d5a41',weapon:'spear',head:'cap',cape:'#48573a'},
  pikeman:{name:'魏軍槍兵',skin:'#c99a72',hair:'#232427',main:'#765348',dark:'#40302c',trim:'#79865b',metal:'#d3dbe3',accent:'#5d433b',weapon:'spear',head:'cap',cape:'#5a443b'},
  archer:{name:'魏軍弓手',skin:'#c99a72',hair:'#232427',main:'#67564b',dark:'#37302d',trim:'#71844e',metal:'#c9964e',accent:'#51453d',weapon:'bow',head:'cap',cape:'#4b4039'},
  officer:{name:'魏軍校尉',skin:'#cc9a72',hair:'#1f2023',main:'#824451',dark:'#44272e',trim:'#d6ad49',metal:'#e0e5eb',accent:'#3e4554',weapon:'sword',head:'crest',cape:'#61323c'},
  caoren:{name:'曹仁',skin:'#d0a078',hair:'#20242b',main:'#465f89',dark:'#263957',trim:'#d4dbe4',metal:'#e4e9ee',accent:'#b38a3f',weapon:'sword',head:'helm',cape:'#334b70',shield:true},
  zhanghe:{name:'張郃',skin:'#d0a078',hair:'#202126',main:'#694b87',dark:'#3b2c51',trim:'#d04e5b',metal:'#e0e6ec',accent:'#c45e70',weapon:'spear',head:'crest',cape:'#4b3863'},
  xiahoudun:{name:'夏侯惇',skin:'#cf9a70',hair:'#16181b',main:'#85323d',dark:'#481e25',trim:'#272c35',metal:'#e3e7eb',accent:'#c43b48',weapon:'blade',head:'black',cape:'#642831',beard:'short',eyepatch:true}
};
const esc=s=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);
const r=(x,y,w,h,c,rx=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}"${rx?` rx="${rx}"`:''} fill="${c}"/>`;
const p=(pts,c)=>`<polygon points="${pts}" fill="${c}"/>`;
const l=(x1,y1,x2,y2,c,w=2)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="square"/>`;
const c=(x,y,rr,col)=>`<circle cx="${x}" cy="${y}" r="${rr}" fill="${col}"/>`;
function headgear(q){
  if(q.head==='crown')return p('31,21 35,10 41,18 47,7 53,18 59,10 63,22',q.trim)+r(32,20,30,5,q.trim);
  if(q.head==='guan')return r(31,18,31,6,q.main)+p('35,19 40,9 45,17 50,8 56,18 61,13 62,23',q.trim)+p('47,11 51,1 55,13',q.trim);
  if(q.head==='horn')return r(31,18,31,6,q.trim)+p('31,20 23,13 27,25',q.trim)+p('61,20 69,13 65,25',q.trim)+p('44,18 48,8 52,18',q.accent);
  if(q.head==='silver')return r(30,18,33,6,q.trim)+p('36,19 47,7 58,19',q.accent)+p('49,8 61,2 57,12 68,11 57,18',q.hair);
  if(q.head==='scholar')return r(27,17,39,6,q.hair)+r(36,10,22,8,q.hair)+p('56,12 73,15 59,22',q.trim);
  if(q.head==='crest')return r(30,18,33,6,q.trim)+p('42,18 47,5 52,18',q.accent)+p('50,12 61,8 56,18',q.accent);
  if(q.head==='helm')return r(29,18,35,7,q.main)+p('35,19 47,7 59,19',q.trim)+r(27,23,39,5,q.dark);
  if(q.head==='black')return r(29,18,35,7,q.dark)+p('36,19 47,7 58,19',q.trim)+p('47,8 54,0 59,11',q.accent);
  return r(31,19,31,5,q.trim)+p('39,19 47,11 55,19',q.dark);
}
function face(q,pose){let out=p('34,24 59,24 63,38 56,49 38,49 31,38',q.skin)+p('31,24 37,17 57,17 64,24 57,28 38,27',q.hair);out+=r(38,33,4,3,'#171b20')+r(52,33,4,3,'#171b20')+r(43,42,10,2,'#74463a');if(q.eyepatch)out+=r(50,31,8,4,'#0d0e10')+l(48,29,61,39,'#0d0e10',2);if(q.beard==='long')out+=p('38,43 57,43 58,60 52,72 47,78 42,71 36,58',q.hair)+p('41,47 46,57 43,68',q.trim);if(q.beard==='wide')out+=p('33,42 61,42 58,57 48,63 37,56',q.hair);if(q.beard==='short')out+=p('39,44 56,44 54,56 48,60 41,55',q.hair);return headgear(q)+out}
function body(q,pose,frame){const lean=pose==='attack'?(frame===1?5:2):pose==='hurt'?-3:0;let out='';out+=p(`${24+lean},54 ${35+lean},48 ${58+lean},48 ${70+lean},56 ${66+lean},92 ${29+lean},92 ${20+lean},67`,q.cape||q.dark);out+=p(`${31+lean},52 ${61+lean},52 ${69+lean},82 ${61+lean},94 ${33+lean},94 ${25+lean},80`,q.main);out+=p(`${38+lean},54 ${55+lean},54 ${61+lean},81 ${54+lean},87 ${37+lean},86 ${31+lean},68`,q.dark);out+=r(35+lean,61,23,6,q.trim)+r(40+lean,69,13,13,q.accent)+r(33+lean,86,29,5,q.trim);out+=p(`${26+lean},58 ${16+lean},64 ${15+lean},78 ${23+lean},80 ${34+lean},68`,q.main)+p(`${66+lean},58 ${77+lean},64 ${78+lean},78 ${69+lean},80 ${58+lean},68`,q.main);out+=r(17+lean,72,9,6,q.skin)+r(68+lean,72,9,6,q.skin);out+=p(`${35+lean},92 ${45+lean},92 ${43+lean},116 ${31+lean},116`,q.dark)+p(`${51+lean},92 ${61+lean},92 ${66+lean},116 ${54+lean},116`,q.dark)+r(28+lean,113,17,6,'#211b19')+r(54+lean,113,17,6,'#211b19');
  if(q.shield){out+=c(74+lean,73,17,'#283b5c')+c(74+lean,73,12,'#506b95')+r(70+lean,59,7,28,'#d9b65a')+c(74+lean,73,4,'#d9b65a')}
  return out;
}
function weapon(q,pose,frame){const atk=pose==='attack';if(q.weapon==='guandao'){if(atk&&frame===1)return l(18,87,86,34,'#7b5a31',5)+p('77,22 94,29 86,44 72,40',q.accent)+p('78,25 90,29 83,35',q.metal);return l(24,96,75,29,'#7b5a31',5)+p('66,18 87,24 78,40 61,36',q.accent)+p('68,21 82,24 75,31',q.metal)}if(q.weapon==='spear'){if(atk&&frame===1)return l(16,83,91,57,'#765335',4)+p('87,49 96,55 89,64 81,58',q.metal);return l(24,101,76,23,'#765335',4)+p('72,15 81,21 75,30 67,24',q.metal)}if(q.weapon==='sword'||q.weapon==='blade'){if(atk&&frame===1)return p('58,70 91,45 95,50 64,78',q.metal)+r(55,74,16,5,q.trim);return p('62,87 78,37 84,40 69,91',q.metal)+r(60,86,16,5,q.trim)}if(q.weapon==='fan'){const y=pose==='cast'?35:55;return p(`65,68 89,${y} 91,72 70,85`,q.trim)+l(72,81,85,y+8,'#9b783e',2)+l(77,82,88,y+14,'#9b783e',2)+l(69,78,82,y+4,'#9b783e',2)}if(q.weapon==='bow'){return `<path d="M70 42 Q92 64 70 91" fill="none" stroke="${q.trim}" stroke-width="4"/>${l(70,42,70,91,q.metal,2)}${atk&&frame===1?l(52,66,94,66,q.metal,2):''}`;}return ''}
function effect(q,pose,frame){if(pose==='cast')return c(79,28,frame?10:6,q.accent)+c(79,28,frame?5:3,'#fff9');if(pose==='attack'&&frame===1)return `<path d="M20 93 Q58 25 91 43" fill="none" stroke="${q.accent}" stroke-width="5" opacity=".82"/><path d="M24 94 Q60 34 89 48" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>`;if(pose==='hurt')return r(0,0,96,128,'#fff',0).replace('/>',' opacity=".12"/>');return ''}
export function battleSpriteData(key='scout',pose='idle',frame=0){const q=CFG[key]||CFG.scout;const bob=pose==='idle'?(frame%2?1:0):0;const transform=`translate(0 ${bob})`;const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="128" viewBox="0 0 96 128"><g shape-rendering="crispEdges" transform="${transform}"><ellipse cx="48" cy="121" rx="24" ry="5" fill="#0006"/>${body(q,pose,frame)}${face(q,pose)}${weapon(q,pose,frame)}${effect(q,pose,frame)}</g></svg>`;return esc(svg)}
export function battlePortraitData(key='liubei'){const q=CFG[key]||CFG.liubei;const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="112" height="112" viewBox="0 0 96 96"><rect width="96" height="96" fill="#080808"/><g transform="translate(0,-7)" shape-rendering="crispEdges">${p('18,64 31,51 64,51 78,64 72,96 24,96',q.main)}${p('28,58 67,58 61,82 34,82',q.dark)}${r(34,63,27,6,q.trim)}${face(q,'idle')}</g></svg>`;return esc(svg)}
