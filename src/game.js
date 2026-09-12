import {PARTY_TEMPLATE,ITEMS,SHOP_STOCK,MAPS,STORY_TEXT,VERSION} from './data.js';
import {AudioSystem} from './audio.js';
import {saveGame,loadGame} from './save.js';
import {WorldSystem} from './world.js';
import {BattleSystem} from './battle.js';
import {CinematicSystem} from './cinematics.js';
import {portraitData} from './art.js';

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const audio=new AudioSystem();
const cinematic=new CinematicSystem($('#cutin'));
let state=null,world=null,battle=null;

const ui={battle:{root:$('#battle'),ally:$('#allyList'),enemy:$('#enemyList'),round:$('#battleRound'),portrait:$('#portrait'),stats:$('#actorStats'),msg:$('#battleMsg'),skills:$('#skills'),cmds:$('#cmds')}};
const BIO={
  liubei:'仁德主將。劍術均衡，兼具智略與統御。',
  guanyu:'青龍偃月，長髯赤面。高武力重裝猛將。',
  zhangfei:'豹頭環眼，豪勇剛烈。爆發力最高的前鋒。',
  zhaoyun:'白袍銀槍，身法迅捷。高速度的全能武將。',
  kongming:'羽扇綸巾，智略無雙。擅長落雷、聖雨與擾亂。'
};

const ENCOUNTER_PROFILES={
  0:{base:.10,pityStart:6,forced:10,safeAfter:3,danger:'低',label:'新野近郊',pools:[['scout','scout'],['scout','pikeman'],['scout','archer'],['pikeman','archer','scout']]},
  1:{base:.12,pityStart:6,forced:10,safeAfter:3,danger:'中',label:'隆中山道',pools:[['scout','pikeman','archer'],['pikeman','scout','officer'],['archer','scout','pikeman','scout']]},
  2:{base:.15,pityStart:5,forced:9,safeAfter:3,danger:'高',label:'博望前線',pools:[['pikeman','archer','officer','scout'],['officer','pikeman','pikeman','archer'],['archer','scout','officer','pikeman','scout']]},
  3:{base:.18,pityStart:4,forced:8,safeAfter:2,danger:'危',label:'曹軍警戒區',pools:[['officer','pikeman','archer','officer'],['officer','pikeman','pikeman','archer','scout'],['archer','officer','scout','pikeman','officer']]},
  4:{base:.14,pityStart:6,forced:10,safeAfter:3,danger:'中',label:'荊州殘敵',pools:[['scout','pikeman','archer'],['officer','scout','pikeman','archer']]}
};

function defaultEncounter(){return {safeSteps:3,noBattleSteps:0,total:0,lastLabel:'新野近郊'};}
function newState(){return {version:VERSION,map:'xinye',x:8,y:9,gold:500,formation:'鶴翼',party:structuredClone(PARTY_TEMPLATE),inventory:{ration:3,spiritTea:1},story:{stage:0,longzhong:false,returned:false,bowangGate:false,boss:false,clear:false},steps:0,encounter:defaultEncounter(),lastSafe:{map:'xinye',x:8,y:9}}}
function normalizeState(s){
  if(!s||typeof s!=='object')return newState();
  s.story={stage:0,longzhong:false,returned:false,bowangGate:false,boss:false,clear:false,...(s.story||{})};
  let stage=Number.isFinite(s.story.stage)?s.story.stage:0;
  if(s.story.longzhong)stage=Math.max(stage,1);
  if(s.story.returned)stage=Math.max(stage,2);
  if(s.story.bowangGate)stage=Math.max(stage,3);
  if(s.story.boss||s.story.clear)stage=4;
  s.story.stage=stage;
  if(!MAPS[s.map]){s.map='xinye';s.x=8;s.y=9}
  const m=MAPS[s.map],ch=m.rows[s.y]?.[s.x];
  if(ch==null||['#','W','T','F'].includes(ch)){s.x=m.start.x;s.y=m.start.y}
  s.lastSafe=s.lastSafe&&MAPS[s.lastSafe.map]?s.lastSafe:{map:'xinye',x:8,y:9};
  s.inventory={ration:0,spiritTea:0,...(s.inventory||{})};
  s.party=Array.isArray(s.party)&&s.party.length?s.party:structuredClone(PARTY_TEMPLATE);
  s.encounter={...defaultEncounter(),...(s.encounter||{})};
  return s;
}

