import test from 'node:test';
import assert from 'node:assert/strict';
import {MAPS} from '../../src/data.js';
import {newCampaign,normalizeCampaign,readSave,writeSave,SAVE_KEY,BACKUP_KEY,LEGACY_KEY,route,walkable,tile,battleState,storeCheckpoint,resolveEncounter,buyItem,equipItem,useItem} from '../../src/v12/campaign-state.js';
import {award,damage} from '../../src/v12/rules.js';
const memory=()=>{const data=new Map();return {data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};};
test('all chapter destinations have real walkable routes',()=>{
 const s=newCampaign();const legs=[['xinye',8,9,8,11],['overworld',7,8,15,4],['longzhong',7,8,6,5],['longzhong',6,5,7,9],['overworld',11,4,7,8],['overworld',7,8,22,8],['bowang',8,10,8,6],['bowang',8,6,8,2],['xinye',8,9,4,3],['xinye',4,3,10,3]];
 for(const [map,x,y,gx,gy] of legs){Object.assign(s,{map,x,y});const path=route(s,{x:gx,y:gy});assert.ok(path,`${map} route`);for(const dir of path){const [dx,dy]={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]}[dir];s.x+=dx;s.y+=dy;assert.ok(walkable(tile(s)));}assert.deepEqual([s.x,s.y],[gx,gy]);}
});
test('campaign save survives reload and leaves the legacy slot untouched',()=>{
 const storage=memory(),s=newCampaign();storage.setItem(LEGACY_KEY,'old-save');s.story.stage=2;s.gold=123;s.party[0].hp=2100;assert.equal(writeSave(storage,s),true);const restored=readSave(storage);assert.equal(restored.gold,123);assert.equal(restored.party[0].hp,2100);assert.equal(restored.story.returned,true);assert.equal(storage.getItem(LEGACY_KEY),'old-save');
});
test('new journey keeps a backup; invalid saves fall back without crashing',()=>{
 const storage=memory(),old=newCampaign();old.gold=321;writeSave(storage,old);writeSave(storage,newCampaign(),{backup:true});assert.equal(JSON.parse(storage.getItem(BACKUP_KEY)).gold,321);storage.setItem(SAVE_KEY,'{broken');assert.equal(readSave(storage).gold,321);assert.equal(writeSave({setItem(){throw Error('quota');}},old),false);
});
test('legacy normalization rejects blocked map positions and unknown equipment',()=>{
 const s=newCampaign();s.schema=5;s.map='overworld';s.x=0;s.y=0;s.party[0].weapon='bad';s.party[0].hp=999999;s.gold=-8;s.story.longzhong=true;const n=normalizeCampaign(s);assert.deepEqual([n.x,n.y],[MAPS.overworld.start.x,MAPS.overworld.start.y]);assert.equal(n.party[0].weapon,'bronzeSword');assert.equal(n.party[0].hp,n.party[0].maxHp);assert.equal(n.gold,0);assert.equal(n.story.stage,1);assert.equal(normalizeCampaign(null),null);
});
test('buy, explicit equipment assignment and consumables preserve inventory',()=>{
 const s=newCampaign();assert.equal(buyItem(s,'leatherArmor'),null);assert.equal(s.gold,140);assert.equal(equipItem(s,'guanyu','leatherArmor'),true);assert.equal(s.inventory.leatherArmor,0);assert.equal(s.inventory.clothArmor,1);assert.equal(s.party[1].armor,'leatherArmor');assert.equal(buyItem(s,'scaleArmor'),'金錢不足');const before=s.inventory.ration;assert.equal(useItem(s,'ration','liubei'),false);assert.equal(s.inventory.ration,before);s.party[0].hp=100;assert.equal(useItem(s,'ration','liubei'),true);assert.equal(s.party[0].hp,1700);assert.equal(s.inventory.ration,before-1);
});
test('command checkpoint restores enemies, round, SP, guard and rations',()=>{
 const s=newCampaign(),b=battleState(s,'boss');b.party[0].hp=2000;b.party[4].sp=25;b.enemies[0].hp=321;b.actor=3;b.round=4;b.rations=2;b.guard.add('liubei');storeCheckpoint(s,'boss',b);const storage=memory();writeSave(storage,s);const n=readSave(storage),restored=battleState(n,'boss');assert.equal(restored.actor,3);assert.equal(restored.round,4);assert.equal(restored.enemies[0].hp,321);assert.equal(restored.party[4].sp,25);assert.equal(restored.rations,2);assert.equal(restored.guard.has('liubei'),true);
});
test('victory applies rewards once and unlocks the next objective',()=>{
 const s=newCampaign(),b=battleState(s,'vanguard');storeCheckpoint(s,'vanguard',b);award(b);const expected=b.gold;assert.equal(resolveEncounter(s,'vanguard',b,true),true);assert.equal(s.gold,expected);assert.equal(s.story.stage,3);assert.equal(s.story.vanguard,true);assert.equal(resolveEncounter(s,'vanguard',b,true),false);assert.equal(s.gold,expected);const boss=battleState(s,'boss');storeCheckpoint(s,'boss',boss);award(boss);resolveEncounter(s,'boss',boss,true);assert.equal(s.story.clear,true);assert.equal(s.story.stage,4);
});
test('defeat keeps consumed supplies, retreats and permits recovery',()=>{
 const s=newCampaign();s.map='bowang';s.story.stage=3;const b=battleState(s,'boss');storeCheckpoint(s,'boss',b);b.rations=1;b.party.forEach(p=>p.hp=0);resolveEncounter(s,'boss',b,false);assert.equal(s.map,'xinye');assert.equal(s.inventory.ration,1);assert.equal(s.gold,380);assert.equal(s.story.stage,3);assert.ok(s.party.every(p=>p.hp>0&&p.hp<p.maxHp));assert.equal(s.pending,null);
});

test('campaign armor reduces received physical damage after purchase and reload',()=>{
 const s=newCampaign(),plain=battleState(s,'boss');const before=damage(plain,plain.enemies[0],plain.party[0],.9,false,false,()=>.5);
 buyItem(s,'leatherArmor');equipItem(s,'liubei','leatherArmor');const equipped=battleState(s,'boss');storeCheckpoint(s,'boss',equipped);
 const restored=battleState(normalizeCampaign(s),'boss');assert.equal(restored.equipmentDefense,true);assert.ok(damage(restored,restored.enemies[0],restored.party[0],.9,false,false,()=>.5)<before);
});
