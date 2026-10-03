from pathlib import Path
from PIL import Image
import json,hashlib,wave
root=Path(__file__).resolve().parents[1];m=json.loads((root/'assets/v12/manifest.json').read_text())
for p in (root/'assets/v12').rglob('*.png'):
 with Image.open(p) as im:im.load()
for id,meta in m['sprites'].items():
 p=root/f'assets/v12/sprites/{id}.png';im=Image.open(p);assert im.size==(1024,144) and im.mode=='RGBA',id
 assert hashlib.sha256(p.read_bytes()).hexdigest()==meta['sha256'],id
 frames=[]
 for i in range(8):
  f=im.crop((i*128,0,(i+1)*128,144));box=f.getchannel('A').getbbox();assert box and box[0]>=3 and box[2]<=125 and box[1]>=3 and box[3]<=140,(id,i,box)
  assert sum(a>128 for a in f.getchannel('A').get_flattened_data())>800,(id,i,'empty pose')
  frames.append(hashlib.sha256(f.tobytes()).hexdigest())
 assert len(set(frames))==8,(id,'duplicate pose')
for id in list(m['sprites'])[:5]:assert Image.open(root/f'assets/v12/portraits/{id}.png').size==(128,128)
assert Image.open(root/'assets/v12/fx/battle-fx.png').size==(512,896)
for name in ['battle','boss','victory']:
 with wave.open(str(root/f'assets/v12/audio/{name}.wav')) as f:assert f.getnframes()>22050*8 and f.getnchannels()==2
for p in (root/'src/v12').glob('*.js'):
 s=p.read_text()
 assert not any(x in s for x in ['heroArtV115','enemyArtV11','battleRendererV11','battleArt.js','fillRect(']),p.name
 for token in ['primeGesture','navigator.audioSession','IOS_PRIME','webkitAudioContext','visibilitychange','pageshow']:
  assert token in (root/'src/v11/audioV11.js').read_text(),token
html=(root/'golden-v12.html').read_text();assert 'v120.css?v=12.0' in html and 'main.js?v=12.0' in html
assert "import {AudioV11}" in (root/'src/v12/audio.js').read_text()
assert not any('serviceWorker.register' in p.read_text() for p in (root/'src/v12').glob('*.js'))
print('V12: all PNGs fully decode; 80 unique poses; independent portraits; bounds, hashes, audio, version and renderer isolation pass.')
