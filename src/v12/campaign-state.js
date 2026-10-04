import {PARTY_TEMPLATE, MAPS, ITEMS, ENEMIES, FORMATIONS} from '../data.js';
import {freshState} from './rules.js';

export const SAVE_KEY='sanguo-kongming-v12-campaign';
export const BACKUP_KEY=SAVE_KEY+'-backup';
export const LEGACY_KEY='sanguo-kongming-v5';
export const CHAPTERS=['臥龍出山','返回新野','博望設伏','火起博望','首戰告捷'];
export const OBJECTIVES=[
 '從南門出城，前往隆中草廬拜訪孔明。',
 '返回新野城，與孔明商議迎敵之策。',
 '在新野整備，前往東方博望坡迎擊先鋒。',
 '沿博望坡向北，迎戰夏侯惇與魏軍主力。',
 '博望首戰告捷。返回新野休整，或繼續探索。'
];
export const walkable=ch=>!!ch&&!['#','W','T','F','N','S','I','H','P'].includes(ch);
export const tile=(s,x=s.x,y=s.y)=>MAPS[s.map]?.rows[y]?.[x]||'#';
export function newCampaign(){return {schema:12,version:'12.1',map:'xinye',x:8,y:9,gold:500,formation:'鶴翼',party:structuredClone(PARTY_TEMPLATE),inventory:{ration:4,spiritTea:2},story:{stage:0,longzhong:false,returned:false,vanguard:false,boss:false,clear:false},steps:0,encounter:{safeSteps:4,since:0,total:0},pending:null,savedAt:null};}
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
 s.story.stage=num(raw.story?.stage,0,0,4);
 if(raw.story?.clear||raw.story?.boss)s.story.stage=4;
 else if(raw.story?.returned)s.story.stage=Math.max(s.story.stage,2);
 else if(raw.story?.longzhong)s.story.stage=Math.max(s.story.stage,1);
 Object.assign(s.story,{longzhong:s.story.stage>=1,returned:s.story.stage>=2,vanguard:s.story.stage>=3,boss:s.story.stage>=4,clear:s.story.stage>=4});
 if(MAPS[raw.map])s.map=raw.map;
 s.x=num(raw.x,MAPS[s.map].start.x,0,MAPS[s.map].width-1);s.y=num(raw.y,MAPS[s.map].start.y,0,MAPS[s.map].height-1);
 if(!walkable(tile(s)))Object.assign(s,MAPS[s.map].start);
 if(s.map==='bowang'&&s.story.stage<2){s.map='xinye';Object.assign(s,MAPS.xinye.start);}
 s.steps=num(raw.steps,0);s.encounter={safeSteps:num(raw.encounter?.safeSteps,4,0,20),since:num(raw.encounter?.since??raw.encounter?.noBattleSteps,0,0,20),total:num(raw.encounter?.total,0)};
 s.savedAt=typeof raw.savedAt==='string'?raw.savedAt:null;
 const p=raw.pending;
 if(p&&['patrol','vanguard','boss'].includes(p.kind)&&p.snapshot?.phase==='command'&&Array.isArray(p.snapshot.enemies)){
  const snap=p.snapshot;
  const specs=encounterEnemies(p.kind);
  if(snap.enemies.length===specs.length&&snap.enemies.every((e,i)=>e?.id===specs[i].id)){
   const restored={...freshState(),party:structuredClone(s.party),enemies:specs.map((e,i)=>({...e,hp:num(snap.enemies[i].hp,e.maxHp,0,e.maxHp),sp:num(snap.enemies[i].sp,e.sp,0,100),atk:num(snap.enemies[i].atk,e.atk,30,999)})),actor:num(snap.actor,0,0,4),round:num(snap.round,1,1,999),formation:s.formation,rations:s.inventory.ration,gold:s.gold,guard:new Set((Array.isArray(snap.guard)?snap.guard:[]).filter(id=>s.party.some(p=>p.id===id))),phase:'command',selection:null,result:null};
   if(restored.party[restored.actor].hp>0&&restored.enemies.some(e=>e.hp>0))s.pending={kind:p.kind,snapshot:checkpoint(restored)};
  }
 }
 return s;
}
export function checkpoint(b){return {party:structuredClone(b.party),enemies:structuredClone(b.enemies),actor:b.actor,round:b.round,formation:b.formation,rations:b.rations,gold:b.gold,guard:[...b.guard],phase:'command'};}
export function encounterEnemies(kind){
 const ids=kind==='boss'?['caoren','zhanghe','xiahoudun','pikeman','archer']:kind==='vanguard'?['pikeman','archer','caoren']:['pikeman','archer'];
 return ids.map(id=>{const e={...structuredClone(ENEMIES[id]),id,hp:ENEMIES[id].maxHp,sp:Math.max(6,Math.floor(ENEMIES[id].int/8))};
  if(kind==='vanguard'&&id==='caoren'){e.name='魏軍先鋒將';e.maxHp=e.hp=4800;e.atk=74;e.def=64;e.exp=90;e.gold=100;}
  return e;
 });
}
export function battleState(s,kind){
 if(s.pending?.kind===kind){const snap=s.pending.snapshot;return {...freshState(),...structuredClone(snap),party:structuredClone(s.party),guard:new Set(snap.guard||[]),selection:null,result:null,phase:'command',equipmentDefense:true};}
 return {...freshState(),party:structuredClone(s.party),enemies:encounterEnemies(kind),formation:s.formation,rations:s.inventory.ration,gold:s.gold,equipmentDefense:true};
}
export function storeCheckpoint(s,kind,b){if(b.phase!=='command')return;s.party=structuredClone(b.party);s.gold=b.gold;s.formation=b.formation;s.inventory.ration=b.rations;s.pending={kind,snapshot:checkpoint(b)};}
export function resolveEncounter(s,kind,b,win){
 // Once the checkpoint is cleared, the same result cannot apply rewards twice.
 if(s.pending?.kind!==kind)return false;
 s.party=structuredClone(b.party);s.gold=b.gold;s.formation=b.formation;s.inventory.ration=b.rations;s.pending=null;s.encounter.safeSteps=5;s.encounter.since=0;
 if(win){if(kind==='vanguard')Object.assign(s.story,{stage:3,vanguard:true});if(kind==='boss')Object.assign(s.story,{stage:4,boss:true,clear:true});}
 else {s.gold=Math.max(0,s.gold-120);s.party.forEach(p=>{p.hp=Math.max(1,Math.floor(p.maxHp*.65));p.sp=p.maxSp;});s.map='xinye';Object.assign(s,MAPS.xinye.start);}
 return true;
}
export function buyItem(s,id){const it=ITEMS[id];if(!it)return '未知物品';if(s.gold<it.price)return '金錢不足';if((s.inventory[id]||0)>=999)return '物品已達上限';s.gold-=it.price;s.inventory[id]=(s.inventory[id]||0)+1;return null;}
export function equipItem(s,hero,id){const p=s.party.find(p=>p.id===hero),it=ITEMS[id];if(!p||!it||!['weapon','armor'].includes(it.type)||(s.inventory[id]||0)<1)return false;const old=p[it.type];s.inventory[id]--;if(old)s.inventory[old]=(s.inventory[old]||0)+1;p[it.type]=id;return true;}
export function useItem(s,id,hero){const p=s.party.find(p=>p.id===hero),it=ITEMS[id];if(!p||it?.type!=='consumable'||!(s.inventory[id]>0))return false;const key=it.heal?'hp':'sp',max=it.heal?'maxHp':'maxSp';if(p[key]>=p[max])return false;p[key]=Math.min(p[max],p[key]+(it.heal||it.sp));s.inventory[id]--;return true;}
export function readSave(storage){for(const key of [SAVE_KEY,BACKUP_KEY]){try{const raw=storage.getItem(key);if(raw){const s=normalizeCampaign(JSON.parse(raw));if(s)return s;}}catch{}}return null;}
export function writeSave(storage,s,{backup=false}={}){try{if(backup){const old=storage.getItem(SAVE_KEY);if(old)storage.setItem(BACKUP_KEY,old);}s.savedAt=new Date().toISOString();storage.setItem(SAVE_KEY,JSON.stringify(s));return true;}catch{return false;}}
export function route(s,goal){const start=[s.x,s.y],queue=[start],prev=new Map([[start.join(','),null]]);for(let i=0;i<queue.length;i++){const [x,y]=queue[i];if(x===goal.x&&y===goal.y){let k=[x,y].join(','),path=[];while(prev.get(k)){const [from,dir]=prev.get(k);path.unshift(dir);k=from;}return path;}for(const [dx,dy,dir] of [[0,-1,'u'],[0,1,'d'],[-1,0,'l'],[1,0,'r']]){const nx=x+dx,ny=y+dy,k=[nx,ny].join(',');if(!prev.has(k)&&walkable(tile(s,nx,ny))&&!MAPS[s.map].npcs?.some(n=>n.x===nx&&n.y===ny)){prev.set(k,[[x,y].join(','),dir]);queue.push([nx,ny]);}}}return null;}
