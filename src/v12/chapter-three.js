// Original game dramatization; the encounters and named commanders are not a historical reconstruction.
import {MAPS as PREVIOUS_MAPS,isWorld as previousWorld,isCamp as previousCamp,musicForMap as previousMusic,nextObjective as previousObjective} from './chapter-two.js?v=12.2';
export {CHAPTER_TWO_ENEMIES,SECOND_KINDS} from './chapter-two.js?v=12.2';
function field(width,height){const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x===0||y===0||x===width-1||y===height-1?'#':'.'));return {put(x,y,ch){rows[y][x]=ch;},rect(x,y,w,h,ch){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)rows[yy][xx]=ch;},finish(){return rows.map(r=>r.join(''));}};}
const river=field(28,16);river.rect(1,5,26,2,'W');river.rect(18,5,2,2,'q');river.rect(3,2,5,2,'T');river.rect(5,8,3,2,'T');river.rect(1,13,3,2,'F');river.rect(4,11,20,1,'R');river.rect(4,11,1,2,'R');river.rect(18,3,1,9,'R');river.rect(18,3,5,1,'R');river.rect(18,8,8,1,'R');river.rect(23,11,1,2,'R');river.put(4,12,'J');river.put(12,11,'U');river.put(22,3,'E');river.put(23,12,'V');river.put(25,8,'Z');
const altar=field(16,16);altar.rect(7,4,2,12,'R');altar.rect(7,2,2,2,'G');altar.rect(2,2,3,3,'T');altar.rect(11,7,3,2,'T');altar.rect(2,10,3,2,'F');altar.put(8,15,'.');
const yard=field(16,16);yard.rect(1,1,14,3,'W');yard.rect(4,4,8,5,'p');yard.rect(7,9,2,7,'R');yard.put(8,15,'.');
const cliffs=field(16,16);cliffs.rect(1,1,14,2,'W');cliffs.rect(1,3,14,12,'p');cliffs.put(8,15,'.');
const services=structuredClone(PREVIOUS_MAPS.jiangxia.npcs.filter(n=>['merchant','innkeeper'].includes(n.id)));
function camp(name,npcs,toX,toY){const rows=PREVIOUS_MAPS.jiangxia.rows.map((r,y)=>name==='江東水寨'&&y>0&&y<11?r.slice(0,12)+'WWW'+r.slice(15):r);return {...structuredClone(PREVIOUS_MAPS.jiangxia),name,npcs,rows,exit:{x:8,y:11,to:'riverworld',toX,toY},landmarks:[{x:4.5,y:2,name:'軍需所'},{x:10.5,y:2,name:'客棧'},{x:8,y:6,name:'水軍大帳'},{x:8,y:11,name:'江岸出口'}],navalObjects:[{x:8,y:6,tile:1,size:2},...(name==='江東水寨'?[{x:11,y:7,tile:0,size:2}]:[])]};}
export const THIRD_MAPS={
 alliedcamp:camp('江東水寨',[...services,{x:8,y:7,id:'zhouyu',name:'周瑜',dialog:['同心破敵，方可守住江東。']}],12,11),
 riverworld:{name:'赤壁江岸',kind:'world',width:28,height:16,start:{x:12,y:11},rows:river.finish(),points:{J:{name:'江夏營地',to:'jiangxia'},U:{name:'江東水寨',to:'alliedcamp'},E:{name:'東風祭壇',to:'windaltar'},V:{name:'火船工坊',to:'shipyard'},Z:{name:'赤壁登船口',to:'redcliffs'}},npcs:[]},
 windaltar:{name:'東風祭壇',kind:'battlefield',width:16,height:16,start:{x:8,y:14},rows:altar.finish(),exit:{x:8,y:15,to:'riverworld',toX:22,toY:3},npcs:[{x:8,y:4,id:'windkeeper',name:'觀風使',plan:'wind',dialog:['風向已穩，旗號將依軍師的約定升起。']}],landmarks:[{x:7.5,y:2,name:'觀風臺'},{x:8,y:15,name:'江岸出口'}],navalObjects:[{x:7,y:2,tile:2,size:2}]},
 shipyard:{name:'火船工坊',kind:'battlefield',width:16,height:16,start:{x:8,y:14},rows:yard.finish(),exit:{x:8,y:15,to:'riverworld',toX:23,toY:12},npcs:[{x:6,y:6,id:'shipwright',name:'造船師',plan:'ships',dialog:['蘆葦、油罐與引火船都已備妥，靜候軍令。']}],landmarks:[{x:4.5,y:4,name:'火船泊位'},{x:8,y:15,name:'江岸出口'}],navalObjects:[{x:4,y:4,tile:3,size:2}]},
 redcliffs:{name:'赤壁登船口',kind:'battlefield',width:16,height:16,start:{x:8,y:14},rows:cliffs.finish(),exit:{x:8,y:15,to:'riverworld',toX:25,toY:8},npcs:[{x:8,y:10,id:'zhouyuBattle',name:'周瑜',dialog:['尚待東風與火船準備，勿急於登船。']}],landmarks:[{x:7.5,y:3,name:'魏軍連環艦'},{x:8,y:15,name:'江岸出口'}]},
 jiangling:camp('江陵營地',[...services,{x:8,y:7,id:'kongmingNpc',name:'孔明',dialog:['赤壁戰事告一段落。三章的同心與謀略，皆已記在軍議之中。']}],4,12)
};
export const MAPS={...PREVIOUS_MAPS,...THIRD_MAPS};
export const CHAPTER_THREE_ENEMIES={xuhuang:{name:'徐晃',maxHp:12600,atk:104,def:86,int:70,agi:58,exp:420,gold:560,archetype:'xuhuang'}};
export const THIRD_KINDS=['navalPatrol','windward','fireships','redcliff'];
export const isWorld=map=>previousWorld(map)||MAPS[map]?.kind==='world';
export const isCamp=map=>previousCamp(map)||['alliedcamp','jiangling'].includes(map);
export const chapterNumber=s=>s.story.stage>=10?3:s.story.stage>=5?2:1;
export const musicForMap=s=>s.story.stage>=10?(isWorld(s.map)||MAPS[s.map]?.kind==='battlefield'?'world':'town'):previousMusic(s);
export const retreatCamp=s=>s.story.stage>=14?'jiangling':s.story.stage>=10?'alliedcamp':s.story.stage>=9?'jiangxia':s.story.stage>=5?'refugecamp':'xinye';
export const questMarker=s=>s.story.stage>=10?(s.story.stage===10?'U':s.story.stage===11?(s.story.plans.includes('wind')?'V':'E'):s.story.stage<14?'Z':null):s.story.stage===0?'L':s.story.stage===1?'X':s.story.stage<4?'B':s.story.stage===5?'C':s.story.stage===6?'A':s.story.stage<9?'D':null;
export function nextObjective(s){if(s.story.stage<10)return previousObjective(s);const m=MAPS[s.map];
 if(s.map==='riverworld'){const ch=questMarker(s);for(let y=0;y<m.height;y++){const x=m.rows[y].indexOf(ch);if(ch&&x>=0)return {x,y};}}
 if(s.map==='alliedcamp'&&s.story.stage===10)return {x:8,y:8};
 if(s.map==='windaltar'&&s.story.stage===11&&!s.story.plans.includes('wind'))return {x:8,y:5};
 if(s.map==='shipyard'&&s.story.stage===11&&!s.story.plans.includes('ships'))return {x:6,y:7};
 if(s.map==='redcliffs'&&[12,13].includes(s.story.stage))return {x:8,y:11};
 return m.exit?{x:m.exit.x,y:m.exit.y}:null;
}
