// Original game dramatization, not a historical reconstruction.
import {MAPS as PREVIOUS_MAPS,isWorld as previousWorld,isCamp as previousCamp,chapterNumber as previousChapter,musicForMap as previousMusic,nextObjective as previousObjective,retreatCamp as previousRetreat,questMarker as previousMarker} from './chapter-three.js?v=12.3';
export {CHAPTER_TWO_ENEMIES,SECOND_KINDS,CHAPTER_THREE_ENEMIES,THIRD_KINDS,THIRD_MAPS} from './chapter-three.js?v=12.3';
function field(width,height){const rows=Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>x===0||y===0||x===width-1||y===height-1?'#':'.'));return {put(x,y,ch){rows[y][x]=ch;},rect(x,y,w,h,ch){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)rows[yy][xx]=ch;},finish(){return rows.map(r=>r.join(''));}};}
const road=field(28,16);road.rect(2,2,5,3,'T');road.rect(10,9,3,3,'T');road.rect(20,2,4,3,'T');road.rect(5,11,17,1,'R');road.rect(15,5,1,7,'R');road.rect(15,9,10,1,'R');road.rect(21,11,1,2,'R');road.put(5,11,'K');road.put(15,5,'O');road.put(24,9,'Q');road.put(21,12,'Y');
const grain=field(16,16);grain.rect(7,5,2,11,'R');grain.rect(2,2,3,2,'T');grain.rect(11,2,3,2,'T');grain.put(8,15,'.');
const gate=field(16,16);gate.rect(1,2,14,12,'c');gate.rect(6,1,4,2,'G');gate.put(8,15,'.');
function camp(name,npc,point){const m=structuredClone(PREVIOUS_MAPS.jiangxia);delete m.navalObjects;m.rows=m.rows.map((r,y)=>y>0&&y<m.height-1?r.slice(0,1)+r.slice(1,-1).replace(/[.R]/g,'c')+r.slice(-1):r);for(const y of [7,8])for(const x of [2,3,12,13])m.rows[y]=m.rows[y].slice(0,x)+'T'+m.rows[y].slice(x+1);return {...m,name,npcs:[...m.npcs.filter(n=>['merchant','innkeeper'].includes(n.id)),npc],exit:{x:8,y:11,to:'jingworld',toX:point.x,toY:point.y},landmarks:[{x:4.5,y:2,name:'軍需所'},{x:10.5,y:2,name:'客棧'},{x:8,y:6,name:'軍議堂'},{x:8,y:11,name:'荊南古道'}],jingnanObjects:[{x:7,y:5,tile:0,size:2},{x:2,y:7,tile:3,size:2},{x:12,y:7,tile:3,size:2}]};}
export const FOURTH_MAPS={
 jingcamp:camp('江陵軍議營地',{x:8,y:7,id:'kongmingNpc',name:'孔明',dialog:['荊南百姓盼望安定。先保全糧道，再往長沙交涉。']},{x:5,y:11}),
 jingworld:{name:'荊南古道',kind:'world',width:28,height:16,start:{x:5,y:11},rows:road.finish(),points:{K:{name:'江陵軍議營地',to:'jingcamp'},O:{name:'桂陽糧站',to:'grainpost'},Q:{name:'長沙城門',to:'changshagate'},Y:{name:'長沙軍府',to:'changshatown'}},npcs:[]},
 grainpost:{name:'桂陽糧站',kind:'battlefield',width:16,height:16,start:{x:8,y:14},rows:grain.finish(),exit:{x:8,y:15,to:'jingworld',toX:15,toY:5},npcs:[{x:8,y:6,id:'grainOfficer',name:'糧官',dialog:['糧隊平安抵達，百姓的糧食已有著落。']}],landmarks:[{x:4,y:4,name:'桂陽糧車'},{x:8,y:15,name:'古道出口'}],jingnanObjects:[{x:3,y:3,tile:1,size:2},{x:10,y:5,tile:1,size:2}]},
 changshagate:{name:'長沙城門',kind:'battlefield',width:16,height:16,start:{x:8,y:14},rows:gate.finish(),exit:{x:8,y:15,to:'jingworld',toX:24,toY:9},npcs:[{x:8,y:6,id:'huangzhongNpc',name:'黃忠',dialog:['長沙百姓不可再受兵火。諸位的誠意，老夫已見。']}],landmarks:[{x:7.5,y:2,name:'長沙關門'},{x:8,y:15,name:'古道出口'}],jingnanObjects:[{x:6,y:2,tile:2,size:3}]},
 changshatown:camp('長沙軍府',{x:8,y:7,id:'huangzhongNpc',name:'黃忠',dialog:['護糧安民，才是守城之道。長沙軍府已備妥軍需，諸位可在此整軍。']},{x:21,y:12})
};
export const MAPS={...PREVIOUS_MAPS,...FOURTH_MAPS};
export const FOURTH_KINDS=['jingPatrol','supplyEscort','changsha'];
export const CHAPTER_FOUR_ENEMIES={huangzhong:{name:'黃忠',maxHp:14500,atk:112,def:88,int:68,agi:76,exp:500,gold:680,archetype:'huangzhong'}};
export const isWorld=map=>previousWorld(map)||MAPS[map]?.kind==='world';
export const isCamp=map=>previousCamp(map)||['jingcamp','changshatown'].includes(map);
export const chapterNumber=s=>s.story.stage>=15?4:previousChapter(s);
export const musicForMap=s=>s.story.stage>=15?(isWorld(s.map)||MAPS[s.map]?.kind==='battlefield'?'world':'town'):previousMusic(s);
export const retreatCamp=s=>s.story.stage>=19?'changshatown':s.story.stage>=15?'jingcamp':previousRetreat(s);
export const questMarker=s=>s.story.stage>=15?(s.story.stage===15?'K':s.story.stage===16?'O':s.story.stage<19?'Q':null):previousMarker(s);
export function nextObjective(s){if(s.story.stage<15)return previousObjective(s);const m=MAPS[s.map];if(s.map==='jingworld'){const ch=questMarker(s);for(let y=0;y<m.height;y++){const x=m.rows[y].indexOf(ch);if(ch&&x>=0)return {x,y};}}if(s.map==='jingcamp'&&s.story.stage===15)return {x:8,y:8};if(s.map==='grainpost'&&s.story.stage===16)return {x:8,y:7};if(s.map==='changshagate'&&[17,18].includes(s.story.stage))return {x:8,y:7};return m.exit?{x:m.exit.x,y:m.exit.y}:null;}
