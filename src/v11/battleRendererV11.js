import {heroSpriteMeta,portraitUrl,HERO_W,HERO_H,HERO_COLS} from './heroArtV115.js';
import {ENEMY_W,ENEMY_H,ENEMY_COLS,enemyFrameFor} from './assetsV11.js';

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
    const {url,col}=heroSpriteMeta(id,pose,frame);
    return `<div class="v11-sprite-window hero-window"><div class="v11-sprite hero-sprite" style="background-image:url('${url}');background-size:${HERO_W*HERO_COLS}px ${HERO_H}px;background-position:${-col*HERO_W}px 0"></div></div>`;
  }
  enemySprite(id,pose,frame){
    const {url,col}=enemyFrameFor(id,pose,frame);
    return `<div class="v11-sprite-window enemy-window"><div class="v11-sprite enemy-sprite mirror" style="background-image:url('${url}');background-size:${ENEMY_W*ENEMY_COLS}px ${ENEMY_H}px;background-position:${-col*ENEMY_W}px 0"></div></div>`;
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
    const p=this.state.party[b.actor]||this.state.party.find(x=>x.hp>0)||this.state.party[0];
    this.ui.portrait.style.backgroundImage=`url('${portraitUrl(p.id)}')`;
    this.ui.portrait.style.backgroundSize='contain';
    this.ui.portrait.style.backgroundPosition='center';
    this.ui.portrait.setAttribute('aria-label',p.name);
    this.ui.stats.innerHTML=actorStats(p);
  }
}
