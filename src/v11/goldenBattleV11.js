import {PARTY_TEMPLATE} from '../data.js';
import {BattleSystemV11} from './battleSystemV11.js';
import {AudioV11} from './audioV11.js';
const $=s=>document.querySelector(s);const audio=new AudioV11();
const state={formation:'鶴翼',gold:500,inventory:{ration:4},party:structuredClone(PARTY_TEMPLATE)};state.party.forEach(p=>{p.hp=p.maxHp;p.sp=p.maxSp});
const ui={root:$('#battle'),ally:$('#allyList'),enemy:$('#enemyList'),round:$('#battleRound'),portrait:$('#portrait'),stats:$('#actorStats'),msg:$('#battleMsg'),skills:$('#skills'),cmds:$('#cmds')};let battle;
const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function back(){if(!battle?.b||battle.b.busy)return;battle.b.select=null;ui.skills.classList.remove('open');ui.cmds.classList.remove('hidden');battle.render();battle.msg('重新選擇指令。');audio.sfx('ui')}
function setAudioUI(ok,detail=''){
 const btn=$('#soundV11'),gate=$('#soundGateV11'),label=$('#soundGateText');
 if(ok){btn.textContent='聲音 ✓';gate?.classList.add('hidden');if(label)label.textContent='聲音已啟用'}
 else{btn.textContent='聲音 !';gate?.classList.remove('hidden');if(label)label.textContent=detail||'點一下啟用聲音'}
}
async function enableSound(ev){
 ev?.preventDefault?.();
 // Must happen synchronously in the user's tap stack on iPhone.
 audio.primeGesture();
 const btn=$('#soundV11');if(btn)btn.textContent='啟用中…';
 const ok=await audio.unlock(true,true);
 if(ok){audio.start('boss');setAudioUI(true);ui.msg.textContent='iPhone 音訊已解鎖，BGM 已開始。'}
 else{setAudioUI(false,`音訊尚未啟用（${audio.status()}），請再點一次`);ui.msg.textContent=`音訊啟用失敗：${audio.status()}。請確認媒體音量後再點「啟用聲音」。`}
}
function boot(){
  battle=new BattleSystemV11(ui,state,audio,()=>{ui.msg.textContent='V11 Golden Battle 測試結束。重新整理即可再戰。';audio.start('victory')},null);
  battle.start(['caoren','zhanghe','pikeman','archer','xiahoudun'],{boss:true,label:'V11 Golden Battle'});
  $('#soundV11').addEventListener('click',enableSound);
  $('#soundGateV11')?.addEventListener('click',enableSound);
  $('#identityV11').onclick=()=>{ui.root.classList.toggle('identity-test');$('#identityV11').textContent=ui.root.classList.contains('identity-test')?'顯名':'隱名';audio.sfx('ui')};
  document.querySelectorAll('[data-cmd]').forEach(b=>b.onclick=()=>battle.command(b.dataset.cmd));$('#battleBack').onclick=back;
  if(!isIOS)$('#soundGateV11')?.classList.add('hidden');
  addEventListener('pointerdown',()=>audio.unlock(false,true).then(ok=>{if(ok){setAudioUI(true);if(!audio.timer)audio.start('boss')}}),{once:true,passive:true});
}
boot();
