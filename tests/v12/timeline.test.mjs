import test from 'node:test';
import assert from 'node:assert/strict';
import {Timeline} from '../../src/v12/timeline.js';

function clock(){
 const handlers=new Map();
 globalThis.document={hidden:false,addEventListener:(name,fn)=>handlers.set(name,fn),removeEventListener:(name,fn)=>{if(handlers.get(name)===fn)handlers.delete(name);}};
 globalThis.requestAnimationFrame=()=>1;
 globalThis.cancelAnimationFrame=()=>{};
 const timeline=new Timeline();let now=0;timeline.frame(now);
 return {timeline,async advance(ms){while(ms>0){const step=Math.min(10,ms);ms-=step;now+=step;timeline.frame(now);await Promise.resolve();}},visibility(hidden){document.hidden=hidden;handlers.get('visibilitychange')();timeline.frame(now);}};
}
test('real attack timeline anticipates, strikes once, recovers and clears',async()=>{
 const {timeline:t,advance}=clock();let hits=0;const done=t.attack('hero',()=>hits++);
 assert.equal(t.animations.get('hero').pose,'anticipation');
 await advance(170);assert.equal(hits,0);
 await advance(10);assert.equal(hits,1);assert.equal(t.animations.get('hero').pose,'strike');
 await advance(120);assert.equal(t.animations.get('hero').pose,'recover');
 await advance(220);await done;assert.equal(t.animations.has('hero'),false);assert.equal(hits,1);t.dispose();
});
test('cast holds its pose before impact and ends after recovery',async()=>{
 const {timeline:t,advance}=clock();let hits=0;const done=t.cast('hero',()=>hits++);
 await advance(170);assert.equal(t.animations.get('hero').pose,'cast');assert.equal(hits,0);
 await advance(180);assert.equal(hits,1);
 await advance(300);assert.equal(t.animations.get('hero').pose,'recover');
 await advance(160);await done;assert.equal(t.animations.has('hero'),false);t.dispose();
});
test('hidden tab preserves attack progress and resumes without skipping',async()=>{
 const {timeline:t,advance,visibility}=clock();let hits=0;const done=t.attack('hero',()=>hits++);
 await advance(100);visibility(true);await advance(1000);assert.equal(t.time,100);assert.equal(hits,0);
 visibility(false);await advance(80);assert.equal(hits,1);assert.equal(t.animations.get('hero').pose,'strike');
 await advance(340);await done;t.dispose();
});
test('lethal hurt releases pose before KO effect and expires the effect',async()=>{
 const {timeline:t,advance}=clock();const done=t.hurt('enemy',true);
 assert.equal(t.animations.get('enemy').pose,'hurt');await advance(250);await done;
 assert.equal(t.animations.has('enemy'),false);assert.equal(t.effects[0].kind,'ko');
 await advance(520);assert.equal(t.effects.length,0);t.dispose();
});
