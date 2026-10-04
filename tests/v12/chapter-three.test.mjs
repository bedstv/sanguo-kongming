import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {GoldenBattle} from '../../src/v12/battle.js';
import {MAPS,THIRD_MAPS,nextObjective} from '../../src/v12/chapter-three.js';
import {newCampaign,normalizeCampaign,beginChapterTwo,provisionConvoy,beginChapterThree,agreeAlliance,battleState,storeCheckpoint,resolveEncounter,route,buyItem,equipItem} from '../../src/v12/campaign-state.js';
function cleared(){const s=newCampaign();s.story.stage=9;s.story.chapter2Complete=true;s.story.rescued=['west','east'];return s;}
function prepared(){const s=cleared();beginChapterThree(s);agreeAlliance(s);s.story.plans=['wind','ships'];s.story.stage=13;return s;}
function win(s,kind){const b=battleState(s,kind);storeCheckpoint(s,kind,b);assert.equal(resolveEncounter(s,kind,b,true),true);assert.equal(resolveEncounter(s,kind,b,true),false);}
test('V12.2 clear save continues with all party, inventory and equipment preserved',()=>{
 const old=cleared();old.version='12.2';old.gold=873;old.party[2].hp=1234;old.party[1].armor='scaleArmor';old.inventory.ration=6;
 const s=normalizeCampaign(old);assert.equal(beginChapterThree(s),true);assert.equal(s.story.stage,10);assert.equal(s.map,'alliedcamp');assert.equal(s.gold,873);assert.equal(s.party[2].hp,1234);assert.equal(s.party[1].armor,'scaleArmor');assert.equal(s.inventory.ration,6);assert.equal(beginChapterThree(s),false);
});
test('completed chapter-two flag never downgrades a later stage on reload',()=>{
 for(const stage of [10,11,12,13,14]){const s=prepared();s.story.stage=stage;if(stage===11)s.story.plans=['wind'];s.map=stage===14?'jiangling':'alliedcamp';const r=normalizeCampaign(s);assert.equal(r.story.stage,stage);assert.equal(r.story.chapter2Complete,true);assert.equal(r.story.chapter3Complete,stage===14);}
});
test('all third-chapter exits, service points and quest routes are reachable',()=>{
 for(const [map,m] of Object.entries(THIRD_MAPS)){assert.equal(m.rows.length,m.height);assert.ok(m.rows.every(r=>r.length===m.width));const s=prepared();s.map=map;Object.assign(s,m.start);if(m.exit)assert.ok(route(s,{x:m.exit.x,y:m.exit.y}),map);if(m.points)for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++)if(m.points[m.rows[y][x]])assert.ok(route(s,{x,y}),`${map}:${x},${y}`);for(const n of m.npcs||[])assert.ok([[0,1],[0,-1],[1,0],[-1,0]].some(([dx,dy])=>route(s,{x:n.x+dx,y:n.y+dy})),map+':'+n.id);}
 for(const [map,stage,plans] of [['alliedcamp',10,[]],['windaltar',11,[]],['shipyard',11,['wind']],['redcliffs',12,['ships','wind']]]){const s=prepared();s.map=map;s.story.stage=stage;s.story.plans=plans;Object.assign(s,MAPS[map].start);assert.ok(route(s,nextObjective(s)),map);}
});
test('alliance and either preparation order advance once; one flag survives reload',()=>{
 for(const order of [['windward','fireships'],['fireships','windward']]){let s=cleared();beginChapterThree(s);assert.equal(agreeAlliance(s),true);assert.equal(agreeAlliance(s),false);win(s,order[0]);s=normalizeCampaign(s);assert.equal(s.story.stage,11);assert.equal(s.story.plans.length,1);win(s,order[1]);assert.equal(s.story.stage,12);assert.deepEqual([...s.story.plans].sort(),['ships','wind']);}
});
test('fire-ship advantage applies once and damaged enemy checkpoint remains exact',()=>{
 const s=prepared(),b=battleState(s,'redcliff');assert.ok(b.enemies.every(e=>e.hp===Math.floor(e.maxHp*.8)));b.enemies[0].hp-=127;b.actor=1;b.guard.add('liubei');storeCheckpoint(s,'redcliff',b);const r=normalizeCampaign(s),restored=battleState(r,'redcliff');assert.equal(restored.enemies[0].hp,b.enemies[0].hp);assert.equal(restored.guard.has('liubei'),true);assert.equal(restored.actor,1);
 const unready=cleared();beginChapterThree(unready);assert.ok(battleState(unready,'redcliff').enemies.every(e=>e.hp===e.maxHp));
});
test('premature chapter-three checkpoints and maps cannot bypass progression',()=>{
 const s=newCampaign();s.map='redcliffs';assert.equal(normalizeCampaign(s).map,'xinye');const early=cleared();beginChapterThree(early);storeCheckpoint(early,'redcliff',battleState(early,'redcliff'));assert.equal(normalizeCampaign(early).pending,null);
});
test('defeat returns to allied camp with preparations and used resources preserved',()=>{
 const s=prepared(),b=battleState(s,'redcliff');storeCheckpoint(s,'redcliff',b);b.rations=1;b.gold=400;b.party.forEach(p=>p.hp=0);resolveEncounter(s,'redcliff',b,false);assert.equal(s.map,'alliedcamp');assert.equal(s.gold,280);assert.equal(s.inventory.ration,1);assert.equal(s.story.stage,13);assert.deepEqual(s.story.plans,['wind','ships']);assert.ok(s.party.every(p=>p.hp===Math.floor(p.maxHp*.65)));
});
test('twelve seeded three-chapter journeys win using real stats and camp recovery',async()=>{
 const reports=[];
 for(let seed=1;seed<=12;seed++){
  let random=seed;const rng=()=>((random=(random*1664525+1013904223)>>>0)/4294967296),s=newCampaign(),report={seed,battles:[]};s.story.stage=2;buyItem(s,'leatherArmor');equipItem(s,'liubei','leatherArmor');
  const rest=()=>s.party.forEach(p=>{p.hp=p.maxHp;p.sp=p.maxSp;});
  async function fight(kind){const b=new GoldenBattle({initialState:battleState(s,kind),rng,timeline:{effect(){},hurt(){},wait:async()=>{},attack:async(id,hit)=>hit(),cast:async(id,hit)=>hit()},audio:{sfx(){},start(){}}});storeCheckpoint(s,kind,b.state);let actions=0;
   while(!b.state.result&&actions++<400){if(kind==='bridge'){b.command('defend');while(b.state.phase!=='command'&&!b.state.result)await new Promise(r=>setImmediate(r));continue;}
    const p=b.actor(),t=b.state.enemies.filter(e=>e.hp>0).sort((a,z)=>a.hp-z.hp)[0],low=b.state.party.filter(p=>p.hp>0).sort((a,z)=>a.hp/a.maxHp-z.hp/z.maxHp)[0];let side='enemy',index=b.state.enemies.indexOf(t);
    if(p.int>=70&&p.sp>=7&&low.hp<low.maxHp*.5){b.command('tactic');b.skill('heal');side='ally';index=b.state.party.indexOf(low);}else if(b.state.rations>0&&low.hp<low.maxHp*.28){b.command('item');side='ally';index=b.state.party.indexOf(low);}else if(p.id==='kongming'&&p.sp>=6){b.command('tactic');b.skill('fire');}else b.command('attack');await b.target(side,index);
   }
   assert.equal(b.state.result?.win,true,`seed ${seed}, ${kind}`);assert.equal(resolveEncounter(s,kind,b.state,true),true);assert.equal(resolveEncounter(s,kind,b.state,true),false);report.battles.push({kind,rounds:b.state.round,actions,survivors:s.party.filter(p=>p.hp>0).length});
  }
  await fight('vanguard');await fight('boss');beginChapterTwo(s);rest();while(s.inventory.ration<2)assert.equal(buyItem(s,'ration'),null);provisionConvoy(s);await fight('rescueWest');rest();await fight('rescueEast');rest();s.story.stage=8;await fight('bridge');assert.equal(s.story.stage,9);if(seed===1)fs.writeFileSync('docs/v12/chapter3-start-save.json',JSON.stringify({...s,version:'12.2'},null,2));beginChapterThree(s);rest();agreeAlliance(s);for(const kind of seed%2?['windward','fireships']:['fireships','windward']){await fight(kind);rest();}s.story.stage=13;await fight('redcliff');assert.equal(s.story.stage,14);assert.equal(s.map,'jiangling');const reload=normalizeCampaign(s);assert.equal(reload.story.stage,14);assert.equal(reload.gold,s.gold);reports.push(report);
 }
 fs.writeFileSync('docs/v12/chapter3-combat-qa.json',JSON.stringify({animationClock:'instant test clock',modifiedCombatStats:false,campRecovery:true,journeys:reports},null,2));
});
