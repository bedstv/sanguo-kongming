import {V10_ATLAS,V10_PORTRAITS,FRAME_W,FRAME_H,COLS,ROWS,frameFor,PORTRAIT_MAP} from './assetsV10.js';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const seg=(hp,max,enemy=false)=>{const cells=8,on=Math.round(clamp(hp/Math.max(1,max),0,1)*cells);return `<div class="v10-troopbar ${enemy?'enemybar':'allybar'}" aria-label="${Math.max(0,hp)} / ${max}">${Array.from({length:cells},(_,i)=>`<i class="${i<on?'on':''}"></i>`).join('')}</div>`};
const actorStats=p=>`<b>${p.name}</b><em>${p.role}</em><span>Lv.${p.level}</span><span>兵 ${Math.max(0,p.hp)}/${p.maxHp}</span><span>SP ${p.sp}/${p.maxSp}</span>`;
export class BattleRendererV10{
  constructor(ui,state,effective){this.ui=ui;this.state=state;this.effective=effective}
  sprite(id,pose,frame,enemy=false){
    const {row,col}=frameFor(id,pose,frame);
    return `<div class="v10-sprite-window"><div class="v10-sprite-sheet ${enemy?'mirror':''}" style="background-image:url('${V10_ATLAS}');background-size:${FRAME_W*COLS}px ${FRAME_H*ROWS}px;background-position:${-col*FRAME_W}px ${-row*FRAME_H}px"></div></div>`;
  }
  unit(u,i,side,b){
    const enemy=side==='enemy', key=`${enemy?'e':'a'}${i}`, pose=b.pose?.[key]||'idle', frame=b.animFrame?.[key]??(b.round+i)%2;
    const active=!enemy&&i===b.actor, dead=u.hp<=0;
    return `<div class="battle-unit v10-unit ${side} ${active?'active':''} ${dead?'dead':''}" data-side="${side}" data-idx="${i}">
      <div class="v10-info"><strong>${u.name}</strong><small>${Math.max(0,u.hp)}</small>${seg(u.hp,u.maxHp,enemy)}</div>
      ${this.sprite(u.id||u.archetype||'pikeman',dead?'ko':pose,frame,enemy)}
    </div>`;
  }
  render(b){
    const allies=this.state.party.slice(0,5), enemies=b.enemies.slice(0,5);
    this.ui.ally.innerHTML=allies.map((u,i)=>this.unit(u,i,'ally',b)).join('');
    this.ui.enemy.innerHTML=enemies.map((u,i)=>this.unit(u,i,'enemy',b)).join('');
    this.ui.round.textContent=`${b.label} · 第 ${b.round} 回合 · ${this.state.formation}陣`;
    const p=this.state.party[b.actor]||this.state.party.find(x=>x.hp>0)||this.state.party[0];
    const pi=PORTRAIT_MAP[p.id]??0;
    this.ui.portrait.style.backgroundImage=`url('${V10_PORTRAITS}')`;
    this.ui.portrait.style.backgroundSize=`${96*5}px 96px`;
    this.ui.portrait.style.backgroundPosition=`${-pi*96}px 0px`;
    this.ui.portrait.setAttribute('aria-label',p.name);
    this.ui.stats.innerHTML=actorStats(p);
  }
}
