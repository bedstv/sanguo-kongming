import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {GoldenBattle} from '../../src/v12/battle.js';
import {newCampaign,battleState,storeCheckpoint,resolveEncounter,buyItem,equipItem} from '../../src/v12/campaign-state.js';

test('first chapter clears with real HP, SP and persistent supplies across twelve seeded runs',async()=>{
 const reports=[];
 for(let seed=1;seed<=12;seed++){
  let random=seed;const rng=()=>((random=(random*1664525+1013904223)>>>0)/4294967296);
  const s=newCampaign();s.story.stage=2;buyItem(s,'leatherArmor');equipItem(s,'liubei','leatherArmor');const report={seed};
  for(const kind of ['vanguard','boss']){
   const b=new GoldenBattle({initialState:battleState(s,kind),rng,timeline:{effect(){},hurt(){},wait:async()=>{},attack:async(id,hit)=>hit(),cast:async(id,hit)=>hit()},audio:{sfx(){},start(){}}});
   storeCheckpoint(s,kind,b.state);let actions=0;
   while(!b.state.result&&actions++<300){
    const p=b.actor(),t=b.state.enemies.filter(e=>e.hp>0).sort((a,z)=>a.hp-z.hp)[0];
    const low=b.state.party.filter(p=>p.hp>0).sort((a,z)=>a.hp/a.maxHp-z.hp/z.maxHp)[0];
    let side='enemy',index=b.state.enemies.indexOf(t);
    if(p.int>=60&&p.sp>=7&&low.hp<low.maxHp*.5){b.command('tactic');b.skill('heal');side='ally';index=b.state.party.indexOf(low);}
    else if(b.state.rations>0&&low.hp<low.maxHp*.28){b.command('item');side='ally';index=b.state.party.indexOf(low);}
    else if(p.id==='kongming'&&p.sp>=6){b.command('tactic');b.skill('fire');}
    else b.command('attack');
    await b.target(side,index);
   }
   assert.equal(b.state.result?.win,true,`seed ${seed}, ${kind}`);
   report[kind]={win:true,rounds:b.state.round,actions,rations:b.state.rations};
   assert.equal(resolveEncounter(s,kind,b.state,true),true);
  }
  assert.equal(s.story.clear,true);reports.push(report);
 }
 fs.writeFileSync('docs/v12/campaign-combat-qa.json',JSON.stringify({animationClock:'instant test clock',modifiedCombatStats:false,strategy:'focus lowest enemy HP; heal below 50%; ration below 28%; Kongming fire when affordable',reports},null,2));
});
