const $=s=>document.querySelector(s);
const isIOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
let last={enabled:true,ready:false,context:'none',everUnlocked:false};
function toast(t){const e=$('#toast');if(!e)return;e.textContent=t;e.classList.add('on');clearTimeout(e.t);e.t=setTimeout(()=>e.classList.remove('on'),1800)}
function pulseDialog(){const d=$('#worldMsg');if(!d)return;d.classList.remove('hint-pulse');void d.offsetWidth;d.classList.add('hint-pulse');setTimeout(()=>d.classList.remove('hint-pulse'),900)}
function revealHint(){const menu=$('#menuOverlay');if(menu)menu.classList.remove('on');setTimeout(()=>{pulseDialog();toast('任務提示已顯示在左下對話框')},0)}
const hintBtn=$('#hintBtn');if(hintBtn)hintBtn.addEventListener('click',revealHint);
const quickHint=$('#quickHintBtn');if(quickHint)quickHint.addEventListener('click',()=>hintBtn?.click());
const quest=$('#quest');if(quest){quest.title='點一下查看任務提示';quest.addEventListener('click',()=>hintBtn?.click())}
function audioUi(detail={}){
  last={...last,...detail};const s=$('#soundState'),b=$('#soundBtn');
  if(!last.enabled){if(s)s.textContent='聲音 關';if(b)b.textContent='開啟聲音';return}
  if(last.ready){if(s)s.textContent='聲音 已啟用';if(b)b.textContent='關閉聲音';return}
  const suspended=last.context==='suspended';if(s)s.textContent=suspended?'聲音 待恢復':'聲音 待啟用';if(b)b.textContent=suspended?'點一下恢復聲音':'啟用 / 測試聲音';
}
document.addEventListener('sanguo-audio-state',e=>{const before=last.ready;audioUi(e.detail);if(!before&&e.detail?.ready)toast(isIOS?'iPhone 音訊已解鎖，BGM 已開始':'音訊已啟用')});
const soundBtn=$('#soundBtn');if(soundBtn)soundBtn.addEventListener('click',()=>setTimeout(()=>{if(isIOS&&last.enabled&&!last.ready)toast('iPhone 尚未解鎖音訊：請調高媒體音量、確認藍牙輸出，再點一次')},500));
window.addEventListener('pageshow',()=>{if(isIOS&&last.enabled&&!last.ready)audioUi(last)});
setTimeout(()=>audioUi(last),0);
