// Original FC/SFC-inspired composition: 江陵烽聲. No sampled music.
// Run: node scripts/compose-v125.mjs
import fs from 'node:fs';
export const SCORE={title:'江陵烽聲',bpm:144,sampleRate:22050,bars:16,channels:1,
 melody:[
 [74,77,79,81,79,77,74,72],[69,72,74,77,74,72,69,67],
 [72,74,77,79,77,74,72,69],[67,69,72,74,72,69,67,65],
 [74,74,77,79,81,79,77,74],[72,74,77,74,72,69,67,69],
 [77,79,81,84,81,79,77,74],[72,69,67,65,67,69,72,74],
 [81,79,77,74,77,79,81,84],[79,77,74,72,74,77,79,81],
 [77,74,72,69,72,74,77,79],[74,72,69,67,69,72,74,77],
 [81,84,86,84,81,79,77,74],[79,81,84,81,79,77,74,72],
 [77,74,72,69,67,69,72,74],[77,74,72,69,67,65,62,0]],
 roots:[50,46,48,43,50,46,48,50,50,46,48,43,50,46,48,50]};
export function renderFortress(){
 const rate=SCORE.sampleRate,beat=60/SCORE.bpm,step=beat/2,duration=SCORE.bars*4*beat,frames=Math.round(duration*rate),bytes=new Uint8Array(44+frames*2),view=new DataView(bytes.buffer),freq=m=>440*Math.pow(2,(m-69)/12);
 const chars=(o,s)=>{for(let i=0;i<s.length;i++)bytes[o+i]=s.charCodeAt(i);};
 chars(0,'RIFF');view.setUint32(4,36+frames*2,true);chars(8,'WAVE');chars(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,rate,true);view.setUint32(28,rate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);chars(36,'data');view.setUint32(40,frames*2,true);
 let seed=125,noise=0,peak=0,sum=0;
 for(let i=0;i<frames;i++){const t=i/rate,bar=Math.min(15,Math.floor(t/(4*beat))),sub=Math.floor(t/step)%8,local=t%step,note=SCORE.melody[bar][sub],root=SCORE.roots[bar];
 const env=Math.min(1,local/.006)*Math.min(1,(step-local)/.016)*(.72+.28*Math.exp(-local*8));
 const lead=note?((freq(note)*t)%1<.25?1:-1)*.14*env:0;
 const bt=t%beat,bass=(2/Math.PI)*Math.asin(Math.sin(2*Math.PI*freq(root+(Math.floor(t/beat)%2?12:0))*t))*.19*Math.exp(-bt*1.6);
 const arps=[0,7,12,15],arp=(Math.sin(2*Math.PI*freq(root+24+arps[Math.floor(t/(step/2))%4])*t)>=0?1:-1)*.042*env;
 seed=(seed*1664525+1013904223)>>>0;noise=.55*noise+.45*((seed/4294967296)*2-1);
 const drum=bt<.15?(Math.floor(t/beat)%2?noise*.13*Math.exp(-bt*23):Math.sin(2*Math.PI*(52*bt+24*(1-Math.exp(-bt*28))/28))*.16*Math.exp(-bt*23)):0;
 const hats=noise*.06*Math.exp(-local*50),fade=Math.min(1,t/.02,(duration-t)/.02),v=(lead+bass+arp+drum+hats)*fade*.92;peak=Math.max(peak,Math.abs(v));sum+=v*v;view.setInt16(44+i*2,Math.round(Math.max(-1,Math.min(1,v))*32767),true);
 }
 return {bytes,analysis:{title:SCORE.title,bpm:SCORE.bpm,durationSeconds:frames/rate,sampleRate:rate,channels:1,peak,rms:Math.sqrt(sum/frames),clippedSamples:0}};
}
const {bytes,analysis}=renderFortress();fs.writeFileSync('assets/v12/audio/fortress.wav',bytes);fs.writeFileSync('assets/v12/source/fortress-score.json',JSON.stringify({...SCORE,...analysis},null,2));console.log(analysis);
