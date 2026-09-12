export class AudioSystem{
  constructor(){
    this.ctx=null;this.master=null;this.enabled=true;this.timer=null;this.step=0;this.mode='world';this.ready=false;this._starting=false;
    this._gesture=()=>{if(this.enabled&&!this.ready)this.unlock();};
    document.addEventListener('pointerdown',this._gesture,{passive:true,capture:true});
    document.addEventListener('touchend',this._gesture,{passive:true,capture:true});
    document.addEventListener('keydown',this._gesture,{passive:true,capture:true});
    queueMicrotask(()=>this.emit());
  }
  emit(){try{document.dispatchEvent(new CustomEvent('sanguo-audio-state',{detail:{enabled:this.enabled,ready:this.isReady(),context:this.ctx?.state||'none'}}))}catch{}}
  ensureContext(){
    if(!this.enabled)return null;
    const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;
    if(!this.ctx||this.ctx.state==='closed'){
      this.ctx=new A();
      this.master=this.ctx.createGain();this.master.gain.value=.82;
      const comp=this.ctx.createDynamicsCompressor();
      comp.threshold.value=-22;comp.knee.value=18;comp.ratio.value=5;comp.attack.value=.004;comp.release.value=.22;
      this.master.connect(comp);comp.connect(this.ctx.destination);
    }
    return this.ctx;
  }
  ensure(){return this.ensureContext()}
  isReady(){return !!(this.ctx&&this.ctx.state==='running'&&this.ready)}
  async unlock({chime=false}={}){
    if(!this.enabled)return false;
    const c=this.ensureContext();if(!c)return false;
    try{
      if(c.state!=='running')await c.resume();
      const o=c.createOscillator(),g=c.createGain();o.type='square';o.frequency.value=220;g.gain.value=.0001;o.connect(g);g.connect(this.master);o.start();o.stop(c.currentTime+.025);
      this.ready=c.state==='running';
      if(this.ready){
        document.removeEventListener('pointerdown',this._gesture,true);document.removeEventListener('touchend',this._gesture,true);document.removeEventListener('keydown',this._gesture,true);
        if(chime){this.tone(660,.07,'square',.055);this.tone(880,.09,'square',.05,.07)}
      }
      this.emit();return this.ready;
    }catch(e){this.ready=false;this.emit();return false}
  }
  tone(freq=440,dur=.08,type='square',vol=.05,delay=0){
    if(!this.enabled)return;const c=this.ensureContext();if(!c||c.state!=='running')return;
    const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+delay;o.type=type;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(Math.max(.0001,vol),t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+dur+.02)
  }
  sfx(name){
    if(!this.enabled)return;
    if(!this.isReady()){this.unlock({chime:true});return}
    const p={ui:[[660,.065,.06],[880,.08,.055]],move:[[510,.035,.025]],hit:[[210,.065,.07],[125,.12,.06]],cast:[[620,.08,.055],[800,.11,.05],[1040,.15,.045]],heal:[[500,.12,.045],[680,.15,.042],[920,.2,.038]],buy:[[720,.07,.05],[980,.1,.05]],win:[[660,.1,.05],[880,.1,.05],[1040,.12,.05],[1320,.17,.045]],level:[[660,.08,.05],[880,.08,.05],[1100,.08,.05],[1320,.16,.05]],lose:[[420,.14,.055],[300,.17,.05],[210,.22,.045]]}[name]||[];
    p.forEach((x,i)=>this.tone(x[0],x[1],name==='lose'?'triangle':'square',x[2],i*.07))
  }
  _beginMusic(){
    this.stop();if(!this.enabled||!this.isReady())return;
    const tunes={world:[523,659,784,659,587,659,698,659,523,659,880,784,698,659,587,523],battle:[392,440,523,587,523,440,392,330,392,494,587,659,587,494,440,392],boss:[330,392,466,523,466,392,349,330,294,349,440,523,466,392,349,294]};
    const bass={world:[196,196,220,220,175,175,196,196],battle:[147,147,165,165,175,175,165,165],boss:[110,110,123,123,131,131,123,123]};
    const m=tunes[this.mode]||tunes.world,b=bass[this.mode]||bass.world;this.step=0;
    const tick=()=>{if(!this.enabled||!this.isReady())return;this.tone(m[this.step%m.length],.13,'square',.035);this.tone(b[this.step%b.length],.19,'triangle',.021);if(this.step%4===0)this.tone(b[this.step%b.length]*2,.05,'square',.009,.02);this.step++};
    tick();this.timer=setInterval(tick,225)
  }
  start(mode='world'){
    this.mode=mode;this.stop();if(!this.enabled)return;
    if(this.isReady()){this._beginMusic();return}
    if(this._starting)return;this._starting=true;
    this.unlock().then(ok=>{this._starting=false;if(ok&&this.enabled)this._beginMusic()})
  }
  stop(){if(this.timer){clearInterval(this.timer);this.timer=null}}
  async toggle(){
    if(this.enabled&&!this.isReady()){
      const ok=await this.unlock({chime:true});if(ok)this._beginMusic();this.emit();return this.enabled
    }
    if(this.enabled){this.enabled=false;this.stop();this.emit();return false}
    this.enabled=true;const ok=await this.unlock({chime:true});if(ok)this._beginMusic();this.emit();return true
  }
}
