const $=s=>document.querySelector(s);
const battle=$('#battle'),round=$('#battleRound');
function sceneFromText(t=''){if(/決戰|夏侯惇|Boss|BOSS/.test(t))return'boss';if(/博望|山道|森林|伏兵/.test(t))return'forest';return'field'}
function syncBattleScene(){if(!battle||!round)return;battle.dataset.scene=sceneFromText(round.textContent)}
if(round){new MutationObserver(syncBattleScene).observe(round,{childList:true,characterData:true,subtree:true});syncBattleScene()}
const quest=$('#quest');if(quest)quest.setAttribute('aria-label','目前主線任務；點一下可查看提示');
