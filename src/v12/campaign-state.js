import {PARTY_TEMPLATE, ITEMS, ENEMIES, FORMATIONS} from '../data.js';
import {freshState} from './rules.js';
import {MAPS,CHAPTER_TWO_ENEMIES,SECOND_KINDS,CHAPTER_THREE_ENEMIES,THIRD_KINDS,THIRD_MAPS,CHAPTER_FOUR_ENEMIES,FOURTH_KINDS,FOURTH_MAPS,retreatCamp} from './chapter-four.js?v=12.4';

export const SAVE_KEY='sanguo-kongming-v12-campaign';
export const BACKUP_KEY=SAVE_KEY+'-backup';
export const LEGACY_KEY='sanguo-kongming-v5';
export const CHAPTERS=['臥龍出山','返回新野','博望設伏','火起博望','首戰告捷','南撤集結','長坂救援','渡口整軍','長坂守橋','江夏安民','孫劉盟約','借風備船','赤壁軍令','赤壁破陣','江陵安定','荊南軍議','桂陽護糧','長沙交涉','弓將決戰','長沙安民'];
export const OBJECTIVES=[
 '從南門出城，前往隆中草廬拜訪孔明。',
 '返回新野城，與孔明商議迎敵之策。',
 '在新野整備，前往東方博望坡迎擊先鋒。',
 '沿博望坡向北，迎戰夏侯惇與魏軍主力。',
 '博望首戰告捷。點「續章」接續長坂護民。',
 '靠近民長，備妥兩份軍糧，集結南撤百姓。',
 '前往長坂古道，接應西路糧車與東路傷者。',
 '兩路百姓已接應。前往當陽渡口，與渡頭老翁交談。',
 '前往當陽渡口守橋，撐過四回合讓百姓渡河。',
 '百姓平安渡河，第二章完成。點「續章」前往赤壁風起。',
 '在江東水寨與周瑜交談，商議孫劉盟約。',
 '完成東風祭壇與火船工坊兩路準備，可任選先後。',
 '東風與火船皆已備妥。前往赤壁登船口，與周瑜會合。',
 '登上連環艦，擊破徐晃與魏軍，完成赤壁決戰。',
 '赤壁大捷，第三章完成。點「續章」前往荊南定策。',
 '在江陵軍議營地與孔明交談，商議護糧安民。',
 '沿荊南古道前往桂陽糧站，接應糧官並護送糧隊。',
 '糧隊已平安抵達。前往長沙城門，與黃忠交涉。',
 '迎戰黃忠與長沙守軍，守住護糧安民的誠意。',
 '長沙已安，第四章完成。可在長沙軍府整軍與探索。'
];
export const walkable=ch=>!!ch&&!['#','W','T','F','N','S','I','H','P','G'].includes(ch);
export const tile=(s,x=s.x,y=s.y)=>MAPS[s.map]?.rows[y]?.[x]||'#';
export function newCampaign(){return {schema:12,version:'12.4',map:'xinye',x:8,y:9,gold:500,formation:'鶴翼',party:structuredClone(PARTY_TEMPLATE),inventory:{ration:4,spiritTea:2},story:{stage:0,longzhong:false,returned:false,vanguard:false,boss:false,clear:false,chapter2Started:false,rescued:[],chapter2Complete:false,chapter3Started:false,plans:[],chapter3Complete:false,chapter4Started:false,supplySecured:false,chapter4Complete:false},steps:0,encounter:{safeSteps:4,since:0,total:0},pending:null,savedAt:null};}
const num=(x,f,min=0,max=1e7)=>Number.isFinite(x)?Math.min(max,Math.max(min,Math.floor(x))):f;
export function normalizeCampaign(raw){
 if(!raw||typeof raw!=='object'||!Array.isArray(raw.party))return null;
 const s=newCampaign();
 s.gold=num(raw.gold,s.gold);s.formation=FORMATIONS[raw.formation]?raw.formation:s.formation;
 s.party=PARTY_TEMPLATE.map(base=>{
  const p=raw.party.find(p=>p?.id===base.id);if(!p)return structuredClone(base);
  const out={...base};for(const key of ['level','maxHp','maxSp','atk','def','int','agi'])out[key]=num(p[key],base[key],key==='maxSp'?0:1,key==='level'?99:100000);
  out.exp=num(p.exp,0);out.hp=num(p.hp,out.maxHp,0,out.maxHp);out.sp=num(p.sp,out.maxSp,0,out.maxSp);
  for(const slot of ['weapon','armor'])if(ITEMS[p[slot]]?.type===slot)out[slot]=p[slot];return out;
 });
 for(const id of Object.keys(ITEMS))s.inventory[id]=num(raw.inventory?.[id],s.inventory[id]||0,0,999);
 s.story.stage=num(raw.story?.stage,0,0,19);
 if(raw.story?.clear||raw.story?.boss)s.story.stage=Math.max(s.story.stage,4);
 else if(raw.story?.returned)s.story.stage=Math.max(s.story.stage,2);
 else if(raw.story?.longzhong)s.story.stage=Math.max(s.story.stage,1);
 s.story.rescued=[...new Set((Array.isArray(raw.story?.rescued)?raw.story.rescued:[]).filter(x=>['west','east'].includes(x)))];
 if(raw.story?.chapter2Complete)s.story.stage=Math.max(s.story.stage,9);
 if(raw.story?.chapter3Complete)s.story.stage=Math.max(s.story.stage,14);
 if(raw.story?.chapter4Complete)s.story.stage=19;
 if(raw.story?.supplySecured&&s.story.stage>=16)s.story.stage=Math.max(s.story.stage,17);
 s.story.plans=[...new Set((Array.isArray(raw.story?.plans)?raw.story.plans:[]).filter(x=>['wind','ships'].includes(x)))];
 if(s.story.stage<11)s.story.plans=[];
 if(s.story.stage===11&&s.story.plans.length===2)s.story.stage=12;
 if(s.story.stage>=12)s.story.plans=['wind','ships'];
 if(s.story.stage===6&&s.story.rescued.length===2)s.story.stage=7;
 if(s.story.stage<6)s.story.rescued=[];
 if(s.story.stage>=7)s.story.rescued=['west','east'];
 Object.assign(s.story,{longzhong:s.story.stage>=1,returned:s.story.stage>=2,vanguard:s.story.stage>=3,boss:s.story.stage>=4,clear:s.story.stage>=4});
 s.story.chapter2Started=s.story.stage>=5;s.story.chapter2Complete=s.story.stage>=9;s.story.chapter3Started=s.story.stage>=10;s.story.chapter3Complete=s.story.stage>=14;s.story.chapter4Started=s.story.stage>=15;s.story.supplySecured=s.story.stage>=17;s.story.chapter4Complete=s.story.stage===19;
 if(MAPS[raw.map])s.map=raw.map;
 s.x=num(raw.x,MAPS[s.map].start.x,0,MAPS[s.map].width-1);s.y=num(raw.y,MAPS[s.map].start.y,0,MAPS[s.map].height-1);
 if(!walkable(tile(s)))Object.assign(s,MAPS[s.map].start);
 if((s.map==='bowang'&&s.story.stage<2)||(!['xinye','overworld','longzhong','bowang'].includes(s.map)&&s.story.stage<5)){s.map='xinye';Object.assign(s,MAPS.xinye.start);}
 if(THIRD_MAPS[s.map]&&s.story.stage<10){s.map=s.story.stage>=9?'jiangxia':'xinye';Object.assign(s,MAPS[s.map].start);}
 if(FOURTH_MAPS[s.map]&&(s.story.stage<15||s.map==='changshatown'&&s.story.stage<19||s.map==='changshagate'&&s.story.stage<17||s.map==='grainpost'&&s.story.stage<16)){s.map=s.story.stage>=15?'jingcamp':s.story.stage>=14?'jiangling':s.story.stage>=9?'jiangxia':'xinye';Object.assign(s,MAPS[s.map].start);}
 s.steps=num(raw.steps,0);s.encounter={safeSteps:num(raw.encounter?.safeSteps,4,0,20),since:num(raw.encounter?.since??raw.encounter?.noBattleSteps,0,0,20),total:num(raw.encounter?.total,0)};
 s.savedAt=typeof raw.savedAt==='string'?raw.savedAt:null;
 const p=raw.pending;
 if(p&&['patrol','vanguard','boss',...SECOND_KINDS,...THIRD_KINDS,...FOURTH_KINDS].includes(p.kind)&&p.snapshot?.phase==='command'&&Array.isArray(p.snapshot.enemies)){
  const snap=p.snapshot;
  const specs=encounterEnemies(p.kind);
  if((!SECOND_KINDS.includes(p.kind)||s.story.stage>=5)&&(!THIRD_KINDS.includes(p.kind)||s.story.stage>=(p.kind==='redcliff'?13:p.kind==='navalPatrol'?10:11))&&(!FOURTH_KINDS.includes(p.kind)||s.story.stage>=(p.kind==='changsha'?18:p.kind==='supplyEscort'?16:15))&&!(p.kind==='supplyEscort'&&s.story.supplySecured)&&!(p.kind==='changsha'&&s.story.chapter4Complete)&&snap.enemies.length===specs.length&&snap.enemies.every((e,i)=>e?.id===specs[i].id)){
   const restored={...freshState(),party:structuredClone(s.party),enemies:specs.map((e,i)=>({...e,hp:num(snap.enemies[i].hp,e.maxHp,0,e.maxHp),sp:num(snap.enemies[i].sp,e.sp,0,100),atk:num(snap.enemies[i].atk,e.atk,30,999)})),actor:num(snap.actor,0,0,4),round:num(snap.round,1,1,999),formation:s.formation,rations:s.inventory.ration,gold:s.gold,guard:new Set((Array.isArray(snap.guard)?snap.guard:[]).filter(id=>s.party.some(p=>p.id===id))),phase:'command',selection:null,result:null,holdRounds:p.kind==='bridge'?4:0};
   if(restored.party[restored.actor].hp>0&&restored.enemies.some(e=>e.hp>0))s.pending={kind:p.kind,snapshot:checkpoint(restored)};
  }
 }
 return s;
}
export function checkpoint(b){return {party:structuredClone(b.party),enemies:structuredClone(b.enemies),actor:b.actor,round:b.round,formation:b.formation,rations:b.rations,gold:b.gold,guard:[...b.guard],holdRounds:b.holdRounds||0,phase:'command'};}
export function encounterEnemies(kind){
 if(FOURTH_KINDS.includes(kind)){const ids=kind==='changsha'?['huangzhong','pikeman','archer','changshaPike','changshaBow']:kind==='supplyEscort'?['pikeman','archer','changshaPike']:['pikeman','archer'];return ids.map(id=>{const archetype=id==='changshaPike'?'pikeman':id==='changshaBow'?'archer':id,base=CHAPTER_FOUR_ENEMIES[archetype]||ENEMIES[archetype],e={...structuredClone(base),id,archetype,hp:base.maxHp,sp:Math.max(6,Math.floor(base.int/8))};if(archetype!=='huangzhong'){e.name=(kind==='supplyEscort'?'截糧':kind==='jingPatrol'?'荊南':'長沙')+(archetype==='pikeman'?'槍兵':'弓手');e.maxHp=e.hp=Math.round(e.maxHp*1.5);e.atk+=14;e.def+=10;e.exp+=35;e.gold+=40;}return e;});}
 if(THIRD_KINDS.includes(kind)){const ids=kind==='redcliff'?['xuhuang','caoren','zhanghe','pikeman','archer']:kind==='fireships'?['caoren','pikeman','archer']:['pikeman','archer'];return ids.map(id=>{const base=CHAPTER_THREE_ENEMIES[id]||ENEMIES[id],e={...structuredClone(base),id,hp:base.maxHp,sp:Math.max(6,Math.floor(base.int/8))};if(id==='pikeman'||id==='archer'){e.maxHp=e.hp=Math.round(e.maxHp*1.4);e.atk+=10;e.def+=8;e.exp+=30;e.gold+=35;}if(kind==='fireships'&&id==='caoren'){e.name='魏軍水寨將';e.maxHp=e.hp=5200;e.atk=78;e.def=66;e.exp=100;e.gold=140;}return e;});}

 if(SECOND_KINDS.includes(kind)){const ids=kind==='bridge'?['caochun','zhanghe','pikeman','archer']:['pikeman','archer'];return ids.map(id=>{const base=CHAPTER_TWO_ENEMIES[id]||ENEMIES[id],e={...structuredClone(base),id,hp:base.maxHp,sp:Math.max(6,Math.floor(base.int/8))};if(id==='pikeman'||id==='archer'){e.maxHp=e.hp=Math.round(e.maxHp*(kind==='bridge'?1.6:1.3));e.atk+=kind==='bridge'?12:8;e.def+=6;e.exp+=20;e.gold+=25;}return e;});}
 const ids=kind==='boss'?['caoren','zhanghe','xiahoudun','pikeman','archer']:kind==='vanguard'?['pikeman','archer','caoren']:['pikeman','archer'];
 return ids.map(id=>{const e={...structuredClone(ENEMIES[id]),id,hp:ENEMIES[id].maxHp,sp:Math.max(6,Math.floor(ENEMIES[id].int/8))};
  if(kind==='vanguard'&&id==='caoren'){e.name='魏軍先鋒將';e.maxHp=e.hp=4800;e.atk=74;e.def=64;e.exp=90;e.gold=100;}
  return e;
 });
}
export function battleState(s,kind){
 if(s.pending?.kind===kind){const snap=s.pending.snapshot;return {...freshState(),...structuredClone(snap),party:structuredClone(s.party),guard:new Set(snap.guard||[]),selection:null,result:null,phase:'command',equipmentDefense:true,holdRounds:kind==='bridge'?4:0,enemyFaction:FOURTH_KINDS.includes(kind)?'守軍':'魏軍'};}
 const enemies=encounterEnemies(kind);if(kind==='redcliff'&&s.story.plans.includes('wind')&&s.story.plans.includes('ships'))for(const e of enemies)e.hp=Math.floor(e.maxHp*.8);
 return {...freshState(),party:structuredClone(s.party),enemies,formation:s.formation,rations:s.inventory.ration,gold:s.gold,equipmentDefense:true,actor:Math.max(0,s.party.findIndex(p=>p.hp>0)),holdRounds:kind==='bridge'?4:0,enemyFaction:FOURTH_KINDS.includes(kind)?'守軍':'魏軍'};
}
export function storeCheckpoint(s,kind,b){if(b.phase!=='command')return;s.party=structuredClone(b.party);s.gold=b.gold;s.formation=b.formation;s.inventory.ration=b.rations;s.pending={kind,snapshot:checkpoint(b)};}
export function resolveEncounter(s,kind,b,win){
 // Once the checkpoint is cleared, the same result cannot apply rewards twice.
 if(s.pending?.kind!==kind)return false;
 s.party=structuredClone(b.party);s.gold=b.gold;s.formation=b.formation;s.inventory.ration=b.rations;s.pending=null;s.encounter.safeSteps=5;s.encounter.since=0;
 if(win){if(kind==='vanguard')Object.assign(s.story,{stage:Math.max(s.story.stage,3),vanguard:true});if(kind==='boss')Object.assign(s.story,{stage:Math.max(s.story.stage,4),boss:true,clear:true});
  if(kind==='rescueWest'||kind==='rescueEast'){const family=kind==='rescueWest'?'west':'east';if(!s.story.rescued.includes(family))s.story.rescued.push(family);if(s.story.rescued.length===2)s.story.stage=Math.max(7,s.story.stage);}
  if(kind==='windward'||kind==='fireships'){const plan=kind==='windward'?'wind':'ships';if(!s.story.plans.includes(plan))s.story.plans.push(plan);if(s.story.plans.length===2)s.story.stage=Math.max(12,s.story.stage);}
  if(kind==='redcliff'){Object.assign(s.story,{stage:14,chapter3Started:true,chapter3Complete:true});s.map='jiangling';Object.assign(s,MAPS.jiangling.start);}
  if(kind==='supplyEscort'&&!s.story.supplySecured){s.story.stage=Math.max(s.story.stage,17);s.story.supplySecured=true;s.inventory.ration=Math.min(999,(s.inventory.ration||0)+2);}
  if(kind==='changsha'){Object.assign(s.story,{stage:19,chapter4Started:true,supplySecured:true,chapter4Complete:true});s.map='changshatown';Object.assign(s,MAPS.changshatown.start);}
  if(kind==='bridge'){Object.assign(s.story,{stage:9,chapter2Started:true,chapter2Complete:true});s.map='jiangxia';Object.assign(s,MAPS.jiangxia.start);}
 }
 else {s.gold=Math.max(0,s.gold-120);s.party.forEach(p=>{p.hp=Math.max(1,Math.floor(p.maxHp*.65));p.sp=p.maxSp;});s.map=retreatCamp(s);Object.assign(s,MAPS[s.map].start);}
 return true;
}
export function buyItem(s,id){const it=ITEMS[id];if(!it)return '未知物品';if(s.gold<it.price)return '金錢不足';if((s.inventory[id]||0)>=999)return '物品已達上限';s.gold-=it.price;s.inventory[id]=(s.inventory[id]||0)+1;return null;}
export function equipItem(s,hero,id){const p=s.party.find(p=>p.id===hero),it=ITEMS[id];if(!p||!it||!['weapon','armor'].includes(it.type)||(s.inventory[id]||0)<1)return false;const old=p[it.type];s.inventory[id]--;if(old)s.inventory[old]=(s.inventory[old]||0)+1;p[it.type]=id;return true;}
export function useItem(s,id,hero){const p=s.party.find(p=>p.id===hero),it=ITEMS[id];if(!p||it?.type!=='consumable'||!(s.inventory[id]>0))return false;const key=it.heal?'hp':'sp',max=it.heal?'maxHp':'maxSp';if(p[key]>=p[max])return false;p[key]=Math.min(p[max],p[key]+(it.heal||it.sp));s.inventory[id]--;return true;}
export function readSave(storage){for(const key of [SAVE_KEY,BACKUP_KEY]){try{const raw=storage.getItem(key);if(raw){const s=normalizeCampaign(JSON.parse(raw));if(s)return s;}}catch{}}return null;}
export function writeSave(storage,s,{backup=false}={}){try{if(backup){const old=storage.getItem(SAVE_KEY);if(old)storage.setItem(BACKUP_KEY,old);}s.savedAt=new Date().toISOString();storage.setItem(SAVE_KEY,JSON.stringify(s));return true;}catch{return false;}}
export function route(s,goal){const start=[s.x,s.y],queue=[start],prev=new Map([[start.join(','),null]]);for(let i=0;i<queue.length;i++){const [x,y]=queue[i];if(x===goal.x&&y===goal.y){let k=[x,y].join(','),path=[];while(prev.get(k)){const [from,dir]=prev.get(k);path.unshift(dir);k=from;}return path;}for(const [dx,dy,dir] of [[0,-1,'u'],[0,1,'d'],[-1,0,'l'],[1,0,'r']]){const nx=x+dx,ny=y+dy,k=[nx,ny].join(',');if(!prev.has(k)&&walkable(tile(s,nx,ny))&&!MAPS[s.map].npcs?.some(n=>n.x===nx&&n.y===ny)){prev.set(k,[[x,y].join(','),dir]);queue.push([nx,ny]);}}}return null;}

