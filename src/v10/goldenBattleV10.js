import {PARTY_TEMPLATE} from '../data.js';
import {BattleSystemV10} from './battleSystemV10.js';
import {AudioV10} from './audioV10.js';
const $=s=>document.querySelector(s);
const audio=new AudioV10();
const state={formation:'鶴翼',gold:500,inventory:{ration:4},party:structuredClone(PARTY_TEMPLATE)};
state.party.forEach(p=>{p.hp=p.maxHp;p.sp=p.maxSp});
const ui={root:$('#battle'),ally:$('#allyList'),enemy:$('#enemyList'),round:$('#battleRound'),portrait:$('#portrait'),stats:$('#actorStats'),msg:$('#battleMsg'),skills:$('#skills'),cmds:$('#cmds')};
let battle;
function back(){if(!battle?.b||battle.b.busy)return;battle.b.select=null;ui.skills.classList.remove('open');ui.cmds.classList.remove('hidden');battle.render();battle.msg('重新選擇指令。');audio.sfx('ui')}
function boot(){
  battle=new BattleSystemV10(ui,state,audio,()=>{ui.msg.textContent='V10 Golden Battle 測試結束。重新整理即可再戰。'},null);
  battle.start(['caoren','zhanghe','pikeman','archer','xiahoudun'],{boss:true,label:'V10 Golden Battle'});
  $('#soundV10').onclick=async()=>{const ok=await audio.unlock(true);$('#soundV10').textContent=ok?'聲音 ✓':'聲音';if(ok)audio.start('boss')};
  document.querySelectorAll('[data-cmd]').forEach(b=>b.onclick=()=>battle.command(b.dataset.cmd));
  $('#battleBack').onclick=back;
  addEventListener('pointerdown',()=>audio.unlock(false),{once:true,passive:true});
}
boot();
