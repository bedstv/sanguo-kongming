"""Original chapter-three Red Cliffs battle theme; keeps existing music untouched."""
from pathlib import Path
import numpy as np, wave, json, subprocess
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/v12/audio';SR=22050
def voice(m,d,kind='pulse',gain=.1,detune=0):
 n=max(1,int(d*SR));t=np.arange(n)/SR;f=440*2**((m-69+detune)/12);phase=t*f
 if kind=='triangle':x=2*np.abs(2*(phase%1)-1)-1
 else:
  # Band-limited pulse Fourier series: intentional vintage duty-cycle colour.
  duty=.25 if kind=='pulse' else .5;x=np.zeros(n)
  for k in range(1,min(16,int(SR/(2*f)))+1):x+=2*np.sin(np.pi*k*duty)/(np.pi*k)*np.cos(2*np.pi*k*phase-np.pi*k*duty)
 env=np.minimum(1,t/.005)*np.minimum(1,(d-t)/.045)*np.exp(-t/(d*2));return x*env*gain

scores={
 'naval':{'title':'赤壁夜航','tempo':160,'lead':[64,67,71,76,74,71,67,64, 62,66,69,74,73,69,66,62, 64,67,71,76,79,78,76,71, 69,71,74,76,74,71,67,66, 64,67,71,78,76,74,71,67, 66,64,62,59,62,66,67,71]*3,'roots':[40,38,40,45,40,38]*3}
}
report={}
for mode,q in scores.items():
 step=30/q['tempo'];mix=np.zeros((int(len(q['lead'])*step*SR),2))
 def put(x,at,pan=0):
  pos=int(at*SR);n=min(len(x),len(mix)-pos)
  if n>0:mix[pos:pos+n,0]+=x[:n]*np.sqrt((1-pan)/2);mix[pos:pos+n,1]+=x[:n]*np.sqrt((1+pan)/2)
 for s,m in enumerate(q['lead']):
  root=q['roots'][s//8]
  if m is not None:put(voice(m,step*1.4,'pulse',.14),s*step,-.2)
  if s%2==0:put(voice(root,step*1.8,'triangle',.18),s*step)
  put(voice(root+12+[0,4 if mode=='town' else 3,7,12][s%4],step*.65,'square',.035),s*step,.3)
 fade=int(.006*SR);mix[:fade]*=np.linspace(0,1,fade)[:,None];mix[-fade:]*=np.linspace(1,0,fade)[:,None]
 mix*=.6/max(.6,float(np.max(np.abs(mix))))
 with wave.open(str(OUT/f'{mode}.wav'),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes((mix*32767).astype('<i2').tobytes())
 report[mode]={'title':q['title'],'seconds':round(len(mix)/SR,3),'peak':round(float(np.max(np.abs(mix))),4),'loop':True,'voices':['pulse melody','triangle bass','square arpeggio']}
for mode in scores:
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(OUT/f'{mode}.wav'),'-codec:a','libmp3lame','-b:a','80k',str(OUT/f'{mode}.mp3')],check=True)
 (OUT/f'{mode}.wav').replace(ROOT/f'assets/v12/source/{mode}-score.wav')
(OUT/'chapter-three-score.json').write_text(json.dumps(scores,ensure_ascii=False,indent=2))
(OUT/'chapter-three-mix-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False))