export function beginChapterTwo(s){if(s.story.stage!==4||s.pending)return false;Object.assign(s.story,{stage:5,chapter2Started:true,rescued:[],chapter2Complete:false,chapter3Started:false,plans:[],chapter3Complete:false});s.map='refugecamp';Object.assign(s,MAPS.refugecamp.start);s.encounter.safeSteps=5;s.encounter.since=0;return true;}
export function provisionConvoy(s){if(s.story.stage!==5)return '百姓已集結。';if((s.inventory.ration||0)<2)return '需要兩份軍糧。可在軍需所購買，再回來集結。';s.inventory.ration-=2;s.story.stage=6;return null;}

export function beginChapterThree(s){if(s.story.stage!==9||s.pending)return false;Object.assign(s.story,{stage:10,chapter3Started:true,plans:[],chapter3Complete:false});s.map='alliedcamp';Object.assign(s,MAPS.alliedcamp.start);s.encounter.safeSteps=5;s.encounter.since=0;return true;}
export function agreeAlliance(s){if(s.story.stage!==10)return false;s.story.stage=11;return true;}

export function beginChapterFour(s){if(s.story.stage!==14||s.pending)return false;Object.assign(s.story,{stage:15,chapter3Complete:true,chapter4Started:true,supplySecured:false,chapter4Complete:false});s.map='jingcamp';Object.assign(s,MAPS.jingcamp.start);s.encounter.safeSteps=5;s.encounter.since=0;return true;}
export function orderSupplyEscort(s){if(s.story.stage!==15)return false;s.story.stage=16;return true;}