function show(id){$$('.screen').forEach(s=>s.classList.remove('on'));$(id).classList.add('on')}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e.t);e.t=setTimeout(()=>e.classList.remove('on'),1200)}
function msg(t){$('#worldMsg').textContent=t}
function quest(){const s=state.story.stage;return ['前往世界地圖東北方「隆中」拜訪孔明','返回「新野城」；進城後商店會開放','前往東方「博望坡」迎擊曹軍','深入博望坡，擊敗夏侯惇','第一章完成'][s]||'自由探索'}
function encounterProfile(){return ENCOUNTER_PROFILES[state.story.stage]||ENCOUNTER_PROFILES[4]}
function dangerText(){
  if(state.map!=='overworld')return '敵情 安全';
  const p=encounterProfile(),e=state.encounter;
  if(e.safeSteps>0)return `敵情 緩和 ${e.safeSteps}`;
  if(e.noBattleSteps>=p.pityStart)return `敵影逼近`;
  return `敵情 ${p.danger}`;
}
function refreshHUD(){
  const m=MAPS[state.map];
  $('#location').textContent=m.name;
  $('#gold').textContent=`金 ${state.gold}`;
  $('#formation').textContent=state.formation;
  $('#quest').textContent=`任務：${quest()}`;
  $('#soundState').textContent=`聲音 ${audio.enabled?(audio.isReady?.()?'已啟用':'待啟用'):'關'}`;
  const danger=$('#dangerState');if(danger)danger.textContent=dangerText();
}
function setupWorld(){world=new WorldSystem($('#worldCanvas'),state,onTile,msg);world.render();refreshHUD()}

function storyArrival(id){
  if(id==='xinye'&&state.story.longzhong&&!state.story.returned){
    state.story.returned=true;state.story.stage=2;refreshHUD();msg(STORY_TEXT.returned);
    setTimeout(()=>cinematic.show({key:'kongming',name:'孔明',kicker:'軍略 · 博望坡',text:'「坡道狹長，可誘敵深入，再以火攻破之。」',tone:'skill',duration:720}),140);
    saveGame(state);
  }
}
function enterMap(id,x,y,{resume=false}={}){
  state.map=id;const m=MAPS[id];state.x=x??m.start.x;state.y=y??m.start.y;
  if(id==='xinye')state.lastSafe={map:id,x:state.x,y:state.y};
  if(id==='overworld'&&!resume)state.encounter.safeSteps=Math.max(state.encounter.safeSteps,2);
  setupWorld();show('#world');audio.start('world');msg(resume?`已回到${m.name}。`:`來到${m.name}。`);storyArrival(id);
}
function autoPoint(ch){
  const m=MAPS[state.map],p=m.points?.[ch];if(!p)return false;
  if(ch==='B'&&state.story.stage<2){msg('博望坡尚未開放。先完成隆中事件並返回新野整備。');return true}
  msg(`抵達${p.name}，正在進入……`);audio.sfx('ui');setTimeout(()=>enterMap(p.to),160);return true;
}

function encounterZone(){
  if(state.story.stage===0)return state.x>=12?'隆中外圍':'新野近郊';
  if(state.story.stage===1)return state.x<=10?'新野回程':'隆中山道';
  if(state.story.stage>=2&&state.x>=14)return'博望前線';
  return encounterProfile().label;
}
function maybeEncounter(ch){
  if(state.map!=='overworld'||!['.','R'].includes(ch))return false;
  const e=state.encounter,p=encounterProfile();
  if(e.safeSteps>0){e.safeSteps--;refreshHUD();return false}
  e.noBattleSteps++;
  const pityBonus=Math.max(0,e.noBattleSteps-p.pityStart)*.045;
  const chance=Math.min(.68,p.base+pityBonus);
  const forced=e.noBattleSteps>=p.forced;
  refreshHUD();
  if(!forced&&Math.random()>=chance)return false;
  startEncounter(forced);
  return true;
}
function startEncounter(forced=false){
  const p=encounterProfile();
  let pools=p.pools;
  if(state.story.stage===0&&state.x>=12)pools=[['scout','pikeman','archer'],['pikeman','archer','scout']];
  if(state.story.stage>=2&&state.x>=14)pools=[['officer','pikeman','archer','scout'],['officer','pikeman','pikeman','archer'],['archer','officer','scout','pikeman','scout']];
  const ids=pools[Math.floor(Math.random()*pools.length)];
  state.encounter.total++;
  state.encounter.lastLabel=encounterZone();
  state.encounter.noBattleSteps=0;
  state.encounter.safeSteps=p.safeAfter;
  msg(forced?'斥候急報：敵軍已追上我軍！':'前方草木異動，遭遇魏軍巡邏隊！');
  audio.sfx('ui');
  setTimeout(()=>startBattle(ids,{label:`${state.encounter.lastLabel} · 野外遭遇戰`,wild:true}),180);
}
function resetEncounterAfterBattle(extra=0){
  const p=encounterProfile();
  state.encounter.safeSteps=Math.max(state.encounter.safeSteps,p.safeAfter+extra);
  state.encounter.noBattleSteps=0;
  refreshHUD();
}

