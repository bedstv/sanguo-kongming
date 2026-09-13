import {V11_HERO_ATLAS,V11_PORTRAITS,HERO_W,HERO_H,HERO_COLS,HERO_ROWS,heroFrameFor,PORTRAIT_MAP} from './assetsV11.js';
import {enemySpriteUrl} from './enemyArtV11.js';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const seg=(hp,max,enemy=false)=>{
  const cells=8,on=Math.round(clamp(hp/Math.max(1,max),0,1)*cells);
  return `<div class="v11-troopbar ${enemy?'enemybar':'allybar'}" aria-label="${Math.max(0,hp)} / ${max}">${Array.from({length:cells},(_,i)=>`<i class="${i<on?'on':''}"></i>`).join('')}</div>`;
};
const actorStats=p=>`<b>${p.name}</b><em>${p.role}　Lv.${p.level}</em><span>兵力 ${Math.max(0,p.hp)}/${p.maxHp}</span><span>策略 ${p.sp}/${p.maxSp}</span>`;
const safeId=id=>String(id||'soldier').replace(/[^a-z0-9_-]/gi,'');

export class BattleRendererV11{
  constructor(ui,state,effective){this.ui=ui;this.state=state;this.effective=effective}
  heroSprite(id,pose,frame){
    const {row,col}=heroFrameFor(id,pose,frame);
    return `<div class="v11-sprite-window hero-window"><div class="v11-sprite hero-sprite" style="background-image:url('${V11_HERO_ATLAS}');background-size:${HERO_W*HERO_COLS}px ${HERO_H*HERO_ROWS}px;background-position:${-col*HERO_W}px ${-row*HERO_H}px"></div></div>`;
  }
  enemySprite(id,pose,frame){
    const url=enemySpriteUrl(id,pose,frame);
    return `<div class="v11-sprite-window enemy-window"><div class="v11-sprite enemy-sprite mirror" style="background-image:url('${url}')"></div></div>`;
  }
  unit(u,i,side,b){
    const enemy=side==='enemy',key=`${enemy?'e':'a'}${i}`,pose=b.pose?.[key]||'idle',frame=b.animFrame?.[key]??(b.round+i)%2,active=!enemy&&i===b.actor,dead=u.hp<=0,id=safeId(u.id||u.archetype||'pikeman');
    return `<div class="battle-unit v11-unit ${side} char-${id} pose-${dead?'ko':pose} ${active?'active':''} ${dead?'dead':''}" data-side="${side}" data-idx="${i}" data-char="${id}"><div class="v11-info"><strong>${u.name}</strong><small>${Math.max(0,u.hp)}</small>${seg(u.hp,u.maxHp,enemy)}</div>${enemy?this.enemySprite(id,dead?'ko':pose,frame):this.heroSprite(id,dead?'ko':pose,frame)}</div>`;
  }
  render(b){
    const allies=this.state.party.slice(0,5),enemies=b.enemies.slice(0,5);
    this.ui.ally.innerHTML=allies.map((u,i)=>this.unit(u,i,'ally',b)).join('');
    this.ui.enemy.innerHTML=enemies.map((u,i)=>this.unit(u,i,'enemy',b)).join('');
    this.ui.round.textContent=`${b.label}　·　第 ${b.round} 回合　·　${this.state.formation}陣`;
    const p=this.state.party[b.actor]||this.state.party.find(x=>x.hp>0)||this.state.party[0],pi=PORTRAIT_MAP[p.id]??0;
    this.ui.portrait.style.backgroundImage=`url('${V11_PORTRAITS}')`;
    this.ui.portrait.style.backgroundSize=`${112*5}px 112px`;
    this.ui.portrait.style.backgroundPosition=`${-pi*112}px 0`;
    this.ui.portrait.setAttribute('aria-label',p.name);
    this.ui.stats.innerHTML=actorStats(p);
  }
}
