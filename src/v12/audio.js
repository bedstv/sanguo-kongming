// Keep the proven synchronous HTMLMediaElement primer, audioSession playback,
// touch/pointer/keyboard resume, visibilitychange and pageshow from V11 unchanged.
import {AudioV11} from '../v11/audioV11.js';
import {asset} from './assets.js';
export class AudioV12 extends AudioV11{
 constructor(){super();this.buffers=new Map();this.loading=new Map();this.offset=0;this.startedAt=0;this.request=0;this.mode='boss';this.source=null;this.bgmGain=null;this.hasEntered=false;this.muted=false;}
 async load(mode){if(this.buffers.has(mode))return this.buffers.get(mode);if(!this.loading.has(mode))this.loading.set(mode,fetch(asset(`audio/${mode}.${['world','town','bridge','naval','jingnan'].includes(mode)?'mp3':'wav'}`)).then(r=>{if(!r.ok)throw new Error(`音樂讀取失敗 ${r.status}`);return r.arrayBuffer();}).then(b=>this.ensure().decodeAudioData(b)).then(b=>{this.buffers.set(mode,b);return b;}).catch(e=>{this.loading.delete(mode);throw e;}));return this.loading.get(mode);}
 async start(mode='boss'){
  if(mode==='defeat'){this.stop();this.mode='defeat';return;}
  if(!['battle','boss','victory','world','town','bridge','naval','jingnan'].includes(mode))mode='boss';
  if(this.mode!==mode){this.stop();this.offset=0;this.mode=mode;}
  if(!this.hasEntered||this.muted||!this.isReady()||this.source||document.hidden)return;
  const request=++this.request;this.timer={loading:true};
  try{const buffer=await this.load(mode);if(request!==this.request||this.muted||document.hidden||!this.isReady())return;const c=this.ctx,source=c.createBufferSource(),gain=c.createGain();source.buffer=buffer;source.loop=mode!=='victory';gain.gain.value=.36;source.connect(gain);gain.connect(this.master);this.source=source;this.bgmGain=gain;this.timer=source;this.startedAt=c.currentTime;source.start(0,this.offset%buffer.duration);source.onended=()=>{if(this.source===source&&!source.loop){this.source=null;this.timer={ended:true};this.offset=0;}};}catch(e){if(request===this.request){this.timer=null;this.lastError=String(e);document.dispatchEvent(new CustomEvent('v12audioerror',{detail:this.lastError}));}}
 }
 stop(){this.request=(this.request||0)+1;if(this.source){const dur=this.source.buffer?.duration||1;this.offset=((this.offset||0)+this.ctx.currentTime-this.startedAt)%dur;const src=this.source;this.source=null;src.onended=null;try{src.stop();src.disconnect();}catch{}this.bgmGain?.disconnect();}this.timer=null;}
 mute(){this.muted=true;this.enabled=false;this.stop();if(this.master)this.master.gain.value=0;}
 async enable(){this.muted=false;this.enabled=true;this.hasEntered=true;this.primeGesture();if(this.master)this.master.gain.value=.9;const ok=await this.unlock(true,true);if(ok)await this.start(this.mode);return ok;}
 sfx(name){if(!this.hasEntered||this.muted||!this.isReady())return;const q={ui:[[81,.04],[86,.06]],attack:[[64,.04],[71,.035]],hit:[[40,.065],[33,.085]],cast:[[74,.06],[77,.08],[81,.1],[86,.16]],heal:[[74,.08],[78,.08],[81,.12],[86,.2]],ko:[[57,.08],[50,.13],[38,.22]],win:[[74,.08],[81,.08],[86,.2]],lose:[[62,.15],[58,.18],[50,.3]]};(q[name]||q.ui).forEach(([m,d],i)=>this.tone(m,d,['hit','ko','lose'].includes(name)?'triangle':'square',name==='ui'?.033:.07,i*.055));if(['attack','hit','ko'].includes(name))this.noise(name==='ko'?.16:.055,name==='attack'?.02:.055);}
}