function onTile(ch){
  state.steps++;
  if(state.map==='overworld'&&autoPoint(ch))return;
  const m=MAPS[state.map];
  if(state.map!=='overworld'&&m.exit&&state.x===m.exit.x&&state.y===m.exit.y){msg('離開此地，返回世界地圖……');setTimeout(()=>enterMap(m.exit.to,m.exit.toX,m.exit.toY),140);return}
  if(state.map==='bowang'&&state.story.stage>=2&&!state.story.bowangGate&&state.y<=6){state.story.bowangGate=true;state.story.stage=Math.max(state.story.stage,3);refreshHUD();msg(STORY_TEXT.bowangIntro);saveGame(state);setTimeout(()=>startBattle(['officer','pikeman','archer','scout','pikeman'],{label:'博望坡先鋒'}),450);return}
  if(state.map==='bowang'&&state.story.bowangGate&&!state.story.boss&&state.y<=2){setTimeout(()=>{msg(STORY_TEXT.bossIntro);startBattle(['caoren','zhanghe','officer','archer','xiahoudun'],{boss:true,label:'博望坡決戰'})},350);return}
  maybeEncounter(ch);
}

function launchBattle(ids,opt){show('#battle');audio.start(opt.boss?'boss':'battle');battle=new BattleSystem(ui.battle,state,audio,result=>endBattle(result,opt),cinematic);battle.start(ids,opt)}
function startBattle(ids,opt={}){
  if(opt.boss){show('#battle');audio.start('boss');cinematic.show({key:'xiahoudun',name:'夏侯惇',kicker:'魏軍先鋒 · 博望坡',text:'「劉備小兒，今日看你往哪裡逃！」',tone:'boss',duration:920}).then(()=>launchBattle(ids,opt));return}
  launchBattle(ids,opt);
}
function endBattle(r,opt){
  if(r.win===null&&r.fled){resetEncounterAfterBattle(1);enterMap(state.map,state.x,state.y,{resume:true});msg('成功撤退。敵軍暫時被甩開，接下來幾步不會再次遇敵。');return}
  if(r.win){
    resetEncounterAfterBattle();toast(`勝利！+${r.gold}金 / +${r.exp}EXP`);
    if(r.levelUps?.length)msg(`${r.levelUps.join('、')} 升級了！`);
    if(opt.boss){state.story.boss=true;state.story.clear=true;state.story.stage=4;saveGame(state);cinematic.show({key:'kongming',name:'孔明',kicker:'博望坡 · 首戰告捷',text:'「火勢既起，曹軍鋒芒已挫。」',tone:'ally',duration:760}).then(showEnding);return}
    enterMap(state.map,state.x,state.y,{resume:true});
    if(opt.wild)msg(`擊退${state.encounter.lastLabel}巡邏隊。接下來 ${state.encounter.safeSteps} 步為安全距離。`);
  }else{
    resetEncounterAfterBattle(2);state.party.forEach(p=>{p.hp=p.maxHp;p.sp=p.maxSp});state.gold=Math.max(0,state.gold-120);enterMap(state.lastSafe.map,state.lastSafe.x,state.lastSafe.y,{resume:true});msg('戰敗後撤回新野整軍。野外敵情會暫時降低。若想先推劇情，可使用 B 選單的「脫困」。');
  }
}

