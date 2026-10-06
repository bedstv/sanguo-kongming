// Original fifth-chapter dramatization; not a historical battle reconstruction.
import {MAPS as PREVIOUS_MAPS,isWorld as previousWorld,isCamp as previousCamp,chapterNumber as previousChapter,musicForMap as previousMusic,nextObjective as previousObjective,retreatCamp as previousRetreat,questMarker as previousMarker} from './chapter-four.js?v=12.4';
export {CHAPTER_TWO_ENEMIES,SECOND_KINDS,CHAPTER_THREE_ENEMIES,THIRD_KINDS,THIRD_MAPS,CHAPTER_FOUR_ENEMIES,FOURTH_KINDS,FOURTH_MAPS} from './chapter-four.js?v=12.4';
function field(w,h){const rows=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>x===0||y===0||x===w-1||y===h-1?'#':'.'));return {rect(x,y,w,h,ch){for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]=ch;},put(x,y,ch){rows[y][x]=ch;},finish(){return rows.map(r=>r.join(''));}};}
const road=field(28,16);road.rect(2,2,5,3,'T');road.rect(18,2,5,2,'T');road.rect(4,10,21,1,'R');road.rect(4,10,1,3,'R');road.rect(12,4,1,7,'R');road.rect(12,4,4,1,'R');road.rect(21,6,1,5,'R');road.rect(21,6,4,1,'R');road.put(4,12,'K');road.put(15,4,'U');road.put(24,10,'O');road.put(24,6,'Q');
function camp(name,complete=false){const m=structuredClone(PREVIOUS_MAPS.changshatown);return {...m,name,npcs:[...m.npcs.filter(n=>['merchant','innkeeper'].includes(n.id)),{x:8,y:7,id:'kongmingNpc',name:'孔明',dialog:[complete?'城門、烽火與糧道皆已安定。先安置百姓，再議下一段旅程。':'烽火臺與北岸糧道都須接應，兩路可任選先後。']}],exit:{x:8,y:11,to:'fortworld',toX:4,toY:12},landmarks:[{x:4.5,y:2,name:'軍需所'},{x:10.5,y:2,name:'客棧'},{x:8,y:6,name:complete?'安民軍府':'回防軍議'},{x:8,y:11,name:'北岸古道'}]};}
const beacon=structuredClone(PREVIOUS_MAPS.windaltar);beacon.npcs=[{x:8,y:4,id:'officer',name:'烽火校尉',defense:'beacon',dialog:['烽火旗號已傳至江陵，各營可互相接應。']}];beacon.landmarks=[{x:7.5,y:2,name:'烽火臺'},{x:8,y:15,name:'北岸出口'}];beacon.exit={x:8,y:15,to:'fortworld',toX:15,toY:4};
const convoy=structuredClone(PREVIOUS_MAPS.grainpost);convoy.npcs=[{x:8,y:6,id:'convoyCaptain',name:'糧隊領隊',defense:'convoy',dialog:['糧車已抵江陵，傷兵與百姓都有了口糧。']}];convoy.landmarks=[{x:4,y:4,name:'北岸糧隊'},{x:8,y:15,name:'北岸出口'}];convoy.exit={x:8,y:15,to:'fortworld',toX:24,toY:10};
const gate=structuredClone(PREVIOUS_MAPS.changshagate);gate.npcs=[{x:8,y:6,id:'officer',name:'守城校尉',dialog:['魏軍將至，請先完成烽火與糧道兩路準備。']}];gate.landmarks=[{x:7.5,y:2,name:'江陵城門'},{x:8,y:15,name:'北岸出口'}];gate.exit={x:8,y:15,to:'fortworld',toX:24,toY:6};
export const FIFTH_MAPS={
 jianglingfort:camp('江陵回防營地'),
 fortworld:{name:'江陵北岸',kind:'world',width:28,height:16,start:{x:4,y:12},rows:road.finish(),points:{K:{name:'江陵回防營地',to:'jianglingfort'},U:{name:'北岸烽火臺',to:'beaconpost'},O:{name:'北岸糧道',to:'convoypost'},Q:{name:'江陵城門',to:'jianglinggate'}},npcs:[]},
 beaconpost:{...beacon,name:'北岸烽火臺'},convoypost:{...convoy,name:'北岸糧道'},jianglinggate:{...gate,name:'江陵城門'},forttown:camp('江陵安民軍府',true)
};
export const MAPS={...PREVIOUS_MAPS,...FIFTH_MAPS};
export const FIFTH_KINDS=['fortPatrol','signalDefense','convoyDefense','jianglingSiege'];
export const isWorld=map=>previousWorld(map)||MAPS[map]?.kind==='world';
export const isCamp=map=>previousCamp(map)||['jianglingfort','forttown'].includes(map);
export const chapterNumber=s=>s.story.stage>=20?5:previousChapter(s);
export const musicForMap=s=>s.story.stage>=20?(isWorld(s.map)||MAPS[s.map]?.kind==='battlefield'?'world':'town'):previousMusic(s);
export const retreatCamp=s=>s.story.stage>=24?'forttown':s.story.stage>=20?'jianglingfort':previousRetreat(s);
export const questMarker=s=>s.story.stage>=20?(s.story.stage===20?'K':s.story.stage===21?(s.story.defensePlans?.includes('beacon')?'O':'U'):s.story.stage<24?'Q':null):previousMarker(s);
export function nextObjective(s){if(s.story.stage<20)return previousObjective(s);const m=MAPS[s.map];if(s.map==='fortworld'){const ch=questMarker(s);for(let y=0;y<m.height;y++){const x=m.rows[y].indexOf(ch);if(ch&&x>=0)return {x,y};}}if(s.map==='jianglingfort'&&s.story.stage===20)return {x:8,y:8};if(s.map==='beaconpost'&&s.story.stage===21&&!s.story.defensePlans.includes('beacon'))return {x:8,y:5};if(s.map==='convoypost'&&s.story.stage===21&&!s.story.defensePlans.includes('convoy'))return {x:8,y:7};if(s.map==='jianglinggate'&&[22,23].includes(s.story.stage))return {x:8,y:7};return m.exit?{x:m.exit.x,y:m.exit.y}:null;}
