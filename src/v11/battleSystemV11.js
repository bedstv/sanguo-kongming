import {BattleSystem} from '../battle.js';
import {BattleRendererV11} from './battleRendererV11.js';
export class BattleSystemV11 extends BattleSystem{
  constructor(ui,state,audio,onEnd,cinematic=null){super(ui,state,audio,onEnd,cinematic);this.renderer=new BattleRendererV11(ui,state,p=>this.effective(p))}
}
