// V11 combat numbers, extracted without importing any legacy renderer.
import {PARTY_TEMPLATE, ENEMIES, ITEMS, FORMATIONS, SKILLS} from '../data.js';
export {ITEMS, FORMATIONS, SKILLS};
export const CAST=['liubei','guanyu','zhangfei','zhaoyun','kongming'];
export const OPPONENTS=['caoren','zhanghe','xiahoudun','pikeman','archer'];
export function freshState(){return {party:structuredClone(PARTY_TEMPLATE),enemies:OPPONENTS.map(id=>({...structuredClone(ENEMIES[id]),id,hp:ENEMIES[id].maxHp,sp:Math.max(6,Math.floor(ENEMIES[id].int/8))})),actor:0,round:1,formation:'鶴翼',rations:4,gold:500,guard:new Set(),phase:'command',selection:null,result:null};}
export function effective(p){const w=ITEMS[p.weapon]||{},a=ITEMS[p.armor]||{};return {...p,atk:p.atk+(w.atk||0),def:p.def+(a.def||0),int:p.int+(w.int||0)+(a.int||0),agi:p.agi+(w.agi||0)+(a.agi||0)};}
export function damage(state,attacker,target,mult=1,magic=false,isAlly=false,rng=Math.random){const fm=FORMATIONS[state.formation];let base=magic?attacker.int*10-target.int*3:attacker.atk*9-target.def*4;if(isAlly&&!magic)base*=fm.atk;let d=Math.max(90,Math.floor(base*mult*(.65+.35*(attacker.hp/attacker.maxHp))*(88+Math.floor(rng()*27))/100));if(state.guard.has(target.id))d=Math.floor(d*.55);if(!isAlly)d=Math.floor(d*fm.def);target.hp=Math.max(0,target.hp-d);return d;}
export function award(state){let gold=0,exp=0;for(const e of state.enemies){gold+=e.gold;exp+=e.exp;}state.gold+=gold;const levelUps=[];for(const p of state.party){p.exp+=exp;while(p.exp>=p.level*100){p.exp-=p.level*100;p.level++;p.maxHp+=260;p.maxSp+=2;p.atk+=4;p.def+=3;p.int+=2;p.agi+=2;p.hp=p.maxHp;p.sp=p.maxSp;levelUps.push(p.name);}}return {gold,exp,levelUps};}