function interact(){
  const m=MAPS[state.map];const n=world.nearbyNpc();
  if(n){
    if(n.id==='kongmingNpc'&&!state.story.longzhong){state.story.longzhong=true;state.story.stage=1;state.party.forEach(p=>{p.hp=p.maxHp;p.sp=p.maxSp});cinematic.show({key:'kongming',name:'孔明',kicker:'隆中 · 臥龍',text:'「曹軍不久將至，我已有一計。」',tone:'ally',duration:720});msg(`${STORY_TEXT.longzhong} 下一步：離開隆中，返回新野城。回程也會遭遇魏軍巡邏。`);audio.sfx('ui');refreshHUD();saveGame(state);return}
    msg(n.dialog.join(' '));audio.sfx('ui');return;
  }
  const ch=world.tileAt(state.x,state.y);
  if(state.map==='overworld'&&m.points?.[ch]){autoPoint(ch);return}
  if(state.map!=='overworld'&&m.exit&&state.x===m.exit.x&&state.y===m.exit.y){enterMap(m.exit.to,m.exit.toX,m.exit.toY);return}
  if(state.map==='xinye'){
    const cur=world.tileAt(state.x,state.y);
    if(cur==='S'){if(!state.story.longzhong){msg('商店尚未正式供應軍需。先前往隆中拜訪孔明。');return}openShop();return}
    if(cur==='I'){state.party.forEach(p=>{p.hp=p.maxHp;p.sp=p.maxSp});msg('在客棧休息，全隊兵力與策略恢復。');audio.sfx('heal');return}
  }
  msg('這裡沒有特別的事物。可按 B 開啟選單查看「任務提示」。');
}
function hint(){
  const s=state.story.stage;
  if(s===0){if(state.map==='xinye')msg('提示：從新野南門離城；世界地圖金色箭頭指向「隆中」。途中從第一趟旅程就會遇到魏軍巡邏。');else if(state.map==='overworld')msg('提示：沿道路往東北前往隆中。野外敵情會逐步升高，久未遇敵時會觸發保底遭遇。');else if(state.map==='longzhong')msg('提示：尋找頭上有「！」的孔明，靠近後按 A 對話。');else msg('提示：先前往隆中拜訪孔明。')}
  else if(s===1)msg(state.map==='overworld'?'提示：世界地圖金色箭頭已改指向「新野」。回程仍有隨機遭遇，戰後有安全步數。':'提示：離開隆中並返回新野；進城後主線會自動更新。');
  else if(s===2)msg(state.map==='xinye'?'提示：可先在商店整備；接著從南門離城，往博望坡路上的敵軍更強、遇敵率也更高。':'提示：前往世界地圖東方的「博望坡」地標。越接近前線，敵情越高。');
  else if(s===3)msg('提示：繼續沿博望坡道路向北深入，夏侯惇正在前方。');
  else msg('第一章已完成，可自由探索或保存進度。');
  audio.sfx('ui');
}
function rescue(){if(!state)return;$('#menuOverlay').classList.remove('on');const safe=state.lastSafe&&MAPS[state.lastSafe.map]?state.lastSafe:{map:'xinye',x:8,y:9};state.party.forEach(p=>{if(p.hp<=0)p.hp=Math.max(1,Math.floor(p.maxHp*.35))});state.encounter.safeSteps=Math.max(state.encounter.safeSteps,4);enterMap(safe.map,safe.x,safe.y,{resume:true});toast('已返回最近安全點');msg('脫困完成。主線旗標與裝備均保留，且獲得短暫野外安全距離。')}

