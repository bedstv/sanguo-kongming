import {battleSpriteData,battlePortraitData} from './battleArt.js';

function segBar(hp,max,enemy=false){
  const cells=10,ratio=Math.max(0,Math.min(1,hp/Math.max(1,max))),filled=Math.ceil(ratio*cells);
  return `<div class="v8-segbar ${enemy?'enemybar':'allybar'}" aria-label="${Math.max(0,hp)} / ${max}">${Array.from({length:cells},(_,i)=>`<i class="${i<filled?'on':''}"></i>`).join('')}</div>`;
}
function statLabel(p,ep){return `<b>${p.name}</b><em>${p.role}</em><span>Lv.${p.level}</span><span>兵 ${Math.max(0,p.hp)}/${p.maxHp}</span><span>SP ${p.sp}/${p.maxSp}</span><span>武 ${ep.atk}　防 ${ep.def}</span><span>智 ${ep.int}　速 ${ep.agi}</span>`}

export class BattleRenderer{
  constructor(ui,state,effective){this.ui=ui;this.state=state;this.effective=effective}
  render(b){
    this.ui.enemy.innerHTML=b.enemies.map((e,i)=>this.unitHtml(e,i,true,b)).join('');
    this.ui.ally.innerHTML=this.state.party.map((p,i)=>this.unitHtml(p,i,false,b)).join('');
    this.ui.round.textContent=`${b.label} · 第 ${b.round} 回合 · ${this.state.formation}陣`;
    const p=this.state.party[b.actor]||this.state.party.find(x=>x.hp>0);
    if(p){this.ui.portrait.src=battlePortraitData(p.id);this.ui.portrait.alt=`${p.name} 肖像`;this.ui.stats.innerHTML=statLabel(p,this.effective(p));}
    this.ui.root.dataset.boss=b.boss?'1':'0';
  }
  unitHtml(x,i,enemy,b){
    const key=enemy?x.archetype:x.id,mapKey=`${enemy?'e':'a'}${i}`,pose=b.pose[mapKey]||'idle',frame=b.animFrame[mapKey]??(pose==='idle'?b.round%2:0);
    const classes=['battle-unit','v8-unit',enemy?'enemy':'ally',x.hp<=0?'dead':'',i===b.actor&&!enemy?'active':'',pose==='cast'?'casting':''].filter(Boolean).join(' ');
    const sprite=battleSpriteData(key,pose,frame);
    const hp=Math.max(0,x.hp);
    return `<div class="${classes}" data-side="${enemy?'enemy':'ally'}" data-idx="${i}">
      <div class="sprite-shell v8-sprite-shell"><img src="${sprite}" alt="${x.name}"></div>
      <div class="unit-copy v8-unit-copy"><strong>${x.name}</strong><small>${hp}</small>${segBar(hp,x.maxHp,enemy)}</div>
    </div>`;
  }
}
