"""Original FC/SFC-inspired score, deterministic offline PCM production.
No sampled/copyrighted melodies. Two pulse voices, triangle bass, arps, noise kit.
"""
from pathlib import Path
import numpy as np, wave, json
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/v12/audio';SR=22050
rng=np.random.default_rng(1200)
# Hand-authored eight-bar phrases (eighth notes; None = rest).
battle_a=[74,81,79,77,74,None,72,74, 77,79,81,None,84,81,79,77, 76,79,77,74,72,None,69,72, 74,77,76,72,69,72,73,None]
battle_b=[86,84,81,79,77,81,84,None, 83,81,79,76,74,76,79,None, 81,77,74,72,74,77,79,81, 79,76,73,69,73,76,81,None]
boss_a=[62,69,65,68,69,None,74,72, 69,68,65,62,61,None,65,68, 70,69,65,62,58,62,65,None, 61,64,67,70,69,67,64,None]
boss_b=[77,76,74,69,72,None,74,77, 76,73,70,67,64,67,70,73, 74,72,69,65,62,65,69,72, 73,69,68,64,61,64,68,None]
victory=[74,81,86,None,85,86,89,None, 88,86,81,77,79,81,86,None, 89,88,86,81,84,86,88,None, 86,None,None,None,None,None,None,None]
scores={
'battle':{'title':'風起博望','tempo':144,'lead':battle_a+battle_a[:24]+[74,76,77,79,81,79,77,None]+battle_b+battle_a,'roots':[50,53,48,45]*2+[58,55,50,45]+[50,53,48,45],'loop':True},
'boss':{'title':'鐵騎壓境','tempo':158,'lead':boss_a+boss_b+boss_a+[x+12 if x else None for x in boss_b],'roots':[38,37,46,45,41,40,38,37]*2,'loop':True},
'victory':{'title':'旌旗凱旋','tempo':116,'lead':victory,'roots':[50,55,57,50],'loop':False}}
report={}
def voice(m,d,kind='pulse',gain=.1,detune=0):
 n=max(1,int(d*SR));t=np.arange(n)/SR;f=440*2**((m-69+detune)/12);phase=t*f
 if kind=='triangle':x=2*np.abs(2*(phase%1)-1)-1
 else:
  # Band-limited pulse Fourier series: intentional vintage duty-cycle colour.
  duty=.25 if kind=='pulse' else .5;x=np.zeros(n)
  for k in range(1,min(16,int(SR/(2*f)))+1):x+=2*np.sin(np.pi*k*duty)/(np.pi*k)*np.cos(2*np.pi*k*phase-np.pi*k*duty)
 env=np.minimum(1,t/.005)*np.minimum(1,(d-t)/.045)*np.exp(-t/(d*2));return x*env*gain
for mode,q in scores.items():
 step=30/q['tempo'];dur=len(q['lead'])*step;tail=0 if q['loop'] else 1.4;mix=np.zeros((int((dur+tail)*SR),2))
 def put(x,at,pan=0):
  pos=int(at*SR);n=min(len(x),len(mix)-pos)
  if n>0:mix[pos:pos+n,0]+=x[:n]*np.sqrt((1-pan)/2);mix[pos:pos+n,1]+=x[:n]*np.sqrt((1+pan)/2)
 for s,m in enumerate(q['lead']):
  bar=s//8;root=q['roots'][bar];minor=mode!='victory';third=3 if minor else 4
  if m is not None:
   length=step*(1.55 if s%8 in [2,6] else .76);put(voice(m,length,'pulse',.19),s*step,-.12)
   if bar>=4:put(voice(m-12,step*.7,'square',.06,.025),s*step+.006,.28)
  if s%2==0:put(voice(root+(7 if s%8==6 else 0),step*1.65,'triangle',.24),s*step,0)
  arp=root+12+[0,third,7,12][s%4];put(voice(arp,step*.5,'square',.045),s*step,.4 if s%2 else -.4)
  if s%4==0:
   t=np.arange(int(.085*SR))/SR;kick=np.sin(2*np.pi*(90*t-270*t*t))*np.exp(-t*48)*.22;put(kick,s*step)
  if s%4==2:
   t=np.arange(int(.075*SR))/SR;noise=rng.uniform(-1,1,len(t));put(noise*np.exp(-t*58)*.095,s*step)
  if mode=='boss' or s%2:
   t=np.arange(int(.023*SR))/SR;noise=rng.uniform(-1,1,len(t));put(noise*np.exp(-t*120)*.028,s*step,-.3)
 if not q['loop']:
  for m in [50,62,66,69,74,86]:put(voice(m,1.25,'triangle' if m<60 else 'square',.13),dur-step*8)
 # Tiny boundary fade prevents loop clicks; headroom reserved for runtime SFX.
 fade=int(SR*.004);mix[:fade]*=np.linspace(0,1,fade)[:,None];mix[-fade:]*=np.linspace(1,0,fade)[:,None]
 peak=np.max(np.abs(mix));mix*=.68/max(.68,peak)
 with wave.open(str(OUT/f'{mode}.wav'),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes((mix*32767).astype('<i2').tobytes())
 report[mode]={'title':q['title'],'tempo':q['tempo'],'seconds':round(len(mix)/SR,3),'peak':round(float(np.max(np.abs(mix))),4),'rms':round(float(np.sqrt(np.mean(mix**2))),4),'loop':q['loop'],'voices':['pulse lead','pulse counterline','triangle bass','arpeggio','noise drums']}
(OUT/'score.json').write_text(json.dumps(scores,ensure_ascii=False,indent=2));(OUT/'mix-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False))
