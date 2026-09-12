const $=s=>document.querySelector(s);
function pulseDialog(){const d=$('#worldMsg');if(!d)return;d.classList.remove('hint-pulse');void d.offsetWidth;d.classList.add('hint-pulse');setTimeout(()=>d.classList.remove('hint-pulse'),900)}
function revealHint(){const menu=$('#menuOverlay');if(menu)menu.classList.remove('on');setTimeout(()=>{pulseDialog();const t=$('#toast');if(t){t.textContent='任務提示已顯示在左下對話框';t.classList.add('on');clearTimeout(t.t);t.t=setTimeout(()=>t.classList.remove('on'),1400)}},0)}
const hintBtn=$('#hintBtn');if(hintBtn)hintBtn.addEventListener('click',revealHint);
const quickHint=$('#quickHintBtn');if(quickHint)quickHint.addEventListener('click',()=>hintBtn?.click());
const quest=$('#quest');if(quest){quest.title='點一下查看任務提示';quest.addEventListener('click',()=>hintBtn?.click())}
function audioUi({enabled=true,ready=false,context='none'}={}){const s=$('#soundState'),b=$('#soundBtn');if(!enabled){if(s)s.textContent='聲音 關';if(b)b.textContent='開啟聲音';return}if(ready){if(s)s.textContent='聲音 已啟用';if(b)b.textContent='關閉聲音';return}if(s)s.textContent='聲音 待啟用';if(b)b.textContent='啟用 / 測試聲音'}
document.addEventListener('sanguo-audio-state',e=>audioUi(e.detail));
setTimeout(()=>audioUi({enabled:true,ready:false,context:'none'}),0);
