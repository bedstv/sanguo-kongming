import {preload} from './assets.js';
import {Timeline} from './timeline.js';
import {GoldenBattle} from './battle.js';
import {BattleRendererV12} from './renderer.js';
import {AudioV12} from './audio.js';
const $=s=>document.querySelector(s),root=$('#battle'),audio=new AudioV12();let battle,renderer,timeline;
if(new URLSearchParams(location.search).get('music')==='battle')audio.mode='battle';
function audioUI(){const ok=audio.isReady()&&!audio.muted;$('#sound').textContent=ok?'聲音 ✓':'聲音';$('#sound').setAttribute('aria-pressed',String(ok));$('#sound').setAttribute('aria-label',ok?'關閉聲音':'開啟聲音');}
async function enableSound(){const ok=await audio.enable();audioUI();if(!ok)$('#message').textContent='請再點「聲音」啟用音樂。';}
$('#sound').onclick=()=>{if(audio.isReady()&&!audio.muted){audio.mute();audioUI();}else enableSound();};
$('#identity').onclick=()=>{const active=root.classList.toggle('identity-test');$('#identity').textContent=active?'顯名':'隱名';$('#identity').setAttribute('aria-pressed',String(active));renderer.render(battle.state);audio.sfx('ui');};
$('#cancel').onclick=()=>battle.cancel();document.querySelectorAll('[data-cmd]').forEach(b=>b.onclick=()=>battle.command(b.dataset.cmd));
addEventListener('keydown',e=>{if(e.key==='Escape')battle?.cancel();});
$('#enter').onclick=()=>{enableSound();$('#loading').hidden=true;$('#commands button').focus();};$('#silent').onclick=()=>{audio.hasEntered=true;audio.mute();$('#loading').hidden=true;$('#commands button').focus();};
$('#replay').onclick=()=>location.reload();
function soundResume(){audioUI();if(audio.hasEntered&&!audio.muted&&!document.hidden)audio.unlock(false,false).then(audioUI);}
document.addEventListener('visibilitychange',soundResume);addEventListener('pageshow',soundResume);document.addEventListener('v12audioerror',()=>{$('#message').textContent='音樂載入失敗，請點「聲音」重試。';});
try{const images=await preload((n,total)=>$('#loadingText').textContent=`整軍備戰 ${n} / ${total}`);timeline=new Timeline();battle=new GoldenBattle({timeline,audio,onChange:s=>renderer?.render(s),onMessage:t=>{if(!root.classList.contains('identity-test'))$('#message').textContent=t;}});renderer=new BattleRendererV12(root,images,timeline,battle);$('#loadingText').textContent='五將同心，迎戰魏軍。';$('#enter').disabled=false;$('#enter').textContent='鳴鼓出戰';$('#silent').disabled=false;
 // Test-only access is opt-in; ordinary play does not expose mutable battle state.
 if(new URLSearchParams(location.search).has('qa'))window.__V12={battle,renderer,timeline,audio,images};
}catch(error){$('#loadingText').textContent=`${error.message}，請重新載入。`;$('#enter').disabled=false;$('#enter').textContent='重新載入';$('#enter').onclick=()=>location.reload();console.error(error);}
