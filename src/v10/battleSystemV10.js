import {BattleSystem} from '../battle.js';
import {BattleRendererV10} from './battleRendererV10.js';
export class BattleSystemV10 extends BattleSystem{
  constructor(ui,state,audio,onEnd,cinematic=null){
    super(ui,state,audio,onEnd,cinematic);
    this.renderer=new BattleRendererV10(ui,state,p=>this.effective(p));
  }
}
