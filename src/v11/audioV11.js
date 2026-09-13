const SONGS={
 battle:{tempo:138,lead:[72,74,76,79,81,79,76,74,72,74,77,81,84,81,79,76,74,72,69,72,74,77,79,77,74,72,67,69,72,74,76,72],harm:[60,64,65,67,69,67,65,64,60,62,65,67,69,67,65,62],bass:[45,45,48,48,50,50,48,48,43,43,45,45,48,48,50,47],arp:[60,64,67,64,62,65,69,65]},
 boss:{tempo:154,lead:[64,67,68,71,73,71,68,67,64,62,59,62,64,67,71,73,76,73,71,68,64,62,59,57,59,62,64,68,71,73,71,68],harm:[52,55,56,59,61,59,56,55,52,50,47,50,52,55,59,61],bass:[40,40,43,43,44,44,43,43,38,38,40,40,43,43,44,40],arp:[52,56,59,56,50,55,59,55]},
 victory:{tempo:124,lead:[72,76,79,84,83,84,88,91,88,84,86,88,91,95,96,95],harm:[60,64,67,72,71,72,76,79],bass:[48,48,53,53,55,55,48,48],arp:[60,64,67,72]}
};

// A tiny audible WAV played directly by an HTMLMediaElement during the user's tap.
// On iOS this helps Safari promote the page into a media playback audio session before
// WebAudio starts, which is more reliable than awaiting AudioContext.resume() alone.
const IOS_PRIME='data:audio/wav;base64,UklGRuQDAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YcADAAAAAFwWYyKdHtUMQPWx4qLdVujW/TsURSEDH5AOhPdz5BbeSOfD+xcSCiBBHykQu/lF5q3eYubJ+fIPth5YH54R5Psj6GffouXq99ANSh1IH/ES/P0L6j/gCuUo9rMLyhsUHx8UAAD56zbhmeSE9J4JOBq8HigV7wHs7UfiTeT/8pMHlxhDHgwWyAPf73HjJuSb8ZUF6RapHcwWhwXR8bLkJORY8KcDMhXyHGcXLQe/8wbmROQ278kBdBMfHN4Xtgim9WznheQ37gAAsRExGzIYIwqE9+Do5uRa7Uz+7Q8tGmMYcQtW+WDqZeWf7K78Kg4TGXIYoQwa++nrAOYG7Cj7awznF2EYsg3P/HrttuaP67z5sgqqFjAYow5x/g7vhOc562v4AQlfFeIXdA8AAKTwZ+gE6zb3WwcJFHgXJBB5ATryX+nt6h72wQWqEvMWthDdAszzaOr26iL1NgREEVYWJxEoBFn1gesb60X0vALbD6MVehFaBd32p+xc64TzVAFwDtoUrxFzBlj41+236+LyAAAGDQAUxxFxB8f5D+8q7F3ywf6fCxUTwhFTCCj7TfC07Pbxmf0+ChwSoxEaCXr8jvFT7avxiPzkCBcRahHFCbr90PIF7nzxj/uTBwkQGBFVCuf+EvTI7mjxr/pPBvQOsBDICgAAUPWZ72/x6fkXBdoNNBAhCwQBiPZ38I7xPPnvA70MpA9fC/IBufdg8cXxqvjXAqALAw+DC8kC4PhQ8hLyMfjRAYQKUw6NC4gD/PlH83Ty0/feAG0Jlg2ACy8ECvtC9OjyjfcAAFsIzgxcC74EC/w+9W7zYfc3/1EH/QsiCzUF+vw69gT0TfeE/lEGJQvTCpMF2f0z96b0UPfn/VwFSApyCtgFpf4n+FT1afdh/XUEaQkACgYGXf8V+Qz2l/fy/JwDiQh/CR0GAAD7+cv22veb/NQCqwfwCB0GjgDW+o/3L/ha/BwC0AZVCAgGBwGl+1f4lPgx/HcB+wWwB94FaQFn/CD5Cfke/OYALQUEB6EFtgEa/ej5jPkh/GgAaQRSBlEF7AG9/a36Gvo4/AAAsAOcBfEEDAJO/m37s/pk/K3/AwPlBIEEFgLN/if8U/uj/G//ZAItBAQECwI4/9f8+fv0/Eb/1QF5A3sD7AGQ/379pPxW/TP/VwHIAugCuAHT/xn+UP3H/Tb/6gAeAk0CcgEAAKb+/f1F/k3/kAB7AasBGgEYACT/p/7P/nn/SgDjAAUBsQAcAJL/Tv9k/7j/GABWAF0AOQAKAO7/7/8=';