function openShop(){const body=$('#shopBody');body.innerHTML=SHOP_STOCK.map(id=>{const it=ITEMS[id];return `<div class="shop-item"><div><strong>${it.name}</strong><div class="muted">${it.desc} · ${it.type==='weapon'?`攻+${it.atk||0}`:it.type==='armor'?`防+${it.def||0}`:'消耗品'}</div></div><button data-buy="${id}">${it.price}金</button></div>`}).join('');body.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>buy(b.dataset.buy));$('#shopOverlay').classList.add('on')}
function buy(id){const it=ITEMS[id];if(state.gold<it.price){toast('金錢不足');return}state.gold-=it.price;if(it.type==='consumable')state.inventory[id]=(state.inventory[id]||0)+1;else{state.inventory[id]=(state.inventory[id]||0)+1;autoEquip(id)}audio.sfx('buy');refreshHUD();toast(`購入 ${it.name}`)}
function autoEquip(id){const it=ITEMS[id],slot=it.type;let best=state.party[0];if(id==='scholarRobe'||id==='featherFan')best=state.party.find(p=>p.id==='kongming')||best;else if(id.includes('Spear'))best=state.party.find(p=>p.id==='zhaoyun')||best;else if(id==='generalBlade')best=state.party.find(p=>p.id==='guanyu')||best;best[slot]=id;state.inventory[id]--}
function openMenu(tab='party'){renderMenu(tab);$('#menuOverlay').classList.add('on')}
function renderMenu(tab){
  if(tab==='party'){$('#menuBody').innerHTML=state.party.map(p=>{const w=ITEMS[p.weapon],a=ITEMS[p.armor];return `<div class="party-card"><img src="${portraitData(p.id)}" alt="${p.name}"><div><strong>${p.name} <small>${p.role}</small></strong><div class="muted">Lv.${p.level} · 兵力 ${p.hp}/${p.maxHp} · 策略 ${p.sp}/${p.maxSp}</div><div class="muted">武器 ${w?.name||'無'} / 防具 ${a?.name||'無'}</div></div><div class="party-stats">武${p.atk}<br>防${p.def}<br>智${p.int}</div></div>`}).join('');return}
  if(tab==='art'){$('#menuBody').innerHTML=state.party.map(p=>`<div class="codex-card"><img src="${portraitData(p.id)}" alt="${p.name}"><div><strong>${p.name}</strong><div class="epithet">${p.role}</div><div class="muted">${BIO[p.id]||''}</div></div></div>`).join('');return}
  $('#menuBody').innerHTML=Object.entries(state.inventory).filter(([,n])=>n>0).map(([id,n])=>`<div class="list-row"><div><strong>${ITEMS[id]?.name||id}</strong><div class="muted">${ITEMS[id]?.desc||''}</div></div><div>×${n}</div></div>`).join('')||'<div class="muted">沒有物品</div>';
}
function showEnding(){$('#endingText').textContent=STORY_TEXT.chapterClear;$('#endingOverlay').classList.add('on');saveGame(state)}
function startNew(){state=newState();show('#world');setupWorld();msg(`${STORY_TEXT.intro} 提示：從南門離城後，前往隆中的第一趟路程就會開始遇到敵軍。`);audio.ensure();audio.start('world')}
function continueGame(){const s=loadGame();if(!s){toast('沒有存檔');return}state=normalizeState(s);audio.ensure();enterMap(state.map,state.x,state.y,{resume:true});msg(`已讀取進度。任務：${quest()}；野外敵情系統已更新為 V5.5。`)}
function battleBack(){if(!battle?.b||battle.b.busy)return;battle.b.select=null;ui.battle.skills.classList.remove('open');ui.battle.cmds.classList.remove('hidden');battle.render();battle.msg(`${state.party[battle.b.actor]?.name||'我軍'}：重新選擇指令。`);audio.sfx('ui')}

$('#newBtn').onclick=startNew;
$('#continueBtn').onclick=continueGame;
$('#aBtn').onclick=interact;
$('#bBtn').onclick=()=>openMenu();
$('#soundBtn').onclick=async()=>{await audio.toggle();refreshHUD()};
$('#partyTab').onclick=()=>renderMenu('party');
$('#inventoryTab').onclick=()=>renderMenu('inventory');
$('#artTab').onclick=()=>renderMenu('art');
$('#hintBtn').onclick=hint;
$('#rescueBtn').onclick=rescue;
$('#battleBack').onclick=battleBack;
$('#saveBtn').onclick=()=>{saveGame(state);toast('已存檔')};
$('#closeMenu').onclick=()=>$('#menuOverlay').classList.remove('on');
$('#closeShop').onclick=()=>$('#shopOverlay').classList.remove('on');
$('#endingSave').onclick=()=>{saveGame(state);toast('通關進度已保存')};
$('#endingClose').onclick=()=>{$('#endingOverlay').classList.remove('on');enterMap('overworld',18,8)};
$$('[data-dir]').forEach(b=>b.onclick=()=>{if(!state)return;const d=b.dataset.dir,moved=world.move(d==='l'?-1:d==='r'?1:0,d==='u'?-1:d==='d'?1:0);if(moved){audio.sfx('move');refreshHUD()}});
$$('[data-cmd]').forEach(b=>b.onclick=()=>battle?.command(b.dataset.cmd));

if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
