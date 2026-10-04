// Original dramatic adaptation for this game; not a claim of historical chronology.
import {MAPS as FIRST_MAPS} from '../data.js';
function field(width,height){const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x===0||y===0||x===width-1||y===height-1?'#':'.'));return {rows,put(x,y,ch){rows[y][x]=ch;},rect(x,y,w,h,ch){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)rows[yy][xx]=ch;},finish(){return rows.map(r=>r.join(''));}};}
const south=field(28,16);south.rect(1,7,26,2,'W');south.rect(11,7,2,2,'q');south.rect(4,2,4,2,'T');south.rect(19,3,4,2,'F');south.rect(18,12,5,2,'T');south.rect(7,9,1,3,'R');south.rect(7,10,5,1,'R');south.rect(11,5,1,5,'R');south.rect(11,5,5,1,'R');south.rect(12,9,12,1,'R');south.put(7,11,'C');south.put(15,5,'A');south.put(23,9,'D');
const road=field(16,16);road.rect(7,1,2,15,'R');road.rect(2,2,3,2,'T');road.rect(10,2,4,2,'F');road.rect(2,8,3,2,'T');road.rect(11,6,3,2,'F');road.rect(2,12,3,2,'F');road.put(8,15,'.');road.rect(4,6,4,1,'R');road.rect(8,11,4,1,'R');
const ferry=field(16,16);ferry.rect(1,5,14,2,'W');ferry.rect(7,5,2,2,'q');ferry.rect(7,7,2,9,'R');ferry.rect(7,1,2,4,'R');ferry.rect(3,2,2,2,'T');ferry.rect(11,2,2,2,'T');ferry.put(11,4,'d');ferry.put(8,15,'.');
function camp(name,npcs,exit){return {...structuredClone(FIRST_MAPS.xinye),name,kind:'camp',npcs,exit,landmarks:[{x:4.5,y:2,name:'軍需所'},{x:10.5,y:2,name:'客棧'},{x:8,y:6,name:'集結營'},{x:8,y:11,name:'南下古道'}]};}
const services=[{x:4,y:4,id:'merchant',name:'軍需商人',dialog:['軍糧與裝備已運抵。靠近北面的軍需所便可購買。']},{x:11,y:4,id:'innkeeper',name:'營地醫者',dialog:['先安頓傷兵，再整軍出發。']}];
export const MAPS={...FIRST_MAPS,
 refugecamp:camp('南撤營地',[...services,{x:8,y:7,id:'elder',name:'民長',dialog:['請先備妥兩份軍糧，再帶百姓上路。']}],{x:8,y:11,to:'southworld',toX:7,toY:11}),
 southworld:{name:'荊州南境',kind:'world',width:28,height:16,start:{x:7,y:11},rows:south.finish(),points:{C:{name:'南撤營地',to:'refugecamp'},A:{name:'長坂古道',to:'changban'},D:{name:'當陽渡口',to:'ferry'}},npcs:[]},
 changban:{name:'長坂古道',kind:'battlefield',width:16,height:16,start:{x:8,y:14},exit:{x:8,y:15,to:'southworld',toX:15,toY:5},rows:road.finish(),npcs:[{x:4,y:5,id:'westFamily',name:'西路百姓',rescue:'west',dialog:['多謝將軍，我們這就沿古道往渡口去。']},{x:11,y:10,id:'eastFamily',name:'東路百姓',rescue:'east',dialog:['糧車與傷者都已安頓，渡口見。']}],landmarks:[{x:4,y:5,name:'西路糧車'},{x:11,y:10,name:'東路傷者'},{x:8,y:15,name:'南境出口'}]},
 ferry:{name:'當陽渡口',kind:'battlefield',width:16,height:16,start:{x:8,y:14},exit:{x:8,y:15,to:'southworld',toX:23,toY:9},rows:ferry.finish(),npcs:[{x:8,y:8,id:'ferrymaster',name:'渡頭老翁',dialog:['渡船已備妥，請先接應古道上的兩路百姓。']}],landmarks:[{x:11,y:4,name:'渡船'},{x:7.5,y:6,name:'長坂河橋'},{x:8,y:15,name:'南境出口'}]},
 jiangxia:camp('江夏營地',[...services,{x:8,y:7,id:'kongmingNpc',name:'孔明',dialog:['百姓已平安渡河。先在江夏休整，兩章旅程的進度都已保存。']}],{x:8,y:11,to:'southworld',toX:23,toY:9})
};
export const CHAPTER_TWO_ENEMIES={caochun:{name:'曹純',maxHp:16000,atk:102,def:86,int:66,agi:86,exp:380,gold:420,archetype:'caochun'}};
export const SECOND_KINDS=['pursuit','rescueWest','rescueEast','bridge'];
export const isWorld=map=>MAPS[map]?.kind==='world';
export const isCamp=map=>['xinye','refugecamp','jiangxia'].includes(map);
export const chapterNumber=s=>s.story.stage>=5?2:1;
export const musicForMap=s=>isWorld(s.map)||MAPS[s.map]?.kind==='battlefield'?'world':'town';
export function nextObjective(s){const st=s.story.stage,m=MAPS[s.map];
 if(s.map==='southworld'){const ch=st===5?'C':st===6?'A':'D';for(let y=0;y<m.height;y++){const x=m.rows[y].indexOf(ch);if(x>=0)return {x,y};}}
 if(s.map==='refugecamp'&&st===5)return {x:8,y:8};
 if(s.map==='changban'&&st===6)return s.story.rescued.includes('west')?{x:11,y:11}:{x:4,y:6};
 if(s.map==='ferry'&&st>=7&&st<9)return {x:8,y:9};
 return m.exit?{x:m.exit.x,y:m.exit.y}:null;
}
