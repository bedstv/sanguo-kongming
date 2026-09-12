import {PARTY_TEMPLATE} from '../data.js';
import {BattleSystem} from '../battle.js';
import {BattleRenderer} from './battleRendererV9.js';
import {AudioV9} from './audioV9.js';
const $=s=>document.querySelector(s);
const audio=new AudioV9();
const state={formation:'鶴翼',gold:500,inventory:{ration:4},party:structuredClone(PARTY_TEMPLATE)};
state.party.forEach(p=>{p.hp=p.maxHp;p.sp=p.maxSp});
const ui={root:$('#battle'),ally:$('#allyList'),enemy:$('#enemyList'),round:$('#battleRound'),portrait:$('#portrait'),stats:$('#actorStats'),msg:$('#battleMsg'),skills:$('#skills'),cmds:$('#cmds')};
let battle;
function boot(){
  battle=new BattleSystem(ui,state,audio,()=>{ui.msg.textContent='Golden Battle 測試結束。重新整理即可再戰。'},null);
  battle.renderer=new BattleRenderer(ui,state,p=>battle.effective(p));
  battle.start(['caoren','zhanghe','pikeman','archer','xiahoudun'],{boss:true,label:'V9 Golden Battle'});
  $('#soundV9').onclick=async()=>{const ok=await audio.unlock(true);$('#soundV9').textContent=ok?'聲音 ✓':'聲音待啟用';if(ok)audio.start('boss')};
  document.querySelectorAll('[data-cmd]').forEach(b=>b.onclick=()=>battle.command(b.dataset.cmd));
  $('#battleBack').onclick=()=>{if(!battle?.b||battle.b.busy)return;battle.b.select=null;ui.skills.classList.remove('open');ui.cmds.classList.remove('hidden');battle.render();battle.msg('重新選擇指令。');audio.sfx('ui')};
  addEventListener('pointerdown',()=>audio.unlock(false),{once:true,passive:true});
}
boot();