export class AudioV11{
 constructor(){
  this.ctx=null;this.master=null;this.ready=false;this.enabled=true;this.mode='boss';this.timer=null;this.step=0;this.mediaPrimer=null;this.lastError='';
  this._resume=()=>this.unlock(false,true);
  ['pointerdown','touchstart','touchend','keydown'].forEach(ev=>document.addEventListener(ev,this._resume,{passive:true,capture:true}));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)this.stop();else this.unlock(false,false).then(ok=>{if(ok&&!this.timer)this.start(this.mode)})});
  window.addEventListener('pageshow',()=>this.unlock(false,false).then(ok=>{if(ok&&!this.timer)this.start(this.mode)}));
 }
 setPlaybackSession(){try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch{}}
 ensure(){
  if(this.ctx&&this.ctx.state!=='closed')return this.ctx;
  const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;
  try{this.ctx=new A({latencyHint:'interactive'})}catch{try{this.ctx=new A()}catch(e){this.lastError=String(e);return null}}
  this.master=this.ctx.createGain();this.master.gain.value=.9;
  const comp=this.ctx.createDynamicsCompressor();comp.threshold.value=-21;comp.knee.value=8;comp.ratio.value=5;comp.attack.value=.003;comp.release.value=.18;
  this.master.connect(comp);comp.connect(this.ctx.destination);
  this.ctx.onstatechange=()=>{this.ready=this.ctx?.state==='running'};
  return this.ctx;
 }
 primeGesture(){
  this.setPlaybackSession();const c=this.ensure();if(!c||!this.enabled)return c;
  try{
   if(!this.mediaPrimer){this.mediaPrimer=new Audio();this.mediaPrimer.src=IOS_PRIME;this.mediaPrimer.preload='auto';this.mediaPrimer.volume=.32;this.mediaPrimer.setAttribute('playsinline','');}
   this.mediaPrimer.currentTime=0;const p=this.mediaPrimer.play();if(p?.catch)p.catch(()=>{});
  }catch{}
  // Start a near-silent oscillator synchronously in the tap stack as a second iOS unlock path.
  try{const o=c.createOscillator(),g=c.createGain(),t=c.currentTime;g.gain.setValueAtTime(.0001,t);o.frequency.value=880;o.connect(g);g.connect(this.master);o.start(t);o.stop(t+.025)}catch{}
  try{const r=c.resume();if(r?.catch)r.catch(()=>{})}catch{}
  return c;
 }
 hz(m){return 440*Math.pow(2,(m-69)/12)}
 tone(m,d=.08,type='square',v=.03,delay=0,detune=0){const c=this.ensure();if(!c||c.state!=='running'||m==null)return;const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+delay;o.type=type;o.frequency.value=this.hz(m);o.detune.value=detune;g.gain.setValueAtTime(Math.max(.0001,v),t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+d+.03)}
 noise(d=.03,v=.012,delay=0){const c=this.ensure();if(!c||c.state!=='running')return;const n=Math.max(1,Math.floor(c.sampleRate*d)),b=c.createBuffer(1,n,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);const s=c.createBufferSource(),g=c.createGain(),t=c.currentTime+delay;s.buffer=b;g.gain.value=v;s.connect(g);g.connect(this.master);s.start(t)}
 async unlock(chime=true,fromGesture=false){
  const c=fromGesture?this.primeGesture():this.ensure();if(!c||!this.enabled)return false;
  this.setPlaybackSession();
  try{
   if(c.state!=='running')await c.resume();
   // Safari can briefly report interrupted/suspended after resume; retry once inside the same unlock flow.
   if(c.state!=='running'){await new Promise(r=>setTimeout(r,40));try{await c.resume()}catch{}}
   this.ready=c.state==='running';
   if(this.ready&&chime){this.tone(76,.065,'square',.085);this.tone(83,.11,'square',.075,.07);this.noise(.025,.012,.13)}
   if(this.ready&&!this.timer)this.start(this.mode);
   this.lastError=this.ready?'':`AudioContext ${c.state}`;
   return this.ready;
  }catch(e){this.ready=false;this.lastError=String(e);return false}
 }
 status(){return this.ctx?this.ctx.state:'uninitialized'}
 isReady(){return !!(this.ctx&&this.ctx.state==='running'&&this.ready)}
 start(mode='boss'){this.mode=SONGS[mode]?mode:'boss';this.stop();if(!this.isReady())return;const q=SONGS[this.mode],ms=60000/q.tempo/2;this.step=0;const tick=()=>{const s=this.step++,lead=q.lead[s%q.lead.length],harm=q.harm[Math.floor(s/2)%q.harm.length],bass=q.bass[Math.floor(s/2)%q.bass.length],arp=q.arp[s%q.arp.length];this.tone(lead,ms/1000*.7,'square',.036,0,s%2?4:-4);if(s%2===0)this.tone(harm,ms/1000*1.1,'square',.018,.006,7);this.tone(bass,ms/1000*1.4,'triangle',.032);if(s%2===1)this.tone(arp+12,ms/1000*.45,'square',.009,.012,2);if(s%4===0){this.noise(.035,.022);this.tone(bass-12,.05,'triangle',.021)}else if(s%4===2)this.noise(.018,.011);if(this.mode==='boss'&&s%8===7)this.noise(.055,.024)};tick();this.timer=setInterval(tick,ms)}
 stop(){if(this.timer){clearInterval(this.timer);this.timer=null}}
 sfx(name){const map={ui:[[76,.03],[81,.045]],hit:[[45,.045],[40,.07]],cast:[[74,.04],[79,.055],[86,.08],[91,.11]],heal:[[69,.05],[74,.065],[81,.09],[86,.12]],win:[[72,.045],[76,.055],[79,.065],[84,.085],[88,.12]],lose:[[64,.09],[59,.13],[55,.18]],level:[[72,.035],[76,.045],[81,.06],[88,.095]]};(map[name]||map.ui).forEach((x,i)=>this.tone(x[0],x[1],name==='lose'?'triangle':'square',.055,i*.045));if(name==='hit'){this.noise(.05,.032);this.tone(33,.06,'triangle',.036)}}
}
