import {PARTY_TEMPLATE} from '../data.js';
import {BattleSystemV11} from './battleSystemV11.js';
import {AudioV11} from './audioV11.js';
const $=s=>document.querySelector(s);const audio=new AudioV11();
const state={formation:'鶴翼',gold:500,inventory:{ration:4},party:structuredClone(PARTY_TEMPLATE)};state.party.forEach(p=>{p.hp=p.maxHp;p.sp=p.maxSp});
const ui={root:$('#battle'),ally:$('#allyList'),enemy:$('#enemyList'),round:$('#battleRound'),portrait:$('#portrait'),stats:$('#actorStats'),msg:$('#battleMsg'),skills:$('#skills'),cmds:$('#cmds')};let battle;
function back(){if(!battle?.b||battle.b.busy)return;battle.b.select=null;ui.skills.classList.remove('open');ui.cmds.classList.remove('hidden');battle.render();battle.msg('重新選擇指令。');audio.sfx('ui')}
function boot(){
  battle=new BattleSystemV11(ui,state,audio,()=>{ui.msg.textContent='V11 Golden Battle 測試結束。重新整理即可再戰。';audio.start('victory')},null);
  battle.start(['caoren','zhanghe','pikeman','archer','xiahoudun'],{boss:true,label:'V11 Golden Battle'});
  $('#soundV11').onclick=async()=>{const ok=await audio.unlock(true);$('#soundV11').textContent=ok?'聲音 ✓':'聲音';if(ok)audio.start('boss')};
  $('#identityV11').onclick=()=>{ui.root.classList.toggle('identity-test');$('#identityV11').textContent=ui.root.classList.contains('identity-test')?'顯名':'隱名';audio.sfx('ui')};
  document.querySelectorAll('[data-cmd]').forEach(b=>b.onclick=()=>battle.command(b.dataset.cmd));$('#battleBack').onclick=back;
  addEventListener('pointerdown',()=>audio.unlock(false).then(ok=>{if(ok&&!audio.timer)audio.start('boss')}),{once:true,passive:true});
}
boot();
