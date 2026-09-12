export class AudioSystem{
  constructor(){
    this.ctx=null;this.master=null;this.enabled=true;this.timer=null;this.step=0;this.mode='world';this.ready=false;this._starting=false;this._everUnlocked=false;
    this._gesture=()=>{if(this.enabled&&(!this.isReady()||this.ctx?.state!=='running'))this.unlock({chime:false,fromGesture:true})};
    document.addEventListener('pointerdown',this._gesture,{passive:true,capture:true});
    document.addEventListener('touchstart',this._gesture,{passive:true,capture:true});
    document.addEventListener('touchend',this._gesture,{passive:true,capture:true});
    document.addEventListener('keydown',this._gesture,{passive:true,capture:true});
    document.addEventListener('visibilitychange',()=>this._visibility());
    window.addEventListener('pageshow',()=>this._wakeAfterBackground());
    queueMicrotask(()=>this.emit());
  }
  emit(){try{document.dispatchEvent(new CustomEvent('sanguo-audio-state',{detail:{enabled:this.enabled,ready:this.isReady(),context:this.ctx?.state||'none',everUnlocked:this._everUnlocked}}))}catch{}}
  ensureContext(){
    if(!this.enabled)return null;
    const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;
    if(!this.ctx||this.ctx.state==='closed'){
      try{if(navigator.audioSession&&'type'in navigator.audioSession)navigator.audioSession.type='playback'}catch{}
      this.ctx=new A({latencyHint:'interactive'});
      this.master=this.ctx.createGain();this.master.gain.value=.95;
      const comp=this.ctx.createDynamicsCompressor();comp.threshold.value=-20;comp.knee.value=16;comp.ratio.value=4;comp.attack.value=.003;comp.release.value=.2;
      this.master.connect(comp);comp.connect(this.ctx.destination);
      this.ctx.onstatechange=()=>{this.ready=this.ctx?.state==='running'&&this._everUnlocked;this.emit()};
    }
    return this.ctx;
  }
  ensure(){return this.ensureContext()}
  isReady(){return !!(this.ctx&&this.ctx.state==='running'&&this.ready)}
  _prime(c){
    try{
      const b=c.createBuffer(1,1,22050),s=c.createBufferSource(),g=c.createGain();g.gain.value=.00001;s.buffer=b;s.connect(g);g.connect(this.master);s.start(0);
      const o=c.createOscillator(),og=c.createGain();o.type='square';o.frequency.value=220;og.gain.value=.00001;o.connect(og);og.connect(this.master);o.start(0);o.stop(c.currentTime+.02);
    }catch{}
  }
  async unlock({chime=false,fromGesture=false}={}){
    if(!this.enabled)return false;const c=this.ensureContext();if(!c)return false;
    try{
      this._prime(c);
      if(c.state!=='running')await c.resume();
      this._prime(c);
      this.ready=c.state==='running';this._everUnlocked=this._everUnlocked||this.ready;
      if(this.ready&&chime){this.tone(660,.09,'square',.085);this.tone(880,.12,'square',.075,.08)}
      this.emit();
      if(this.ready&&this.enabled&&!this.timer)this._beginMusic();
      return this.ready;
    }catch{this.ready=false;this.emit();return false}
  }
  async test(){if(!this.enabled)this.enabled=true;const ok=await this.unlock({chime:true,fromGesture:true});if(ok&&!this.timer)this._beginMusic();return ok}
  tone(freq=440,dur=.08,type='square',vol=.05,delay=0){
    if(!this.enabled)return;const c=this.ensureContext();if(!c||c.state!=='running')return;
    const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+delay;o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(Math.max(.0001,vol),t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+dur+.02)
  }
  sfx(name){
    if(!this.enabled)return;if(!this.isReady()){this.unlock({chime:false});return}
    const p={ui:[[660,.07,.075],[880,.09,.07]],move:[[510,.04,.035]],hit:[[210,.07,.085],[125,.13,.075]],cast:[[620,.09,.07],[800,.12,.065],[1040,.16,.055]],heal:[[500,.13,.055],[680,.16,.05],[920,.21,.045]],buy:[[720,.08,.065],[980,.11,.06]],win:[[660,.11,.06],[880,.11,.06],[1040,.13,.06],[1320,.18,.055]],level:[[660,.09,.06],[880,.09,.06],[1100,.09,.06],[1320,.17,.055]],lose:[[420,.15,.07],[300,.18,.065],[210,.23,.055]]}[name]||[];
    p.forEach((x,i)=>this.tone(x[0],x[1],name==='lose'?'triangle':'square',x[2],i*.07))
  }
  _beginMusic(){
    this.stop();if(!this.enabled||!this.isReady())return;
    const tunes={world:[523,659,784,659,587,659,698,659,523,659,880,784,698,659,587,523],battle:[392,440,523,587,523,440,392,330,392,494,587,659,587,494,440,392],boss:[330,392,466,523,466,392,349,330,294,349,440,523,466,392,349,294]};
    const bass={world:[196,196,220,220,175,175,196,196],battle:[147,147,165,165,175,175,165,165],boss:[110,110,123,123,131,131,123,123]};
    const m=tunes[this.mode]||tunes.world,b=bass[this.mode]||bass.world;this.step=0;
    const tick=()=>{if(!this.enabled||!this.isReady())return;this.tone(m[this.step%m.length],.15,'square',.05);this.tone(b[this.step%b.length],.21,'triangle',.03);if(this.step%4===0)this.tone(b[this.step%b.length]*2,.06,'square',.014,.02);this.step++};
    tick();this.timer=setInterval(tick,225)
  }
  start(mode='world'){
    this.mode=mode;this.stop();if(!this.enabled)return;if(this.isReady()){this._beginMusic();return}
    if(this._starting)return;this._starting=true;this.unlock().then(ok=>{this._starting=false;if(ok&&this.enabled&&!this.timer)this._beginMusic()})
  }
  stop(){if(this.timer){clearInterval(this.timer);this.timer=null}}
  async toggle(){
    if(this.enabled&&!this.isReady())return this.test();
    if(this.enabled){this.enabled=false;this.stop();this.emit();return false}
    this.enabled=true;const ok=await this.test();this.emit();return ok
  }
  _visibility(){
    if(document.hidden){this.stop();this.ready=false;this.emit();return}
    this._wakeAfterBackground()
  }
  _wakeAfterBackground(){
    if(!this.enabled||!this.ctx||!this._everUnlocked)return;
    this.ctx.resume().then(()=>{this.ready=this.ctx.state==='running';this.emit();if(this.ready&&!this.timer)this._beginMusic()}).catch(()=>{this.ready=false;this.emit()})
  }
}
