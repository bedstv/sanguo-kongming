// One RAF-owned timeline. Pauses while hidden: no background action skips.
export class Timeline{
 constructor(){this.time=0;this.last=null;this.jobs=[];this.animations=new Map();this.effects=[];this.listeners=new Set();this.running=true;this.frame=this.frame.bind(this);document.addEventListener('visibilitychange',()=>{this.last=null;});this.raf=requestAnimationFrame(this.frame);}
 frame(now){if(!this.running)return;const dt=this.last==null?0:Math.min(50,now-this.last);this.last=now;if(!document.hidden){this.time+=dt;for(const j of this.jobs.filter(x=>x.at<=this.time)){this.jobs.splice(this.jobs.indexOf(j),1);j.resolve();}this.effects=this.effects.filter(e=>this.time-e.start<e.duration);for(const fn of this.listeners)fn(this.time);}this.raf=requestAnimationFrame(this.frame);}
 wait(ms){return new Promise(resolve=>this.jobs.push({at:this.time+ms,resolve}));}
 pose(id,pose){this.animations.set(id,{pose,start:this.time});}
 clear(id){this.animations.delete(id);}
 effect(id,kind,text='',duration=640){this.effects.push({id,kind,text,start:this.time,duration});}
 async attack(id,hit){this.pose(id,'anticipation');await this.wait(180);this.pose(id,'strike');hit();await this.wait(120);this.pose(id,'recover');await this.wait(220);this.clear(id);}
 async cast(id,hit){this.pose(id,'anticipation');await this.wait(170);this.pose(id,'cast');await this.wait(180);hit();await this.wait(300);this.pose(id,'recover');await this.wait(160);this.clear(id);}
 async hurt(id,ko){this.pose(id,'hurt');await this.wait(250);this.clear(id);if(ko)this.effect(id,'ko','',520);}
 dispose(){this.running=false;cancelAnimationFrame(this.raf);}
}
